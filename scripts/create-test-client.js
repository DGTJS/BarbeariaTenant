const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createTestClient() {
  try {
    console.log("🔧 Criando cliente de teste...\n");

    // Verificar se já existe
    const existing = await prisma.user.findUnique({
      where: { email: "cliente.teste@example.com" },
    });

    if (existing) {
      console.log("⚠️  Cliente de teste já existe!");
      console.log(`   Nome: ${existing.name}`);
      console.log(`   Email: ${existing.email}`);
      console.log(`   Role: ${existing.role || "Nenhuma"}`);
      return;
    }

    // Criar cliente de teste
    const client = await prisma.user.create({
      data: {
        name: "Cliente Teste",
        email: "cliente.teste@example.com",
        role: "Cliente",
      },
    });

    console.log("✅ Cliente de teste criado com sucesso!");
    console.log(`   Nome: ${client.name}`);
    console.log(`   Email: ${client.email}`);
    console.log(`   Role: ${client.role}`);
    console.log(`   ID: ${client.id}`);

    console.log("\n💡 Agora você pode:");
    console.log("   1. Ir para Admin → Notificações");
    console.log('   2. Selecionar "Clientes Específicos"');
    console.log("   3. Ver o cliente de teste na lista!");
  } catch (error) {
    console.error("❌ Erro ao criar cliente de teste:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestClient();

