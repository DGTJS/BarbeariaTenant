import { getBarberShopsId } from "@/_lib/getBarberShop";

interface BarberShopPageProps {
  params: {
    id: string;
  };
}

const BarberShopPage = async ({ params }: BarberShopPageProps) => {
  const barberShop = await getBarberShopsId(params.id);

  return (
    <div>
      <h1>{barberShop?.name}</h1>
    </div>
  );
};

export default BarberShopPage;
