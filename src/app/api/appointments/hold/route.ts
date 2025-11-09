import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/_server/auth-options";
import { db } from "@/_lib/prisma";
import { addMinutes } from "date-fns";

/**
 * POST /api/appointments/hold
 * Segura um slot por 5 minutos para o usuário
 * 
 * Body:
 * {
 *   barberId: string
 *   serviceId: string
 *   startDateTime: string (ISO)
 *   endDateTime: string (ISO)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { barberId, serviceId, startDateTime, endDateTime } = body;

    // Validar dados
    if (!barberId || !serviceId || !startDateTime || !endDateTime) {
      return NextResponse.json(
        { error: "Dados incompletos" },
        { status: 400 }
      );
    }

    const start = new Date(startDateTime);
    const end = new Date(endDateTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: "Formato de data inválido" },
        { status: 400 }
      );
    }

    // Verificar se já existe hold ou booking para este slot
    const existingBooking = await db.booking.findFirst({
      where: {
        barberId,
        dateTime: {
          gte: start,
          lt: end
        },
        status: {
          not: "Cancelada"
        }
      }
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "Horário não disponível" },
        { status: 409 }
      );
    }

    const existingHold = await db.appointmentHold.findFirst({
      where: {
        barberId,
        startDateTime: {
          gte: start,
          lt: end
        },
        expiresAt: {
          gt: new Date()
        }
      }
    });

    if (existingHold) {
      return NextResponse.json(
        { error: "Horário sendo reservado por outro usuário" },
        { status: 409 }
      );
    }

    // Criar hold (válido por 5 minutos)
    const expiresAt = addMinutes(new Date(), 5);

    const hold = await db.appointmentHold.create({
      data: {
        userId: session.user.id,
        barberId,
        serviceId,
        startDateTime: start,
        endDateTime: end,
        expiresAt
      }
    });

    return NextResponse.json({
      holdId: hold.id,
      expiresAt: hold.expiresAt,
      message: "Horário reservado por 5 minutos"
    });
  } catch (error: any) {
    console.error("Erro ao criar hold:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao reservar horário" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/appointments/hold/{id}
 * Libera um hold manualmente
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const holdId = searchParams.get("holdId");

    if (!holdId) {
      return NextResponse.json(
        { error: "holdId é obrigatório" },
        { status: 400 }
      );
    }

    // Verificar se o hold pertence ao usuário
    const hold = await db.appointmentHold.findUnique({
      where: { id: holdId }
    });

    if (!hold) {
      return NextResponse.json(
        { error: "Hold não encontrado" },
        { status: 404 }
      );
    }

    if (hold.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Hold não pertence a este usuário" },
        { status: 403 }
      );
    }

    // Deletar hold
    await db.appointmentHold.delete({
      where: { id: holdId }
    });

    return NextResponse.json({ message: "Hold liberado com sucesso" });
  } catch (error: any) {
    console.error("Erro ao liberar hold:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao liberar hold" },
      { status: 500 }
    );
  }
}

