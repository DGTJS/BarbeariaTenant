import { db } from "@/_lib/prisma";
import Image from "next/image";
import { Button } from "@/_components/ui/button";
import { ChevronLeftIcon, MenuIcon } from "lucide-react";
import Link from "next/link";

interface BarbersProps {
  params: {
    id: string;
  };
}

const BarberPage = async ({ params }: BarbersProps) => {
  const Barbers = await db.barber.findUnique({ where: { id: params.id } });
  return (
    <>
    <div>
      <div className="relative h-[300] w-full">
      <Image src={Barbers!.photo!} alt="Logo" fill className="object-cover object-top"/>

      </div>

      <Button  variant="outline" className="absolute top-4 left-4 cursor-pointer">
        <Link href="/">
        
        <ChevronLeftIcon className="text-white" />
        </Link>

      </Button>

      <Button variant="outline" className="absolute top-4 right-4">
        <MenuIcon/>
      </Button>

      <div className="p-2">

      <h1 className="text-2xl font-semibold">{Barbers!.name}</h1>
      <p className="text-gray-500">{Barbers!.phone}</p>
      </div>
    </div>

    </>
  );
};

export default BarberPage;
