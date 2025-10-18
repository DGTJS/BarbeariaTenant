"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/_components/ui/dialog";
import { Button } from "@/_components/ui/button";
import { Badge } from "@/_components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/_components/ui/avatar";
import { Calendar } from "@/_components/ui/calendar";
import { toast } from "sonner";
import { createBooking } from "@/_actions/create-booking";
import { getHomeData, sanitizeDecimal } from "@/_lib/getHomeData";
import { Clock, Star, Calendar as CalendarIcon, User, Scissors, X } from "lucide-react";
import Image from "next/image";

interface Service {
  id: string;
  name: string;
  price: any;
  duration: number;
  imageUrl: string;
  categoryId: string | null;
  barberShopId: string;
  description?: string;
  category?: {
    id: string;
    name: string;
    IconUrl: string;
  };
  barberShop: {
    id: string;
    name: string;
    address: string | null;
    phones: string[];
    imageUrl: string | null;
  };
}

interface Barber {
  id: string;
  name: string;
  photo: string;
  phone: string | null;
  barberShopId: string;
  categories: Array<{ id: string; name: string; IconUrl: string }>;
  workingHours: Array<{
    id: string;
    barberId: string;
    weekday: number;
    startTime: string;
    endTime: string;
    pauses: Array<{
      id: string;
      startTime: string;
      endTime: string;
    }>;
  }>;
  booking: Array<{ rating: number | null }>;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const { data: session, status } = useSession();
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedBarber && selectedDate) {
      generateAvailableTimes();
    }
  }, [selectedBarber, selectedDate]);

  const loadData = async () => {
    try {
      const homeData = await getHomeData();
      setServices(sanitizeDecimal(homeData.services));
      setBarbers(sanitizeDecimal(homeData.barbers));
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar dados");
    }
  };

  const generateAvailableTimes = () => {
    if (!selectedBarber || !selectedDate) return;

    const dayOfWeek = selectedDate.getDay();
    const workingHours = selectedBarber.workingHours.find(wh => wh.weekday === dayOfWeek);
    
    if (!workingHours) {
      setAvailableTimes([]);
      return;
    }

    const times: string[] = [];
    const startHour = parseInt(workingHours.startTime.split(':')[0]);
    const endHour = parseInt(workingHours.endTime.split(':')[0]);
    
    for (let hour = startHour; hour < endHour; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:00`);
      times.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    
    setAvailableTimes(times);
  };

  const handleBooking = async () => {
    if (!session?.user?.id) {
      toast.error("Você precisa estar logado para fazer um agendamento");
      return;
    }

    if (!selectedService || !selectedBarber || !selectedDate || !selectedTime) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const bookingDateTime = new Date(selectedDate);
      bookingDateTime.setHours(hours, minutes, 0, 0);

      await createBooking({
        userId: session.user.id,
        serviceId: selectedService.id,
        barberId: selectedBarber.id,
        dateTime: bookingDateTime,
        status: "PENDING"
      });

      toast.success("Agendamento realizado com sucesso!");
      handleClose();
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      toast.error("Erro ao criar agendamento");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedService(null);
    setSelectedBarber(null);
    setSelectedDate(new Date());
    setSelectedTime("");
    setCurrentStep(1);
    onClose();
  };

  const getBarberAverageRating = (barber: Barber) => {
    const ratings = barber.booking.filter(b => b.rating !== null).map(b => b.rating!);
    if (ratings.length === 0) return 5.0;
    return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  };

  const getServicePrice = (service: Service) => {
    const base = Number(service.price) || 0;
    return Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(base);
  };

  if (status === "loading") {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-white">
            <span className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Agendar Serviço
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
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
                {step < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      currentStep > step ? "bg-primary" : "bg-gray-600"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Selecionar Serviço */}
          {currentStep === 1 && (
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                <Scissors className="h-5 w-5" />
                Escolha o Serviço
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className={`cursor-pointer rounded-lg border p-4 transition-all hover:border-primary ${
                      selectedService?.id === service.id ? "border-primary bg-primary/10" : "border-border"
                    }`}
                    onClick={() => setSelectedService(service)}
                  >
                    <div className="relative mb-3 h-24 w-full">
                      <Image
                        src={service.imageUrl}
                        alt={service.name}
                        fill
                        className="rounded-lg object-cover"
                      />
                    </div>
                    <h4 className="mb-2 font-semibold text-white">{service.name}</h4>
                    <p className="mb-2 text-sm text-gray-400">{service.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">
                        {getServicePrice(service)}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="mr-1 h-3 w-3" />
                        {service.duration}min
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              {selectedService && (
                <div className="mt-4 flex justify-end">
                  <Button onClick={() => setCurrentStep(2)}>
                    Continuar
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Selecionar Barbeiro */}
          {currentStep === 2 && (
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                <User className="h-5 w-5" />
                Escolha o Barbeiro
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {barbers.map((barber) => (
                  <div
                    key={barber.id}
                    className={`cursor-pointer rounded-lg border p-4 transition-all hover:border-primary ${
                      selectedBarber?.id === barber.id ? "border-primary bg-primary/10" : "border-border"
                    }`}
                    onClick={() => setSelectedBarber(barber)}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={barber.photo} alt={barber.name} />
                        <AvatarFallback>{barber.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{barber.name}</h4>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-400">
                            {getBarberAverageRating(barber).toFixed(1)}
                          </span>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {barber.categories.slice(0, 2).map((category) => (
                            <Badge key={category.id} variant="outline" className="text-xs">
                              {category.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  Voltar
                </Button>
                {selectedBarber && (
                  <Button onClick={() => setCurrentStep(3)}>
                    Continuar
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Selecionar Data e Horário */}
          {currentStep === 3 && (
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                <CalendarIcon className="h-5 w-5" />
                Escolha Data e Horário
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Calendar */}
                <div>
                  <h4 className="mb-3 font-semibold text-white">Selecione a Data</h4>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border border-border bg-card"
                  />
                </div>

                {/* Time Selection */}
                <div>
                  <h4 className="mb-3 font-semibold text-white">Selecione o Horário</h4>
                  <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                    {availableTimes.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
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
              </div>

              {/* Resumo */}
              {selectedService && selectedBarber && selectedDate && selectedTime && (
                <div className="mt-6 rounded-lg border border-primary bg-primary/5 p-4">
                  <h4 className="mb-3 font-semibold text-white">Resumo do Agendamento</h4>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Serviço:</span>
                      <span className="text-white">{selectedService.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Barbeiro:</span>
                      <span className="text-white">{selectedBarber.name}</span>
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
                    <div className="flex justify-between border-t border-border pt-2 mt-2">
                      <span className="text-gray-400">Total:</span>
                      <span className="text-primary font-semibold">
                        {getServicePrice(selectedService)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  Voltar
                </Button>
                <Button
                  onClick={handleBooking}
                  disabled={loading || !selectedService || !selectedBarber || !selectedDate || !selectedTime}
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
