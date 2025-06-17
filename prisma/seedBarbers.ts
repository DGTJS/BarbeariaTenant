import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    const images = [
      "https://092abtnhnl.ufs.sh/f/tWCD8hUekPO5heL6xqFaY08T2Xl3OGVyrkbWcAHSQzuBiDew",
      "https://092abtnhnl.ufs.sh/f/tWCD8hUekPO5Lds8GiMzFhV6fsG7iLg5rDx9CuHlwt1RdZeN",
      "https://092abtnhnl.ufs.sh/f/tWCD8hUekPO5hYKLNcoFaY08T2Xl3OGVyrkbWcAHSQzuBiDe",
    ];

    const names = ["Renato Silva", "João Pedro", "Lucas Souza"];
    const emails = [
      "renato.silva@barbeira.com.br",
      "joao.pedro@barbeira.com.br",
      "lucas.souza@barbeira.com.br",
    ];
    const phones = ["(11) 98997-9592", "(11) 98997-9593", "(11) 98997-9594"];

    // Defina o ID de uma barbearia existente ou use lógica para buscar uma aleatória
    const barberShop = await prisma.barberShop.findFirst();
    if (!barberShop) {
      console.log("Barbearia não encontrada");
      return;
    }

    for (let i = 0; i < 3; i++) {
      const user = await prisma.user.create({
        data: {
          email: emails[i],
          name: names[i],
          phone: phones[i],
          photo: images[i],
          password: "123456",
          role: "Barbeiro",
        },
      });

      await prisma.barber.create({
        data: {
          name: names[i],
          photo: images[i],
          phone: phones[i],
          user: { connect: { id: user.id } },
          barberShop: { connect: { id: barberShop.id } },
        },
      });
    }
    await prisma.$disconnect();
  } catch (error) {
    console.error("Erro ao criar as barbearias:", error);
  }
}

seedDatabase();
