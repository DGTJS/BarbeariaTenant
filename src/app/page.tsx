// import Image from "next/image";
import Header from "@/_components/header";
import { Input } from "@/_components/ui/input";
import { SearchIcon } from "lucide-react";
import { Button } from "@/_components/ui/button";
import Image from "next/image";
import Appointments from "@/_components/appointments";
import { db } from "@/_lib/prisma";
import CardBarber from "@/_components/cardBarber";
import Barbers from "@/_components/barbers";
import Category from "@/_components/category";
import FooterBar from "@/_components/footerbar";
import CardServices from "@/_components/cardServices";
import { getCategories } from "@/_lib/getCategories";

export default async function Home() {
  const services = await db.barberShopService.findMany({
    where: { status: true },
    include: {
      priceAdjustments: true, // traga todos os ajustes pra depois filtrar no front
      category: true,
    },
  });
  const PopularBarbers = await db.barberShop.findMany({});
  const barbers = await db.barber.findMany({});
  const categories = await getCategories();

  return (
    <>
      <Header />
      <div className="p-5 text-white">
        <h2 className="text-xl">
          Olá, <span className="text-xl font-bold text-white">Diego!</span>
        </h2>
        <p>
          {new Date().toLocaleDateString("pt-BR", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
        <div className="mt-5 flex items-center gap-1 space-x-1 text-gray-800">
          <Input
            placeholder="O que você quer fazer hoje?"
            className="border-gray-700 py-5 placeholder-gray-400"
          />
          <Button variant="secondary" className="bg-purple-500 py-5">
            <SearchIcon className="h-5 w-5 text-white" />
          </Button>
        </div>
        {/* CATEGORY */}
        <div className="mt-5 flex gap-3 overflow-auto [&::-webkit-scrollbar]:hidden">
          {categories.map((category) => (
            <Category
              key={category.id}
              name={category.name}
              IconUrl={category.IconUrl}
            />
          ))}
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
          Barbeiros
        </h2>
        <div className="flex gap-3 overflow-auto [&::-webkit-scrollbar]:hidden">
          {barbers.map((barber) => (
            <Barbers key={barber.id} barber={barber} nameButton="Agendar" />
          ))}
        </div>
        <h2 className="font mt-5 text-sm font-semibold text-gray-400 uppercase">
          Recomendados
        </h2>
        <div className="flex gap-3 overflow-auto [&::-webkit-scrollbar]:hidden">
          {services.map((services) => (
            <CardServices
              key={services.id}
              BarberShopService={services}
              nameButton="Agendar"
            />
          ))}
        </div>
        <h2 className="font mt-5 text-sm font-semibold text-gray-400 uppercase">
          Populares
        </h2>
        <div className="flex gap-3 overflow-auto [&::-webkit-scrollbar]:hidden">
          {PopularBarbers.map((barberShop) => (
            <CardBarber
              key={barberShop.id}
              barberShop={barberShop}
              nameButton="Reservar"
            />
          ))}
        </div>
      </div>
      <FooterBar />
    </>
  );
}
