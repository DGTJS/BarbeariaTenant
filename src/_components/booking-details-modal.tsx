"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  User,
  Scissors,
  Timer,
  MessageCircle,
  X,
} from "lucide-react";
import { Button } from "@/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/_components/ui/dialog";
import { Badge } from "@/_components/ui/badge";
import { Booking } from "@/_types/booking";
import { useSiteConfig } from "@/_hooks/useSiteConfig";

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onStatusUpdate?: () => void;
}

export default function BookingDetailsModal({
  isOpen,
  onClose,
  booking,
  onStatusUpdate,
}: BookingDetailsModalProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [isExpired, setIsExpired] = useState(false);
  const [bookingData, setBookingData] = useState<Booking | null>(booking);
  const { config } = useSiteConfig();

  // Sincronizar bookingData quando booking mudar
  useEffect(() => {
    setBookingData(booking);
  }, [booking]);

  // Converter totalPrice para número de forma segura (DEVE vir antes de qualquer return)
  const totalPrice = useMemo(() => {
    const currentBooking = bookingData || booking;
    if (!currentBooking?.totalPrice) return 0;

    if (typeof currentBooking.totalPrice === "string") {
      const parsed = parseFloat(currentBooking.totalPrice);
      return isNaN(parsed) ? 0 : parsed;
    }

    const num = Number(currentBooking.totalPrice);
    return isNaN(num) ? 0 : num;
  }, [bookingData?.totalPrice, booking?.totalPrice]);

  // Debug: verificar condições do botão (DEVE vir antes de qualquer return)
  const shouldShowWhatsAppButton = useMemo(() => {
    const currentBooking = bookingData || booking;
    if (!currentBooking) return false;

    const statusMatch =
      currentBooking.status === "Aguardando Pagamento" ||
      currentBooking.status?.toLowerCase().includes("aguardando");
    const paymentMatch = currentBooking.paymentMethod?.toLowerCase() === "pix";
    const notExpired = !isExpired;

    console.log("🔍 [BOOKING-DETAILS] Condições do botão WhatsApp:", {
      status: currentBooking.status,
      statusMatch,
      paymentMethod: currentBooking.paymentMethod,
      paymentMatch,
      isExpired,
      notExpired,
      shouldShow: statusMatch && paymentMatch && notExpired,
    });

    return statusMatch && paymentMatch && notExpired;
  }, [
    bookingData?.status,
    bookingData?.paymentMethod,
    booking?.status,
    booking?.paymentMethod,
    isExpired,
  ]);

  // Buscar dados completos do booking quando o modal abrir (se necessário)
  useEffect(() => {
    if (!isOpen || !bookingData) return;

    // Se não tem totalPrice ou paymentMethod, buscar dados completos
    const needsRefresh = !bookingData.totalPrice || !bookingData.paymentMethod;

    const fetchCompleteBooking = async () => {
      try {
        const res = await fetch(`/api/bookings?userId=${bookingData.user.id}`);
        if (res.ok) {
          const bookings = await res.json();
          const completeBooking = bookings.find(
            (b: Booking) => b.id === bookingData.id
          );
          if (completeBooking) {
            console.log("✅ [BOOKING-DETAILS] Dados completos carregados:", {
              totalPrice: completeBooking.totalPrice,
              paymentMethod: completeBooking.paymentMethod,
            });
            setBookingData(completeBooking);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados completos:", error);
      }
    };

    if (needsRefresh) {
      fetchCompleteBooking();
    }
  }, [isOpen, bookingData]);

  // Calcular tempo restante e verificar status
  useEffect(() => {
    if (!isOpen || !bookingData) return;

    const checkStatus = async () => {
      // Buscar status atualizado do booking
      try {
        const res = await fetch(`/api/bookings?userId=${bookingData.user.id}`);
        if (res.ok) {
          const bookings = await res.json();
          const updatedBooking = bookings.find(
            (b: Booking) => b.id === bookingData.id
          );
          if (updatedBooking) {
            // Atualizar dados se houver mudanças
            if (
              updatedBooking.status !== bookingData.status ||
              updatedBooking.totalPrice !== bookingData.totalPrice ||
              updatedBooking.paymentMethod !== bookingData.paymentMethod
            ) {
              setBookingData(updatedBooking);
              if (
                updatedBooking.status !== bookingData.status &&
                onStatusUpdate
              ) {
                // Status mudou!
                onStatusUpdate();
              }
            }
          }
        }
      } catch (error) {
        console.error("Erro ao verificar status:", error);
      }
    };

    // Verificar status a cada 5 segundos se estiver aguardando pagamento
    let statusInterval: NodeJS.Timeout | null = null;
    if (bookingData.status === "Aguardando Pagamento") {
      statusInterval = setInterval(checkStatus, 5000);
    }

    // Calcular tempo restante se for "Aguardando Pagamento"
    let timerInterval: NodeJS.Timeout | null = null;
    if (
      bookingData.status === "Aguardando Pagamento" &&
      bookingData.paymentExpiresAt
    ) {
      const updateTimer = () => {
        const now = new Date().getTime();
        const expiresAtDate =
          typeof bookingData.paymentExpiresAt === "string"
            ? new Date(bookingData.paymentExpiresAt)
            : bookingData.paymentExpiresAt;
        const expiresAt = new Date(expiresAtDate).getTime();
        const difference = expiresAt - now;

        if (difference <= 0) {
          setTimeRemaining("Expirado");
          setIsExpired(true);
          // Atualizar status se expirou
          if (onStatusUpdate) {
            setTimeout(() => onStatusUpdate(), 1000);
          }
          return;
        }

        setIsExpired(false);
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeRemaining(
          `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      };

      updateTimer();
      timerInterval = setInterval(updateTimer, 1000);
    }

    return () => {
      if (statusInterval) clearInterval(statusInterval);
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [isOpen, bookingData, onStatusUpdate]);

  // Função para gerar link do WhatsApp (DEVE vir antes de qualquer return)
  const generateWhatsAppLink = useMemo(() => {
    return (price: number) => {
      const currentBooking = bookingData || booking;
      if (!currentBooking || !config?.barbershop_phone) {
        console.error(
          "Telefone do WhatsApp não configurado ou booking inválido"
        );
        return null;
      }

      const formattedPrice = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(price);

      const bookingDate = new Date(currentBooking.dateTime);
      const formattedDate = bookingDate.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const formattedTime = bookingDate.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const message =
        `Olá! Gostaria de confirmar o pagamento do meu agendamento via PIX:\n\n` +
        `*Serviço:* ${currentBooking.service.name}${
          currentBooking.serviceOption
            ? ` - ${currentBooking.serviceOption.name}`
            : ""
        }\n` +
        `*Barbeiro:* ${currentBooking.barber.name}\n` +
        `*Data:* ${formattedDate}\n` +
        `*Horário:* ${formattedTime}\n` +
        `*Valor:* ${formattedPrice}\n\n` +
        `Aguardo as informações para realizar o pagamento via PIX.`;

      const cleanPhone = config.barbershop_phone.replace(/\D/g, "");
      const encodedMessage = encodeURIComponent(message);
      return `https://wa.me/55${cleanPhone}?text=${encodedMessage}`;
    };
  }, [bookingData, booking, config?.barbershop_phone]);

  const handleWhatsAppClick = () => {
    const bookingToUse = bookingData || booking;
    if (!bookingToUse || !totalPrice || totalPrice === 0) {
      console.error("Valor do agendamento inválido:", {
        booking: bookingToUse?.id,
        totalPrice: bookingToUse?.totalPrice,
        calculated: totalPrice,
      });
      return;
    }

    // generateWhatsAppLink é um useMemo que retorna uma função
    const link = generateWhatsAppLink(totalPrice);
    if (link) {
      window.open(link, "_blank");
    } else {
      console.error("Não foi possível gerar o link do WhatsApp");
    }
  };

  // Debug: log dos dados do booking (DEVE vir ANTES do return condicional)
  useEffect(() => {
    const currentBooking = bookingData || booking;
    if (currentBooking && isOpen) {
      console.log("🔍 [BOOKING-DETAILS] Dados do booking recebidos:", {
        id: currentBooking.id,
        totalPrice: currentBooking.totalPrice,
        totalPriceType: typeof currentBooking.totalPrice,
        paymentMethod: currentBooking.paymentMethod,
        status: currentBooking.status,
        paymentExpiresAt: currentBooking.paymentExpiresAt,
        serviceName: currentBooking.service?.name,
      });
    }
  }, [bookingData, booking, isOpen]);

  // Retorno condicional APENAS após todos os hooks
  const currentBooking = bookingData || booking;
  if (!currentBooking) return null;

  const bookingDate = new Date(currentBooking.dateTime);
  const formattedDate = bookingDate.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedTime = bookingDate.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes("confirmado") || statusLower === "confirmed") {
      return (
        <Badge className="bg-green-500 hover:bg-green-600">Confirmado</Badge>
      );
    }
    if (
      statusLower.includes("aguardando") ||
      statusLower.includes("aguardandopagamento")
    ) {
      return (
        <Badge className="bg-amber-500 hover:bg-amber-600">
          Aguardando Pagamento
        </Badge>
      );
    }
    if (statusLower.includes("cancelado") || statusLower === "cancelled") {
      return <Badge className="bg-red-500 hover:bg-red-600">Cancelado</Badge>;
    }
    return <Badge variant="secondary">{status}</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detalhes do Agendamento</span>
            {getStatusBadge(currentBooking.status)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações do agendamento */}
          <div className="bg-accent/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Scissors className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm text-foreground-muted">Serviço</p>
                <p className="font-semibold text-foreground">
                  {currentBooking.service.name}
                  {currentBooking.serviceOption &&
                    ` - ${currentBooking.serviceOption.name}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-foreground-muted">Barbeiro</p>
                <p className="font-semibold text-foreground">
                  {currentBooking.barber.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-foreground-muted">Data</p>
                <p className="font-semibold text-foreground">{formattedDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-foreground-muted">Horário</p>
                <p className="font-semibold text-foreground">{formattedTime}</p>
              </div>
            </div>

            <div className="border-t border-border pt-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground-muted">Total</span>
                <span className="text-lg font-bold text-primary">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(totalPrice)}
                </span>
              </div>
            </div>

            {/* Cronômetro para pagamento PIX */}
            {currentBooking.status === "Aguardando Pagamento" &&
              currentBooking.paymentExpiresAt && (
                <div className="border-t border-border pt-3 mt-3">
                  <div
                    className={`flex items-center gap-2 justify-center p-3 rounded-lg border ${
                      isExpired
                        ? "bg-red-500/10 border-red-500/20"
                        : "bg-amber-500/10 border-amber-500/20"
                    }`}
                  >
                    <Timer
                      className={`w-5 h-5 ${isExpired ? "text-red-600" : "text-amber-600"}`}
                    />
                    <div>
                      <p className="text-xs text-foreground-muted">
                        Tempo restante para pagamento
                      </p>
                      <p
                        className={`text-lg font-bold ${isExpired ? "text-red-600" : "text-amber-600"}`}
                      >
                        {timeRemaining || "Calculando..."}
                      </p>
                    </div>
                  </div>
                  {!isExpired && (
                    <p className="text-xs text-center text-foreground-muted mt-2">
                      Após este tempo, o agendamento será cancelado
                      automaticamente
                    </p>
                  )}
                </div>
              )}

            {/* Status de aguardando pagamento - mostrar mensagem */}
            {currentBooking.status === "Aguardando Pagamento" && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mt-3">
                <p className="text-sm text-amber-600 font-medium text-center">
                  ⏳ Aguardando confirmação do pagamento via PIX
                </p>
              </div>
            )}
          </div>

          {/* Botão WhatsApp para pagamento */}
          {shouldShowWhatsAppButton && (
            <Button
              onClick={handleWhatsAppClick}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Enviar Pagamento via WhatsApp
            </Button>
          )}

          {/* Mensagem se confirmado */}
          {currentBooking.status === "Confirmado" && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
              <p className="text-sm text-green-600 font-medium">
                ✅ Agendamento confirmado com sucesso!
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
