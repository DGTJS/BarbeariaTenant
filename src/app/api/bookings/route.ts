import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/_providers/auth';
import { db } from '@/_lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId || userId !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Buscar agendamentos do usuário
    const bookings = await db.booking.findMany({
      where: {
        userId: userId,
      },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
            imageUrl: true,
          }
        },
        barber: {
          select: {
            id: true,
            name: true,
            photo: true,
          }
        },
        serviceOption: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
          }
        }
      },
      orderBy: {
        dateTime: 'desc',
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
