"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { toast } from "sonner";
import { createBooking } from "@/app/_actions/create-booking";
import { ptBR } from "date-fns/locale/pt-BR";
import { CalendarIcon, Clock, User, X } from "lucide-react";

interface BarberWithWorkingHours {
  id: string;
  name: string;
  photo: string;
  phone: string | null;
  barberShopId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  workingHours: {
    id: string;
    barberId: string;
    weekday: number;
    startTime: string;
    endTime: string;
    pauses: {
      id: string;
      startTime: string;
      endTime: string;
    }[];
  }[];
}

interface Service {
  id: string;
  name: string;
  price: any;
  duration: number;
  imageUrl: string;
  categoryId: string | null;
  barberShopId: string;
  description?: string;
  priceAdjustments?: Array<{ priceAdjustment: any }>;
}

interface Booking {
  id: string;
  dateTime: Date;
  status: string;
  barberId: string;
  serviceId: string;
  userId: string;
}

interface BookingSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service;
  barber: {
    id: string;
    name: string;
    photo: string;
    workingHours?: {
      id: string;
      barberId: string;
      weekday: number;
      startTime: string;
      endTime: string;
      pauses: {
        id: string;
        startTime: string;
        endTime: string;
      }[];
    }[];
  };
  bookings: Booking[];
}

