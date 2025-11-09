import { NextRequest, NextResponse } from 'next/server';
import { getSession, getTenantDatabase } from '@/_lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const db = await getTenantDatabase(req);

    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
      }
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession(req);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const db = await getTenantDatabase(req);

    const { name, whatsappNumber, image } = await req.json();

    // Validações
    if (!name || name.trim().length === 0) {
      return NextResponse.json({ message: 'Nome é obrigatório' }, { status: 400 });
    }

    const updatedUser = await db.user.update({
      where: { id: session.userId },
      data: {
        name: name.trim(),
        whatsappNumber: whatsappNumber?.trim() || null,
        image: image || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        whatsappNumber: true,
        image: true,
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

