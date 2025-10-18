"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/_components/ui/dialog";
import { Button } from "@/_components/ui/button";
import { Badge } from "@/_components/ui/badge";
import { Calendar } from "@/_components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/_components/ui/select";
import { toast } from "sonner";
import { createBooking } from "@/app/_actions/create-booking";
import { set } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, ChevronLeft, ChevronRight, Scissors, User, Clock, CheckCircle } from "lucide-react";

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

interface Category {
  id: string;
  name: string;
  IconUrl: string;
  description?: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  barbers: BarberWithWorkingHours[];
  bookings: Booking[];
  categories: Category[];
}

export default function BookingModal({ isOpen, onClose, services, barbers, bookings, categories }: BookingModalProps) {
  const { data: session, status } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectBarber, setSelectBarber] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setSelectedCategory(null);
      setSelectedService(null);
      setSelectBarber("");
      setSelectedDate(undefined);
      setSelectedTime(undefined);
      setAvailableTimes([]);
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

  // Filtrar serviços por categoria
  const filteredServices = useMemo(() => 
    selectedCategory 
      ? services.filter(service => service.categoryId === selectedCategory.id)
      : [],
    [selectedCategory, services]
  );

  // Filtrar barbeiros que oferecem o serviço selecionado
  const filteredBarbers = useMemo(() => 
    selectedService 
      ? barbers.filter(barber => {
          // Aqui você pode adicionar lógica para verificar se o barbeiro oferece o serviço
          // Por enquanto, retorna todos os barbeiros
          return true;
        })
      : [],
    [selectedService, barbers]
  );


  const handleSelectTime = useCallback((time: string | undefined) => {
    setSelectedTime(time);
  }, []);

  const handleDateSelect = useCallback((date: Date | undefined) => {
    setSelectedDate(date);
  }, []);

  const handleCreateBooking = useCallback(async () => {
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
        userId: session?.user?.id || "",
      });

      toast.success("Agendamento criado com sucesso");
      handleClose();
      // Atualizar a página para mostrar o novo agendamento
      window.location.reload();
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      toast.error("Erro ao criar agendamento");
    } finally {
      setLoading(false);
    }
  }, [selectBarber, selectedDate, selectedTime, selectedService, session?.user?.id]);

  const handleClose = useCallback(() => {
    setCurrentStep(1);
    setSelectedCategory(null);
    setSelectedService(null);
    setSelectBarber("");
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    setAvailableTimes([]);
    onClose();
  }, [onClose]);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => prev + 1);
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => prev - 1);
  }, []);

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Escolha a Categoria";
      case 2: return "Escolha o Serviço";
      case 3: return "Escolha o Barbeiro";
      case 4: return "Escolha a Data";
      case 5: return "Escolha o Horário";
      case 6: return "Resumo do Agendamento";
      default: return "Agendar Serviço";
    }
  };

  const getStepIcon = () => {
    switch (currentStep) {
      case 1: return <Scissors className="h-5 w-5" />;
      case 2: return <Scissors className="h-5 w-5" />;
      case 3: return <User className="h-5 w-5" />;
      case 4: return <CalendarIcon className="h-5 w-5" />;
      case 5: return <Clock className="h-5 w-5" />;
      case 6: return <CheckCircle className="h-5 w-5" />;
      default: return <CalendarIcon className="h-5 w-5" />;
    }
  };

  const getLowestPrice = useCallback((service: Service) => {
    const basePrice = Number(service.price);
    const adjustments = service.priceAdjustments || [];

    if (adjustments.length === 0) return basePrice;

    const pricesWithAdjustments = adjustments.map(
      (adj) => basePrice + Number(adj.priceAdjustment),
    );
    return Math.min(...pricesWithAdjustments);
  }, []);


  // Se o modal não estiver aberto, não renderizar nada
  if (!isOpen) {
    return null;
  }

  // Verificar se os dados estão carregados
  if (!categories || categories.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Agendar Serviço</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-400">Carregando categorias...</p>
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
          <DialogTitle className="flex items-center gap-2 text-white">
            {getStepIcon()}
            {getStepTitle()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-2">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step
                      ? "bg-primary text-white"
                      : "bg-gray-600 text-gray-400"
                  }`}
                >
                  {step}
                </div>
                {step < 6 && (
                  <div
                    className={`w-8 h-1 mx-1 ${
                      currentStep > step ? "bg-primary" : "bg-gray-600"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Categoria */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className={`cursor-pointer rounded-lg border p-4 transition-all hover:border-primary ${
                      selectedCategory?.id === category.id ? "border-primary bg-primary/10" : "border-border"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={category.IconUrl} 
                        alt={category.name} 
                        width={24} 
                        height={24}
                        className="flex-shrink-0 rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-white">{category.name}</h4>
                        {category.description && (
                          <p className="text-sm text-gray-400">{category.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {selectedCategory && (
                <div className="flex justify-end">
                  <Button onClick={nextStep}>
                    Continuar
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Serviço */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    className={`cursor-pointer rounded-lg border p-4 transition-all hover:border-primary ${
                      selectedService?.id === service.id ? "border-primary bg-primary/10" : "border-border"
                    }`}
                    onClick={() => setSelectedService(service)}
                  >
                    <div className="mb-3 h-16 w-full">
                      <img
                        src={service.imageUrl}
                        alt={service.name}
                        width={200}
                        height={64}
                        className="w-full h-16 rounded-lg object-cover"
                      />
                    </div>
                    <h4 className="mb-2 font-semibold text-white">{service.name}</h4>
                    <p className="mb-2 text-sm text-gray-400">{service.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">
                        {Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(getLowestPrice(service))}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="mr-1 h-3 w-3" />
                        {service.duration}min
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Voltar
                </Button>
                {selectedService && (
                  <Button onClick={nextStep}>
                    Continuar
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Barbeiro */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {filteredBarbers.map((barber) => (
                  <div
                    key={barber.id}
                    className={`cursor-pointer rounded-lg border p-4 transition-all hover:border-primary ${
                      selectBarber === barber.id ? "border-primary bg-primary/10" : "border-border"
                    }`}
                    onClick={() => setSelectBarber(barber.id)}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={barber.photo}
                        alt={barber.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{barber.name}</h4>
                        <p className="text-sm text-gray-400">Barbeiro Profissional</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Voltar
                </Button>
                {selectBarber && (
                  <Button onClick={nextStep}>
                    Continuar
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Data */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Selecione a Data</h3>
                <p className="text-sm text-gray-400">Escolha uma data disponível para seu agendamento</p>
              </div>
              
              <div className="w-full">
                <div className="calendar-container">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={(date) => date < new Date()}
                    className="rounded-lg border border-border bg-card p-4 w-full"
                    locale={ptBR}
                    classNames={{
                      months: "flex flex-col space-y-4",
                      month: "space-y-4",
                      caption: "flex justify-between items-center mb-4 px-2",
                      caption_label: "text-lg font-semibold text-white",
                      nav: "flex items-center justify-between w-full",
                      nav_button: "h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100 text-white hover:bg-white/10 rounded-md transition-all flex items-center justify-center",
                      nav_button_previous: "order-first",
                      nav_button_next: "order-last",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex w-full",
                      head_cell: "text-gray-400 rounded-md flex-1 font-normal text-[0.8rem] text-center",
                      row: "flex w-full mt-2",
                      cell: "flex-1 h-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                      day: "w-full h-9 p-0 font-normal aria-selected:opacity-100 text-white hover:bg-primary hover:text-white rounded-md transition-colors flex items-center justify-center",
                      day_selected: "bg-primary text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white",
                      day_today: "bg-accent text-accent-foreground",
                      day_outside: "day-outside text-gray-400 opacity-50 aria-selected:bg-accent/50 aria-selected:text-gray-400 aria-selected:opacity-30",
                      day_disabled: "text-gray-400 opacity-50",
                      day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                      day_hidden: "invisible",
                    }}
                  />
                </div>
                <style jsx>{`
                  .calendar-container :global(table) {
                    width: 100% !important;
                  }
                  .calendar-container :global(thead tr) {
                    display: flex !important;
                    width: 100% !important;
                  }
                  .calendar-container :global(thead th) {
                    flex: 1 !important;
                    text-align: center !important;
                  }
                  .calendar-container :global(tbody tr) {
                    display: flex !important;
                    width: 100% !important;
                  }
                  .calendar-container :global(tbody td) {
                    flex: 1 !important;
                    text-align: center !important;
                  }
                  .calendar-container :global(tbody button) {
                    width: 100% !important;
                    height: 36px !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                  }
                `}</style>
              </div>

              {selectedDate && (
                <div className="text-center p-4 bg-primary/10 border border-primary/30 rounded-lg">
                  <p className="text-sm text-primary font-medium">
                    Data selecionada: {selectedDate.toLocaleDateString("pt-BR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </p>
                </div>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Voltar
                </Button>
                {selectedDate && (
                  <Button onClick={nextStep}>
                    Continuar
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Horário */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Selecione o Horário</h3>
                <p className="text-sm text-gray-400">Escolha um horário disponível para {selectedDate?.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}</p>
              </div>

              {availableTimes.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-2">
                  {availableTimes.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSelectTime(time)}
                      className={`text-sm h-12 transition-all duration-200 ${
                        selectedTime === time 
                          ? "bg-primary text-white shadow-lg scale-105" 
                          : "hover:scale-105 hover:border-primary/50"
                      }`}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 bg-gray-800/50 border border-gray-600 rounded-lg">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 mb-2">Nenhum horário disponível</p>
                  <p className="text-sm text-gray-500">Tente selecionar outra data</p>
                </div>
              )}

              {selectedTime && (
                <div className="text-center p-4 bg-primary/10 border border-primary/30 rounded-lg">
                  <p className="text-sm text-primary font-medium">
                    Horário selecionado: {selectedTime}
                  </p>
                </div>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Voltar
                </Button>
                {selectedTime && (
                  <Button onClick={nextStep}>
                    Continuar
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Step 6: Resumo */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="rounded-lg border border-primary bg-primary/5 p-4">
                <h4 className="mb-3 font-semibold text-white">Resumo do Agendamento</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Categoria:</span>
                    <span className="text-white">{selectedCategory?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Serviço:</span>
                    <span className="text-white">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Barbeiro:</span>
                    <span className="text-white">
                      {barbers.find((b) => b.id === selectBarber)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Data:</span>
                    <span className="text-white">
                      {selectedDate?.toLocaleDateString("pt-BR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Horário:</span>
                    <span className="text-white">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2 mt-2">
                    <span className="text-gray-400">Total:</span>
                    <span className="text-primary font-semibold">
                      {selectedService && Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(getLowestPrice(selectedService))}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Voltar
                </Button>
                <Button
                  onClick={handleCreateBooking}
                  disabled={loading}
                >
                  {loading ? "Agendando..." : "Confirmar Agendamento"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}