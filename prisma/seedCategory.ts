import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

async function seedCategoryDatabase() {
  await prisma.barberCategory.createMany({
    data: [
      {
        name: "Cabelo",
        IconUrl:
          "https://092abtnhnl.ufs.sh/f/tWCD8hUekPO5LE30lBMzFhV6fsG7iLg5rDx9CuHlwt1RdZeN",
      },
      {
        name: "Barba",
        IconUrl:
          "https://092abtnhnl.ufs.sh/f/tWCD8hUekPO5JrxOXqQzLqEKM87orjxQp1i9FUSnghDsfPae",
      },
      {
        name: "Acabemento",
        IconUrl:
          "https://092abtnhnl.ufs.sh/f/tWCD8hUekPO5bs3P1Hw7wlT2QPkdKemXHpiCZELJ4jSa0zOM",
      },
      {
        name: "Sobrancelha",
        IconUrl:
          "https://092abtnhnl.ufs.sh/f/tWCD8hUekPO5EgBdt4XJtg3FC87ObndhUefW0skEK64NVSvc",
      },
      {
        name: "Massagem",
        IconUrl:
          "https://092abtnhnl.ufs.sh/f/tWCD8hUekPO5qsvgVYbIWuCXSD1PT9MsYJafzFvOwVeBE3kR",
      },
      {
        name: "Hidratação",
        IconUrl:
          "https://092abtnhnl.ufs.sh/f/tWCD8hUekPO56uyRjp0UX2oTS8WMNzemARQB6I4qgsapE1kc",
      },
    ],
  });
}

seedCategoryDatabase()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
