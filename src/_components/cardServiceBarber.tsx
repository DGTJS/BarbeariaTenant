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
    <Card className="my-3 p-0">
      <CardContent className="flex items-center gap-3 p-3">
        {/* IMAGE */}
        <div className="relative max-h-[110px] min-h-[110px] max-w-[110px] min-w-[110px]">
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
            <h3 className="text-lg font-semibold">{service.name}</h3>
            <h3 className="flex items-center gap-1 text-center text-sm text-gray-500">
              <AlarmClock size={12} /> {service.duration}: Minutos
            </h3>
          </div>
          <p className="text-sm text-gray-500">{service.description}</p>
          <div className="mt-3 flex justify-between">
            <span className="font-semibold text-purple-600">
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
            <Button variant="outline">
              {" "}
              <Calendar size={15} /> Agendar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceBarberCard;
