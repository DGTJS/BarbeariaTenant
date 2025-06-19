import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  const barbers = await prisma.barber.findMany({ take: 3 });
  const services = await prisma.barberShopService.findMany({ take: 3 });

  if (barbers.length < 3 || services.length < 3) {
    console.log(
      "⚠️ Pelo menos 3 barbeiros e 3 serviços são necessários para esse seed.",
    );
    return;
  }

  const adjustments = [
    {
      barberId: barbers[0].id,
      serviceId: services[0].id,
      priceAdjustment: 2.5,
    },
    {
      barberId: barbers[1].id,
      serviceId: services[1].id,
      priceAdjustment: 4.99,
    },
    {
      barberId: barbers[2].id,
      serviceId: services[2].id,
      priceAdjustment: 1.75,
    },
    {
      barberId: barbers[0].id,
      serviceId: services[1].id,
      priceAdjustment: 3.0,
    },
    {
      barberId: barbers[1].id,
      serviceId: services[2].id,
      priceAdjustment: 5.25,
    },
  ];

  for (const adjustment of adjustments) {
    await prisma.servicePriceAdjustment.create({ data: adjustment });
  }

  console.log("✅ Ajustes de preço criados com sucesso.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
