import { NextRequest, NextResponse } from "next/server";
import { getTenantDatabase } from "@/_lib/auth";
import { findNextAvailableSlot } from "@/_lib/availability";

/**
 * GET /api/services/{serviceId}/barbers
 * Lista barbeiros que oferecem um serviço específico
 *
 * Query params:
 * - includeAvailability: "true" para incluir próximo horário disponível (opcional)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  try {
    // CRÍTICO: Obter banco do tenant correto
    const db = await getTenantDatabase(request);
    
    const { serviceId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const includeAvailability =
      searchParams.get("includeAvailability") === "true";

    // Buscar serviço
    const service = await db.barberShopService.findUnique({
      where: { id: serviceId },
      select: {
        id: true,
        name: true,
      },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Serviço não encontrado" },
        { status: 404 }
      );
    }

    // Buscar barbeiros que oferecem este serviço
    const barberServices = await db.barberService.findMany({
      where: {
        serviceId,
        active: true,
      },
      include: {
        barber: {
          select: {
            id: true,
            name: true,
            image: true,
            rating: true,
            specialties: true,
          },
        },
      },
    });

    // Processar dados dos barbeiros
    const barbersWithDetails = await Promise.all(
      barberServices.map(async bs => {
        // Preço é apenas das opções, não do serviço
        let nextAvailable = null;

        // Se solicitado, buscar próximo horário disponível
        if (includeAvailability) {
          try {
            nextAvailable = await findNextAvailableSlot(
              bs.barber.id,
              serviceId,
              new Date(),
              db
            );
          } catch (error) {
            console.error(
              `Erro ao buscar disponibilidade do barbeiro ${bs.barber.id}:`,
              error
            );
          }
        }

        return {
          id: bs.barber.id,
          name: bs.barber.name,
          photo: bs.barber.image,
          rating: Number(bs.barber.rating) || 0,
          specialties: bs.barber.specialties || [],
          nextAvailable: nextAvailable
            ? `${nextAvailable.date} às ${nextAvailable.time}`
            : null,
        };
      })
    );

    return NextResponse.json({
      service: {
        id: service.id,
        name: service.name,
      },
      barbers: barbersWithDetails,
    });
  } catch (error: any) {
    console.error("Erro ao buscar barbeiros do serviço:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao buscar barbeiros" },
      { status: 500 }
    );
  }
}
