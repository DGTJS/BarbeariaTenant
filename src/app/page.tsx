// import Image from "next/image";
import Header from "@/_components/header";
import Image from "next/image";
import Appointments from "@/_components/appointments";
import { db } from "@/_lib/prisma";
import CardBarber from "@/_components/cardBarberShop";
import Barbers from "@/_components/CardBarbers";
import Category from "@/_components/category";
import CardServices from "@/_components/cardServices";
import { getCategories } from "@/_lib/getCategories";
import { getBarberShops } from "@/_lib/getBarberShop";
import { getUserData } from "@/_lib/getUserData";
import Search from "@/_components/search";

export default async function Home() {
  const services = await db.barberShopService.findMany({
    where: { status: true },
    include: {
      priceAdjustments: true, // traga todos os ajustes pra depois filtrar no front
      category: true,
    },
  });

  // Função simples para converter Decimal em number recursivamente:
  function sanitizeDecimal(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(sanitizeDecimal);
    }
    // Verifica se é um objeto Decimal (tem método toNumber)
    if (obj && typeof obj === "object" && typeof obj.toNumber === "function") {
      return obj.toNumber();
    }
    // Preserva objetos Date
    if (obj instanceof Date) {
      return obj;
    }
    if (obj !== null && typeof obj === "object") {
      const result: any = {};
      for (const key in obj) {
        result[key] = sanitizeDecimal(obj[key]);
      }
      return result;
    }
    return obj;
  }
  const PopularBarbers = await getBarberShops();
  const barbers = await db.barber.findMany({
    include: {
      categories: true, // traga todas as categorias para o filtro
      workingHours: true, // traga os horários de trabalho
    },
  });
  const categories = await getCategories();
  const user = await getUserData();
  const bookings = await db.booking.findMany({
    include: {
      barber: {
        include: {
          categories: true, // traga todas as categorias para o filtro
          workingHours: true, // traga os horários de trabalho
        },
      },
      service: {
        select: {
          id: true,
          duration: true,
          name: true,
        },
      }, // traga o serviço agendado com duration
    },
  });

  return (
    <>
      <Header />
      <div className="p-5 text-white">
        {user?.name && (
          <h2 className="text-xl">
            Olá,{" "}
            <span className="text-xl font-bold text-white">{user?.name}</span>
          </h2>
        )}
        {!user?.name && (
          <h2 className="text-xl font-semibold">
            Entre ou Cadastre-se e faça seus agendamentos!
          </h2>
        )}
        <p>
          {new Date().toLocaleDateString("pt-BR", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
        <div className="mt-5">
          <Search />
        </div>
        {/* CATEGORY */}
        <div className="mt-5 flex gap-3 overflow-auto [&::-webkit-scrollbar]:hidden">
          {categories.map((category) => (
            <Category
              key={category.id}
              name={category.name}
              IconUrl={category.IconUrl}
              id={category.id}
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
            <Barbers
              key={barber.id}
              barber={sanitizeDecimal(barber)}
              nameButton="Agendar"
            />
          ))}
        </div>

        {/* RECOMENDADOS */}
        <h2 className="font mt-5 text-sm font-semibold text-gray-400 uppercase">
          Recomendados
        </h2>
        <div className="flex gap-3 overflow-auto [&::-webkit-scrollbar]:hidden">
          {services.map((service) => {
            const barbersOfTheSameCategory = barbers.filter((barber) =>
              barber.categories.some((cat) => cat.id === service.categoryId),
            );

            // Usa a função sanitizeDecimal para converter todos os campos Decimal
            const sanitizedService = sanitizeDecimal(service);
            const sanitizedBookings = bookings.map((booking) => ({
              dateTime: booking.dateTime,
              service: {
                duration: Number(booking.service.duration),
              },
              barberId: booking.barberId,
            }));
            const sanitizedBarbers = sanitizeDecimal(
              barbersOfTheSameCategory.map((barber) => ({
                ...barber,
                workingHours: (barber.workingHours ?? []).map((wh) => ({
                  ...wh,
                  pauses: [],
                })),
              })),
            );

            return (
              <CardServices
                key={service.id}
                BarberShopService={sanitizedService}
                nameButton="Agendar"
                bookings={sanitizedBookings}
                barbers={sanitizedBarbers}
              />
            );
          })}
        </div>

        {/* POPULARES */}
        <h2 className="font mt-5 text-sm font-semibold text-gray-400 uppercase">
          Populares
        </h2>
        <div className="flex gap-3 overflow-auto [&::-webkit-scrollbar]:hidden">
          {PopularBarbers.map((barberShop) => (
            <CardBarber
              key={barberShop.id}
              barberShop={sanitizeDecimal(barberShop)}
              nameButton="Reservar"
            />
          ))}
        </div>
      </div>
    </>
  );
}
