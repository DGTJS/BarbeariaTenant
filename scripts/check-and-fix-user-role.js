/**
 * Script para verificar e corrigir o role de um usuário específico
 *
 * Uso: node scripts/check-and-fix-user-role.js <email-do-usuario> [role]
 *
 * Roles:
 *   1 = Admin
 *   2 = Barbeiro
 *   3 = Cliente (padrão)
 *
 * Se role não for fornecido, apenas mostra o role atual
 */

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkAndFixUserRole() {
  const email = process.argv[2];
  const newRole = process.argv[3] ? parseInt(process.argv[3]) : null;

  if (!email) {
    console.error("❌ Por favor, forneça o email do usuário:");
    console.log("   node scripts/check-and-fix-user-role.js <email> [role]");
    console.log("\nRoles:");
    console.log("  1 = Admin");
    console.log("  2 = Barbeiro");
    console.log("  3 = Cliente");
    process.exit(1);
  }

  try {
    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        barber: {
          select: {
            id: true,
            hasAdminAccess: true,
          },
        },
      },
    });

    if (!user) {
      console.error(`❌ Usuário com email "${email}" não encontrado.`);
      process.exit(1);
    }

    console.log("\n📊 Informações do Usuário:");
    console.log(`   ID: ${user.id}`);
    console.log(`   Nome: ${user.name || "Não informado"}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role atual: ${user.role} (${getRoleName(user.role)})`);
    console.log(`   Tem registro de barbeiro: ${user.barber ? "Sim" : "Não"}`);
    if (user.barber) {
      console.log(
        `   Barbeiro tem acesso admin: ${user.barber.hasAdminAccess ? "Sim" : "Não"}`
      );
    }

    // Verificar permissões atuais
    const isAdmin = user.role === 1;
    const isBarbeiro = user.role === 2 || !!user.barber;
    const canAccessAdmin = isAdmin || isBarbeiro;

    console.log(`\n🔐 Permissões de Acesso:`);
    console.log(`   É Admin: ${isAdmin ? "✅ Sim" : "❌ Não"}`);
    console.log(`   É Barbeiro: ${isBarbeiro ? "✅ Sim" : "❌ Não"}`);
    console.log(
      `   Pode acessar área admin: ${canAccessAdmin ? "✅ Sim" : "❌ Não"}`
    );

    // Se não forneceu role, apenas mostra e sai
    if (newRole === null) {
      console.log("\n💡 Para alterar o role, execute:");
      console.log(`   node scripts/check-and-fix-user-role.js ${email} <role>`);
      console.log("\nRoles disponíveis:");
      console.log("  1 = Admin (acesso completo)");
      console.log("  2 = Barbeiro (acesso como barbeiro)");
      console.log("  3 = Cliente (sem acesso admin)");
      await prisma.$disconnect();
      process.exit(0);
    }

    // Validar role
    if (![1, 2, 3].includes(newRole)) {
      console.error(`❌ Role inválido: ${newRole}`);
      console.error("   Roles válidos: 1 (Admin), 2 (Barbeiro), 3 (Cliente)");
      await prisma.$disconnect();
      process.exit(1);
    }

    // Se role já está correto, não precisa atualizar
    if (user.role === newRole) {
      console.log(
        `\n✅ Role já está como ${getRoleName(newRole)}. Nenhuma alteração necessária.`
      );
      await prisma.$disconnect();
      process.exit(0);
    }

    // Atualizar role
    console.log(
      `\n🔄 Atualizando role de ${getRoleName(user.role)} para ${getRoleName(newRole)}...`
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { role: newRole },
    });

    console.log(`✅ Role atualizado com sucesso!`);
    console.log(`\n📊 Nova situação:`);
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        barber: {
          select: {
            id: true,
            hasAdminAccess: true,
          },
        },
      },
    });

    const newIsAdmin = updatedUser.role === 1;
    const newIsBarbeiro = updatedUser.role === 2 || !!updatedUser.barber;
    const newCanAccessAdmin = newIsAdmin || newIsBarbeiro;

    console.log(
      `   Role: ${updatedUser.role} (${getRoleName(updatedUser.role)})`
    );
    console.log(`   É Admin: ${newIsAdmin ? "✅ Sim" : "❌ Não"}`);
    console.log(`   É Barbeiro: ${newIsBarbeiro ? "✅ Sim" : "❌ Não"}`);
    console.log(
      `   Pode acessar área admin: ${newCanAccessAdmin ? "✅ Sim" : "❌ Não"}`
    );

    await prisma.$disconnect();
    console.log("\n✅ Processo concluído!");
  } catch (error) {
    console.error("❌ Erro ao verificar/atualizar usuário:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

function getRoleName(role) {
  switch (role) {
    case 1:
      return "Admin";
    case 2:
      return "Barbeiro";
    case 3:
      return "Cliente";
    default:
      return `Desconhecido (${role})`;
  }
}

checkAndFixUserRole();


