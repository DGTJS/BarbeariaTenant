import Header from "@/_components/header";
import HomeContent from "@/_components/home-content";
import { getHomeData, sanitizeDecimal } from "@/_lib/getHomeData";
import { getUserData } from "@/_lib/getUserData";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Home() {
  // Obter sessão do usuário
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || null;
  
  // Busca todos os dados em uma única operação otimizada
  const { services, barbers, categories, barberShops, bookings } = await getHomeData(userId || "");
  const user = await getUserData();

  return (
    <>
      <Header categories={sanitizeDecimal(categories)} />
      <HomeContent
        user={user}
        categories={sanitizeDecimal(categories)}
        barbers={sanitizeDecimal(barbers)}
        services={sanitizeDecimal(services)}
        barberShops={sanitizeDecimal(barberShops)}
        bookings={sanitizeDecimal(bookings)}
      />
    </>
  );
}
