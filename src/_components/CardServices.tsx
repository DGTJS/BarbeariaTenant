import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { BarberShopService } from "@/generated/prisma/client";
import { Badge } from "./ui/badge";
import { StarIcon } from "lucide-react";

interface BarberServiceProps {
  BarberShopService: BarberShopService;
  nameButton: string;
}

const CardServices = ({
  BarberShopService,
  nameButton,
}: BarberServiceProps) => {
  if (!BarberShopService) return null; // Evita o erro de undefined

  return (
    <Card className="columns mt-5 flex min-w-[167px] rounded-2xl p-1">
      <CardContent className="p-1 pb-2">
        <div className="relative h-[150px] w-full">
          <Image
            src={BarberShopService.imageUrl}
            alt="Logo"
            fill
            className="objet-cover rounded-2xl"
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
            R$ {BarberShopService.price.toString()}
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
