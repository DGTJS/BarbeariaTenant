import { NextRequest, NextResponse } from "next/server";
import { db } from "@/_lib/prisma";
;

// GET /api/bookings/check-conflict?barberId=...&dateTime=...&serviceId=...
export async function GET(request: NextRequest) {
  try {
    // CRÍTICO: Obter banco do tenant correto
    // Usando banco único
    const hostname = request.headers.get("host") || "";
    console.log(`🔍 [CHECK-CONFLICT] Verificando conflito no tenant: ${hostname}`);

    const { searchParams } = new URL(request.url);
    const barberId = searchParams.get("barberId");
    const dateTimeStr = searchParams.get("dateTime");
    const serviceId = searchParams.get("serviceId");

    if (!barberId || !dateTimeStr || !serviceId) {
      return NextResponse.json(
        { error: "Parâmetros obrigatórios: barberId, dateTime, serviceId" },
        { status: 400 }
      );
    }

    const requestedDateTime = new Date(dateTimeStr);

    // Buscar duração da opção (se houver) - por padrão usar 30 minutos
    // Nota: Esta API não recebe optionId, então usa padrão de 30 minutos
    // O cálculo real será feito com base nas opções selecionadas
    const serviceDuration = 30; // padrão quando não há opção informada
    const requestedEndTime = new Date(
      requestedDateTime.getTime() + serviceDuration * 60000
    );

    // Buffer de 10 minutos entre agendamentos
    const bufferTime = 10 * 60000;
    const requestedEndTimeWithBuffer = new Date(
      requestedEndTime.getTime() + bufferTime
    );

    // Buscar todos os agendamentos confirmados do barbeiro no mesmo dia
    const startOfDay = new Date(requestedDateTime);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(requestedDateTime);
    endOfDay.setHours(23, 59, 59, 999);

    // Buscar agendamentos que ocupam horário (Confirmado, Aguardando Pagamento, Pendente)
    const existingBookings = await db.booking.findMany({
      where: {
        barberId: barberId,
        dateTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          in: [
            "Confirmado",
            "confirmed",
            "Aguardando Pagamento",
            "aguardando pagamento",
            "aguardandopagamento",
            "Pending",
            "Pendente",
            "pending",
          ],
        },
        // Não considerar cancelados
        NOT: {
          OR: [
            { status: { contains: "Cancel" } },
            { status: { contains: "cancel" } },
          ],
        },
      },
      include: {
        service: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Buscar opções para cada booking
    const bookingsWithOptions = await Promise.all(
      existingBookings.map(async booking => {
        const serviceOptionBooking = await db.serviceOptionBooking.findFirst({
          where: { bookingId: booking.id },
          include: {
            serviceOption: {
              select: { duration: true },
            },
          },
        });
        return {
          ...booking,
          serviceOption: serviceOptionBooking?.serviceOption || null,
        };
      })
    );

    // Verificar conflitos
    const hasConflict = bookingsWithOptions.some(booking => {
      const bookingStart = new Date(booking.dateTime);
      // Usar duração da opção se disponível, senão usar padrão de 30 minutos
      const bookingDuration = booking.serviceOption?.duration || 30;
      const bookingEnd = new Date(
        bookingStart.getTime() + bookingDuration * 60000
      );
      const bookingEndWithBuffer = new Date(bookingEnd.getTime() + bufferTime);

      // Verifica se há sobreposição
      const overlap =
        (requestedDateTime >= bookingStart &&
          requestedDateTime < bookingEndWithBuffer) ||
        (requestedEndTimeWithBuffer > bookingStart &&
          requestedEndTimeWithBuffer <= bookingEndWithBuffer) ||
        (requestedDateTime <= bookingStart &&
          requestedEndTimeWithBuffer >= bookingEndWithBuffer);

      if (overlap) {
        console.log("❌ Conflito detectado:", {
          requested: {
            start: requestedDateTime.toISOString(),
            end: requestedEndTime.toISOString(),
            endWithBuffer: requestedEndTimeWithBuffer.toISOString(),
          },
          existing: {
            id: booking.id,
            start: bookingStart.toISOString(),
            end: bookingEnd.toISOString(),
            endWithBuffer: bookingEndWithBuffer.toISOString(),
          },
        });
      }

      return overlap;
    });

    if (hasConflict) {
      return NextResponse.json(
        {
          available: false,
          error: "Este horário não está mais disponível",
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ available: true }, { status: 200 });
  } catch (error) {
    console.error("Erro ao verificar conflito:", error);
    return NextResponse.json(
      { error: "Erro ao verificar disponibilidade" },
      { status: 500 }
    );
  }
}
