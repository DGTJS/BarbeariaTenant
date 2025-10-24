import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

async function seedCategoryDatabase() {
  await prisma.barberCategory.createMany({
    data: [
      {
        name: "Cabelo",
        IconUrl: "lucide:Scissors",
        description: "Cortes e penteados profissionais"
      },
      {
        name: "Barba",
        IconUrl: "lucide:Wind",
        description: "Aparar e modelar barba"
      },
      {
        name: "Acabamento",
        IconUrl: "lucide:Sparkles",
        description: "Finalização e detalhes"
      },
      {
        name: "Sobrancelha",
        IconUrl: "lucide:Eye",
        description: "Design e modelagem de sobrancelhas"
      },
      {
        name: "Massagem",
        IconUrl: "lucide:Hand",
        description: "Massagens relaxantes"
      },
      {
        name: "Hidratação",
        IconUrl: "lucide:Droplet",
        description: "Tratamentos capilares"
      },
    ],
  });
}

seedCategoryDatabase()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
