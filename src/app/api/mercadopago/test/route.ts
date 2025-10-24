import { NextRequest, NextResponse } from "next/server";

// GET /api/mercadopago/test - Testar configuração do Mercado Pago
export async function GET() {
  try {
    const config = {
      hasClientId: !!process.env.MERCADOPAGO_CLIENT_ID,
      hasClientSecret: !!process.env.MERCADOPAGO_CLIENT_SECRET,
      hasPublicClientId: !!process.env.NEXT_PUBLIC_MERCADOPAGO_CLIENT_ID,
      hasAppUrl: !!process.env.NEXT_PUBLIC_APP_URL,
      appUrl: process.env.NEXT_PUBLIC_APP_URL,
      clientIdPrefix: process.env.MERCADOPAGO_CLIENT_ID?.substring(0, 10) + '...',
    };

    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/mercadopago/callback`;
    const authUrl = `https://auth.mercadopago.com/authorization?client_id=${process.env.NEXT_PUBLIC_MERCADOPAGO_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&platform_id=mp`;

    return NextResponse.json({
      config,
      redirectUri,
      authUrl,
      status: 'ok'
    });
  } catch (error) {
    console.error('Erro no teste Mercado Pago:', error);
    return NextResponse.json({ 
      error: 'Erro interno',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}





