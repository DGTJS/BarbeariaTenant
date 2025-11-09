const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkBarbers() {
  try {
    console.log("🔍 Verificando barbeiros no banco de dados...\n");

    // Contar todos os barbeiros
    const count = await prisma.barber.count();
    console.log(`📊 Total de barbeiros no banco: ${count}`);

    // Buscar todos os barbeiros
    const barbers = await prisma.barber.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        userId: true,
        barberShopId: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log("\n📋 Lista de barbeiros:");
    barbers.forEach((barber, index) => {
      console.log(`\n${index + 1}. ${barber.name}`);
      console.log(`   ID: ${barber.id}`);
      console.log(`   Email: ${barber.email || "N/A"}`);
      console.log(`   Telefone: ${barber.phone || "N/A"}`);
      console.log(`   Criado em: ${barber.createdAt}`);
      console.log(`   User ID: ${barber.userId}`);
      console.log(`   BarberShop ID: ${barber.barberShopId}`);
    });

    // Verificar se há barbeiros sem user associado
    const barbersWithoutUser = await prisma.barber.findMany({
      where: {
        user: null,
      },
    });

    if (barbersWithoutUser.length > 0) {
      console.log(
        `\n⚠️  ATENÇÃO: ${barbersWithoutUser.length} barbeiro(s) sem user associado:`
      );
      barbersWithoutUser.forEach(b => {
        console.log(`   - ${b.name} (ID: ${b.id})`);
      });
    }

    // Verificar relacionamentos
    const barbersWithRelations = await prisma.barber.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        categories: {
          select: {
            id: true,
            name: true,
          },
        },
        workingHours: {
          select: {
            id: true,
            weekday: true,
          },
        },
      },
    });

    console.log("\n🔗 Relacionamentos:");
    barbersWithRelations.forEach(barber => {
      console.log(`\n${barber.name}:`);
      console.log(
        `   User: ${barber.user ? `${barber.user.email} (role: ${barber.user.role})` : "NENHUM"}`
      );
      console.log(`   Categorias: ${barber.categories.length}`);
      console.log(`   Horários: ${barber.workingHours.length}`);
    });
  } catch (error) {
    console.error("❌ Erro:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBarbers();

