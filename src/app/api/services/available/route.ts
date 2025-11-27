import { NextRequest, NextResponse } from "next/server";
import { db } from "@/_lib/prisma";
;

/**
 * GET /api/services/available
 * Lista todos os serviços disponíveis com preço fixo
 *
 * Retorna:
 * - Preço único do serviço (sem variações)
 * - Número de barbeiros que oferecem o serviço
 */
export async function GET(request: NextRequest) {
  try {
    // CRÍTICO: Obter banco do tenant correto
    // Usando banco único
    
    const services = await db.barberShopService.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        image: true,
        categoryId: true,
        status: true,
        barberShopId: true,
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
        barberServices: {
          where: {
            active: true,
          },
          select: {
            barberId: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    // Retornar serviços (preço é apenas das opções)
    const servicesSimplified = services.map(service => ({
      id: service.id,
      name: service.name,
      description: service.description,
      category: service.category,
      availableBarbersCount: service.barberServices.length,
      image: service.image || service.imageUrl,
    }));

    return NextResponse.json(servicesSimplified);
  } catch (error: any) {
    console.error("Erro ao buscar serviços:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao buscar serviços" },
      { status: 500 }
    );
  }
}
