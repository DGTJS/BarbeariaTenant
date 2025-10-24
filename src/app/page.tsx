import HeaderWrapper from "@/_components/header-wrapper";
import HomeContent from "@/_components/home-content";
import { getHomeData, sanitizeDecimal } from "@/_lib/getHomeData";
import { getUserData } from "@/_lib/getUserData";
import { getBanners } from "@/_lib/getBanners";
import { getBarberShopSystemStatus } from "@/_lib/getBarberShopSystemStatus";
import { getServerSession } from "next-auth";
import { authOptions } from "@/_providers/auth-options";

export default async function Home() {
  // Obter sessão do usuário
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || null;
  
  // Busca todos os dados em uma única operação otimizada
  const { services, barbers, categories, bookings } = await getHomeData(userId || "");
  const user = await getUserData();
  const banners = await getBanners();

  return (
    <>
      <HeaderWrapper 
        categories={sanitizeDecimal(categories)} 
        user={user}
        bookings={sanitizeDecimal(bookings)}
        services={sanitizeDecimal(services)}
        barbers={sanitizeDecimal(barbers)}
      />
      <HomeContent
        user={user}
        categories={sanitizeDecimal(categories)}
        barbers={sanitizeDecimal(barbers)}
        services={sanitizeDecimal(services)}
        bookings={sanitizeDecimal(bookings)}
        banners={sanitizeDecimal(banners)}
      />
    </>
  );
}
