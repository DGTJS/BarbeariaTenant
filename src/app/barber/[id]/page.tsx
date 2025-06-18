import { db } from "@/_lib/prisma";
import Image from "next/image";
import { Button } from "@/_components/ui/button";
import { ChevronLeftIcon, MenuIcon, StarIcon } from "lucide-react";
import Link from "next/link";

interface BarbersProps {
  params: {
    id: string;
  };
}

const BarberPage = async ({ params }: BarbersProps) => {
  const Barbers = await db.barber.findUnique({ where: { id: params.id } });
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

  return (
    <div>
      <div className="relative h-[300] w-full">
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
          {reviews._avg.rating?.toFixed(2) || "Sem avaliação"}
        </Button>
      </div>
    </div>
  );
};

export default BarberPage;
