import { getBarberShopsId } from "@/_lib/getBarberShop";
import Image from "next/image";
import { Button } from "@/_components/ui/button";
import { ChevronLeftIcon, StarIcon } from "lucide-react";
import Link from "next/link";
import SideBarButton from "@/_components/sidebar-button";
import {
  getBarberFromBarberShop,
  getCategoriesFromBarberShop,
} from "@/_lib/getCategories";
import Category from "@/_components/category";
import ServiceBarberCard from "@/_components/cardServiceBarber";
import { getServiceBarberShop } from "@/_lib/getServiceShop";
import BarberCardHorizontal from "@/_components/BarberCardHorizontal";

interface BarberShopPageProps {
  params: Promise<{
    id: string;
  }>;
}

const BarberShopPage = async ({ params }: BarberShopPageProps) => {
  const { id } = await params;
  const barberShop = await getBarberShopsId(id);
  const categoriesBarberShop = await getCategoriesFromBarberShop(id);
  const servicesBarberShop = await getServiceBarberShop(id);
  const barberBarberShop = await getBarberFromBarberShop(id);

  return (
    <div className="min-h-screen bg-background">
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
        className="fixed top-4 left-4 z-50 bg-card-secondary border-card-border"
        asChild
      >
        <Link href="/">
          <ChevronLeftIcon className="text-card-foreground" />
        </Link>
      </Button>
      <div className="fixed top-4 right-4 z-50">
        <SideBarButton category={categoriesBarberShop} />
      </div>
      <div className="flex flex-row justify-between p-5">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{barberShop?.name}</h1>
          <p className="text-foreground-muted">{barberShop?.address}</p>
        </div>
        <Button variant="outline" className="mt-2">
          <StarIcon className="fill-primary text-primary h-4 w-4" />
          {barberShop?.rating}
        </Button>
      </div>
      <div className="border-t border-solid border-card-border p-5">
        <h3 className="text-sm font-semibold text-foreground">Categoria</h3>
        <div className="mt-5 flex gap-3 overflow-auto pb-5 [&::-webkit-scrollbar]:hidden">
          {categoriesBarberShop.map((category) => (
            <Category
              key={category.id}
              name={category.name}
              IconUrl={category.IconUrl}
              id={category.id}
            />
          ))}
        </div>
        <h3 className="text-sm font-semibold text-foreground">Barbeiros</h3>
        <div className="mt-5 flex gap-3 overflow-auto pb-5 [&::-webkit-scrollbar]:hidden">
          {barberBarberShop.map((barberBarberShop) => (
            <BarberCardHorizontal
              key={barberBarberShop.id}
              barber={barberBarberShop}
              nameButton={"Agendar"}
              averageRating={barberBarberShop.averageRating ?? undefined}
            />
          ))}
        </div>
        <div className="border-t border-solid border-card-border">
          <h3 className="pt-4 text-sm font-semibold text-foreground-muted uppercase">
            Serviços
          </h3>
          <div className="mt-5 gap-3">
            {servicesBarberShop && servicesBarberShop.length > 0 ? (
              servicesBarberShop.map((service) => (
                <ServiceBarberCard 
                  key={service.id} 
                  service={{
                    ...service,
                    price: Number(service.price)
                  }}
                  barber={{
                    id: "",
                    name: "",
                    photo: "",
                    barberShopId: service.barberShopId
                  }}
                  user={null}
                  bookings={[]}
                />
              ))
            ) : (
              <p className="text-sm text-foreground-muted">
                Nenhum serviço disponível.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarberShopPage;
