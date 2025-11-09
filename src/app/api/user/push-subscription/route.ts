import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/_providers/auth-options';
import { db } from '@/_lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { subscription } = await request.json();

    if (!subscription) {
      return NextResponse.json({ message: 'Subscription data required' }, { status: 400 });
    }

    // Parse subscription
    const subscriptionData = typeof subscription === 'string' 
      ? JSON.parse(subscription) 
      : subscription;

    // Verificar se já existe uma inscrição para este endpoint
    const existingSubscription = await db.pushSubscription.findFirst({
      where: {
        userId: session.user.id,
        endpoint: subscriptionData.endpoint
      }
    });

    if (existingSubscription) {
      // Atualizar
      await db.pushSubscription.update({
        where: { id: existingSubscription.id },
        data: {
          keys: JSON.stringify(subscriptionData.keys)
        }
      });
    } else {
      // Criar nova
      await db.pushSubscription.create({
        data: {
          userId: session.user.id,
          endpoint: subscriptionData.endpoint,
          keys: JSON.stringify(subscriptionData.keys)
        }
      });
    }

    return NextResponse.json({ message: 'Subscription saved successfully' });
  } catch (error) {
    console.error('Error saving push subscription:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Deletar todas as inscrições do usuário
    await db.pushSubscription.deleteMany({
      where: {
        userId: session.user.id
      }
    });

    return NextResponse.json({ message: 'Subscription removed successfully' });
  } catch (error) {
    console.error('Error removing push subscription:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const subscriptions = await db.pushSubscription.findMany({
      where: {
        userId: session.user.id
      }
    });

    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error('Error fetching push subscriptions:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

