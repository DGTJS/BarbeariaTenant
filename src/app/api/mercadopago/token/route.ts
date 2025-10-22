import { NextRequest, NextResponse } from "next/server";
import { db } from "@/_lib/prisma";

// GET /api/mercadopago/token - Obter token válido (renova se necessário)
export async function GET() {
  try {
    const configs = await db.siteConfig.findMany({
      where: {
        key: {
          in: [
            'mercado_pago_connected',
            'mercado_pago_access_token',
            'mercado_pago_refresh_token',
            'mercado_pago_token_expires_at'
          ]
        }
      }
    });

    const configMap = configs.reduce((acc, config) => {
      acc[config.key] = config.value;
      return acc;
    }, {} as Record<string, string>);

    const isConnected = configMap['mercado_pago_connected'] === 'true';
    const accessToken = configMap['mercado_pago_access_token'];
    const refreshToken = configMap['mercado_pago_refresh_token'];
    const expiresAt = Number(configMap['mercado_pago_token_expires_at'] || 0);

    if (!isConnected || !accessToken) {
      return NextResponse.json({ error: 'Mercado Pago não conectado' }, { status: 400 });
    }

    // Verificar se o token ainda é válido (com margem de 5 minutos)
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    
    if (now < (expiresAt - fiveMinutes)) {
      return NextResponse.json({ 
        access_token: accessToken,
        expires_at: expiresAt,
        needs_refresh: false
      });
    }

    // Token expirado ou próximo do vencimento, tentar renovar
    if (!refreshToken) {
      return NextResponse.json({ error: 'Token expirado e sem refresh token' }, { status: 400 });
    }

    try {
      const refreshPayload = new URLSearchParams({
        client_id: process.env.MERCADOPAGO_CLIENT_ID!,
        client_secret: process.env.MERCADOPAGO_CLIENT_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      });

      const refreshResponse = await fetch('https://api.mercadopago.com/oauth/token', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: refreshPayload,
      });

      if (!refreshResponse.ok) {
        console.error('Erro ao renovar token:', await refreshResponse.text());
        return NextResponse.json({ error: 'Falha ao renovar token' }, { status: 400 });
      }

      const tokenData = await refreshResponse.json();
      const { access_token, refresh_token, expires_in } = tokenData;

      // Atualizar tokens no banco
      await Promise.all([
        db.siteConfig.upsert({
          where: { key: 'mercado_pago_access_token' },
          update: { value: access_token, type: 'string' },
          create: { key: 'mercado_pago_access_token', value: access_token, type: 'string' },
        }),
        db.siteConfig.upsert({
          where: { key: 'mercado_pago_refresh_token' },
          update: { value: refresh_token, type: 'string' },
          create: { key: 'mercado_pago_refresh_token', value: refresh_token, type: 'string' },
        }),
        db.siteConfig.upsert({
          where: { key: 'mercado_pago_token_expires_at' },
          update: { value: String(Date.now() + (expires_in * 1000)), type: 'number' },
          create: { key: 'mercado_pago_token_expires_at', value: String(Date.now() + (expires_in * 1000)), type: 'number' },
        }),
      ]);

      return NextResponse.json({ 
        access_token: access_token,
        expires_at: Date.now() + (expires_in * 1000),
        needs_refresh: true
      });
    } catch (refreshError) {
      console.error('Erro ao renovar token:', refreshError);
      return NextResponse.json({ error: 'Falha ao renovar token' }, { status: 400 });
    }
  } catch (error) {
    console.error('Erro ao obter token Mercado Pago:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// DELETE /api/mercadopago/token - Desconectar Mercado Pago
export async function DELETE() {
  try {
    await Promise.all([
      db.siteConfig.deleteMany({
        where: {
          key: {
            in: [
              'mercado_pago_connected',
              'mercado_pago_access_token',
              'mercado_pago_refresh_token',
              'mercado_pago_token_expires_at'
            ]
          }
        }
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao desconectar Mercado Pago:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
