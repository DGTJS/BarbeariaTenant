import { cache } from "react";
import { db } from "./prisma";

// Função unificada para buscar todos os dados da página inicial
export const getHomeData = cache(async (userId: string) => {
  try {
    // Busca todos os dados em paralelo para otimizar performance
    const [
      services,
      barbers,
      categories,
      barberShops,
      bookings
    ] = await Promise.all([
      // Serviços globais (disponíveis em todas as barbearias) - consulta otimizada
      db.barberShopService.findMany({
        where: { 
          status: true
        },
        select: {
          id: true,
          name: true,
          price: true,
          duration: true,
          imageUrl: true,
          description: true,
          categoryId: true,
          barberShopId: true,
          priceAdjustments: {
            select: {
              priceAdjustment: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              IconUrl: true,
            },
          },
        },
        take: 50, // Limitar resultados para evitar sobrecarga
      }),
      
      // Barbeiros com avaliações - consulta otimizada
      db.barber.findMany({
        select: {
          id: true,
          name: true,
          photo: true,
          phone: true,
          barberShopId: true,
          userId: true,
          createdAt: true,
          updatedAt: true,
          categories: {
            select: {
              id: true,
              name: true,
              IconUrl: true,
            },
          },
          workingHours: {
            select: {
              id: true,
              weekday: true,
              startTime: true,
              endTime: true,
              pauses: {
                select: {
                  id: true,
                  startTime: true,
                  endTime: true,
                },
              },
            },
          },
          booking: {
            select: {
              rating: true,
            },
          },
        },
        take: 20, // Limitar resultados
      }),
      
      // Categorias - consulta simples
      db.barberCategory.findMany({
        select: {
          id: true,
          name: true,
          IconUrl: true,
          description: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 10, // Limitar resultados
      }),
      
      // Barbearias - consulta simples
      db.barberShop.findMany({
        where: { status: true },
        select: {
          id: true,
          name: true,
          address: true,
          phones: true,
          imageUrl: true,
          rating: true,
          description: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
        take: 10, // Limitar resultados
      }),
      
      // Agendamentos - apenas do usuário atual e futuros (se userId fornecido)
      userId ? db.booking.findMany({
        where: {
          userId: userId,
          dateTime: {
            gte: new Date(), // Apenas agendamentos futuros
          },
        },
        select: {
          id: true,
          dateTime: true,
          status: true,
          comment: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          barber: {
            select: {
              id: true,
              name: true,
              photo: true,
            },
          },
          service: {
            select: {
              id: true,
              duration: true,
              name: true,
            },
          },
        },
        orderBy: {
          dateTime: 'asc', // Ordenar por data crescente
        },
        take: 10, // Limitar a 10 agendamentos futuros
      }) : Promise.resolve([]),
    ]);

  // Deduplica categorias por nome
  const uniqueCategories = new Map<string, (typeof categories)[number]>();
  for (const category of categories) {
    if (!uniqueCategories.has(category.name)) {
      uniqueCategories.set(category.name, category);
    }
  }

  // Deduplica serviços por ID
  const uniqueServices = new Map<string, (typeof services)[number]>();
  for (const service of services) {
    if (!uniqueServices.has(service.id)) {
      uniqueServices.set(service.id, service);
    }
  }

  // Deduplica barbeiros por ID
  const uniqueBarbers = new Map<string, (typeof barbers)[number]>();
  for (const barber of barbers) {
    if (!uniqueBarbers.has(barber.id)) {
      uniqueBarbers.set(barber.id, barber);
    }
  }

  // Deduplica barbearias por ID
  const uniqueBarberShops = new Map<string, (typeof barberShops)[number]>();
  for (const barberShop of barberShops) {
    if (!uniqueBarberShops.has(barberShop.id)) {
      uniqueBarberShops.set(barberShop.id, barberShop);
    }
  }

    
    return {
      services: Array.from(uniqueServices.values()),
      barbers: Array.from(uniqueBarbers.values()),
      categories: Array.from(uniqueCategories.values()),
      barberShops: Array.from(uniqueBarberShops.values()),
      bookings,
    };
  } catch (error) {
    console.error('Erro ao buscar dados da página inicial:', error);
    // Retornar dados vazios em caso de erro para evitar quebrar a aplicação
    return {
      services: [],
      barbers: [],
      categories: [],
      barberShops: [],
      bookings: [],
    };
  }
});

// Função para sanitizar dados Decimal
export function sanitizeDecimal(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(sanitizeDecimal);
  }
  // Verifica se é um objeto Decimal (tem método toNumber)
  if (obj && typeof obj === "object" && typeof obj.toNumber === "function") {
    return obj.toNumber();
  }
  // Preserva objetos Date
  if (obj instanceof Date) {
    return obj;
  }
  if (obj !== null && typeof obj === "object") {
    const result: any = {};
    for (const key in obj) {
      result[key] = sanitizeDecimal(obj[key]);
    }
    return result;
  }
  return obj;
}
