"use server";
import { db } from "@/_lib/prisma";
import Image from "next/image";
import { Button } from "@/_components/ui/button";
import { ChevronLeftIcon, MenuIcon, StarIcon } from "lucide-react";
import Link from "next/link";
import Category from "@/_components/category";

interface BarbersProps {
  params: {
    id: string;
  };
}

export default async function BarberPage({ params }: BarbersProps) {
  const Barbers = await db.barber.findUnique({
    where: { id: params.id },
    include: {
      categories: true, // nome da relação no schema (corrija se for diferente!)
    },
  });

  const reviews = await db.booking.aggregate({
    where: {
      barberId: params.id,
      rating: {
        not: null,
      },
    },
    _avg: {
      rating: true,
    },
  });

  const avarange = reviews._avg.rating
    ? Math.min(reviews._avg.rating, 5)
    : null;

  return (
    <div>
      <div className="relative h-[300px] w-full">
        <Image
          src={Barbers!.photo!}
          alt="Logo"
          fill
          className="object-cover object-top"
        />
      </div>

      <Button
        variant="outline"
        className="absolute top-4 left-4 cursor-pointer"
        asChild
      >
        <Link href="/">
          <ChevronLeftIcon className="text-white" />
        </Link>
      </Button>

      <Button variant="outline" className="absolute top-4 right-4">
        <MenuIcon />
      </Button>

      <div className="flex flex-row justify-between p-5">
        <div>
          <h1 className="text-2xl font-semibold">{Barbers!.name}</h1>
          <p className="text-gray-500">Barbeiro</p>
        </div>

        <Button variant="outline" className="mt-2">
          <StarIcon className="fill-primary text-primary h-4 w-4" />
          {avarange !== null
            ? reviews._avg.rating?.toFixed(2)
            : "Sem avaliação"}
        </Button>
      </div>
      <div className="border-t border-solid border-gray-800 p-5">
        <h3 className="text-sm font-semibold text-gray-200">Categoria</h3>
        <div className="mt-5 flex gap-3 overflow-auto pb-5 [&::-webkit-scrollbar]:hidden">
          {Barbers!.categories!.map((category) => (
            <Category
              key={category.id}
              name={category.name}
              IconUrl={category.IconUrl}
            />
          ))}
        </div>
        <h3 className="mt-2 text-sm font-semibold text-gray-200">Serviços</h3>
      </div>
    </div>
  );
}
