/**
 * Webhook do Asaas para processar eventos de pagamento
 */

import { NextRequest, NextResponse } from "next/server";
import { prismaSuper } from "@/_lib/prisma-super";
import { handleAsaasWebhook } from "@/_lib/asaas";

export async function POST(request: NextRequest) {
  try {
    const event = await request.json();

    // Verificar autenticação do webhook (opcional)
    const token = request.headers.get("asaas-access-token");
    if (token !== process.env.ASAAS_WEBHOOK_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Processar evento
    await handleAsaasWebhook(event);

    // Atualizar status da assinatura baseado no evento
    if (event.payment?.subscription) {
      const subscriptionId = event.payment.subscription;

      // Buscar subscription no banco pelo ID do Asaas
      const subscription = await prismaSuper.subscription.findFirst({
        where: { asaasSubscriptionId: subscriptionId },
        include: { tenant: true },
      });

      if (subscription) {
        switch (event.event) {
          case "PAYMENT_CONFIRMED":
            // Pagamento confirmado - renovar assinatura
            await prismaSuper.tenant.update({
              where: { id: subscription.tenantId },
              data: {
                status: "active",
                isActive: true,
              },
            });

            await prismaSuper.subscription.update({
              where: { id: subscription.id },
              data: {
                status: "active",
                isActive: true,
              },
            });
            break;

          case "PAYMENT_OVERDUE":
            // Pagamento em atraso - notificar
            await prismaSuper.tenant.update({
              where: { id: subscription.tenantId },
              data: {
                status: "expired",
              },
            });
            break;

          case "PAYMENT_RECEIVED":
            // Pagamento recebido - atualizar datas
            if (subscription.plan.period === "monthly") {
              const nextBilling = new Date();
              nextBilling.setMonth(nextBilling.getMonth() + 1);

              await prismaSuper.subscription.update({
                where: { id: subscription.id },
                data: {
                  nextBillingDate: nextBilling,
                },
              });
            }
            break;
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erro ao processar webhook do Asaas:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao processar webhook" },
      { status: 500 }
    );
  }
}
