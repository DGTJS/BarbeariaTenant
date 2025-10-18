import { NextRequest, NextResponse } from "next/server";
import { db } from "@/_lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, message, type } = body;

    if (!bookingId || !message || !type) {
      return NextResponse.json(
        { error: 'ID do agendamento, mensagem e tipo são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar dados do agendamento
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        },
        service: {
          select: {
            name: true
          }
        },
        barber: {
          select: {
            name: true
          }
        }
      }
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Agendamento não encontrado' },
        { status: 404 }
      );
    }

    // Aqui você pode integrar com serviços de email/SMS
    // Por enquanto, vamos simular o envio
    const messageData = {
      bookingId,
      type, // 'email', 'sms', 'whatsapp'
      message,
      recipient: {
        name: booking.user.name,
        email: booking.user.email,
        phone: booking.user.phone
      },
      booking: {
        dateTime: booking.dateTime,
        service: booking.service.name,
        barber: booking.barber.name
      },
      sentAt: new Date(),
      status: 'sent' // 'sent', 'failed', 'pending'
    };

    // Log da mensagem (em produção, salvar no banco ou enviar via API)
    console.log('Mensagem enviada:', messageData);

    return NextResponse.json({
      message: 'Mensagem enviada com sucesso',
      data: messageData
    });
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    return NextResponse.json(
      { error: 'Erro ao enviar mensagem', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}
