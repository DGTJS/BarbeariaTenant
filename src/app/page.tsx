// import Image from "next/image";
import Header from "@/_components/header";
import { Input } from "@/_components/ui/input";
import { SearchIcon } from "lucide-react";
import { Button } from "@/_components/ui/button";
import Image from "next/image";
import Appointments from "@/_components/appointments";

export default function Home() {
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
            className="border-gray-700 bg-gray-800 py-5 placeholder-gray-400"
          />
          <Button variant="outline" className="bg-purple-500 py-5">
            <SearchIcon className="h-5 w-5 text-white" />
          </Button>
        </div>

        {/* BANNER */}
        <div className="relative mt-5 h-[170px] w-full">
          <Image
            src="/banner-01.png"
            alt="Banner"
            fill
            className="rounded-lg object-cover"
          />
        </div>

        {/* AGENDAMENTOS */}
        <h2 className="font mt-5 font-semibold text-gray-400">AGENDAMENTOS</h2>
        <Appointments />
      </div>
    </>
  );
}
