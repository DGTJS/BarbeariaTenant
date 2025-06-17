import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

async function seedServices() {
  // Busca categorias e mapeia por nome (minúsculo)
  const categories = await prisma.barberCategory.findMany();
  const categoryMap = new Map(
    categories.map((cat) => [cat.name.toLowerCase(), cat.id]),
  );

  // Busca todas as barbearias para associar serviços
  const barberShops = await prisma.barberShop.findMany();

  // Template dos serviços que vamos criar para cada barbearia
  const servicesTemplate = [
    {
      name: "Corte de Cabelo",
      description: "Estilo personalizado com as últimas tendências.",
      price: "60.00",
      duration: 60,
      imageUrl:
        "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png",
      categoryName: "cabelo",
    },
    {
      name: "Barba",
      description: "Modelagem completa para destacar sua masculinidade.",
      price: "40.00",
      duration: 45,
      imageUrl:
        "https://utfs.io/f/e6bdffb6-24a9-455b-aba3-903c2c2b5bde-1jo6tu.png",
      categoryName: "barba",
    },
    {
      name: "Pézinho",
      description: "Acabamento perfeito para um visual renovado.",
      price: "35.00",
      duration: 30,
      imageUrl:
        "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
      categoryName: "acabemento",
    },
    {
      name: "Sobrancelha",
      description: "Expressão acentuada com modelagem precisa.",
      price: "20.00",
      duration: 30,
      imageUrl:
        "https://utfs.io/f/2118f76e-89e4-43e6-87c9-8f157500c333-b0ps0b.png",
      categoryName: "sobrancelha",
    },
    {
      name: "Massagem",
      description: "Relaxe com uma massagem revigorante.",
      price: "50.00",
      duration: 60,
      imageUrl:
        "https://utfs.io/f/c4919193-a675-4c47-9f21-ebd86d1c8e6a-4oen2a.png",
      categoryName: "massagem",
    },
    {
      name: "Hidratação",
      description: "Hidratação profunda para cabelo e barba.",
      price: "25.00",
      duration: 45,
      imageUrl:
        "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
      categoryName: "hidratação",
    },
  ];

  for (const shop of barberShops) {
    for (const service of servicesTemplate) {
      const categoryId = categoryMap.get(service.categoryName);
      if (!categoryId) {
        console.warn(
          `Categoria "${service.categoryName}" não encontrada. Serviço "${service.name}" não será criado para barbearia "${shop.name}"`,
        );
        continue;
      }

      // Cria o serviço
      await prisma.barberShopService.create({
        data: {
          barberShopId: shop.id,
          categoryId,
          name: service.name,
          description: service.description,
          price: service.price,
          duration: service.duration,
          imageUrl: service.imageUrl,
          status: true,
        },
      });
    }
  }
}

async function main() {
  console.log("Iniciando seed dos serviços...");
  await seedServices();
  console.log("Seed dos serviços finalizado!");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
