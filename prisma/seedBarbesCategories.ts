import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

async function seedCategoriesBarbers() {
  const barbers = await prisma.barber.findMany();
  const categories = await prisma.barberCategory.findMany();

  if (!barbers.length || !categories.length) {
    console.log("Nenhum barbeiro ou categoria encontrada.");
    return;
  }

  for (const barber of barbers) {
    // Exemplo: associar 3 categorias aleatórias a cada barbeiro
    const randomCategories = [...categories]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    await prisma.barber.update({
      where: { id: barber.id },
      data: {
        categories: {
          connect: randomCategories.map((cat) => ({ id: cat.id })),
        },
      },
    });

    console.log(
      `Barbeiro ${barber.name} vinculado a categorias: ${randomCategories.map((c) => c.name).join(", ")}`,
    );
  }
}

seedCategoriesBarbers()
  .then(async () => {
    console.log("Seed de categorias por barbeiro finalizado.");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Erro ao executar o seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
