// import Image from "next/image";
import Header from "@/_components/header";
import { Input } from "@/_components/ui/input";
import { SearchIcon } from "lucide-react";
import { Button } from "@/_components/ui/button";
import Image from "next/image";
import Appointments from "@/_components/appointments";
import { db } from "@/_lib/prisma";
import BarberShopItem from "@/_components/barbershopitem";

export default async function Home() {
  const barberShop = await db.barberShop.findMany({});

  return (
    <>
      <Header />
      <div className="p-5 text-white">
        <h2 className="text-xl">
          Olá, <span className="text-xl font-bold text-white">Diego!</span>
        </h2>
        <p>Domingo, 14 de Junho.</p>
        <div className="mt-5 flex items-center gap-1 space-x-1 text-gray-800">
          <Input
            placeholder="O que você quer fazer hoje?"
            className="border-gray-700 py-5 placeholder-gray-400"
          />
          <Button variant="outline" className="bg-purple-500 py-5">
            <SearchIcon className="h-5 w-5 text-white" />
          </Button>
        </div>

        {/* BANNER */}
        <div className="relative mt-5 h-[190px] w-full">
          <Image
            src="/banner-01.png"
            alt="Banner"
            fill
            className="rounded-lg object-cover"
          />
        </div>

        {/* AGENDAMENTOS */}
        <h2 className="font mt-5 text-sm font-semibold text-gray-400 uppercase">
          Agendamentos
        </h2>
        <Appointments />
        <h2 className="font mt-5 text-sm font-semibold text-gray-400 uppercase">
          Recomendados
        </h2>
        <div className="flex gap-3 overflow-auto [&::-webkit-scrollbar]:hidden">
          {barberShop.map((barberShop) => (
            <BarberShopItem key={barberShop.id} barberShop={barberShop} />
          ))}
        </div>
        <h2 className="font mt-5 text-sm font-semibold text-gray-400 uppercase">
          Populares
        </h2>
        <div className="flex gap-3 overflow-auto [&::-webkit-scrollbar]:hidden">
          {barberShop.map((barberShop) => (
            <BarberShopItem key={barberShop.id} barberShop={barberShop} />
          ))}
        </div>
      </div>
    </>
  );
}
