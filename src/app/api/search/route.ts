import { NextRequest, NextResponse } from "next/server";
import { db } from "@/_lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");

    let services: any[] = [];
    let barbers: any[] = [];
    let barberShops: any[] = [];

    if (category) {
      // Busca por categoria
      const servicesRaw = await db.barberShopService.findMany({
        where: { 
          categoryId: category,
          status: true 
        },
        include: {
          category: true,
          barberShop: {
            select: {
              id: true,
              name: true,
              address: true,
              imageUrl: true,
            }
          },
          priceAdjustments: {
            include: {
              barber: {
                select: {
                  id: true,
                  name: true,
                  photo: true,
                  workingHours: {
                    include: {
                      pauses: true,
                    }
                  }
                }
              }
            }
          }
        },
      });

      // Deduplica serviços por ID
      const uniqueServicesMap = new Map();
      servicesRaw.forEach(service => {
        uniqueServicesMap.set(service.id, service);
      });
      services = Array.from(uniqueServicesMap.values());

      // Buscar barbeiros da categoria
      barbers = await db.barber.findMany({
        where: {
          categories: {
            some: { id: category },
          },
        },
        include: {
          categories: true,
          barberShop: {
            select: {
              id: true,
              name: true,
              address: true,
            }
          }
        },
      });

      // Buscar barbearias que tenham serviços dessa categoria
      barberShops = await db.barberShop.findMany({
        where: {
          services: {
            some: { 
              categoryId: category,
              status: true 
            },
          },
        },
        select: {
          id: true,
          name: true,
          address: true,
          imageUrl: true,
          rating: true,
          description: true,
        },
      });

    } else if (search) {
      // Busca por texto
      const searchTerm = search.toLowerCase();

      // Buscar serviços
      const servicesRaw = await db.barberShopService.findMany({
        where: {
          AND: [
            { status: true },
            {
              OR: [
                {
                  name: {
                    contains: searchTerm,
                    mode: "insensitive",
                  },
                },
                {
                  description: {
                    contains: searchTerm,
                    mode: "insensitive",
                  },
                },
                {
                  category: {
                    name: {
                      contains: searchTerm,
                      mode: "insensitive",
                    },
                  },
                },
              ],
            },
          ],
        },
        include: {
          category: true,
          barberShop: {
            select: {
              id: true,
              name: true,
              address: true,
              imageUrl: true,
            }
          },
          priceAdjustments: {
            include: {
              barber: {
                select: {
                  id: true,
                  name: true,
                  photo: true,
                  workingHours: {
                    include: {
                      pauses: true,
                    }
                  }
                }
              }
            }
          }
        },
      });

      // Deduplica serviços por ID
      const uniqueServicesMap = new Map();
      servicesRaw.forEach(service => {
        uniqueServicesMap.set(service.id, service);
      });
      services = Array.from(uniqueServicesMap.values());

      // Buscar barbeiros
      barbers = await db.barber.findMany({
        where: {
          name: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        include: {
          categories: true,
          barberShop: {
            select: {
              id: true,
              name: true,
              address: true,
            }
          }
        },
      });

      // Buscar barbearias
      barberShops = await db.barberShop.findMany({
        where: {
          OR: [
            {
              name: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
            {
              address: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          ],
        },
        select: {
          id: true,
          name: true,
          address: true,
          imageUrl: true,
          rating: true,
          description: true,
        },
      });
    } else {
      // Sem filtros: retorna todos os serviços ativos com dados suficientes para a UI
      const servicesRaw = await db.barberShopService.findMany({
        where: { status: true },
        include: {
          category: true,
          barberShop: {
            select: { id: true, name: true, address: true, imageUrl: true },
          },
          priceAdjustments: {
            include: {
              barber: {
                select: {
                  id: true,
                  name: true,
                  photo: true,
                  workingHours: { include: { pauses: true } },
                },
              },
            },
          },
        },
      });

      const uniqueServicesMap = new Map();
      servicesRaw.forEach((service) => uniqueServicesMap.set(service.id, service));
      services = Array.from(uniqueServicesMap.values());
    }

    // Processar serviços para incluir barbeiros disponíveis
    const processedServices = services.map((service: any) => {
      const availableBarbers = service.priceAdjustments?.map((adj: any) => adj.barber) || [];
      
      return {
        ...service,
        price: Number(service.price),
        barber: availableBarbers,
        priceAdjustments: service.priceAdjustments?.map((adj: any) => ({
          ...adj,
          priceAdjustment: Number(adj.priceAdjustment),
        })) || [],
      };
    });

    return NextResponse.json({
      services: processedServices,
      barbers,
      barberShops,
    });
  } catch (error) {
    console.error("Erro na API de pesquisa:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}