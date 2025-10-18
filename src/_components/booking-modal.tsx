"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/_components/ui/dialog";
import { Button } from "@/_components/ui/button";
import { Badge } from "@/_components/ui/badge";
import { Calendar } from "@/_components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/_components/ui/select";
import { toast } from "sonner";
import { createBooking } from "@/app/_actions/create-booking";
import { getHomeData, sanitizeDecimal } from "@/_lib/getHomeData";
import { set } from "date-fns";
import { CalendarIcon } from "lucide-react";
import Image from "next/image";

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

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const { data: session, status } = useSession();
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<BarberWithWorkingHours[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectBarber, setSelectBarber] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!selectBarber || !selectedDate) {
      setAvailableTimes([]);
      return;
    }

    const selectedBarberObj = barbers.find((b) => b.id === selectBarber);
    if (!selectedBarberObj) {
      setAvailableTimes([]);
      return;
    }

    // Descobrir o dia da semana (0=domingo, 1=segunda, ...)
    const weekday = selectedDate.getDay();
    const workingHour = selectedBarberObj.workingHours?.find(
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
        booking.barberId === selectBarber &&
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
  }, [selectBarber, selectedDate, barbers, bookings]);

  const loadData = async () => {
    try {
      const homeData = await getHomeData();
      setServices(sanitizeDecimal(homeData.services));
      setBarbers(sanitizeDecimal(homeData.barbers));
      setBookings(sanitizeDecimal(homeData.bookings));
      
      // Selecionar o primeiro serviço por padrão
      if (homeData.services.length > 0) {
        setSelectedService(sanitizeDecimal(homeData.services)[0]);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar dados");
    }
  };

  const handleSelectTime = (time: string | undefined) => {
    setSelectedTime(time);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleCreateBooking = async () => {
    if (!session?.user?.id) {
      toast.error("Você precisa estar logado para fazer um agendamento");
      return;
    }

    if (!selectBarber || !selectedDate || !selectedTime || !selectedService) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      const hours = Number(selectedTime.split(":")[0]);
      const minutes = Number(selectedTime.split(":")[1]);

      const newData = set(selectedDate, { hours: hours, minutes: minutes });

      await createBooking({
        barberId: selectBarber,
        dateTime: newData,
        serviceId: selectedService.id,
        status: "pending",
        userId: session.user.id,
      });

      toast.success("Agendamento criado com sucesso");
      handleClose();
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      toast.error("Erro ao criar agendamento");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectBarber("");
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    setAvailableTimes([]);
    onClose();
  };

  const getLowestPrice = (service: Service) => {
    const basePrice = Number(service.price);
    const adjustments = service.priceAdjustments || [];

    if (adjustments.length === 0) return basePrice;

    const pricesWithAdjustments = adjustments.map(
      (adj) => basePrice + Number(adj.priceAdjustment),
    );
    return Math.min(...pricesWithAdjustments);
  };

  if (status === "loading") {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Agendar Serviço</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-400">Carregando...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!session) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Acesso Necessário</DialogTitle>
          </DialogHeader>
          <div className="p-6 text-center">
            <p className="mb-6 text-gray-400">
              Você precisa estar logado para fazer um agendamento
            </p>
            <Button onClick={() => window.location.href = "/api/auth/signin"}>
              Fazer Login
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!selectedService) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Agendar Serviço</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-400">Carregando serviços...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Agendar Serviço</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Info */}
          <div className="rounded-lg border border-border p-4">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16">
                <Image
                  src={selectedService.imageUrl}
                  alt={selectedService.name}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{selectedService.name}</h3>
                <p className="text-sm text-gray-400">{selectedService.description}</p>
                <div className="mt-2 flex items-center gap-4">
                  <Badge variant="secondary" className="text-xs">
                    <CalendarIcon className="mr-1 h-3 w-3" />
                    {selectedService.duration}min
                  </Badge>
                  <span className="text-lg font-bold text-primary">
                    {Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(getLowestPrice(selectedService))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Barber Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-white">Selecione o Barbeiro</label>
            <Select value={selectBarber} onValueChange={setSelectBarber}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Escolha um barbeiro" />
              </SelectTrigger>
              <SelectContent>
                {barbers.map((barber) => (
                  <SelectItem key={barber.id} value={barber.id}>
                    <div className="flex items-center gap-2">
                      <div className="relative h-6 w-6">
                        <Image
                          src={barber.photo}
                          alt={barber.name}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      <span>{barber.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-white">Selecione a Data</label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => date < new Date()}
              className="rounded-md border border-border bg-card"
            />
          </div>

          {/* Time Selection */}
          {selectBarber && selectedDate && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-white">Selecione o Horário</label>
              <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                {availableTimes.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSelectTime(time)}
                    className="text-sm"
                  >
                    {time}
                  </Button>
                ))}
              </div>
              {availableTimes.length === 0 && (
                <p className="text-sm text-gray-400">
                  Nenhum horário disponível para esta data
                </p>
              )}
            </div>
          )}

          {/* Summary */}
          {selectBarber && selectedDate && selectedTime && (
            <div className="rounded-lg border border-primary bg-primary/5 p-4">
              <h4 className="mb-3 font-semibold text-white">Resumo do Agendamento</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Barbeiro:</span>
                  <span className="text-white">
                    {barbers.find((b) => b.id === selectBarber)?.name || "Selecione um barbeiro"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Data:</span>
                  <span className="text-white">
                    {selectedDate.toLocaleDateString("pt-BR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Horário:</span>
                  <span className="text-white">{selectedTime}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreateBooking}
              disabled={loading || !selectBarber || !selectedDate || !selectedTime}
            >
              {loading ? "Agendando..." : "Confirmar Agendamento"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}