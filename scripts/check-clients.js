const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkClients() {
  try {
    console.log("🔍 Verificando clientes no banco de dados...\n");

    // Buscar todos os usuários
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        _count: {
          select: {
            booking: true,
          },
        },
      },
    });

    console.log(`📊 Total de usuários: ${allUsers.length}\n`);

    // Agrupar por role
    const byRole = allUsers.reduce((acc, user) => {
      const role = user.role || "Sem role";
      if (!acc[role]) acc[role] = [];
      acc[role].push(user);
      return acc;
    }, {});

    console.log("👥 Usuários por role:");
    Object.entries(byRole).forEach(([role, users]) => {
      console.log(`  ${role}: ${users.length} usuário(s)`);
    });

    // Clientes (não Admin, não Barbeiro)
    const clients = allUsers.filter(
      u => u.role !== "Admin" && u.role !== "Barbeiro"
    );

    console.log(`\n✅ Clientes (não Admin/Barbeiro): ${clients.length}`);

    if (clients.length > 0) {
      console.log("\n📋 Lista de clientes:");
      clients.forEach((client, index) => {
        console.log(
          `  ${index + 1}. ${client.name || "Sem nome"} (${client.email}) - Role: ${client.role || "Nenhuma"} - Agendamentos: ${client._count.booking}`
        );
      });
    } else {
      console.log("\n⚠️  Não há clientes cadastrados no sistema!");
      console.log("\n💡 Para criar um cliente de teste, você pode:");
      console.log("   1. Fazer login no sistema como um novo usuário");
      console.log("   2. Ou executar:");
      console.log("\n   node scripts/create-test-client.js");
    }

    // Admins
    const admins = allUsers.filter(u => u.role === "Admin");
    console.log(`\n👨‍💼 Administradores: ${admins.length}`);
    if (admins.length > 0) {
      admins.forEach((admin, index) => {
        console.log(`  ${index + 1}. ${admin.name} (${admin.email})`);
      });
    }

    // Barbeiros
    const barbers = allUsers.filter(u => u.role === "Barbeiro");
    console.log(`\n💈 Barbeiros: ${barbers.length}`);
    if (barbers.length > 0) {
      barbers.forEach((barber, index) => {
        console.log(`  ${index + 1}. ${barber.name} (${barber.email})`);
      });
    }
  } catch (error) {
    console.error("❌ Erro ao verificar clientes:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkClients();

