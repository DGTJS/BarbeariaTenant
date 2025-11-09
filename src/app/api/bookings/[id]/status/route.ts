import { NextRequest, NextResponse } from "next/server";
import { getTenantDatabase } from "@/_lib/auth";
import { getSession } from "@/_lib/auth";
import { dispatchWebhook, WebhookEvent } from "@/_lib/webhook-dispatcher";

// Cache em memória para agendamentos (mesma estrutura do route.ts principal)
const cachedBookings: Map<string, { data: any; timestamp: number }> = new Map();

// Função para invalidar cache de agendamentos
function invalidateBookingsCache(hostname?: string, userId?: string) {
  if (hostname && userId) {
    const cacheKey = `${hostname}:${userId}`;
    cachedBookings.delete(cacheKey);
    console.log(
      `🧹 [BOOKINGS] Cache invalidado para tenant: ${hostname}, usuário: ${userId}`
    );
  } else if (hostname) {
    // Invalidar todos os caches deste tenant
    const keysToDelete: string[] = [];
    cachedBookings.forEach((_, key) => {
      if (key.startsWith(`${hostname}:`)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => cachedBookings.delete(key));
    console.log(`🧹 [BOOKINGS] Cache invalidado para tenant: ${hostname}`);
  } else {
    cachedBookings.clear();
    console.log("🧹 [BOOKINGS] Cache invalidado para todos os tenants");
  }
}

// PATCH /api/bookings/[id]/status
// Atualiza o status de um agendamento e dispara webhooks
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession(request);

    if (!session?.userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Obter banco do tenant correto
    const db = await getTenantDatabase(request);
    const hostname = request.headers.get("host") || "";

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status não fornecido" },
        { status: 400 }
      );
    }

    // Validar status
    const validStatuses = ["pending", "confirmed", "cancelled", "completed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Status inválido. Use: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    // Buscar agendamento atual
    const currentBooking = await db.booking.findUnique({
      where: { id },
      include: {
        service: true,
        barber: true,
        user: true,
      },
    });

    if (!currentBooking) {
      return NextResponse.json(
        { error: "Agendamento não encontrado" },
        { status: 404 }
      );
    }

    const previousStatus = currentBooking.status;

    // Atualizar status
    const updatedBooking = await db.booking.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
      },
      include: {
        service: true,
        barber: true,
        user: true,
      },
    });

    console.log(`✅ Status atualizado: ${previousStatus} → ${status}`);

    // Determinar evento do webhook
    let webhookEvent: WebhookEvent = "booking.status_changed";

    if (status === "confirmed") {
      webhookEvent = "booking.confirmed";
    } else if (status === "cancelled") {
      webhookEvent = "booking.cancelled";
    } else if (status === "completed") {
      webhookEvent = "booking.completed";
    }

    // Disparar webhooks (não bloqueia resposta)
    dispatchWebhook(webhookEvent, {
      ...updatedBooking,
      previousStatus,
    }).catch(error => {
      console.error("Erro ao disparar webhook:", error);
    });

    // Invalidar cache de agendamentos para este usuário e tenant
    invalidateBookingsCache(hostname, updatedBooking.userId);

    // Disparar evento SSE para atualização em tempo real (apenas para o mesmo tenant)
    global.sseClients?.forEach((client: any) => {
      // Verificar se o cliente pertence ao mesmo tenant
      if (client.hostname === hostname) {
        client.send({
          event: "booking.status_changed",
          data: JSON.stringify({
            bookingId: id,
            status,
            previousStatus,
            timestamp: new Date().toISOString(),
            // Informações do cliente
            customer: {
              name: updatedBooking.user.name,
              email: updatedBooking.user.email,
              phone: updatedBooking.user.phone,
            },
            // Informações do serviço e barbeiro
            service: {
              name: updatedBooking.service.name,
            },
            barber: {
              name: updatedBooking.barber.name,
            },
            dateTime: updatedBooking.dateTime,
          }),
        });
      }
    });

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      previousStatus,
      message: "Status atualizado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar status" },
      { status: 500 }
    );
  }
}