const BookingSidebar = ({ isOpen, onClose, service, barber, bookings }: BookingSidebarProps) => {
  const { data: session } = useSession();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const handleSelectTime = useCallback((time: string | undefined) => {
    setSelectedTime(time);
  }, []);

  const handleDateSelect = useCallback((date: Date | undefined) => {
    setSelectedDate(date);
  }, []);

  useEffect(() => {
    if (!selectedDate) {
      setAvailableTimes([]);
      return;
    }

    // Descobrir o dia da semana (0=domingo, 1=segunda, ...)
    const weekday = selectedDate.getDay();
    
    const workingHour = barber.workingHours?.find(
      (wh) => wh.weekday === weekday,
    );

    if (!workingHour) {
      setAvailableTimes([]);
      return;
    }

    // Parse início e fim do expediente
    const [startHour, startMinute] = workingHour.startTime
      .split(":")
      .map(Number);
    const [endHour, endMinute] = workingHour.endTime.split(":").map(Number);

    const start = new Date(selectedDate);
    start.setHours(startHour, startMinute, 0, 0);
    const end = new Date(selectedDate);
    end.setHours(endHour, endMinute, 0, 0);

    // Pausas
    const pauses = workingHour.pauses || [];

    const bookingsForBarberAndDate = bookings.filter(
      (booking) =>
        booking.barberId === barber.id &&
        new Date(booking.dateTime).toDateString() ===
          selectedDate.toDateString(),
    );

    // Gera slots de 30 em 30 minutos
    let slot = new Date(start);
    const slots: string[] = [];
    while (slot < end) {
      const slotEnd = new Date(slot.getTime() + 30 * 60 * 1000); // 30 minutos

      // Verifica se o slot está em uma pausa
      const isInPause = pauses.some((pause) => {
        const pauseStart = new Date(selectedDate);
        const [pauseStartHour, pauseStartMinute] = pause.startTime
          .split(":")
          .map(Number);
        pauseStart.setHours(pauseStartHour, pauseStartMinute, 0, 0);

        const pauseEnd = new Date(selectedDate);
        const [pauseEndHour, pauseEndMinute] = pause.endTime
          .split(":")
          .map(Number);
        pauseEnd.setHours(pauseEndHour, pauseEndMinute, 0, 0);

        return slot >= pauseStart && slotEnd <= pauseEnd;
      });

      // Verifica se já existe um agendamento neste horário
      const hasBooking = bookingsForBarberAndDate.some((booking) => {
        const bookingTime = new Date(booking.dateTime);
        return (
          bookingTime.getHours() === slot.getHours() &&
          bookingTime.getMinutes() === slot.getMinutes()
        );
      });

      if (!isInPause && !hasBooking) {
        slots.push(
          `${slot.getHours().toString().padStart(2, "0")}:${slot
            .getMinutes()
            .toString()
            .padStart(2, "0")}`,
        );
      }

      slot = new Date(slot.getTime() + 30 * 60 * 1000); // Próximo slot
    }

    setAvailableTimes(slots);
  }, [selectedDate, barber.id, bookings.length]);

  const handleCreateBooking = useCallback(async () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    if (!session?.user?.id) {
      toast.error("Você precisa estar logado para fazer um agendamento");
      return;
    }

    setLoading(true);
    try {
      const hours = Number(selectedTime.split(":")[0]);
      const minutes = Number(selectedTime.split(":")[1]);

      const newData = new Date(selectedDate);
      newData.setHours(hours, minutes, 0, 0);

      await createBooking({
        barberId: barber.id,
        dateTime: newData,
        serviceId: service.id,
        status: "Pendente",
        userId: session.user.id,
      });

      toast.success("Agendamento realizado com sucesso!");
      onClose();
      
      // Reset form
      setSelectedDate(undefined);
      setSelectedTime(undefined);
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      toast.error("Erro ao realizar agendamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [selectedDate, selectedTime, service.id, barber.id, session?.user?.id, onClose]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="bg-background border-border w-full sm:w-[400px] max-w-[90vw] overflow-y-auto">
        <SheetTitle className="mx-5 pt-5 pl-3 text-left text-2xl border-b border-solid border-gray-700 pb-4">
          Agendar Serviço
        </SheetTitle>

        <div className="mx-5 flex flex-col gap-4 pb-6">
          {/* Informações do Serviço */}
          <div className="border-b border-solid border-gray-700 pb-4">
            <h3 className="text-sm font-semibold mb-3">Serviço Selecionado</h3>
            <div className="flex items-center gap-3">
              <img
                src={service.imageUrl}
                alt={service.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-semibold">{service.name}</h4>
                <p className="text-sm text-foreground-muted">{service.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-primary font-semibold">
                    {formatPrice(service.price)}
                  </span>
                  <span className="text-sm text-foreground-muted">
                    <Clock className="inline h-3 w-3 mr-1" />
                    {service.duration} min
                  </span>
                </div>
              </div>
            </div>
          </div>


          {/* Calendário */}
          <div className="border-b border-solid border-gray-700 pb-4">
            <label className="text-sm font-semibold mb-3 block">Data</label>
            <Calendar
              mode="single"
              locale={ptBR}
              className="w-full"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today;
              }}
            />
          </div>

          {/* Seleção de Horário */}
          {selectedDate && (
            <div className="border-b border-solid border-gray-700 pb-4">
              <label className="text-sm font-semibold mb-3 block">Horário</label>
              {availableTimes.length > 0 ? (
                <div className="flex gap-2 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:max-h-48 sm:overflow-y-auto sm:pb-0 [&::-webkit-scrollbar]:hidden [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar-track]:hidden [&::-webkit-scrollbar-thumb]:hidden">
                  {availableTimes.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSelectTime(time)}
                      className="text-sm h-10 flex-shrink-0 sm:min-w-0"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Clock className="h-8 w-8 text-foreground-muted mx-auto mb-2" />
                  <p className="text-sm text-foreground-muted">Nenhum horário disponível</p>
                  <p className="text-xs text-foreground-muted mt-1">Tente selecionar outra data</p>
                </div>
              )}
            </div>
          )}

          {/* Resumo */}
          {selectedDate && selectedTime && (
            <div className="border-b border-solid border-gray-700 pb-4">
              <h4 className="font-semibold mb-2">Resumo do Agendamento</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground-muted">Data:</span>
                  <span>
                    {selectedDate.toLocaleDateString("pt-BR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long"
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-muted">Horário:</span>
                  <span>{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-muted">Total:</span>
                  <span className="text-primary font-semibold">
                    {formatPrice(service.price)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Botão de Agendamento */}
          {selectedDate && selectedTime && (
            <div className="px-2 py-2">
              <Button
                onClick={handleCreateBooking}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Agendando..." : "Confirmar Agendamento"}
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BookingSidebar;
