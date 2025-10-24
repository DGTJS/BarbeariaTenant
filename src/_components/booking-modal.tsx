"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/_components/ui/sheet";
import { Button } from "@/_components/ui/button";
import { Badge } from "@/_components/ui/badge";
import { Calendar } from "@/_components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/_components/ui/select";
import { toast } from "sonner";
import { useBooking } from "@/_hooks/use-booking";
import BookingSuccessModal from "./booking-success-modal";
import DynamicIcon from "./dynamic-icon";
import { set } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
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
  serviceOptions?: ServiceOption[];
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
  services?: Service[];
  barbers?: BarberWithWorkingHours[];
  bookings?: Booking[];
  categories: Category[];
  preselectedService?: Service | null;
  preselectedBarber?: BarberWithWorkingHours | null;
}

export default function BookingModal({ isOpen, onClose, services, barbers, bookings, categories, preselectedService, preselectedBarber }: BookingModalProps) {
  const { data: session, status } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedServiceOption, setSelectedServiceOption] = useState<ServiceOption | null>(null);
  const [selectBarber, setSelectBarber] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  // Estado para armazenar opções de serviços
  const [serviceOptions, setServiceOptions] = useState<{ [key: string]: ServiceOption[] }>({});

  // Função para buscar opções de serviços do banco de dados
  const fetchServiceOptions = async (serviceId: string) => {
    try {
      const response = await fetch(`/api/services/${serviceId}/options`);
      if (response.ok) {
        const options = await response.json();
        
        // Atualizar o estado com as opções do banco
        setServiceOptions(prev => ({
          ...prev,
          [serviceId]: options
        }));
        
        return options;
      }
    } catch (error) {
      console.error('Erro ao buscar opções do serviço:', error);
    }
    
    // Se falhar, usar fallback
    const fallbackOptions = getFallbackOptions(serviceId);
    setServiceOptions(prev => ({
      ...prev,
      [serviceId]: fallbackOptions
    }));
    return fallbackOptions;
  };

  // Função para gerar opções de serviços baseadas no serviço selecionado
  const getServiceOptions = async (service: Service): Promise<ServiceOption[]> => {
    // Verificar se já temos as opções em cache
    if (serviceOptions[service.id]) {
      return serviceOptions[service.id];
    }

    // Buscar opções do banco de dados
    const options = await fetchServiceOptions(service.id);
    return options;
  };

  // Função de fallback com opções hardcoded
  const getFallbackOptions = (serviceId: string): ServiceOption[] => {
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

    // Retornar opção padrão se não encontrar no mapa
    return [
      { id: "default", name: "Padrão", description: "Serviço padrão", price: 0, duration: 0, status: true, imageUrl: "" }
    ];
  };

  useEffect(() => {
    if (isOpen) {
      if (preselectedService && preselectedBarber) {
        // Se temos serviço e barbeiro pré-selecionados, começar no step 1 (Opções do Serviço)
        setCurrentStep(1);
        setSelectedService(preselectedService);
        setSelectBarber(preselectedBarber.id);
        // Encontrar a categoria do serviço
        const serviceCategory = categories.find(cat => cat.id === preselectedService.categoryId);
        setSelectedCategory(serviceCategory || null);
      } else {
        // Fluxo normal começando no step 1
        setCurrentStep(1);
        setSelectedCategory(null);
        setSelectedService(null);
        setSelectedServiceOption(null);
        setSelectBarber("");
      }
      setSelectedDate(undefined);
      setSelectedTime(undefined);
      setAvailableTimes([]);
    }
  }, [isOpen, preselectedService?.id, preselectedBarber?.id, categories.length]);

  // Resetar opção quando o serviço muda
  useEffect(() => {
    setSelectedServiceOption(null);
  }, [selectedService]);

  // Carregar opções quando o serviço é selecionado
  useEffect(() => {
    if (selectedService && !serviceOptions[selectedService.id]) {
      console.log('Carregando opções para serviço:', selectedService.name);
      getServiceOptions(selectedService).then(options => {
        console.log('Opções carregadas:', options);
      }).catch(error => {
        console.error('Erro ao carregar opções:', error);
      });
    }
  }, [selectedService, serviceOptions]);

  useEffect(() => {
    if (!selectBarber || !selectedDate || !barbers) {
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

    const bookingsForBarberAndDate = (bookings || []).filter(
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
    selectedCategory && services
      ? services.filter(service => service.categoryId === selectedCategory.id)
      : [],
    [selectedCategory, services]
  );

  // Filtrar barbeiros que oferecem o serviço selecionado
  const filteredBarbers = useMemo(() => 
    selectedService && barbers
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

  const { createBookingWithSuccess, closeSuccessModal, showSuccessModal, successData } = useBooking();

  const handleCreateBooking = useCallback(async () => {
    if (!selectBarber || !selectedDate || !selectedTime || !selectedService) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

      const hours = Number(selectedTime.split(":")[0]);
      const minutes = Number(selectedTime.split(":")[1]);
      const newData = set(selectedDate, { hours: hours, minutes: minutes });

    // Encontrar dados do barbeiro e serviço
    const barber = barbers?.find(b => b.id === selectBarber);
    const serviceOption = selectedServiceOption;
    
    const successData = {
      serviceName: selectedService.name,
      serviceOption: serviceOption?.name,
      barberName: barber?.name || "Barbeiro",
      date: selectedDate.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      }),
      time: selectedTime,
      price: serviceOption ? Number(serviceOption.price) : getLowestPrice(selectedService)
    };

    const success = await createBookingWithSuccess({
        barberId: selectBarber,
        dateTime: newData,
        serviceId: selectedService.id,
      serviceOptionId: serviceOption?.id,
        status: "pending",
    }, successData);

    if (success) {
      handleClose();
    }
  }, [selectBarber, selectedDate, selectedTime, selectedService, selectedServiceOption, barbers, createBookingWithSuccess]);

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
    setCurrentStep(prev => {
      const next = prev + 1;
      // Se há barbeiro pré-selecionado, limitar a 3 steps
      if (preselectedBarber && next > 3) {
        return 3; // Máximo 3 steps
      }
      return next;
    });
  }, [preselectedBarber]);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => {
      const previous = prev - 1;
      // Se há barbeiro pré-selecionado, limitar a 1 step mínimo
      if (preselectedBarber && previous < 1) {
        return 1; // Mínimo 1 step
      }
      return previous;
    });
  }, [preselectedBarber]);

  const getStepTitle = () => {
    if (preselectedBarber) {
      switch (currentStep) {
        case 1: return "Escolha a Opção";
        case 2: return "Escolha Data e Horário";
        case 3: return "Resumo do Agendamento";
        default: return "Agendar Serviço";
      }
    } else {
    switch (currentStep) {
      case 1: return "Escolha a Categoria";
      case 2: return "Escolha o Serviço";
        case 3: return "Escolha a Opção";
        case 4: return "Escolha o Barbeiro";
        case 5: return "Escolha a Data";
        case 6: return "Escolha o Horário";
        case 7: return "Resumo do Agendamento";
      default: return "Agendar Serviço";
      }
    }
  };

  const getStepIcon = () => {
    if (preselectedBarber) {
      switch (currentStep) {
        case 1: return <Scissors className="h-5 w-5" />;
        case 2: return <CalendarIcon className="h-5 w-5" />;
        case 3: return <CheckCircle className="h-5 w-5" />;
        default: return <CalendarIcon className="h-5 w-5" />;
      }
    } else {
    switch (currentStep) {
      case 1: return <Scissors className="h-5 w-5" />;
      case 2: return <Scissors className="h-5 w-5" />;
        case 3: return <Scissors className="h-5 w-5" />;
        case 4: return <User className="h-5 w-5" />;
        case 5: return <CalendarIcon className="h-5 w-5" />;
        case 6: return <Clock className="h-5 w-5" />;
        case 7: return <CheckCircle className="h-5 w-5" />;
      default: return <CalendarIcon className="h-5 w-5" />;
      }
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
  // Se não há categorias mas há um serviço pré-selecionado, permitir continuar
  if ((!categories || categories.length === 0) && !preselectedService) {
    return (
      <Sheet open={isOpen} onOpenChange={handleClose}>
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="text-foreground">Agendar Serviço</SheetTitle>
          </SheetHeader>
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-foreground-muted">Carregando categorias...</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto p-6">
        <SheetHeader className="pb-0">
          <SheetTitle className="flex items-center gap-2 text-foreground">
            {getStepIcon()}
            {getStepTitle()}
          </SheetTitle>
          <div className="text-sm text-foreground-muted text-center">
            Passo {currentStep} de {preselectedBarber ? 3 : 6}
          </div>
        </SheetHeader>

        <div className="space-y-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-2">
            {(preselectedBarber ? [1, 2, 3] : [1, 2, 3, 4, 5, 6]).map((step) => (
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
                {step < (preselectedBarber ? 3 : 6) && (
                  <div
                    className={`w-8 h-1 mx-1 ${
                      currentStep > step ? "bg-primary" : "bg-gray-600"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Categoria ou Opções do Serviço */}
          {currentStep === 1 && (
            <div className="space-y-4">
              {preselectedBarber ? (
                // Mostrar opções do serviço quando há barbeiro pré-selecionado
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Escolha a Opção</h3>
                    <p className="text-sm text-foreground-muted">Selecione o tipo de {selectedService?.name}</p>
                  </div>
                  <div className={`grid gap-6 md:grid-cols-2 ${selectedServiceOption ? 'pb-24 sm:pb-0' : ''}`}>
                    {selectedService && serviceOptions[selectedService.id]?.map((option) => (
                      <div
                        key={option.id}
                        className={`cursor-pointer rounded-lg border p-4 transition-all hover:border-primary ${
                          selectedServiceOption?.id === option.id
                            ? "border-primary bg-primary/10"
                            : "border-border"
                        }`}
                        onClick={() => setSelectedServiceOption(option)}
                      >
                        <div className="space-y-3">
                          {option.imageUrl && (
                            <img
                              src={option.imageUrl}
                              alt={option.name}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                          )}
                          <div>
                            <h4 className="font-semibold text-foreground">{option.name}</h4>
                            <p className="text-sm text-foreground-muted">{option.description}</p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-lg font-bold text-primary">
                                {new Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL',
                                }).format(option.price)}
                              </span>
                              <span className="text-sm text-foreground-muted">{option.duration}min</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Botão fixo no canto inferior */}
                  {selectedServiceOption && (
                    <div className="fixed bottom-6 left-6 right-6 z-50 sm:relative sm:bottom-auto sm:left-auto sm:right-auto sm:z-auto sm:mt-6">
                      <div className="bg-card/95 border border-border rounded-xl p-4 shadow-xl backdrop-blur-md sm:bg-transparent sm:border-0 sm:shadow-none sm:backdrop-blur-none sm:p-0">
                        <Button 
                          onClick={nextStep}
                          className="w-full sm:w-auto h-12 text-base font-semibold"
                          size="lg"
                        >
                          Continuar
                          <ChevronRight className="h-5 w-5 ml-2" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Mostrar categorias no fluxo normal
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
                      <DynamicIcon 
                        iconUrl={category.IconUrl}
                        className="flex-shrink-0 w-6 h-6 rounded-lg"
                        size={24}
                      />
                      <div>
                            <h4 className="font-semibold text-foreground">{category.name}</h4>
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
            </div>
          )}

          {/* Step 2: Serviço ou Data e Horário */}
          {currentStep === 2 && (
            <div className="space-y-4">
              {preselectedBarber ? (
                // Mostrar seleção de data e horário quando há barbeiro pré-selecionado
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Selecione Data e Horário</h3>
                    <p className="text-sm text-foreground-muted">Escolha o dia e horário para seu agendamento</p>
                  </div>
                  
                  {/* Calendário */}
                  <div className="w-full">
                    <style jsx>{`
                      :global(.calendar-container table) {
                        width: 100% !important;
                        table-layout: fixed !important;
                      }
                      :global(.calendar-container thead tr) {
                        display: flex !important;
                        width: 100% !important;
                      }
                      :global(.calendar-container thead th) {
                        flex: 1 !important;
                        text-align: center !important;
                        min-width: 0 !important;
                      }
                      :global(.calendar-container tbody tr) {
                        display: flex !important;
                        width: 100% !important;
                      }
                      :global(.calendar-container tbody td) {
                        flex: 1 !important;
                        text-align: center !important;
                        min-width: 0 !important;
                      }
                      :global(.calendar-container tbody button) {
                        width: 100% !important;
                        height: 32px !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                      }
                    `}</style>
                    <div className="calendar-container">
                      <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date() || date < new Date(new Date().setHours(0, 0, 0, 0))}
                      className="rounded-lg border border-border bg-card p-2 w-full"
                      locale={ptBR}
                      classNames={{
                        months: "flex flex-col space-y-2 w-full",
                        month: "space-y-2 w-full",
                        caption: "flex justify-between items-center mb-2 px-1 w-full",
                        caption_label: "text-sm font-semibold text-foreground",
                        nav: "flex items-center justify-between w-full",
                        nav_button: "h-6 w-6 bg-transparent p-0 opacity-70 hover:opacity-100 text-foreground hover:bg-accent-hover rounded-md transition-all flex items-center justify-center",
                        nav_button_previous: "order-first",
                        nav_button_next: "order-last",
                        table: "w-full border-collapse table-fixed",
                        head_row: "flex w-full",
                        head_cell: "text-gray-400 rounded-md flex-1 font-normal text-[0.7rem] text-center p-1 min-w-0",
                        row: "flex w-full",
                        cell: "flex-1 h-8 text-center text-xs p-0 relative min-w-0 [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                        day: "w-full h-8 p-0 font-normal aria-selected:opacity-100 text-foreground hover:bg-primary hover:text-primary-foreground rounded-md transition-colors flex items-center justify-center text-xs",
                        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                        day_today: "bg-accent text-accent-foreground",
                        day_outside: "day-outside text-gray-400 opacity-50 aria-selected:bg-accent/50 aria-selected:text-gray-400 aria-selected:opacity-30",
                        day_disabled: "text-gray-400 opacity-50",
                        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                        day_hidden: "invisible",
                      }}
                    />
                    </div>
                  </div>

                  {/* Seleção de Horário */}
                  {selectedDate && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <h4 className="text-md font-semibold text-foreground mb-2">Selecione o Horário</h4>
                        <p className="text-sm text-foreground-muted">
                          Horários disponíveis para {selectedDate.toLocaleDateString("pt-BR", { 
                            weekday: "long", 
                            day: "numeric", 
                            month: "long" 
                          })}
                        </p>
                      </div>
                      
                      {availableTimes.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-2">
                          {availableTimes.map((time) => (
                            <Button
                              key={time}
                              variant={selectedTime === time ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedTime(time)}
                              className={`text-sm h-12 transition-all duration-200 ${
                                selectedTime === time 
                                  ? "bg-primary text-primary-foreground shadow-lg scale-105" 
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
                    </div>
                  )}

                  <div className="flex justify-between gap-4">
                    <Button variant="outline" onClick={prevStep}>
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Voltar
                    </Button>
                    {selectedDate && selectedTime && (
                      <Button onClick={nextStep}>
                        Continuar
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                // Mostrar serviços no fluxo normal
            <div className="space-y-6">
              <div>
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Escolha o Serviço</h3>
                  <p className="text-sm text-foreground-muted">Selecione o tipo de serviço desejado</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredServices.map((service) => (
                    <div
                      key={service.id}
                      className={`cursor-pointer rounded-lg border p-4 transition-all hover:border-primary ${
                        selectedService?.id === service.id ? "border-primary bg-primary/10" : "border-border"
                      }`}
                          onClick={() => {
                            setSelectedService(service);
                            // Carregar opções imediatamente
                            if (!serviceOptions[service.id]) {
                              getServiceOptions(service).catch(err => {
                                console.error('Erro ao carregar opções:', err);
                              });
                            }
                          }}
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
                        <h4 className="mb-2 font-semibold text-foreground">{service.name}</h4>
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
            </div>

              {/* Mostrar opções do serviço após seleção */}
              {selectedService && serviceOptions[selectedService.id] && (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Escolha a Opção</h3>
                    <p className="text-sm text-foreground-muted">Selecione o tipo de {selectedService.name}</p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {serviceOptions[selectedService.id].map((option) => (
                      <div
                        key={option.id}
                        className={`cursor-pointer rounded-lg border p-4 transition-all hover:border-primary ${
                          selectedServiceOption?.id === option.id
                            ? "border-primary bg-primary/10"
                            : "border-border"
                        }`}
                        onClick={() => setSelectedServiceOption(option)}
                      >
                        <div className="space-y-3">
                          {option.imageUrl && (
                            <img
                              src={option.imageUrl}
                              alt={option.name}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                          )}
                          <div>
                            <h4 className="font-semibold text-foreground">{option.name}</h4>
                            <p className="text-sm text-foreground-muted">{option.description}</p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-lg font-bold text-primary">
                                {option.price > 0 && '+'}
                                {new Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL',
                                }).format(option.price)}
                              </span>
                              {option.duration > 0 && (
                                <span className="text-sm text-foreground-muted">+{option.duration}min</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Voltar
                </Button>
                {selectedService && selectedServiceOption && (
                  <Button onClick={nextStep}>
                    Continuar
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Resumo (apenas quando há barbeiro pré-selecionado) */}
          {currentStep === 3 && preselectedBarber && (
            <div className="space-y-4">
              <div className="rounded-lg border border-primary bg-primary/5 p-4">
                <h4 className="mb-3 font-semibold text-foreground">Resumo do Agendamento</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-foreground-muted">Serviço:</span>
                    <span className="text-foreground">{selectedService?.name}</span>
                  </div>
                  {selectedServiceOption && (
                    <div className="flex justify-between gap-4">
                      <span className="text-foreground-muted">Opção:</span>
                      <div className="flex items-center gap-2">
                        {selectedServiceOption.imageUrl && (
                          <img
                            src={selectedServiceOption.imageUrl}
                            alt={selectedServiceOption.name}
                            className="w-6 h-6 object-cover rounded"
                          />
                        )}
                        <span className="text-foreground">{selectedServiceOption.name}</span>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between gap-4">
                    <span className="text-foreground-muted">Barbeiro:</span>
                    <span className="text-foreground">
                      {preselectedBarber.name}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-foreground-muted">Data:</span>
                    <span className="text-foreground">
                      {selectedDate?.toLocaleDateString("pt-BR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-foreground-muted">Horário:</span>
                    <span className="text-foreground">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2 mt-2">
                    <span className="text-foreground-muted">Total:</span>
                    <span className="text-primary font-semibold">
                      {selectedServiceOption 
                        ? Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(selectedServiceOption.price)
                        : selectedService && Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(getLowestPrice(selectedService))
                      }
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between gap-4">
                <Button variant="outline" onClick={prevStep}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Voltar
                </Button>
                <Button
                  onClick={handleCreateBooking}
                >
                  Confirmar Agendamento
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Opções do Serviço (apenas fluxo normal) */}
          {currentStep === 3 && !preselectedBarber && (
            <div className="space-y-4">
              {/* Mostrar opções do serviço no fluxo normal */}
              <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Escolha a Opção</h3>
                    <p className="text-sm text-gray-400">Selecione a opção específica do serviço {selectedService?.name}</p>
                    <p className="text-xs text-red-400 mt-1">* Seleção obrigatória</p>
                    {selectedService && (
                      <p className="text-xs text-blue-400 mt-1">Debug: {serviceOptions[selectedService.id]?.length || 0} opções encontradas</p>
                    )}
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    {selectedService && serviceOptions[selectedService.id]?.map((option) => (
                      <div
                        key={option.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          selectedServiceOption?.id === option.id
                            ? "border-primary bg-primary/5 shadow-lg"
                            : "border-card-border hover:border-primary/50 hover:bg-accent-hover hover:shadow-md"
                        }`}
                        onClick={() => setSelectedServiceOption(option)}
                      >
                        {/* Imagem da opção */}
                        {option.imageUrl && (
                          <div className="mb-3">
                            <img
                              src={option.imageUrl}
                              alt={option.name}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-foreground">{option.name}</h4>
                          <span className="text-lg font-bold text-primary">
                            {Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(option.price)}
                          </span>
                        </div>
                        {option.description && (
                          <p className="text-sm text-gray-400 mb-2">{option.description}</p>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Clock className="h-4 w-4" />
                          <span>{option.duration} minutos</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={prevStep}>
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Voltar
                    </Button>
                    <Button 
                      onClick={nextStep}
                      disabled={!selectedServiceOption}
                      className={!selectedServiceOption ? "opacity-50 cursor-not-allowed" : ""}
                    >
                      Continuar
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
            </div>
          )}

          {/* Step 4: Barbeiro */}
          {currentStep === 4 && (
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
                        <h4 className="font-semibold text-foreground">{barber.name}</h4>
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

          {/* Step 5: Data */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">Selecione a Data</h3>
                <p className="text-sm text-gray-400">Escolha uma data disponível para seu agendamento</p>
              </div>
              
              <div className="w-full">
                <style jsx>{`
                  :global(.calendar-container table) {
                    width: 100% !important;
                    table-layout: fixed !important;
                  }
                  :global(.calendar-container thead tr) {
                    display: flex !important;
                    width: 100% !important;
                  }
                  :global(.calendar-container thead th) {
                    flex: 1 !important;
                    text-align: center !important;
                    min-width: 0 !important;
                  }
                  :global(.calendar-container tbody tr) {
                    display: flex !important;
                    width: 100% !important;
                  }
                  :global(.calendar-container tbody td) {
                    flex: 1 !important;
                    text-align: center !important;
                    min-width: 0 !important;
                  }
                  :global(.calendar-container tbody button) {
                    width: 100% !important;
                    height: 32px !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                  }
                `}</style>
                <div className="calendar-container">
                  <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => date < new Date()}
                  className="rounded-lg border border-border bg-card p-2 w-full"
                  locale={ptBR}
                  classNames={{
                    months: "flex flex-col space-y-2 w-full",
                    month: "space-y-2 w-full",
                    caption: "flex justify-between items-center mb-2 px-1 w-full",
                    caption_label: "text-sm font-semibold text-foreground",
                    nav: "flex items-center justify-between w-full",
                    nav_button: "h-6 w-6 bg-transparent p-0 opacity-70 hover:opacity-100 text-foreground hover:bg-accent-hover rounded-md transition-all flex items-center justify-center",
                    nav_button_previous: "order-first",
                    nav_button_next: "order-last",
                    table: "w-full border-collapse table-fixed",
                    head_row: "flex w-full",
                    head_cell: "text-gray-400 rounded-md flex-1 font-normal text-[0.7rem] text-center p-1 min-w-0",
                    row: "flex w-full",
                    cell: "flex-1 h-8 text-center text-xs p-0 relative min-w-0 [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                    day: "w-full h-8 p-0 font-normal aria-selected:opacity-100 text-foreground hover:bg-primary hover:text-primary-foreground rounded-md transition-colors flex items-center justify-center text-xs",
                    day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    day_today: "bg-accent text-accent-foreground",
                    day_outside: "day-outside text-gray-400 opacity-50 aria-selected:bg-accent/50 aria-selected:text-gray-400 aria-selected:opacity-30",
                    day_disabled: "text-gray-400 opacity-50",
                    day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                    day_hidden: "invisible",
                  }}
                />
                </div>
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

          {/* Step 6: Horário */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">Selecione o Horário</h3>
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
                          ? "bg-primary text-primary-foreground shadow-lg scale-105" 
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

          {/* Step 7: Resumo */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <div className="rounded-lg border border-primary bg-primary/5 p-4">
                <h4 className="mb-3 font-semibold text-foreground">Resumo do Agendamento</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-400">Categoria:</span>
                    <span className="text-foreground">{selectedCategory?.name}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-400">Serviço:</span>
                    <span className="text-foreground">{selectedService?.name}</span>
                  </div>
                  {selectedServiceOption && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Opção:</span>
                      <div className="flex items-center gap-2">
                        {selectedServiceOption.imageUrl && (
                          <img
                            src={selectedServiceOption.imageUrl}
                            alt={selectedServiceOption.name}
                            className="w-8 h-8 object-cover rounded"
                          />
                        )}
                        <span className="text-foreground">{selectedServiceOption.name}</span>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-400">Barbeiro:</span>
                    <span className="text-foreground">
                      {barbers?.find((b) => b.id === selectBarber)?.name || "Barbeiro não encontrado"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-400">Data:</span>
                    <span className="text-foreground">
                      {selectedDate?.toLocaleDateString("pt-BR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-400">Horário:</span>
                    <span className="text-foreground">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2 mt-2">
                    <span className="text-gray-400">Total:</span>
                    <span className="text-primary font-semibold">
                      {selectedServiceOption 
                        ? Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                          }).format(selectedServiceOption.price)
                        : selectedService && Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(getLowestPrice(selectedService))
                      }
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
                >
                  Confirmar Agendamento
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
      
      {/* Modal de Sucesso */}
      <BookingSuccessModal
        isOpen={showSuccessModal}
        onClose={closeSuccessModal}
        bookingData={successData || undefined}
      />
    </Sheet>
  );
}