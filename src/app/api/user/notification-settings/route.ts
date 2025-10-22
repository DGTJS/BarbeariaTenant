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
    const user = await db.user.findFirst({
      where: { id: session.user.id },
      select: {
        email: true,
        emailNotifications: true,
        whatsappNotifications: true,
        whatsappNumber: true,
        pushNotifications: true,
        soundNotifications: true,
      }
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      email: user.email,
      emailNotifications: user.emailNotifications ?? true,
      whatsappNotifications: user.whatsappNotifications ?? true,
      whatsappNumber: user.whatsappNumber ?? "",
      pushNotifications: user.pushNotifications ?? true,
      soundNotifications: user.soundNotifications ?? true,
    });

  } catch (error) {
    console.error('Error fetching notification settings:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const {
      emailNotifications,
      whatsappNotifications,
      whatsappNumber,
      pushNotifications,
      soundNotifications
    } = await request.json();

    // Atualizar configurações do usuário
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: {
        emailNotifications: emailNotifications,
        whatsappNotifications: whatsappNotifications,
        whatsappNumber: whatsappNumber,
        pushNotifications: pushNotifications,
        soundNotifications: soundNotifications,
      },
      select: {
        email: true,
        emailNotifications: true,
        whatsappNotifications: true,
        whatsappNumber: true,
        pushNotifications: true,
        soundNotifications: true,
      }
    });

    return NextResponse.json({
      message: 'Settings updated successfully',
      settings: updatedUser
    });

  } catch (error) {
    console.error('Error updating notification settings:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
