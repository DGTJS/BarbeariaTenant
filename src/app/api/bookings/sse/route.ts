import { NextRequest } from "next/server";

// Interface para cliente SSE com informações de tenant
interface SSEClient {
  send: (data: { event: string; data: string }) => void;
  close: () => void;
  hostname: string; // Hostname do tenant (ex: "santos.localhost:3000")
}

// Global storage for SSE clients
if (!global.sseClients) {
  global.sseClients = new Set<SSEClient>();
}

// GET /api/bookings/sse
// Server-Sent Events endpoint for real-time booking updates
export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  // Obter hostname do request para identificar o tenant
  const hostname =
    request.headers.get("host") ||
    request.headers.get("x-forwarded-host") ||
    "unknown";

  const stream = new ReadableStream({
    start(controller) {
      console.log(`🔌 [SSE] Novo cliente conectado do tenant: ${hostname}`);

      const client: SSEClient = {
        hostname, // Armazenar hostname do tenant
        send: (data: { event: string; data: string }) => {
          try {
            const message = `event: ${data.event}\ndata: ${data.data}\n\n`;
            controller.enqueue(encoder.encode(message));
          } catch (error) {
            console.error("[SSE] Erro ao enviar mensagem:", error);
          }
        },
        close: () => {
          try {
            controller.close();
          } catch (error) {
            // Ignore if already closed
          }
        },
      };

      // Adicionar cliente à lista global
      if (global.sseClients) {
        global.sseClients.add(client);
      }

      // Enviar mensagem inicial
      client.send({
        event: "connected",
        data: JSON.stringify({
          message: "Conectado ao sistema de notificações em tempo real",
          timestamp: new Date().toISOString(),
        }),
      });

      // Enviar ping a cada 30 segundos para manter conexão viva
      const pingInterval = setInterval(() => {
        client.send({
          event: "ping",
          data: JSON.stringify({ timestamp: new Date().toISOString() }),
        });
      }, 30000);

      // Cleanup quando conexão fechar
      request.signal.addEventListener("abort", () => {
        console.log("🔌 [SSE] Cliente desconectado");
        clearInterval(pingInterval);
        if (global.sseClients) {
          global.sseClients.delete(client);
        }
        client.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
