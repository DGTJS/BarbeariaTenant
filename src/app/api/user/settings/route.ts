import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/_providers/auth-options';
import { db } from '@/_lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Buscar configurações do usuário
    const userSettings = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        whatsappNumber: true,
        emailNotifications: true,
        whatsappNotifications: true,
      }
    });

    return NextResponse.json(userSettings || {
      whatsappNumber: '',
      emailNotifications: true,
      whatsappNotifications: true,
    });
  } catch (error) {
    console.error('Error fetching user settings:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { whatsappNumber, emailNotifications, whatsappNotifications } = await request.json();

    // Atualizar configurações do usuário
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: {
        whatsappNumber: whatsappNumber || null,
        emailNotifications: emailNotifications ?? true,
        whatsappNotifications: whatsappNotifications ?? true,
      },
      select: {
        whatsappNumber: true,
        emailNotifications: true,
        whatsappNotifications: true,
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user settings:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
