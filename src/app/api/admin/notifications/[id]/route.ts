import { NextRequest, NextResponse } from 'next/server';
import { getSession } from "@/_lib/auth";
import { requireAdmin } from '@/_lib/admin-auth';
import { db } from "@/_lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // CRÍTICO: Verificar autenticação
    const session = await getSession(request);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // CRÍTICO: Obter banco do tenant correto
    // Usando banco único
    const hostname = request.headers.get("host") || "";
    console.log(`🔍 [ADMIN-NOTIFICATIONS-ID-PUT] Atualizando notificação no tenant: ${hostname}`);

    const { id } = await params;
    const data = await request.json();
    const { status, readAt } = data;

    // Verificar se a notificação pertence ao tenant antes de atualizar
    const existingNotification = await db.notification.findUnique({
      where: { id }
    });

    if (!existingNotification) {
      console.error(`❌ [ADMIN-NOTIFICATIONS-ID-PUT] Notificação ${id} não encontrada no tenant: ${hostname}`);
      return NextResponse.json(
        { error: 'Notificação não encontrada' },
        { status: 404 }
      );
    }

    // Verificar se o usuário tem permissão (só pode atualizar suas próprias notificações ou ser admin)
    try {
      await requireAdmin(session, request);
    } catch {
      // Se não for admin, só pode atualizar suas próprias notificações
      if (existingNotification.userId !== session.userId) {
        return NextResponse.json(
          { error: 'Acesso negado. Você só pode atualizar suas próprias notificações.' },
          { status: 403 }
        );
      }
    }

    const notification = await db.notification.update({
      where: { id },
      data: {
        status,
        readAt: readAt ? new Date() : undefined
      }
    });

    console.log(`✅ [ADMIN-NOTIFICATIONS-ID-PUT] Notificação atualizada com sucesso no tenant: ${hostname}`, notification.id);

    return NextResponse.json(notification);
  } catch (error) {
    console.error('❌ [ADMIN-NOTIFICATIONS-ID-PUT] Error updating notification:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

