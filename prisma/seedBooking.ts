import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

async function seedBookings() {
  const users = await prisma.user.findMany({ take: 3 });
  const barbers = await prisma.barber.findMany({ take: 3 });
  const services = await prisma.barberShopService.findMany({ take: 3 });

  if (users.length < 3 || barbers.length < 3 || services.length < 3) {
    console.error(
      "🚨 É necessário pelo menos 3 usuários, barbeiros e serviços.",
    );
    return;
  }

  await prisma.booking.createMany({
    data: [
      {
        userId: users[0].id,
        barberId: barbers[0].id,
        serviceId: services[0].id,
        dateTime: new Date(),
        status: "Confirmada",
        rating: 5,
        comment: "Excelente atendimento, super profissional!",
      },
      {
        userId: users[1].id,
        barberId: barbers[1].id,
        serviceId: services[1].id,
        dateTime: new Date(),
        status: "Confirmada",
        rating: 4,
        comment: "Bom corte, ambiente agradável.",
      },
      {
        userId: users[2].id,
        barberId: barbers[2].id,
        serviceId: services[2].id,
        dateTime: new Date(),
        status: "Confirmada",
        rating: 3,
        comment: "Atendimento ok, mas poderia melhorar a pontualidade.",
      },
    ],
  });

  console.log("✅ Seed de bookings com avaliação criado com sucesso!");
}

seedBookings()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
