import { db } from "@/_lib/prisma";
import Image from "next/image";

interface BarbersProps {
  params: {
    id: string;
  };
}

const BarberPage = async ({ params }: BarbersProps) => {
  const Barbers = await db.barber.findUnique({ where: { id: params.id } });
  return (
    <>
      <h1>{Barbers!.name}</h1>
      <Image src={Barbers!.photo!} alt="Logo" width={120} height={120} />
    </>
  );
};

export default BarberPage;
