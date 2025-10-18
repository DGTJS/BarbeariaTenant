"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card";
import { Button } from "@/_components/ui/button";
import { Badge } from "@/_components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/_components/ui/avatar";
import { Calendar } from "@/_components/ui/calendar";
import { toast } from "sonner";
import { createBooking } from "../_actions/create-booking";
import { getUserData } from "@/_lib/getUserData";
import { getHomeData, sanitizeDecimal } from "@/_lib/getHomeData";
import { Clock, MapPin, Star, Calendar as CalendarIcon, User, Scissors } from "lucide-react";
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

interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [userData, homeData] = await Promise.all([
          getUserData(),
          getHomeData()
        ]);
        
        setUser(userData as User);
        const sanitizedServices = sanitizeDecimal(homeData.services);
        const sanitizedBarbers = sanitizeDecimal(homeData.barbers);
        
        setServices(sanitizedServices);
        setBarbers(sanitizedBarbers);

        // Pré-selecionar serviço se fornecido na URL
        const serviceId = searchParams.get('serviceId');
        if (serviceId) {
          const service = sanitizedServices.find((s: any) => s.id === serviceId);
          if (service) {
            setSelectedService(service);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados");
      }
    };

    loadData();
  }, [searchParams]);

  useEffect(() => {
    if (selectedBarber && selectedDate) {
      generateAvailableTimes();
    }
  }, [selectedBarber, selectedDate]);

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
    if (!user) {
      toast.error("Você precisa estar logado para fazer um agendamento");
      router.push("/api/auth/signin");
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
        userId: user.id,
        serviceId: selectedService.id,
        barberId: selectedBarber.id,
        dateTime: bookingDateTime,
        status: "PENDING"
      });

      toast.success("Agendamento realizado com sucesso!");
      router.push("/");
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      toast.error("Erro ao criar agendamento");
    } finally {
      setLoading(false);
    }
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

  if (!user) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="mx-auto max-w-4xl">
          <Card className="border-border">
            <CardContent className="p-8 text-center">
              <h2 className="mb-4 text-2xl font-bold text-white">Acesso Necessário</h2>
              <p className="mb-6 text-gray-400">
                Você precisa estar logado para fazer um agendamento
              </p>
              <Button onClick={() => router.push("/api/auth/signin")}>
                Fazer Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Agendar Serviço</h1>
          <p className="text-gray-400">Escolha seu serviço, barbeiro e horário</p>
        </div>

        {/* Step 1: Selecionar Serviço */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Scissors className="h-5 w-5" />
              Passo 1: Escolha o Serviço
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <Card
                  key={service.id}
                  className={`cursor-pointer border transition-all hover:border-primary ${
                    selectedService?.id === service.id ? "border-primary bg-primary/10" : "border-border"
                  }`}
                  onClick={() => setSelectedService(service)}
                >
                  <CardContent className="p-4">
                    <div className="relative mb-3 h-32 w-full">
                      <Image
                        src={service.imageUrl}
                        alt={service.name}
                        fill
                        className="rounded-lg object-cover"
                      />
                    </div>
                    <h3 className="mb-2 font-semibold text-white">{service.name}</h3>
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
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Selecionar Barbeiro */}
        {selectedService && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <User className="h-5 w-5" />
                Passo 2: Escolha o Barbeiro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {barbers.map((barber) => (
                  <Card
                    key={barber.id}
                    className={`cursor-pointer border transition-all hover:border-primary ${
                      selectedBarber?.id === barber.id ? "border-primary bg-primary/10" : "border-border"
                    }`}
                    onClick={() => setSelectedBarber(barber)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={barber.photo} alt={barber.name} />
                          <AvatarFallback>{barber.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{barber.name}</h3>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-gray-400">
                              {getBarberAverageRating(barber).toFixed(1)}
                            </span>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {barber.categories.slice(0, 2).map((category) => (
                              <Badge key={category.id} variant="outline" className="text-xs">
                                {category.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Selecionar Data e Horário */}
        {selectedBarber && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <CalendarIcon className="h-5 w-5" />
                Passo 3: Escolha Data e Horário
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                  <div className="grid grid-cols-3 gap-2">
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
            </CardContent>
          </Card>
        )}

        {/* Resumo e Confirmação */}
        {selectedService && selectedBarber && selectedDate && selectedTime && (
          <Card className="border-primary bg-primary/5">
            <CardHeader>
              <CardTitle className="text-white">Resumo do Agendamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold text-white">Serviço</h4>
                  <p className="text-gray-400">{selectedService.name}</p>
                  <p className="text-primary">{getServicePrice(selectedService)}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Barbeiro</h4>
                  <p className="text-gray-400">{selectedBarber.name}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Data</h4>
                  <p className="text-gray-400">
                    {selectedDate.toLocaleDateString("pt-BR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Horário</h4>
                  <p className="text-gray-400">{selectedTime}</p>
                </div>
              </div>
              
              <Button
                onClick={handleBooking}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? "Agendando..." : "Confirmar Agendamento"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
