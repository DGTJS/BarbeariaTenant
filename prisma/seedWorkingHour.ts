import { PrismaClient } from "@/generated/prisma";
const prisma = new PrismaClient();

async function seedWorkingHour() {
  const barbers = await prisma.barber.findMany();

  for (const barber of barbers) {
    // Segunda a sexta (weekday 1 a 5)
    for (let weekday = 1; weekday <= 5; weekday++) {
      const workingHour = await prisma.barberWorkingHour.create({
        data: {
          barberId: barber.id,
          weekday,
          startTime: "09:00",
          endTime: "18:00",
        },
      });

      // Pausa de almoço das 12:00 às 13:00
      await prisma.pause.create({
        data: {
          workingHourId: workingHour.id,
          startTime: "12:00",
          endTime: "13:00",
        },
      });
    }
  }
}

seedWorkingHour()
  .then(() => {
    console.log("Seed de horários de trabalho e pausas criado com sucesso!");
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect();
  });
