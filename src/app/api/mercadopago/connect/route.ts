import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/_providers/auth";

// GET /api/mercadopago/connect - Inicia fluxo OAuth do Mercado Pago
export async function GET(request: NextRequest) {
  try {
    // Verificar se usuário está logado
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ 
        error: 'Usuário não autenticado' 
      }, { status: 401 });
    }

    // Verificar se as credenciais do Devank Delivery estão configuradas
    if (!process.env.MERCADOPAGO_CLIENT_ID || !process.env.MERCADOPAGO_CLIENT_SECRET) {
      return NextResponse.json({ 
        error: 'Credenciais do Mercado Pago não configuradas' 
      }, { status: 500 });
    }

    // Gerar state para segurança (vincula a sessão do usuário)
    const state = `${session.user.id}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    // URL de autorização do Mercado Pago
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/mercadopago/callback`;
    const authUrl = `https://auth.mercadopago.com/authorization?client_id=${process.env.MERCADOPAGO_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(state)}`;

    console.log('🚀 Iniciando OAuth Mercado Pago:', {
      userId: session.user.id,
      state,
      redirectUri,
      authUrl: authUrl.substring(0, 100) + '...'
    });

    return NextResponse.json({
      authUrl,
      state,
      message: 'Redirecionando para autorização do Mercado Pago'
    });

  } catch (error) {
    console.error('Erro ao iniciar OAuth Mercado Pago:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

