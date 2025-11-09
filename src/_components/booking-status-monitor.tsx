"use client";

import { useBookingUpdates } from "@/_hooks/useBookingUpdates";
import { Badge } from "@/_components/ui/badge";
import { CheckCircle, XCircle, Clock, Wifi, WifiOff } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

export function BookingStatusMonitor() {
  const { lastUpdate, isConnected } = useBookingUpdates();

  useEffect(() => {
    if (lastUpdate) {
      // Se tem previousStatus, é uma mudança de status, senão é novo agendamento
      const isNewBooking = !lastUpdate.previousStatus;

      if (isNewBooking) {
        // Notificação de NOVO agendamento
        const customerName = lastUpdate.customer?.name || "Cliente";
        const serviceName = lastUpdate.service?.name || "Serviço";
        const barberName = lastUpdate.barber?.name || "Barbeiro";

        const dateTime = lastUpdate.dateTime
          ? new Date(lastUpdate.dateTime).toLocaleString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "";

        toast.success("🆕 Novo Agendamento!", {
          description: (
            <div className="space-y-1">
              <p className="font-semibold">{customerName}</p>
              <p className="text-xs">
                {serviceName} com {barberName}
              </p>
              {dateTime && (
                <p className="text-xs text-muted-foreground">{dateTime}</p>
              )}
            </div>
          ),
          icon: <CheckCircle className="h-4 w-4" />,
          duration: 8000, // 8 segundos para dar tempo de ler
        });
      } else {
        // Notificação de MUDANÇA de status
        const statusMessages: Record<string, string> = {
          confirmed: "Agendamento confirmado!",
          cancelled: "Agendamento cancelado",
          completed: "Serviço concluído!",
          pending: "Aguardando confirmação",
        };

        const statusIcons: Record<string, any> = {
          confirmed: <CheckCircle className="h-4 w-4" />,
          cancelled: <XCircle className="h-4 w-4" />,
          completed: <CheckCircle className="h-4 w-4" />,
          pending: <Clock className="h-4 w-4" />,
        };

        const message =
          statusMessages[lastUpdate.status] || "Status atualizado";
        const icon = statusIcons[lastUpdate.status];
        const customerName =
          lastUpdate.customer?.name ||
          `ID ${lastUpdate.bookingId.substring(0, 8)}`;

        toast.success(message, {
          description: (
            <div className="space-y-1">
              <p className="font-semibold">{customerName}</p>
              {lastUpdate.service?.name && (
                <p className="text-xs">{lastUpdate.service.name}</p>
              )}
            </div>
          ),
          icon,
          duration: 5000,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastUpdate?.bookingId, lastUpdate?.status]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Badge
        variant={isConnected ? "default" : "destructive"}
        className="flex items-center gap-2"
      >
        {isConnected ? (
          <>
            <Wifi className="h-3 w-3" />
            <span className="text-xs">Tempo Real</span>
          </>
        ) : (
          <>
            <WifiOff className="h-3 w-3" />
            <span className="text-xs">Desconectado</span>
          </>
        )}
      </Badge>
    </div>
  );
}
