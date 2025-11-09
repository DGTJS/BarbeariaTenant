import { NextRequest, NextResponse } from 'next/server';
import { getSession, getTenantDatabase } from '@/_lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const db = await getTenantDatabase(req);
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json({ message: 'Senha é obrigatória' }, { status: 400 });
    }

    // Buscar usuário para verificar senha
    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        password: true,
        email: true,
      },
    });

    if (!user || !user.password) {
      return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 });
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Senha incorreta' }, { status: 401 });
    }

    // Deletar todas as relações do usuário
    await db.$transaction(async (tx) => {
      // Deletar agendamentos
      await tx.booking.deleteMany({
        where: { userId: user.id },
      });

      // Deletar notificações push
      await tx.pushSubscription.deleteMany({
        where: { userId: user.id },
      });

      // Deletar configurações de notificação (se houver tabela separada)
      // Nota: Se as configurações estão na tabela user, serão deletadas automaticamente

      // Deletar usuário
      await tx.user.delete({
        where: { id: user.id },
      });
    });

    return NextResponse.json({
      message: 'Conta deletada com sucesso',
      success: true,
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json({ message: 'Erro ao deletar conta' }, { status: 500 });
  }
}

