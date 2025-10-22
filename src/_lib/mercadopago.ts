import { db } from "./prisma";

export interface MercadoPagoTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user_id: string;
}

/**
 * Obtém tokens válidos do Mercado Pago para um usuário específico
 * Renova automaticamente se necessário
 */
export async function getMercadoPagoTokens(userId: string): Promise<MercadoPagoTokens | null> {
  try {
    // Buscar tokens do usuário
    const [connected, accessToken, refreshToken, expiresAt, mpUserId] = await Promise.all([
      db.siteConfig.findUnique({ where: { key: `mercado_pago_connected_${userId}` } }),
      db.siteConfig.findUnique({ where: { key: `mercado_pago_access_token_${userId}` } }),
      db.siteConfig.findUnique({ where: { key: `mercado_pago_refresh_token_${userId}` } }),
      db.siteConfig.findUnique({ where: { key: `mercado_pago_token_expires_at_${userId}` } }),
      db.siteConfig.findUnique({ where: { key: `mercado_pago_user_id_${userId}` } }),
    ]);

    if (!connected?.value || connected.value !== 'true') {
      return null;
    }

    if (!accessToken?.value || !refreshToken?.value || !expiresAt?.value) {
      return null;
    }

    const expiresAtTime = parseInt(expiresAt.value);
    const now = Date.now();
    const timeUntilExpiry = expiresAtTime - now;

    // Se o token expira em menos de 5 minutos, renovar
    if (timeUntilExpiry < 5 * 60 * 1000) {
      console.log(`Token do usuário ${userId} expirando em ${Math.round(timeUntilExpiry / 1000)}s, renovando...`);
      
      const renewedTokens = await refreshMercadoPagoToken(userId, refreshToken.value);
      if (renewedTokens) {
        return renewedTokens;
      }
    }

    return {
      access_token: accessToken.value,
      refresh_token: refreshToken.value,
      expires_at: expiresAtTime,
      user_id: mpUserId?.value || '',
    };

  } catch (error) {
    console.error('Erro ao obter tokens do Mercado Pago:', error);
    return null;
  }
}

/**
 * Renova o token do Mercado Pago usando o refresh_token
 */
export async function refreshMercadoPagoToken(userId: string, refreshToken: string): Promise<MercadoPagoTokens | null> {
  try {
    if (!process.env.MERCADOPAGO_CLIENT_ID || !process.env.MERCADOPAGO_CLIENT_SECRET) {
      console.error('Credenciais do Mercado Pago não configuradas');
      return null;
    }

    const refreshPayload = new URLSearchParams({
      client_id: process.env.MERCADOPAGO_CLIENT_ID,
      client_secret: process.env.MERCADOPAGO_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    const response = await fetch('https://api.mercadopago.com/oauth/token', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: refreshPayload,
    });

    if (!response.ok) {
      console.error('Erro ao renovar token:', await response.text());
      return null;
    }

    const tokenData = await response.json();
    const { access_token, refresh_token, expires_in, user_id } = tokenData;

    if (!access_token) {
      console.error('Token de acesso não recebido na renovação');
      return null;
    }

    // Salvar novos tokens
    const expiresAt = Date.now() + (expires_in * 1000);
    
    await Promise.all([
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
      user_id && db.siteConfig.upsert({
        where: { key: `mercado_pago_user_id_${userId}` },
        update: { value: user_id, type: 'string' },
        create: { key: `mercado_pago_user_id_${userId}`, value: user_id, type: 'string' },
      }),
    ]);

    console.log(`Token renovado para usuário ${userId}:`, {
      expiresAt: new Date(expiresAt).toISOString(),
      userId: user_id
    });

    return {
      access_token,
      refresh_token,
      expires_at: expiresAt,
      user_id: user_id || '',
    };

  } catch (error) {
    console.error('Erro ao renovar token do Mercado Pago:', error);
    return null;
  }
}

/**
 * Verifica se o usuário tem Mercado Pago conectado
 */
export async function isMercadoPagoConnected(userId: string): Promise<boolean> {
  try {
    const connected = await db.siteConfig.findUnique({
      where: { key: `mercado_pago_connected_${userId}` }
    });
    
    return connected?.value === 'true';
  } catch (error) {
    console.error('Erro ao verificar conexão Mercado Pago:', error);
    return false;
  }
}

/**
 * Desconecta o Mercado Pago do usuário
 */
export async function disconnectMercadoPago(userId: string): Promise<boolean> {
  try {
    await Promise.all([
      db.siteConfig.deleteMany({
        where: { 
          key: { 
            in: [
              `mercado_pago_connected_${userId}`,
              `mercado_pago_access_token_${userId}`,
              `mercado_pago_refresh_token_${userId}`,
              `mercado_pago_token_expires_at_${userId}`,
              `mercado_pago_user_id_${userId}`,
            ]
          }
        }
      }),
    ]);

    console.log(`Mercado Pago desconectado para usuário ${userId}`);
    return true;
  } catch (error) {
    console.error('Erro ao desconectar Mercado Pago:', error);
    return false;
  }
}

/**
 * Cria uma preferência de pagamento no Mercado Pago
 */
export async function createPaymentPreference(userId: string, preferenceData: any) {
  try {
    const tokens = await getMercadoPagoTokens(userId);
    if (!tokens) {
      throw new Error('Mercado Pago não conectado para este usuário');
    }

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferenceData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erro ao criar preferência: ${error}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao criar preferência de pagamento:', error);
    throw error;
  }
}

