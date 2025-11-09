"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/_components/ui/button";
import {
  CheckCircle,
  ClockIcon,
  Bell,
  X,
  DollarSign,
  User,
  CalendarIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/_components/ui/avatar";

interface PendingBooking {
  id?: string;
  bookingId?: string;
  customer?: {
    name: string;
    id: string;
  };
  service?: {
    name: string;
  };
  barber?: {
    name: string;
    photo?: string;
  };
  dateTime?: string;
  totalPrice?: number;
  paymentMethod?: string;
  paymentExpiresAt?: string;
  status?: string;
}

interface AdminNotificationsContextType {
  pendingBookings: PendingBooking[];
  addPendingBooking: (booking: PendingBooking) => void;
  removePendingBooking: (bookingId: string) => void;
  clearAll: () => void;
}

const AdminNotificationsContext = createContext<
  AdminNotificationsContextType | undefined
>(undefined);

export const AdminNotificationsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [pendingBookings, setPendingBookings] = useState<PendingBooking[]>([]);
  const [notificationSound, setNotificationSound] =
    useState<HTMLAudioElement | null>(null);

  // Definir funções ANTES dos useEffects que as utilizam
  const createNotificationSound = React.useCallback(() => {
    try {
      // Criar um tom usando Web Audio API
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      // Tocar 3 tons curtos
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.frequency.value = 800 - i * 50;
          oscillator.type = "sine";

          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime + 0.15
          );

          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.15);
        }, i * 200);
      }
    } catch (error) {
      console.error("Erro ao criar som:", error);
    }
  }, []);

  const addPendingBooking = React.useCallback((booking: PendingBooking) => {
    setPendingBookings(prev => {
      // Verificar se já existe para evitar duplicatas
      const exists = prev.some(
        b =>
          (b.id && b.id === booking.id) ||
          (b.bookingId && b.bookingId === booking.bookingId)
      );

      if (exists) {
        return prev;
      }

      return [...prev, booking];
    });
  }, []);

  const removePendingBooking = React.useCallback((bookingId: string) => {
    setPendingBookings(prev =>
      prev.filter(
        b =>
          (b.id && b.id !== bookingId) ||
          (b.bookingId && b.bookingId !== bookingId)
      )
    );
  }, []);

  const clearAll = React.useCallback(() => {
    setPendingBookings([]);
  }, []);

  // Criar som de notificação programaticamente (será usado quando necessário)
  useEffect(() => {
    // Apenas inicializar o estado do som, sem tocar ainda
    const audio = new Audio();
    audio.volume = 0.5;
    setNotificationSound(audio);
  }, []);

  // Carregar agendamentos pendentes existentes ao iniciar
  useEffect(() => {
    const loadPendingBookings = async () => {
      try {
        // Verificar se há sessão antes de fazer requisição
        const sessionCheck = await fetch(
          `${window.location.origin}/api/auth/session`,
          {
            credentials: "include",
          }
        );
        const sessionData = await sessionCheck.json();

        if (!sessionData.user) {
          console.log(
            "📋 [NOTIFICATIONS] Usuário não autenticado, pulando carregamento"
          );
          return;
        }

        console.log(
          "📋 [NOTIFICATIONS] Carregando agendamentos pendentes existentes..."
        );
        // Usar window.location.origin para preservar o subdomínio do tenant
        const response = await fetch(
          `${window.location.origin}/api/admin/bookings?status=Aguardando Pagamento`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          // Se for 401 ou 403, não logar erro - usuário não está autenticado
          if (response.status === 401 || response.status === 403) {
            console.log(
              "📋 [NOTIFICATIONS] Não autenticado, pulando carregamento"
            );
            return;
          }
          console.error(
            "❌ [NOTIFICATIONS] Erro ao carregar:",
            response.status
          );
          return;
        }

        const bookings = await response.json();
        console.log(
          `✅ [NOTIFICATIONS] ${bookings.length} agendamento(s) pendente(s)`
        );

        // Transformar bookings em formato do provider
        const formattedBookings = bookings.map((booking: any) => ({
          id: booking.id,
          bookingId: booking.id,
          customer: {
            name: booking.user?.name || "Cliente",
            id: booking.user?.id || "",
          },
          service: {
            name: booking.service?.name || "Serviço",
          },
          barber: {
            name: booking.barber?.name || "Barbeiro",
            photo: booking.barber?.photo,
          },
          dateTime: booking.dateTime,
          totalPrice: Number(booking.totalPrice || 0),
          paymentMethod: booking.paymentMethod,
          paymentExpiresAt: booking.paymentExpiresAt,
          status: booking.status,
        }));

        // Adicionar todos de uma vez
        if (formattedBookings.length > 0) {
          setPendingBookings(formattedBookings);
          console.log(
            "✅ [NOTIFICATIONS] Agendamentos pendentes carregados na tela"
          );
        }
      } catch (error) {
        console.error("❌ [NOTIFICATIONS] Erro ao carregar:", error);
      }
    };

    loadPendingBookings();
  }, []);

  // Conectar ao SSE para receber notificações
  useEffect(() => {
    let eventSource: EventSource | null = null;

    const connectSSE = () => {
      try {
        console.log("🔌 [NOTIFICATIONS] Conectando ao SSE...");
        eventSource = new EventSource("/api/bookings/sse");

        eventSource.addEventListener("connected", () => {
          console.log("✅ [NOTIFICATIONS] Conectado ao SSE");
        });

        eventSource.addEventListener("booking.payment_pending", event => {
          try {
            const bookingData = JSON.parse(event.data);
            console.log("🔔 [NOTIFICATIONS] Novo agendamento:", bookingData);

            // Tocar som de notificação
            createNotificationSound();

            // Mostrar toast de notificação
            toast.info("Novo agendamento aguardando pagamento!", {
              description: `${bookingData.customer?.name || "Cliente"} - ${bookingData.service?.name || "Serviço"}`,
              duration: 5000,
            });

            // Adicionar aos agendamentos pendentes
            addPendingBooking(bookingData);
          } catch (error) {
            console.error("Erro ao processar notificação:", error);
          }
        });

        eventSource.addEventListener("booking.status_changed", event => {
          try {
            const bookingData = JSON.parse(event.data);
            console.log("📨 [NOTIFICATIONS] Status alterado:", bookingData);

            // Remover dos pendentes se foi confirmado ou cancelado
            if (
              bookingData.status === "Confirmado" ||
              bookingData.status === "Cancelado"
            ) {
              const bookingId = bookingData.bookingId || bookingData.id;
              if (bookingId) {
                removePendingBooking(bookingId);
              }
            }
          } catch (error) {
            console.error("Erro ao processar mudança de status:", error);
          }
        });

        eventSource.onerror = error => {
          console.error("❌ [NOTIFICATIONS] Erro no SSE:", error);
          if (eventSource) {
            eventSource.close();
          }
          setTimeout(() => {
            connectSSE();
          }, 5000);
        };
      } catch (error) {
        console.error("Erro ao conectar SSE:", error);
      }
    };

    connectSSE();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [
    notificationSound,
    addPendingBooking,
    removePendingBooking,
    createNotificationSound,
  ]);

  return (
    <AdminNotificationsContext.Provider
      value={{
        pendingBookings,
        addPendingBooking,
        removePendingBooking,
        clearAll,
      }}
    >
      {children}
      {/* Cards de notificação flutuantes */}
      {pendingBookings.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 space-y-3 max-w-md">
          {pendingBookings.map((booking, index) => (
            <PendingBookingCard
              key={booking.bookingId || booking.id || index}
              booking={booking}
              onDismiss={() =>
                removePendingBooking(booking.bookingId || booking.id || "")
              }
              onConfirm={async () => {
                const bookingId = booking.bookingId || booking.id;
                if (!bookingId) return;

                try {
                  // Usar window.location.origin para preservar o subdomínio do tenant
                  const response = await fetch(
                    `${window.location.origin}/api/bookings/${bookingId}/confirm-payment`,
                    {
                      method: "PATCH",
                    }
                  );

                  if (!response.ok) {
                    const error = await response.json();
                    throw new Error(
                      error.error || "Erro ao confirmar pagamento"
                    );
                  }

                  toast.success("Pagamento confirmado com sucesso!", {
                    description: `Agendamento de ${booking.customer?.name || "Cliente"} foi confirmado.`,
                  });

                  removePendingBooking(bookingId);
                } catch (error) {
                  console.error("Erro ao confirmar pagamento:", error);
                  toast.error(
                    error instanceof Error
                      ? error.message
                      : "Erro ao confirmar pagamento"
                  );
                }
              }}
            />
          ))}
        </div>
      )}
    </AdminNotificationsContext.Provider>
  );
};

