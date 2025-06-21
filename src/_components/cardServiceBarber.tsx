import { BarberShopService } from "@/generated/prisma";
import { AlarmClock, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import { Card, CardContent } from "./ui/card";

interface PriceAdjustment {
  priceAdjustment: number;
}

interface ServiceBarberCardProps {
  service: BarberShopService & {
    priceAdjustments?: PriceAdjustment[];
  };
}

const ServiceBarberCard = ({ service }: ServiceBarberCardProps) => {
  return (
    <Card className="my-3 min-w-[calc(100%-10px)] border-indigo-950 p-0">
      <CardContent className="flex items-center gap-3 p-3">
        {/* IMAGE */}
        <div className="relative min-h-[100px] min-w-[100px] sm:h-[130px] sm:w-[130px] md:h-[140px] md:w-[140px]">
          <Image
            src={service.imageUrl}
            alt="Logo"
            fill
            className="objet-cover rounded-lg"
          />
        </div>
        {/* CONTEUDO */}
        <div className="w-full space-y-2">
          <div className="flex justify-between">
            <h3 className="max-w-[100px] truncate text-base font-semibold sm:max-w-[140px] sm:text-lg">
              {service.name}
            </h3>
            <h3 className="flex items-center gap-1 text-center text-xs text-gray-500">
              <AlarmClock size={12} /> {service.duration} : Min
            </h3>
          </div>
          <p className="max-w-[calc(100%- 5px)] tuppercase text-xs text-gray-500 sm:text-sm">
            {service.description}
          </p>
          <div className="mt-3 flex justify-between gap-1">
            <span className="flex items-center text-sm font-semibold text-indigo-500 sm:text-base">
              {(() => {
                const base = Number(service.price) || 0;
                const adjustment =
                  service.priceAdjustments?.[0]?.priceAdjustment || 0;
                const final = base + Number(adjustment);
                return `${Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(final)} `;
              })()}
            </span>
            <Button className="h-7 bg-indigo-950 px-2 text-xs text-white sm:h-9 sm:px-3 sm:text-sm">
              <Calendar size={15} /> Agendar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceBarberCard;
