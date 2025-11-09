"use client";

import { useEffect, useState, useCallback } from "react";

interface BookingUpdate {
  bookingId: string;
  status: string;
  previousStatus?: string;
  timestamp: string;
  customer?: {
    name: string | null;
    email: string | null;
    phone: string | null;
  };
  service?: {
    name: string;
    duration?: number;
  };
  barber?: {
    name: string;
  };
  dateTime?: Date | string;
}

/**
 * Hook para receber atualizações de agendamentos em tempo real via SSE
 */
export function useBookingUpdates() {
  const [updates, setUpdates] = useState<BookingUpdate[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<BookingUpdate | null>(null);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    const connect = () => {
      console.log("🔌 Conectando ao SSE...");

      eventSource = new EventSource("/api/bookings/sse");

      eventSource.addEventListener("connected", event => {
        console.log("✅ SSE conectado:", event.data);
        setIsConnected(true);
      });

      // Novo agendamento criado
      eventSource.addEventListener("booking.created", event => {
        const update: BookingUpdate = JSON.parse(event.data);
        console.log("🆕 Novo agendamento criado:", {
          id: update.bookingId,
          cliente: update.customer?.name,
          serviço: update.service?.name,
          barbeiro: update.barber?.name,
          data: update.dateTime,
        });

        setLastUpdate(update);
        setUpdates(prev => [update, ...prev].slice(0, 100)); // Manter últimas 100
      });

      // Status de agendamento alterado
      eventSource.addEventListener("booking.status_changed", event => {
        const update: BookingUpdate = JSON.parse(event.data);
        console.log("📨 Status alterado:", {
          id: update.bookingId,
          cliente: update.customer?.name,
          status: `${update.previousStatus} → ${update.status}`,
        });

        setLastUpdate(update);
        setUpdates(prev => [update, ...prev].slice(0, 100)); // Manter últimas 100
      });

      eventSource.addEventListener("ping", event => {
        // Apenas para manter conexão viva - não logar para não poluir console
      });

      eventSource.onerror = error => {
        console.error("❌ Erro no SSE:", error);
        setIsConnected(false);
        eventSource?.close();

        // Reconectar após 5 segundos
        setTimeout(connect, 5000);
      };
    };

    connect();

    return () => {
      console.log("🔌 Desconectando SSE...");
      eventSource?.close();
      setIsConnected(false);
    };
  }, []);

  const clearUpdates = useCallback(() => {
    setUpdates([]);
    setLastUpdate(null);
  }, []);

  return {
    updates,
    lastUpdate,
    isConnected,
    clearUpdates,
  };
}