// Componente de card de notificação
function PendingBookingCard({
  booking,
  onDismiss,
  onConfirm,
}: {
  booking: PendingBooking;
  onDismiss: () => void;
  onConfirm: () => void;
}) {
  const [isConfirming, setIsConfirming] = React.useState(false);
  const [timeRemaining, setTimeRemaining] = React.useState<{
    minutes: number;
    seconds: number;
    totalMs: number;
    expired: boolean;
  }>({ minutes: 0, seconds: 0, totalMs: 0, expired: false });

  // Calcular tempo restante para pagamento
  React.useEffect(() => {
    const calculateTimeRemaining = () => {
      if (!booking.paymentExpiresAt) {
        setTimeRemaining({
          minutes: 0,
          seconds: 0,
          totalMs: 0,
          expired: false,
        });
        return;
      }

      const expiresAt = new Date(booking.paymentExpiresAt);
      const now = new Date();
      const diffMs = expiresAt.getTime() - now.getTime();

      if (diffMs <= 0) {
        setTimeRemaining({
          minutes: 0,
          seconds: 0,
          totalMs: 0,
          expired: true,
        });
        return;
      }

      const minutes = Math.floor(diffMs / 60000);
      const seconds = Math.floor((diffMs % 60000) / 1000);

      setTimeRemaining({
        minutes,
        seconds,
        totalMs: diffMs,
        expired: false,
      });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [booking.paymentExpiresAt]);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm();
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div
      className="bg-background-secondary border-2 border-primary rounded-xl shadow-2xl p-4 animate-in slide-in-from-right-5 duration-300"
      style={{ backgroundColor: "hsl(var(--background-secondary))" }}
    >
      {/* Header com ícone de sino */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/20 rounded-lg animate-pulse">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-bold text-foreground text-sm">
              Novo Agendamento
            </p>
            <p className="text-xs text-muted-foreground">
              Aguardando Pagamento
            </p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Informações do agendamento */}
      <div className="space-y-3 mb-4">
        {/* Cliente e Data */}
        <div className="flex items-start gap-3">
          <div className="flex flex-col gap-1 flex-1">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="font-semibold text-foreground">
                {booking.customer?.name || "Cliente"}
              </span>
            </div>
            {booking.dateTime && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarIcon className="h-3 w-3 flex-shrink-0" />
                <span>
                  {new Date(booking.dateTime).toLocaleString("pt-BR", {
                    weekday: "long",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Barbeiro com foto */}
        {booking.barber?.name && (
          <div
            className="flex items-center gap-2 p-2 bg-background-secondary rounded-lg"
            style={{ backgroundColor: "hsl(var(--background-secondary))" }}
          >
            <Avatar className="h-10 w-10 border-2 border-primary/30 flex-shrink-0 overflow-hidden">
              <AvatarImage
                src={booking.barber.photo}
                style={{
                  objectPosition: "center center",
                }}
              />
              <AvatarFallback className="bg-primary/20 text-primary-foreground font-bold">
                {booking.barber.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">
                {booking.barber.name}
              </p>
              {booking.service?.name && (
                <p className="text-xs text-muted-foreground truncate">
                  {booking.service.name}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Valor */}
        <div className="flex items-center gap-2 text-sm pt-2 border-t border-border">
          <DollarSign className="h-4 w-4 text-primary" />
          <span className="text-foreground font-semibold">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(Number(booking.totalPrice || 0))}
          </span>
        </div>

        {/* Cronômetro destacado */}
        {booking.paymentExpiresAt && (
          <div className="pt-3 mt-3 border-t border-border">
            <div
              className="bg-background-secondary rounded-lg p-3 border-2 border-primary/30"
              style={{ backgroundColor: "hsl(var(--background-secondary))" }}
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <ClockIcon
                  className={`h-5 w-5 ${
                    timeRemaining.expired
                      ? "text-destructive animate-pulse"
                      : timeRemaining.totalMs < 300000
                        ? "text-destructive animate-pulse"
                        : "text-primary"
                  }`}
                />
                <span className="text-xs font-medium text-foreground uppercase">
                  Tempo Restante
                </span>
              </div>
              {timeRemaining.expired ? (
                <div className="text-center">
                  <p className="text-xl font-bold text-destructive animate-pulse">
                    EXPIRADO
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <div
                      className="bg-card rounded-lg px-3 py-2 shadow-inner border border-border"
                      style={{ backgroundColor: "hsl(var(--card))" }}
                    >
                      <p className="text-2xl font-bold tabular-nums text-foreground">
                        {String(timeRemaining.minutes).padStart(2, "0")}:
                        {String(timeRemaining.seconds).padStart(2, "0")}
                      </p>
                    </div>
                  </div>
                  {timeRemaining.totalMs < 300000 && (
                    <p className="text-xs text-destructive font-semibold mt-1 animate-pulse">
                      ⚠️ Atenção! Menos de 5 minutos
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Botão de ação */}
      <Button
        onClick={handleConfirm}
        disabled={isConfirming}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
        size="sm"
      >
        {isConfirming ? (
          <>
            <ClockIcon className="h-4 w-4 mr-2 animate-spin" />
            Confirmando...
          </>
        ) : (
          <>
            <CheckCircle className="h-4 w-4 mr-2" />
            Confirmar Pagamento
          </>
        )}
      </Button>
    </div>
  );
}

export const useAdminNotifications = () => {
  const context = useContext(AdminNotificationsContext);
  if (!context) {
    throw new Error(
      "useAdminNotifications must be used within AdminNotificationsProvider"
    );
  }
  return context;
};
