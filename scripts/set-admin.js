const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function setAdmin() {
  try {
    const email = process.argv[2];

    if (!email) {
      console.log("❌ Por favor, forneça um email!");
      console.log("\n📝 Uso:");
      console.log('   node scripts/set-admin.js "seu-email@example.com"\n');
      process.exit(1);
    }

    console.log(`🔍 Buscando usuário: ${email}...\n`);

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log(`❌ Usuário com email "${email}" não encontrado!`);
      console.log("\n📋 Usuários disponíveis:");

      const allUsers = await prisma.user.findMany({
        select: { name: true, email: true, role: true },
      });

      allUsers.forEach((u, index) => {
        console.log(
          `  ${index + 1}. ${u.name || "Sem nome"} (${u.email}) - Role: ${u.role || "Nenhuma"}`
        );
      });

      process.exit(1);
    }

    console.log(`✅ Usuário encontrado: ${user.name || "Sem nome"}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role atual: ${user.role || "Nenhuma"}\n`);

    // Atualizar para Admin (role = 1)
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { role: 1 }, // 1 = Admin
    });

    console.log("🎉 Usuário atualizado com sucesso!");
    console.log(`   Nome: ${updated.name}`);
    console.log(`   Email: ${updated.email}`);
    console.log(`   Role: ${updated.role}`);

    console.log("\n🔐 IMPORTANTE: Para aplicar as mudanças:");
    console.log("   1. Vá para o painel Admin");
    console.log('   2. Clique em "Sair do Admin" (no final do menu)');
    console.log("   3. Faça login novamente com este email");
    console.log("   4. Agora você terá permissões de Admin!\n");
  } catch (error) {
    console.error("❌ Erro ao definir admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

setAdmin();
