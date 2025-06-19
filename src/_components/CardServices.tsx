import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { StarIcon } from "lucide-react";
import type {
  BarberShopService as PrismaBarberShopService,
  ServicePriceAdjustment,
} from "@/generated/prisma/client";

interface BarberShopServiceWithAdjustments extends PrismaBarberShopService {
  priceAdjustments?: ServicePriceAdjustment[];
}

interface BarberServiceProps {
  BarberShopService: BarberShopServiceWithAdjustments;
  nameButton: string;
}

const CardServices = ({
  BarberShopService,
  nameButton,
}: BarberServiceProps) => {
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

  return (
    <Card className="columns mt-5 flex min-w-[167px] rounded-2xl p-1">
      <CardContent className="p-1 pb-2">
        <div className="relative h-[150px] w-full">
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
        <div className="py-3">
          <h3 className="truncate text-lg font-semibold">
            {BarberShopService.name}
          </h3>
          <p className="truncate text-sm text-gray-500">
            A partir de R$ {getLowestPrice().toFixed(2)}
          </p>
          <p className="truncate text-sm text-gray-500">
            Duração: {BarberShopService.duration} Minutos
          </p>
        </div>
        <Button
          variant="outline"
          className="mt-3 w-full border-none bg-gray-700"
        >
          {nameButton}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CardServices;
