"use server";
import { db } from "@/_lib/prisma";
import Image from "next/image";
import { Button } from "@/_components/ui/button";
import { ChevronLeftIcon, StarIcon } from "lucide-react";
import SideBarButton from "@/_components/sidebar-button";
import Link from "next/link";
import Category from "@/_components/category";
import ServiceBarberCard from "@/_components/cardServiceBarber";
import { getCategories } from "@/_lib/getCategories";
import FooterBar from "@/_components/footerbar";

interface BarbersProps {
  params: {
    id: string;
  };
}

const BarberPage = async ({ params }: BarbersProps) => {
  const Barbers = await db.barber.findUnique({
    where: { id: params.id },
    select: {
      name: true,
      photo: true,
      barberShopId: true,
      categories: true,
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

  const categories = await getCategories();

  const categoryIds = Barbers!.categories.map((category) => category.id);

  const services = await db.barberShopService.findMany({
    where: {
      categoryId: {
        in: categoryIds,
      },
      status: true,
    },
    include: {
      category: true,
      priceAdjustments: {
        where: {
          barberId: params.id,
        },
      },
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
        className="absolute fixed top-4 left-4 z-50 cursor-pointer"
        asChild
      >
        <Link href="/">
          <ChevronLeftIcon className="text-white" />
        </Link>
      </Button>

      <div className="absolute fixed top-4 right-4 z-50">
        <SideBarButton category={categories} />
      </div>

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
        <div className="border-t border-solid border-gray-800">
          <h3 className="pt-4 text-sm font-semibold text-gray-400 uppercase">
            Serviços
          </h3>
          <div className="mt-5 gap-3">
            {services.length > 0 ? (
              services.map((service) => (
                <ServiceBarberCard
                  key={service.id}
                  service={{
                    ...service,
                    priceAdjustments: service.priceAdjustments?.map((adj) => ({
                      ...adj,
                      priceAdjustment:
                        typeof adj.priceAdjustment === "number"
                          ? adj.priceAdjustment
                          : Number(adj.priceAdjustment),
                    })),
                  }}
                />
              ))
            ) : (
              <p className="text-sm text-gray-400">
                Nenhum serviço disponível.
              </p>
            )}
          </div>
        </div>
        <FooterBar />
      </div>
    </div>
  );
};

export default BarberPage;
