const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkBarberSchedule() {
  try {
    console.log("🔍 Verificando horários e pausas dos barbeiros...\n");

    const barbers = await prisma.barber.findMany({
      include: {
        workingHours: {
          include: {
            pauses: true,
          },
        },
      },
    });

    console.log(`📊 Total de barbeiros: ${barbers.length}\n`);

    for (const barber of barbers) {
      console.log(`\n${"=".repeat(60)}`);
      console.log(`👤 Barbeiro: ${barber.name}`);
      console.log(`   ID: ${barber.id}`);
      console.log(`\n📅 Horários de Trabalho:`);

      if (!barber.workingHours || barber.workingHours.length === 0) {
        console.log("   ⚠️  NENHUM horário configurado!");
      } else {
        const days = [
          "Domingo",
          "Segunda",
          "Terça",
          "Quarta",
          "Quinta",
          "Sexta",
          "Sábado",
        ];

        barber.workingHours.forEach(wh => {
          console.log(
            `\n   ${days[wh.weekday]}: ${wh.startTime} - ${wh.endTime}`
          );

          if (wh.pauses && wh.pauses.length > 0) {
            console.log("   ⏸️  Pausas:");
            wh.pauses.forEach(pause => {
              console.log(`      - ${pause.startTime} até ${pause.endTime}`);
            });
          } else {
            console.log("   ⏸️  Sem pausas");
          }
        });
      }
    }

    console.log(`\n${"=".repeat(60)}\n`);
  } catch (error) {
    console.error("❌ Erro ao verificar horários:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBarberSchedule();
