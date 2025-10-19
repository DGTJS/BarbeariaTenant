"use client";

import { useState } from "react";
import { BarberShopService } from "@/generated/prisma";
import { AlarmClock, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import BookingSidebar from "./booking-sidebar";

interface PriceAdjustment {
  priceAdjustment: number;
}

interface ServiceBarberCardProps {
  service: BarberShopService & {
    priceAdjustments?: PriceAdjustment[];
  };
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
    barberShop?: {
      name: string;
      address?: string;
    };
  };
  user: { id: string; name?: string | null } | null;
  bookings: any[];
}

const ServiceBarberCard = ({ service, barber, user, bookings }: ServiceBarberCardProps) => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleBookingClick = () => {
    setIsBookingModalOpen(true);
  };

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 bg-slate-700/30 border-slate-600 hover:border-primary/50 hover:bg-slate-700/50">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            {/* IMAGE */}
            <div className="relative h-48 sm:h-32 sm:w-32 md:h-36 md:w-36 flex-shrink-0">
              <Image
                src={service.imageUrl}
                alt={service.name}
                fill
                className="object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
              />
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="bg-black/50 text-white border-0">
                  {service.category?.name}
                </Badge>
              </div>
            </div>
            
            {/* CONTEUDO */}
            <div className="flex-1 p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-primary transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-300 line-clamp-2">
                    {service.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <AlarmClock size={14} />
                  <span>{service.duration} min</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-primary">
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
                    <Badge variant="outline" className="text-xs">
                      Preço personalizado
                    </Badge>
                  )}
                </div>
                
                <Button 
                  onClick={handleBookingClick}
                  className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-2 transition-all duration-200 hover:scale-105"
                >
                  <Calendar size={16} className="mr-2" />
                  Agendar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sidebar de Agendamento */}
      <BookingSidebar
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        service={service}
        barber={barber}
        bookings={bookings}
      />
    </>
  );
};

export default ServiceBarberCard;
