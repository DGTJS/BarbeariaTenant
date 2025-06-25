import CardBarbers from "@/_components/CardBarbers";
import CardBarber from "@/_components/cardBarberShop";
import CardServices from "@/_components/cardServices";
import Header from "@/_components/header";
import { db } from "@/_lib/prisma";
import Search from "@/_components/search";

interface SearchPageProps {
  searchParams: {
    search?: string;
    category?: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  let barberShops: any[] = [];
  let barbers: any[] = [];
  let services: any[] = [];
  let searchTitle = '';

  if (searchParams.category) {
    // Busca por categoria
    const categoryId = searchParams.category;
    // Buscar nome da categoria
    const category = await db.barberCategory.findUnique({ where: { id: categoryId } });
    const categoryName = category?.name || "";
    services = await db.barberShopService.findMany({
      where: { categoryId },
    });
    // Buscar barbearias que tenham pelo menos um serviço dessa categoria
    barberShops = await db.barberShop.findMany({
      where: {
        services: {
          some: { categoryId },
        },
      },
    });
    // Buscar barbeiros que tenham pelo menos uma categoria igual à selecionada
    barbers = await db.barber.findMany({
      where: {
        categories: {
          some: { id: categoryId },
        },
      },
    });
    searchTitle = `Categoria: ${categoryName}`;
  } else if (searchParams.search) {
    // Busca por texto (como já faz hoje)
    barberShops = await db.barberShop.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchParams.search,
              mode: "insensitive",
            },
          },
          {
            services: {
              some: {
                name: {
                  contains: searchParams.search,
                  mode: "insensitive",
                },
              },
            },
          },
        ],
      },
    });

    barbers = await db.barber.findMany({
      where: {
        name: {
          contains: searchParams.search,
          mode: "insensitive",
        },
      },
    });

    services = await db.barberShopService.findMany({
      where: {
        name: {
          contains: searchParams.search,
          mode: "insensitive",
        },
      },
    });
    searchTitle = `Resultados para "${searchParams.search}"`;
  }

  return (
    <>
      <div>
        <Header />
        <div className="my-6 px-3">
          <Search />
          <h2 className="mt-4 text-xs font-bold text-gray-400 uppercase">
            {searchTitle}
          </h2>

          {/* BARBERSHOPS */}
          {barberShops.length > 0 && (
            <div className="mt-4 w-full border-t border-gray-400">
              <div className="mx-auto w-full max-w-screen-lg px-2">
                <h2 className="pt-4 text-xs font-bold text-gray-400 uppercase">
                  Barbearias
                </h2>
                <div className="grid-xs">
                  {barberShops.map((shop: any) => (
                    <CardBarber
                      key={shop.id}
                      barberShop={shop}
                      nameButton="Ver"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* BARBERS */}
          {barbers.length > 0 && (
            <div className="mt-4 w-full border-t border-gray-400">
              <div className="mx-auto w-full max-w-screen-lg px-2">
                <h2 className="pt-4 text-xs font-bold text-gray-400 uppercase">
                  Barbeiros
                </h2>
                <div className="grid-xs">
                  {barbers.map((barber) => (
                    <CardBarbers
                      key={barber.id}
                      barber={barber}
                      nameButton="Serviços"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SERVICES */}
          {services.length > 0 && (
            <div className="mt-4 w-full border-t border-gray-400">
              <div className="mx-auto w-full max-w-screen-lg px-2">
                <h2 className="pt-4 text-xs font-bold text-gray-400 uppercase">
                  Serviços
                </h2>
                <div className="grid-xs">
                  {services.map((service) => (
                    <CardServices
                      key={service.id}
                      BarberShopService={service}
                      nameButton="Reservar"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchPage;
