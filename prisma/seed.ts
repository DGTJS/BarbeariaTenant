import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

async function seedCategories() {
  // Cria as categorias (se ainda não existem)
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
    skipDuplicates: true, // evita erro se já criou
  });
}

async function seedBarberShopsAndServices() {
  // Buscar categorias pra mapear por nome
  const categories = await prisma.barberCategory.findMany();
  const categoryMap = new Map(
    categories.map((cat) => [cat.name.toLowerCase(), cat.id]),
  );

  const images = [
    "https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png",
    "https://utfs.io/f/45331760-899c-4b4b-910e-e00babb6ed81-16q.png",
    "https://utfs.io/f/5832df58-cfd7-4b3f-b102-42b7e150ced2-16r.png",
    "https://utfs.io/f/7e309eaa-d722-465b-b8b6-76217404a3d3-16s.png",
    "https://utfs.io/f/178da6b6-6f9a-424a-be9d-a2feb476eb36-16t.png",
    "https://utfs.io/f/2f9278ba-3975-4026-af46-64af78864494-16u.png",
    "https://utfs.io/f/988646ea-dcb6-4f47-8a03-8d4586b7bc21-16v.png",
    "https://utfs.io/f/60f24f5c-9ed3-40ba-8c92-0cd1dcd043f9-16w.png",
    "https://utfs.io/f/f64f1bd4-59ce-4ee3-972d-2399937eeafc-16x.png",
    "https://utfs.io/f/e995db6d-df96-4658-99f5-11132fd931e1-17j.png",
  ];

  const creativeNames = [
    "Barbearia Vintage",
    "Corte & Estilo",
    "Barba & Navalha",
    "The Dapper Den",
    "Cabelo & Cia.",
    "Machado & Tesoura",
    "Barbearia Elegance",
    "Aparência Impecável",
    "Estilo Urbano",
    "Estilo Clássico",
  ];

  const addresses = [
    "Rua da Barbearia, 123",
    "Avenida dos Cortes, 456",
    "Praça da Barba, 789",
    "Travessa da Navalha, 101",
    "Alameda dos Estilos, 202",
    "Estrada do Machado, 303",
    "Avenida Elegante, 404",
    "Praça da Aparência, 505",
    "Rua Urbana, 606",
    "Avenida Clássica, 707",
  ];

  const services = [
    {
      name: "Corte de Cabelo",
      description: "Estilo personalizado com as últimas tendências.",
      price: 60.0,
      imageUrl:
        "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png",
      categoryName: "Cabelo",
    },
    {
      name: "Barba",
      description: "Modelagem completa para destacar sua masculinidade.",
      price: 40.0,
      imageUrl:
        "https://utfs.io/f/e6bdffb6-24a9-455b-aba3-903c2c2b5bde-1jo6tu.png",
      categoryName: "Barba",
    },
    {
      name: "Pézinho",
      description: "Acabamento perfeito para um visual renovado.",
      price: 35.0,
      imageUrl:
        "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
      categoryName: "Acabemento",
    },
    {
      name: "Sobrancelha",
      description: "Expressão acentuada com modelagem precisa.",
      price: 20.0,
      imageUrl:
        "https://utfs.io/f/2118f76e-89e4-43e6-87c9-8f157500c333-b0ps0b.png",
      categoryName: "Sobrancelha",
    },
    {
      name: "Massagem",
      description: "Relaxe com uma massagem revigorante.",
      price: 50.0,
      imageUrl:
        "https://utfs.io/f/c4919193-a675-4c47-9f21-ebd86d1c8e6a-4oen2a.png",
      categoryName: "Massagem",
    },
    {
      name: "Hidratação",
      description: "Hidratação profunda para cabelo e barba.",
      price: 25.0,
      imageUrl:
        "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
      categoryName: "Hidratação",
    },
  ];

  for (let i = 0; i < 10; i++) {
    const barbershop = await prisma.barberShop.create({
      data: {
        name: creativeNames[i],
        address: addresses[i],
        imageUrl: images[i],
        phones: ["(11) 99999-9999", "(11) 99999-9999"],
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac augue ullamcorper, pharetra orci mollis, auctor tellus. Phasellus pharetra erat ac libero efficitur tempus. Donec pretium convallis iaculis. Etiam eu felis sollicitudin, cursus mi vitae, iaculis magna. Nam non erat neque. In hac habitasse platea dictumst. Pellentesque molestie accumsan tellus id laoreet.",
      },
    });

    for (const service of services) {
      const categoryId = categoryMap.get(service.categoryName.toLowerCase());
      if (!categoryId) {
        console.warn(
          `Categoria não encontrada para o serviço: ${service.name}`,
        );
        continue;
      }

      await prisma.barberShopService.create({
        data: {
          name: service.name,
          description: service.description,
          price: service.price,
          duration: 60,
          imageUrl: service.imageUrl,
          barberShopId: barbershop.id,
          categoryId: categoryId,
        },
      });
    }
  }
}

async function main() {
  console.log("Seed iniciando...");
  await seedCategories();
  await seedBarberShopsAndServices();
  console.log("Seed finalizado com sucesso!");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
