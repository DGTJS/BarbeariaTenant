"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { CalendarIcon, StarIcon } from "lucide-react";
import type { barber as Barber } from "@/generated/prisma/client";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Calendar } from "./ui/calendar";
import { ptBR } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState, useEffect } from "react";
import { createBooking } from "@/app/_actions/create-booking";
import { set } from "date-fns";
import { toast } from "sonner";

interface BarberWithWorkingHours extends Barber {
  workingHours: {
    weekday: number;
    startTime: string;
    endTime: string;
    pauses: { startTime: string; endTime: string }[];
  }[];
}

interface BarberServiceProps {
  BarberShopService: {
    id: string;
    name: string;
    price: number;
    duration: number;
    imageUrl: string;
    barber: BarberWithWorkingHours[];
    priceAdjustments?: { priceAdjustment: number }[];
    description?: string;
  };
  nameButton: string;
  barbers: BarberWithWorkingHours[];
  bookings: {
    dateTime: Date;
    service: { duration: number };
    barberId: string;
  }[];
}

const CardServices = ({
  BarberShopService,
  nameButton,
  barbers,
  bookings,
}: BarberServiceProps) => {
  const { data: session } = useSession();
  const [selectBarber, setSelectBarber] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined,
  );
  // const { data } = useSession();

  const handleSelectTime = (time: string | undefined) => {
    setSelectedTime(time);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

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

    // Descubrir o dia da semana (0=domingo, 1=segunda, ...)
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
        booking.service &&
        booking.barberId === selectBarber &&
        new Date(booking.dateTime).toDateString() ===
          selectedDate.toDateString(),
    );

    // Gera slots de 30 em 30 minutos
    let slot = new Date(start);
    const slots: string[] = [];
    while (slot < end) {
      const slotEnd = new Date(
        slot.getTime() + BarberShopService.duration * 60000,
      );

      // Verifica se está em uma pausa
      const isInPause = pauses.some(
        (pause: { startTime: string; endTime: string }) => {
          const [pauseStartHour, pauseStartMinute] = pause.startTime
            .split(":")
            .map(Number);
          const [pauseEndHour, pauseEndMinute] = pause.endTime
            .split(":")
            .map(Number);
          const pauseStart = new Date(selectedDate);
          pauseStart.setHours(pauseStartHour, pauseStartMinute, 0, 0);
          const pauseEnd = new Date(selectedDate);
          pauseEnd.setHours(pauseEndHour, pauseEndMinute, 0, 0);

          return (
            (slot >= pauseStart && slot < pauseEnd) ||
            (slotEnd > pauseStart && slotEnd <= pauseEnd) ||
            (slot <= pauseStart && slotEnd >= pauseEnd)
          );
        },
      );

      const isBusy = bookingsForBarberAndDate.some((booking) => {
        const bookingStart = new Date(booking.dateTime);
        const bookingEnd = new Date(
          bookingStart.getTime() + booking.service.duration * 60000,
        );
        return (
          (slot >= bookingStart && slot < bookingEnd) ||
          (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
          (slot <= bookingStart && slotEnd >= bookingEnd)
        );
      });

      if (!isInPause && !isBusy && slotEnd <= end) {
        slots.push(
          slot
            .toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
            .replace(/^24:/, "00:"),
        );
      }
      slot = new Date(slot.getTime() + 30 * 60000);
    }
    setAvailableTimes(slots);
  }, [
    selectBarber,
    selectedDate,
    barbers,
    BarberShopService.duration,
    bookings,
  ]);

  if (!BarberShopService) return null;

  const getLowestPrice = () => {
    const basePrice = Number(BarberShopService.price);
    const adjustments = BarberShopService.priceAdjustments || [];

    if (adjustments.length === 0) return basePrice;

    const pricesWithAdjustments = adjustments.map(
      (adj) => basePrice + Number(adj.priceAdjustment),
    );
    return Math.min(...pricesWithAdjustments);
  };
  const handleCreateBooking = async () => {
    try {
      if (!selectBarber || !selectedDate || !selectedTime) return;
      
      console.log("Creating booking for user:", session?.user?.id);
      console.log("Session:", session);

      const hours = Number(selectedTime.split(":")[0]);
      const minutes = Number(selectedTime.split(":")[1]);

      const newData = set(selectedDate, { hours: hours, minutes: minutes });

      await createBooking({
        barberId: selectBarber,
        dateTime: newData,
        serviceId: BarberShopService.id,
        status: "pending",
        userId: session?.user?.id || "",
      });
      console.log(createBooking);
      toast.success("Agendamento criado com sucesso");
      // Atualizar a página para mostrar o novo agendamento
      window.location.reload();
    } catch (e) {
      console.error(e);
      toast.error("Erro ao criar agendamento");
    }
  };

  return (
    <>
      {/* Mobile Layout */}
      <Card className="flex max-w-[160px] min-w-[175px] rounded-2xl p-1 lg:hidden">
        <CardContent className="p-0 px-1 pt-1">
          <div className="relative h-[159px] w-full">
            <Image
              src={BarberShopService.imageUrl}
              alt="Logo"
              fill
              className="rounded-2xl object-cover"
            />
            <Badge
              className="absolute top-2 left-2 bg-black/60 shadow-md backdrop-blur-md"
              variant="secondary"
            >
              <StarIcon className="fill-primary text-primary h-4 w-4" />
              <span className="text-xs font-semibold">5.0</span>
            </Badge>
          </div>
          <div className="px-1 py-3">
            <h3 className="truncate text-lg font-semibold">
              {BarberShopService.name}
            </h3>
            <p className="truncate text-sm text-gray-500">
              A partir de R$ {getLowestPrice().toFixed(2)}
            </p>
            <p className="truncate text-sm text-gray-500">
              Duração: {BarberShopService.duration} Min
            </p>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="mt-3 w-full cursor-pointer border-none bg-gray-700 hover:bg-gray-600"
                >
                  {nameButton}
                </Button>
              </SheetTrigger>
            <SheetContent
              side="right"
              className="flex max-h-screen flex-col gap-1 overflow-hidden"
            >
              <SheetHeader className="flex-shrink-0 border-b p-3 pt-5 pb-5 font-semibold">
                <SheetTitle className="flex items-center">
                  <CalendarIcon className="mr-1 h-4 w-4" />
                  Fazer Reserva
                </SheetTitle>
              </SheetHeader>

              <div className="scrollbar-sheet flex-1 overflow-y-auto">
                <div className="border-b px-5 pb-5">
                  <Select value={selectBarber} onValueChange={setSelectBarber}>
                    <h3 className="py-2 text-sm font-semibold">
                      Escolha seu Barbeiro
                    </h3>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um barbeiro" />
                    </SelectTrigger>

                    <SelectContent>
                      {barbers.map((barber) => (
                        <SelectItem key={barber.id} value={barber.id}>
                          <Image
                            src={barber.photo}
                            alt="Logo"
                            width={15}
                            height={15}
                            className="rounded-full object-cover"
                          />
                          {barber.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Calendar
                  mode="single"
                  locale={ptBR}
                  className="w-full border-b pb-2"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => {
                    // Desabilita datas anteriores a hoje
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); // Zera hora para comparar só a data
                    return date < today;
                  }}
                />

                {selectedDate && (
                  <div className="flex gap-2 overflow-auto border-b px-3 py-6 [&::-webkit-scrollbar]:hidden">
                    {selectBarber &&
                      selectedDate &&
                      availableTimes.length === 0 && (
                        <span>Nenhum horário disponível</span>
                      )}
                    {availableTimes.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        className="rounded-2xl border-solid font-normal text-white"
                        onClick={() => handleSelectTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                )}

                {selectedDate && (
                  <div className="p-5">
                    <Card className="px-0 py-3">
                      <CardContent className="space-y-2 px-2">
                        <div className="flex justify-between px-2">
                          <h2 className="font-semibold">
                            {BarberShopService.name}
                          </h2>
                          <p className="text-sm font-bold">
                            {Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(Number(BarberShopService.price))}
                          </p>
                        </div>
                        <div className="flex justify-between px-2">
                          <span className="text-sm text-gray-500">Data</span>
                          <span className="text-sm">
                            {selectedDate.toLocaleDateString("pt-BR", {
                              day: "numeric",
                              month: "long",
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between px-2">
                          <span className="text-sm text-gray-500">Horário</span>
                          <span className="text-sm">{selectedTime}</span>
                        </div>
                        <div className="flex justify-between px-2">
                          <span className="text-sm text-gray-500">Duração</span>
                          <span className="text-sm">
                            {BarberShopService.duration} Min
                          </span>
                        </div>
                        <div className="flex justify-between px-2">
                          <span className="text-sm text-gray-500">
                            Barbeiro
                          </span>
                          <span className="text-sm">
                            {barbers.find((b) => b.id === selectBarber)?.name ||
                              "Selecione um barbeiro"}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>

              <SheetFooter className="flex-shrink-0 border-t px-5 pt-4">
                <Button
                  type="submit"
                  className="w-full text-white"
                  onClick={handleCreateBooking}
                >
                  Confirmar
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </CardContent>
    </Card>

    {/* Desktop Layout */}
    <Card className="hidden lg:block group overflow-hidden rounded-2xl border-0 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20">
      <CardContent className="p-0">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={BarberShopService.imageUrl}
            alt={BarberShopService.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <Badge
            className="absolute top-3 left-3 bg-white/20 backdrop-blur-md border-white/30 text-white"
            variant="secondary"
          >
            <StarIcon className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold">5.0</span>
          </Badge>
          <div className="absolute bottom-3 right-3 rounded-full bg-primary/90 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">
            {BarberShopService.duration}min
          </div>
        </div>
        <div className="p-4">
          <h3 className="mb-2 text-lg font-bold text-white truncate">
            {BarberShopService.name}
          </h3>
          <div className="mb-3 space-y-1">
            <p className="text-sm font-semibold text-primary">
              A partir de R$ {getLowestPrice().toFixed(2)}
            </p>
            {BarberShopService.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {BarberShopService.description}
              </p>
            )}
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="w-full border-primary/30 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-200"
              >
                {nameButton}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex max-h-screen flex-col gap-1 overflow-hidden"
            >
              <SheetHeader className="flex-shrink-0 border-b p-3 pt-5 pb-5 font-semibold">
                <SheetTitle className="flex items-center">
                  <CalendarIcon className="mr-1 h-4 w-4" />
                  Fazer Reserva
                </SheetTitle>
              </SheetHeader>

              <div className="scrollbar-sheet flex-1 overflow-y-auto">
                <div className="border-b px-5 pb-5">
                  <Select value={selectBarber} onValueChange={setSelectBarber}>
                    <h3 className="py-2 text-sm font-semibold">
                      Escolha seu Barbeiro
                    </h3>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um barbeiro" />
                    </SelectTrigger>

                    <SelectContent>
                      {barbers.map((barber) => (
                        <SelectItem key={barber.id} value={barber.id}>
                          <Image
                            src={barber.photo}
                            alt="Logo"
                            width={15}
                            height={15}
                            className="rounded-full object-cover"
                          />
                          {barber.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Calendar
                  mode="single"
                  locale={ptBR}
                  className="w-full border-b pb-2"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => {
                    // Desabilita datas anteriores a hoje
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); // Zera hora para comparar só a data
                    return date < today;
                  }}
                />

                {selectedDate && (
                  <div className="flex gap-2 overflow-auto border-b px-3 py-6 [&::-webkit-scrollbar]:hidden">
                    {selectBarber &&
                      selectedDate &&
                      availableTimes.length === 0 && (
                        <span>Nenhum horário disponível</span>
                      )}
                    {availableTimes.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        className="rounded-2xl border-solid font-normal text-white"
                        onClick={() => handleSelectTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                )}

                {selectedDate && (
                  <div className="p-5">
                    <Card className="px-0 py-3">
                      <CardContent className="space-y-2 px-2">
                        <div className="flex justify-between px-2">
                          <h2 className="font-semibold">
                            {BarberShopService.name}
                          </h2>
                          <p className="text-sm font-bold">
                            {Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(Number(BarberShopService.price))}
                          </p>
                        </div>
                        <div className="flex justify-between px-2">
                          <span className="text-sm text-gray-500">Data</span>
                          <span className="text-sm">
                            {selectedDate.toLocaleDateString("pt-BR", {
                              day: "numeric",
                              month: "long",
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between px-2">
                          <span className="text-sm text-gray-500">Horário</span>
                          <span className="text-sm">{selectedTime}</span>
                        </div>
                        <div className="flex justify-between px-2">
                          <span className="text-sm text-gray-500">Duração</span>
                          <span className="text-sm">
                            {BarberShopService.duration} Min
                          </span>
                        </div>
                        <div className="flex justify-between px-2">
                          <span className="text-sm text-gray-500">
                            Barbeiro
                          </span>
                          <span className="text-sm">
                            {barbers.find((b) => b.id === selectBarber)?.name ||
                              "Selecione um barbeiro"}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>

              <SheetFooter className="flex-shrink-0 border-t px-5 pt-4">
                <Button
                  type="submit"
                  className="w-full text-white"
                  onClick={handleCreateBooking}
                >
                  Confirmar
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </CardContent>
    </Card>
    </>
  );
};

export default CardServices;
