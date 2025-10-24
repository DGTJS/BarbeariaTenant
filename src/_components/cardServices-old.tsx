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
import { ptBR } from "date-fns/locale/pt-BR";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState, useEffect, useCallback, useMemo } from "react";
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

interface ServiceOption {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  status: boolean;
  imageUrl?: string;
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
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [selectedServiceOption, setSelectedServiceOption] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1);
  // const { data } = useSession();

  // Função para gerar opções de serviços
  const getServiceOptions = (service: any): ServiceOption[] => {
    const serviceOptionsMap: { [key: string]: ServiceOption[] } = {
      "Corte de Cabelo": [
        { id: "1", name: "Degradê", description: "Corte com degradê nas laterais", price: 25, duration: 30, status: true, imageUrl: "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png" },
        { id: "2", name: "Social", description: "Corte social clássico", price: 20, duration: 25, status: true, imageUrl: "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png" },
        { id: "3", name: "Militar", description: "Corte militar curto", price: 18, duration: 20, status: true, imageUrl: "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png" },
        { id: "4", name: "Moicano", description: "Corte moicano moderno", price: 30, duration: 35, status: true, imageUrl: "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png" },
        { id: "5", name: "Undercut", description: "Corte undercut moderno", price: 28, duration: 32, status: true, imageUrl: "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png" },
        { id: "6", name: "Pompadour", description: "Corte pompadour clássico", price: 32, duration: 35, status: true, imageUrl: "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png" }
      ],
      "Barba": [
        { id: "7", name: "Barba Completa", description: "Aparar e modelar barba completa", price: 15, duration: 20, status: true, imageUrl: "https://utfs.io/f/e6bdffb6-24a9-455b-aba3-903c2c2b5bde-1jo6tu.png" },
        { id: "8", name: "Bigode", description: "Aparar e modelar bigode", price: 10, duration: 15, status: true, imageUrl: "https://utfs.io/f/e6bdffb6-24a9-455b-aba3-903c2c2b5bde-1jo6tu.png" },
        { id: "9", name: "Barba + Bigode", description: "Barba e bigode completos", price: 20, duration: 25, status: true, imageUrl: "https://utfs.io/f/e6bdffb6-24a9-455b-aba3-903c2c2b5bde-1jo6tu.png" },
        { id: "10", name: "Barba Riscada", description: "Barba com riscos e desenhos", price: 25, duration: 30, status: true, imageUrl: "https://utfs.io/f/e6bdffb6-24a9-455b-aba3-903c2c2b5bde-1jo6tu.png" },
        { id: "11", name: "Barba Longa", description: "Modelagem de barba longa", price: 18, duration: 25, status: true, imageUrl: "https://utfs.io/f/e6bdffb6-24a9-455b-aba3-903c2c2b5bde-1jo6tu.png" }
      ],
      "Sobrancelha": [
        { id: "12", name: "Design Simples", description: "Design básico das sobrancelhas", price: 12, duration: 15, status: true, imageUrl: "https://utfs.io/f/2118f76e-89e4-43e6-87c9-8f157500c333-b0ps0b.png" },
        { id: "13", name: "Design Completo", description: "Design completo com modelagem", price: 18, duration: 20, status: true, imageUrl: "https://utfs.io/f/2118f76e-89e4-43e6-87c9-8f157500c333-b0ps0b.png" },
        { id: "14", name: "Henna", description: "Design com henna para realçar", price: 25, duration: 25, status: true, imageUrl: "https://utfs.io/f/2118f76e-89e4-43e6-87c9-8f157500c333-b0ps0b.png" },
        { id: "15", name: "Microblading", description: "Técnica de microblading", price: 35, duration: 45, status: true, imageUrl: "https://utfs.io/f/2118f76e-89e4-43e6-87c9-8f157500c333-b0ps0b.png" }
      ],
      "Pézinho": [
        { id: "16", name: "Pézinho Simples", description: "Acabamento básico do pézinho", price: 15, duration: 15, status: true, imageUrl: "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png" },
        { id: "17", name: "Pézinho Detalhado", description: "Acabamento detalhado e preciso", price: 20, duration: 20, status: true, imageUrl: "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png" },
        { id: "18", name: "Pézinho + Nuca", description: "Acabamento completo da nuca", price: 25, duration: 25, status: true, imageUrl: "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png" }
      ],
      "Massagem": [
        { id: "19", name: "Massagem Relaxante", description: "Massagem para relaxamento total", price: 40, duration: 30, status: true, imageUrl: "https://utfs.io/f/c4919193-a675-4c47-9f21-ebd86d1c8e6a-4oen2a.png" },
        { id: "20", name: "Massagem Terapêutica", description: "Massagem para alívio de tensões", price: 50, duration: 40, status: true, imageUrl: "https://utfs.io/f/c4919193-a675-4c47-9f21-ebd86d1c8e6a-4oen2a.png" },
        { id: "21", name: "Massagem Facial", description: "Massagem facial revitalizante", price: 35, duration: 25, status: true, imageUrl: "https://utfs.io/f/c4919193-a675-4c47-9f21-ebd86d1c8e6a-4oen2a.png" },
        { id: "22", name: "Massagem Capilar", description: "Massagem no couro cabeludo", price: 25, duration: 20, status: true, imageUrl: "https://utfs.io/f/c4919193-a675-4c47-9f21-ebd86d1c8e6a-4oen2a.png" }
      ],
      "Hidratação": [
        { id: "23", name: "Hidratação Básica", description: "Hidratação simples do cabelo", price: 20, duration: 20, status: true, imageUrl: "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png" },
        { id: "24", name: "Hidratação Profunda", description: "Hidratação profunda e nutritiva", price: 30, duration: 30, status: true, imageUrl: "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png" },
        { id: "25", name: "Hidratação + Barba", description: "Hidratação completa cabelo e barba", price: 35, duration: 35, status: true, imageUrl: "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png" },
        { id: "26", name: "Tratamento Premium", description: "Tratamento premium com queratina", price: 45, duration: 45, status: true, imageUrl: "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png" }
      ]
    };

    return serviceOptionsMap[service.name] || [
      { id: "default", name: "Padrão", description: "Serviço padrão", price: Number(service.price), duration: service.duration, status: true, imageUrl: service.imageUrl }
    ];
  };

  const handleSelectTime = useCallback((time: string | undefined) => {
    setSelectedTime(time);
  }, []);

  const handleDateSelect = useCallback((date: Date | undefined) => {
    setSelectedDate(date);
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => prev + 1);
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => prev - 1);
  }, []);

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

  const getLowestPrice = useMemo(() => {
    const basePrice = Number(BarberShopService.price);
    const adjustments = BarberShopService.priceAdjustments || [];

    if (adjustments.length === 0) return basePrice;

    const pricesWithAdjustments = adjustments.map(
      (adj) => basePrice + Number(adj.priceAdjustment),
    );
    return Math.min(...pricesWithAdjustments);
  }, [BarberShopService.price, BarberShopService.priceAdjustments]);
  const handleCreateBooking = useCallback(async () => {
    try {
      if (!selectBarber || !selectedDate || !selectedTime) return;

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
      
      toast.success("Agendamento criado com sucesso");
      // Atualizar a página para mostrar o novo agendamento
      window.location.reload();
    } catch (e) {
      console.error(e);
      toast.error("Erro ao criar agendamento");
    }
  }, [selectBarber, selectedDate, selectedTime, BarberShopService.id, session?.user?.id, selectedServiceOption]);

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
            <p className="truncate text-sm text-foreground-muted">
              A partir de R$ {getLowestPrice.toFixed(2)}
            </p>
            <p className="truncate text-sm text-foreground-muted">
              Duração: {BarberShopService.duration} Min
            </p>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="mt-3 w-full cursor-pointer border-none bg-card-secondary hover:bg-card-hover"
                onClick={() => setCurrentStep(1)}
              >
                {nameButton}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex max-h-screen flex-col gap-1 overflow-hidden"
            >
              <SheetHeader className="flex-shrink-0 border-b p-3 pt-5 pb-5 font-semibold">
                <SheetTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CalendarIcon className="mr-1 h-4 w-4" />
                    Fazer Reserva
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Passo {currentStep} de 4
                  </div>
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
                        className="rounded-2xl border-solid font-normal text-card-foreground"
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
                          <span className="text-sm text-foreground-muted">Data</span>
                          <span className="text-sm">
                            {selectedDate.toLocaleDateString("pt-BR", {
                              day: "numeric",
                              month: "long",
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between px-2">
                          <span className="text-sm text-foreground-muted">Horário</span>
                          <span className="text-sm">{selectedTime}</span>
                        </div>
                        <div className="flex justify-between px-2">
                          <span className="text-sm text-foreground-muted">Duração</span>
                          <span className="text-sm">
                            {BarberShopService.duration} Min
                          </span>
                        </div>
                        <div className="flex justify-between px-2">
                          <span className="text-sm text-foreground-muted">
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
                  className="w-full text-card-foreground"
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
            className="absolute top-3 left-3 bg-card/20 backdrop-blur-md border-card-border text-card-foreground"
            variant="secondary"
          >
            <StarIcon className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold">5.0</span>
          </Badge>
          <div className="absolute bottom-3 right-3 rounded-full bg-primary/90 px-2 py-1 text-xs font-bold text-primary-foreground backdrop-blur-sm">
            {BarberShopService.duration}min
          </div>
        </div>
        <div className="p-4">
          <h3 className="mb-2 text-lg font-bold text-card-foreground truncate">
            {BarberShopService.name}
          </h3>
          <div className="mb-3 space-y-1">
            <p className="text-sm font-semibold text-primary">
              A partir de R$ {getLowestPrice.toFixed(2)}
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
                className="w-full border-primary/30 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
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
                        className="rounded-2xl border-solid font-normal text-card-foreground"
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
                          <span className="text-sm text-foreground-muted">Data</span>
                          <span className="text-sm">
                            {selectedDate.toLocaleDateString("pt-BR", {
                              day: "numeric",
                              month: "long",
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between px-2">
                          <span className="text-sm text-foreground-muted">Horário</span>
                          <span className="text-sm">{selectedTime}</span>
                        </div>
                        <div className="flex justify-between px-2">
                          <span className="text-sm text-foreground-muted">Duração</span>
                          <span className="text-sm">
                            {BarberShopService.duration} Min
                          </span>
                        </div>
                        <div className="flex justify-between px-2">
                          <span className="text-sm text-foreground-muted">
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
                  className="w-full text-card-foreground"
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
