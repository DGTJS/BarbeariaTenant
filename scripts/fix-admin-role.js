const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function fixAdminRole() {
  try {
    console.log("🔧 Verificando e corrigindo role de Admin...\n");

    // Buscar todos os usuários
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    console.log(`📊 Total de usuários: ${allUsers.length}\n`);

    // Verificar se há algum admin
    const admins = allUsers.filter(u => u.role === "Admin");
    console.log(`👨‍💼 Administradores encontrados: ${admins.length}`);

    if (admins.length === 0) {
      console.log("\n⚠️  Nenhum administrador encontrado!");
      console.log("\n📋 Lista de usuários disponíveis:");
      allUsers.forEach((user, index) => {
        console.log(
          `  ${index + 1}. ${user.name || "Sem nome"} (${user.email}) - Role: ${user.role || "Nenhuma"}`
        );
      });

      console.log("\n❓ Qual usuário deve ser Admin?");
      console.log("   Digite o número do usuário ou o email:");
      console.log("\n   Exemplo: Se você é 'devankfr@gmail.com', execute:");
      console.log('   node scripts/set-admin.js "devankfr@gmail.com"\n');
    } else {
      console.log("\n✅ Administradores ativos:");
      admins.forEach((admin, index) => {
        console.log(`  ${index + 1}. ${admin.name} (${admin.email})`);
      });

      console.log(
        "\n🔑 Para que o sistema funcione, você precisa fazer LOGOUT e LOGIN novamente!"
      );
      console.log("\n📍 Passos:");
      console.log("   1. Vá para o menu Admin");
      console.log('   2. Clique em "Sair do Admin" (no final do menu)');
      console.log("   3. Faça login novamente");
      console.log("   4. Teste as notificações\n");
    }

    // Verificar usuários sem role
    const withoutRole = allUsers.filter(u => !u.role);
    if (withoutRole.length > 0) {
      console.log(`\n⚠️  Usuários sem role definida: ${withoutRole.length}`);
      withoutRole.forEach(user => {
        console.log(`  - ${user.name} (${user.email})`);
      });
    }
  } catch (error) {
    console.error("❌ Erro ao verificar roles:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixAdminRole();

