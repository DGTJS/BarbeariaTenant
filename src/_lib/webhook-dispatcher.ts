import { db } from "@/_lib/prisma";
import crypto from "crypto";

export type WebhookEvent = 
  | "booking.created"
  | "booking.confirmed"
  | "booking.cancelled"
  | "booking.completed"
  | "booking.status_changed";

export interface WebhookPayload {
  event: WebhookEvent;
  timestamp: string;
  data: {
    bookingId: string;
    status: string;
    previousStatus?: string;
    userId: string;
    barberId: string;
    serviceId: string;
    dateTime: string;
    [key: string]: any;
  };
}

/**
 * Dispara webhooks para todos os endpoints registrados
 */
export async function dispatchWebhook(event: WebhookEvent, bookingData: any) {
  try {
    console.log(`🔔 [WEBHOOK] Disparando evento: ${event}`, {
      bookingId: bookingData.id,
      status: bookingData.status
    });

    // Buscar webhooks ativos que escutam este evento
    const webhooks = await db.webhook.findMany({
      where: {
        active: true,
        events: {
          has: event
        }
      }
    });

    if (webhooks.length === 0) {
      console.log(`📭 [WEBHOOK] Nenhum webhook registrado para: ${event}`);
      return;
    }

    console.log(`📤 [WEBHOOK] Enviando para ${webhooks.length} endpoint(s)`);

    // Preparar payload
    const payload: WebhookPayload = {
      event,
      timestamp: new Date().toISOString(),
      data: {
        bookingId: bookingData.id,
        status: bookingData.status,
        previousStatus: bookingData.previousStatus,
        userId: bookingData.userId,
        barberId: bookingData.barberId,
        serviceId: bookingData.serviceId,
        dateTime: bookingData.dateTime,
        ...bookingData
      }
    };

    // Enviar para cada webhook
    const promises = webhooks.map(async (webhook) => {
      try {
        const signature = generateSignature(payload, webhook.secret);

        const response = await fetch(webhook.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Webhook-Signature": signature,
            "X-Webhook-Event": event,
            "User-Agent": "Barbearia-Webhook/1.0"
          },
          body: JSON.stringify(payload),
        });

        // Atualizar última execução
        await db.webhook.update({
          where: { id: webhook.id },
          data: {
            lastTriggeredAt: new Date(),
            failureCount: response.ok ? 0 : webhook.failureCount + 1
          }
        });

        if (!response.ok) {
          console.error(`❌ [WEBHOOK] Erro ao enviar para ${webhook.url}: ${response.status}`);
        } else {
          console.log(`✅ [WEBHOOK] Enviado com sucesso para ${webhook.url}`);
        }

        return { success: response.ok, webhook: webhook.url };
      } catch (error) {
        console.error(`❌ [WEBHOOK] Falha ao enviar para ${webhook.url}:`, error);
        
        // Incrementar contador de falhas
        await db.webhook.update({
          where: { id: webhook.id },
          data: {
            failureCount: webhook.failureCount + 1
          }
        });

        return { success: false, webhook: webhook.url, error };
      }
    });

    const results = await Promise.allSettled(promises);
    
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - successful;

    console.log(`📊 [WEBHOOK] Resultado: ${successful} sucesso, ${failed} falhas`);

  } catch (error) {
    console.error("❌ [WEBHOOK] Erro ao processar webhooks:", error);
  }
}

/**
 * Gera assinatura HMAC para validação
 */
function generateSignature(payload: WebhookPayload, secret: string): string {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(JSON.stringify(payload));
  return hmac.digest("hex");
}

/**
 * Valida assinatura de webhook
 */
export function validateWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(payload);
  const expectedSignature = hmac.digest("hex");
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

