"use client";

import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { StarIcon } from "lucide-react";
import type {
  BarberShopService as PrismaBarberShopService,
  ServicePriceAdjustment,
  barber as Barber,
} from "@/generated/prisma/client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Calendar } from "./ui/calendar";
import { ptBR } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface BarberShopServiceWithAdjustments
  extends Omit<PrismaBarberShopService, "price" | "priceAdjustments"> {
  price: number;
  priceAdjustments?: (Omit<ServicePriceAdjustment, "priceAdjustment"> & {
    priceAdjustment: number;
  })[];
}

interface BarberServiceProps {
  BarberShopService: BarberShopServiceWithAdjustments;
  nameButton: string;
  barbers: Barber[];
}

const CardServices = ({
  BarberShopService,
  nameButton,
  barbers,
}: BarberServiceProps) => {
  if (!BarberShopService) return null;

  console.log("Barbeios: ", barbers);

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
    <Card className="mt-5 flex max-w-[160px] min-w-[175px] rounded-2xl p-1">
      <CardContent className="p-0 px-1 pt-1">
        <div className="relative h-[159px] w-full">
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
        <div className="px-1 py-3">
          <h3 className="truncate text-lg font-semibold">
            {BarberShopService.name}
          </h3>
          <p className="truncate text-sm text-gray-500">
            A partir de R$ {getLowestPrice().toFixed(2)}
          </p>
          <p className="truncate text-sm text-gray-500">
            Duração: {BarberShopService.duration} Min
          </p>
          <Sheet>
            <SheetTrigger asChild className="">
              <Button
                variant="outline"
                className="mt-3 w-full cursor-pointer border-none bg-gray-700 hover:bg-gray-600"
              >
                {nameButton}
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader className="border-b border-gray-700 p-3 pb-7 font-semibold">
                <SheetTitle>Fazer Reserva</SheetTitle>
              </SheetHeader>
              <div className="px-5">
                <Select>
                  <h3 className="py-2 text-sm font-semibold">
                    Escolha seu Barbeiro
                  </h3>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um barbeiro" />
                  </SelectTrigger>

                  <SelectContent>
                    {barbers.map((barber) => (
                      <SelectItem key={barber.id} value={barber.id}>
                        <Image
                          src={barber.photo}
                          alt="Logo"
                          width={15}
                          height={15}
                          className="rounded-full object-cover"
                        />
                        {barber.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Calendar mode="single" locale={ptBR} className="w-full" />
            </SheetContent>
          </Sheet>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardServices;
