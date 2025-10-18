import { cache } from "react";
import { db } from "./prisma";

// Função unificada para buscar todos os dados da página inicial
export const getHomeData = cache(async () => {
  console.log("Fetching home data from database...");
  
  // Busca todos os dados em paralelo para otimizar performance
  const [
    services,
    barbers,
    categories,
    barberShops,
    bookings
  ] = await Promise.all([
    // Serviços globais (disponíveis em todas as barbearias)
    db.barberShopService.findMany({
      where: { 
        status: true,
        barberShop: {
          name: "Serviços Globais"
        }
      },
      include: {
        priceAdjustments: true,
        category: true,
        barberShop: true,
      },
    }),
    
    // Barbeiros com avaliações
    db.barber.findMany({
      include: {
        categories: true,
        workingHours: true,
        booking: {
          where: {
            rating: {
              not: null,
            },
          },
          select: {
            rating: true,
          },
        },
      },
    }),
    
    // Categorias
    db.BarberCategory.findMany({
      orderBy: { createdAt: "desc" },
    }),
    
    // Barbearias
    db.barberShop.findMany({
      where: { status: true },
    }),
    
    // Agendamentos
    db.booking.findMany({
      include: {
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
    }),
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

  console.log("Home data fetched successfully");
  console.log(`Services: ${services.length} -> ${Array.from(uniqueServices.values()).length}`);
  console.log(`Barbers: ${barbers.length} -> ${Array.from(uniqueBarbers.values()).length}`);
  console.log(`Categories: ${categories.length} -> ${Array.from(uniqueCategories.values()).length}`);
  console.log(`BarberShops: ${barberShops.length} -> ${Array.from(uniqueBarberShops.values()).length}`);
  
  return {
    services: Array.from(uniqueServices.values()),
    barbers: Array.from(uniqueBarbers.values()),
    categories: Array.from(uniqueCategories.values()),
    barberShops: Array.from(uniqueBarberShops.values()),
    bookings,
  };
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
