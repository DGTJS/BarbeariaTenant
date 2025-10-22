import { NextRequest, NextResponse } from "next/server";
import { db } from "@/_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/_providers/auth-options";

// GET /api/mercadopago/callback - Callback do OAuth do Mercado Pago
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state');

    console.log('Callback Mercado Pago recebido:', { code: !!code, error, state });

    if (error) {
      console.error('Erro no OAuth Mercado Pago:', error);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/admin/settings?error=mercadopago_auth_failed&details=${encodeURIComponent(error)}`);
    }

    if (!code) {
      console.error('Código de autorização não recebido');
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/admin/settings?error=mercadopago_no_code`);
    }

    // Verificar se usuário está logado
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      console.error('Usuário não autenticado no callback');
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/admin/settings?error=mercadopago_user_not_authenticated`);
    }

    // Validar state (opcional, mas recomendado para segurança)
    if (state && !state.startsWith(session.user.id)) {
      console.error('State inválido:', state);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/admin/settings?error=mercadopago_invalid_state`);
    }

    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.MERCADOPAGO_CLIENT_ID || !process.env.MERCADOPAGO_CLIENT_SECRET) {
      console.error('Variáveis de ambiente do Mercado Pago não configuradas');
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/admin/settings?error=mercadopago_config_missing`);
    }

    // Trocar code por access_token usando form-data (conforme documentação oficial)
    const tokenPayload = new URLSearchParams({
      client_id: process.env.MERCADOPAGO_CLIENT_ID!,
      client_secret: process.env.MERCADOPAGO_CLIENT_SECRET!,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercadopago/callback`,
    });

    console.log('Trocando code por token:', { 
      client_id: process.env.MERCADOPAGO_CLIENT_ID?.substring(0, 10) + '...',
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercadopago/callback`,
      code: code.substring(0, 10) + '...'
    });

    const tokenResponse = await fetch('https://api.mercadopago.com/oauth/token', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: tokenPayload,
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Erro ao trocar code por token:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error: errorText
      });
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/admin/settings?error=mercadopago_token_failed&details=${encodeURIComponent(errorText)}`);
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token, expires_in } = tokenData;

    console.log('Token recebido com sucesso:', {
      has_access_token: !!access_token,
      has_refresh_token: !!refresh_token,
      expires_in
    });

    // Salvar tokens no banco de dados vinculados ao usuário
    try {
      const userId = session.user.id;
      const expiresAt = Date.now() + (expires_in * 1000);

      // Salvar tokens do usuário específico
      await Promise.all([
        db.siteConfig.upsert({
          where: { key: `mercado_pago_connected_${userId}` },
          update: { value: 'true', type: 'boolean' },
          create: { key: `mercado_pago_connected_${userId}`, value: 'true', type: 'boolean' },
        }),
        db.siteConfig.upsert({
          where: { key: `mercado_pago_access_token_${userId}` },
          update: { value: access_token, type: 'string' },
          create: { key: `mercado_pago_access_token_${userId}`, value: access_token, type: 'string' },
        }),
        db.siteConfig.upsert({
          where: { key: `mercado_pago_refresh_token_${userId}` },
          update: { value: refresh_token, type: 'string' },
          create: { key: `mercado_pago_refresh_token_${userId}`, value: refresh_token, type: 'string' },
        }),
        db.siteConfig.upsert({
          where: { key: `mercado_pago_token_expires_at_${userId}` },
          update: { value: String(expiresAt), type: 'number' },
          create: { key: `mercado_pago_token_expires_at_${userId}`, value: String(expiresAt), type: 'number' },
        }),
        db.siteConfig.upsert({
          where: { key: `mercado_pago_user_id_${userId}` },
          update: { value: tokenData.user_id || '', type: 'string' },
          create: { key: `mercado_pago_user_id_${userId}`, value: tokenData.user_id || '', type: 'string' },
        }),
      ]);

      console.log(`Tokens salvos no banco para usuário ${userId}:`, {
        hasAccessToken: !!access_token,
        hasRefreshToken: !!refresh_token,
        expiresAt: new Date(expiresAt).toISOString(),
        userId: tokenData.user_id
      });

      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/admin/settings?success=mercadopago_connected`);
    } catch (dbError) {
      console.error('Erro ao salvar tokens no banco:', dbError);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/admin/settings?error=mercadopago_db_error`);
    }
  } catch (error) {
    console.error('Erro no callback Mercado Pago:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/admin/settings?error=mercadopago_callback_error`);
  }
}
