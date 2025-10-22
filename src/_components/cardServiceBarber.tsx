"use client";

import { useState } from "react";
import { BarberShopService } from "@/generated/prisma";
import { AlarmClock, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import BookingModal from "./booking-modal";

interface PriceAdjustment {
  priceAdjustment: number;
}

interface ServiceBarberCardProps {
  service: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    duration: number;
    imageUrl: string;
    categoryId: string | null;
    priceAdjustments?: PriceAdjustment[];
    category?: {
      id: string;
      name: string;
    } | null;
  };
  barber: {
    id: string;
    name: string;
    photo: string;
    barberShopId?: string;
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
    barberShop?: {
      name: string;
      address?: string;
    };
  };
  user: { id: string; name?: string | null } | null;
  bookings: any[];
  allServices?: any[];
  allBarbers?: any[];
  categories?: any[];
}

const ServiceBarberCard = ({ service, barber, user, bookings, allServices, allBarbers, categories }: ServiceBarberCardProps) => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleBookingClick = () => {
    setIsBookingModalOpen(true);
  };

  return (
    <>
      <Card className="p-0 group hover:shadow-lg transition-all duration-300 bg-card-secondary/30 border border-card-border/30 hover:border-primary/50 hover:bg-card-secondary/50">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            {/* IMAGE */}
            <div className="relative w-full sm:w-32 flex-shrink-0">
              <Image
                src={service.imageUrl}
                alt={service.name}
                width={128}
                height={128}
                className="object-cover rounded-t-2xl sm:rounded-l-2xl sm:rounded-t-none w-full h-32 sm:h-auto"
              />
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="bg-card/50 text-slate-900 dark:text-white border-0 text-xs">
                  {service.category?.name}
                </Badge>
              </div>
            </div>
            
            {/* CONTEUDO */}
            <div className="flex-1 p-3 sm:px-3 sm:py-1 space-y-3">
              {/* Header com título e duração */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold mb-1 text-card-foreground truncate">
                    {service.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-foreground-muted line-clamp-2">
                    {service.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs sm:text-sm text-foreground-muted flex-shrink-0">
                  <AlarmClock size={12} className="sm:w-3.5 sm:h-3.5" />
                  <span>{service.duration} min</span>
                </div>
              </div>
              
              {/* Preço e botão */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-xl sm:text-2xl font-bold text-primary">
                    {(() => {
                      const base = Number(service.price) || 0;
                      const adjustment =
                        service.priceAdjustments?.[0]?.priceAdjustment || 0;
                      const final = base + Number(adjustment);
                      return Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(final);
                    })()}
                  </span>
                  {service.priceAdjustments?.[0]?.priceAdjustment && (
                    <Badge variant="outline" className="text-xs w-fit">
                      Preço personalizado
                    </Badge>
                  )}
                </div>
                
                <Button 
                  onClick={handleBookingClick}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 sm:px-6 py-2 transition-all duration-200 hover:scale-105 w-full sm:w-auto text-sm sm:text-base"
                >
                  <Calendar size={14} className="mr-2 sm:w-4 sm:h-4" />
                  Agendar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Agendamento com Opções */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        services={allServices || []}
        barbers={allBarbers || []}
        bookings={bookings}
        categories={categories || []}
        preselectedService={{
          ...service,
          barberShopId: barber.barberShopId || "",
          // Ensure description is always string or undefined, never null
          description: service.description ?? undefined,
        }}
        preselectedBarber={{
          id: barber.id,
          name: barber.name,
          photo: barber.photo,
          phone: null,
          barberShopId: "",
          userId: "",
          createdAt: new Date(),
          updatedAt: new Date(),
          workingHours: barber.workingHours || [],
        }}
      />
    </>
  );
};

export default ServiceBarberCard;
