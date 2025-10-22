import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/_providers/auth-options";
import { db } from "@/_lib/prisma";

// POST - Avaliar um serviço concluído
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { bookingId, rating, comment } = await request.json();

    // Validar dados
    if (!bookingId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ 
        error: "Dados inválidos. Rating deve ser entre 1 e 5" 
      }, { status: 400 });
    }

    // Verificar se o agendamento existe e pertence ao usuário
    const booking = await db.booking.findFirst({
      where: {
        id: bookingId,
        userId: session.user.id,
        status: "completed", // Só pode avaliar serviços concluídos
      },
      include: {
        barber: {
          select: {
            name: true,
          },
        },
        service: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ 
        error: "Agendamento não encontrado ou não pode ser avaliado" 
      }, { status: 404 });
    }

    // Verificar se já foi avaliado
    if (booking.rating !== null) {
      return NextResponse.json({ 
        error: "Este serviço já foi avaliado" 
      }, { status: 400 });
    }

    // Atualizar o agendamento com a avaliação
    const updatedBooking = await db.booking.update({
      where: { id: bookingId },
      data: {
        rating: rating,
        comment: comment || null,
      },
      include: {
        barber: {
          select: {
            name: true,
          },
        },
        service: {
          select: {
            name: true,
          },
        },
      },
    });

    console.log(`Avaliação salva: ${rating} estrelas para ${booking.barber.name} - ${booking.service.name}`);

    return NextResponse.json({
      message: "Avaliação enviada com sucesso!",
      booking: {
        id: updatedBooking.id,
        rating: updatedBooking.rating,
        comment: updatedBooking.comment,
        barber: updatedBooking.barber.name,
        service: updatedBooking.service.name,
      },
    });
  } catch (error) {
    console.error("Erro ao salvar avaliação:", error);
    return NextResponse.json({ 
      error: "Erro interno do servidor", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
