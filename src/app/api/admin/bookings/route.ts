import { NextRequest, NextResponse } from "next/server";
import { db } from "@/_lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Construir filtros
    const where: any = {};
    
    if (status && status !== 'all') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { service: { name: { contains: search, mode: 'insensitive' } } },
        { barber: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }

    const bookings = await db.booking.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true
          }
        },
        service: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            duration: true,
            imageUrl: true
          }
        },
        barber: {
          select: {
            id: true,
            name: true,
            photo: true
          }
        }
      },
      orderBy: {
        dateTime: 'desc'
      }
    });

    // Converter Decimal para number
    const sanitizedBookings = bookings.map(booking => ({
      ...booking,
      service: {
        ...booking.service,
        price: Number(booking.service.price)
      }
    }));

    return NextResponse.json(sanitizedBookings);
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar agendamentos', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, dateTime } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID do agendamento é obrigatório' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    
    if (status) {
      updateData.status = status;
    }
    
    if (dateTime) {
      updateData.dateTime = new Date(dateTime);
    }

    const updatedBooking = await db.booking.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true
          }
        },
        service: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            duration: true,
            imageUrl: true
          }
        },
        barber: {
          select: {
            id: true,
            name: true,
            photo: true
          }
        }
      }
    });

    // Converter Decimal para number
    const sanitizedBooking = {
      ...updatedBooking,
      service: {
        ...updatedBooking.service,
        price: Number(updatedBooking.service.price)
      }
    };

    return NextResponse.json(sanitizedBooking);
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar agendamento', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID do agendamento é obrigatório' },
        { status: 400 }
      );
    }

    await db.booking.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Agendamento excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir agendamento:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir agendamento', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}
