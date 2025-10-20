import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/_providers/auth';
import { db } from '@/_lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    console.log('Session:', session);
    
    if (!session?.user?.id) {
      console.log('No session or user ID');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    console.log('Fetching bookings for user:', session.user.id);

    // Buscar agendamentos do usuário logado
    const bookings = await db.booking.findMany({
      where: {
        userId: session.user.id,
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

    console.log('Found bookings:', bookings.length);
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
