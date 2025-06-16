import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { BarberShop } from "@prisma/client";
import { Button } from "./ui/button";

interface BarberShopItemProps {
  barberShop: BarberShop;
}

const BarberShopItem = ({ barberShop }: BarberShopItemProps) => {
  return (
    <Card className="columns mt-5 flex min-w-[159px] justify-between border-gray-700 bg-gray-800 p-1">
      <CardContent className="p-0">
        <div className="relative h-[150px] w-full">
          <Image
            src={barberShop.imageUrl}
            alt="Logo"
            fill
            className="objet-cover"
          />
        </div>
        <div className="px-2 py-3">
          <h3 className="text-lg font-semibold">{barberShop.name}</h3>
          <p className="text-sm text-gray-500">{barberShop.address}</p>
        </div>
        <Button variant="outline" className="border-none bg-gray-700">
          Reservar
        </Button>
      </CardContent>
    </Card>
  );
};

export default BarberShopItem;
