import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { BarberShop } from "@prisma/client";
import { Button } from "./ui/button";

interface BarberShopItemProps {
  barberShop: BarberShop;
}

const BarberShopItem = ({ barberShop }: BarberShopItemProps) => {
  return (
    <Card className="columns mt-5 flex min-w-[167px] rounded-2xl border-gray-700 p-1">
      <CardContent className="p-1">
        <div className="relative h-[150px] w-full">
          <Image
            src={barberShop.imageUrl}
            alt="Logo"
            fill
            className="objet-cover rounded-2xl"
          />
        </div>
        <div className="py-3">
          <h3 className="truncate text-lg font-semibold">{barberShop.name}</h3>
          <p className="truncate text-sm text-gray-500">{barberShop.address}</p>
        </div>
        <Button
          variant="outline"
          className="mt-3 w-full border-none bg-gray-700"
        >
          Reservar
        </Button>
      </CardContent>
    </Card>
  );
};

export default BarberShopItem;
