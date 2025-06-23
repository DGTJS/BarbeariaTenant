import { getBarberShopsId } from "@/_lib/getBarberShop";
import Image from "next/image";
import { Button } from "@/_components/ui/button";
import { ChevronLeftIcon, StarIcon } from "lucide-react";
import Link from "next/link";
import SideBarButton from "@/_components/sidebar-button";
import { getCategoriesFromBarberShop } from "@/_lib/getCategories";
import Category from "@/_components/category";
import ServiceBarberCard from "@/_components/cardServiceBarber";
import { getServiceBarberShop } from "@/_lib/getServiceShop";
import FooterBar from "@/_components/footerbar";

interface BarberShopPageProps {
  params: {
    id: string;
  };
}

const BarberShopPage = async ({ params }: BarberShopPageProps) => {
  const barberShop = await getBarberShopsId(params.id);
  const categoriesBarberShop = await getCategoriesFromBarberShop(params.id);
  const servicesBarberShop = await getServiceBarberShop(params.id);

  return (
    <div>
      <div className="relative h-[300px] w-full">
        <Image
          src={barberShop?.imageUrl ?? "/default-image.png"}
          alt="Logo"
          fill
          className="object-cover"
        />
      </div>
      <Button
        variant="outline"
        className="absolute fixed top-4 left-4 z-50 bg-gray-600"
        asChild
      >
        <Link href="/">
          <ChevronLeftIcon className="text-white" />
        </Link>
      </Button>
      <div className="absolute fixed top-4 right-4 z-50">
        <SideBarButton category={categoriesBarberShop} />
      </div>
      <div className="flex flex-row justify-between p-5">
        <div>
          <h1 className="text-2xl font-semibold">{barberShop?.name}</h1>
          <p className="text-gray-500">{barberShop?.address}</p>
        </div>
        <Button variant="outline" className="mt-2">
          <StarIcon className="fill-primary text-primary h-4 w-4" />
          {barberShop?.rating}
        </Button>
      </div>
      <div className="border-t border-solid border-gray-800 p-5">
        <h3 className="text-sm font-semibold text-gray-200">Categoria</h3>
        <div className="mt-5 flex gap-3 overflow-auto pb-5 [&::-webkit-scrollbar]:hidden">
          {categoriesBarberShop.map((category) => (
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
            {servicesBarberShop && servicesBarberShop.length > 0 ? (
              servicesBarberShop.map((service) => (
                <ServiceBarberCard key={service.id} service={service} />
              ))
            ) : (
              <p className="text-sm text-gray-400">
                Nenhum serviço disponível.
              </p>
            )}
          </div>
        </div>
      </div>
      <FooterBar />
    </div>
  );
};

export default BarberShopPage;
