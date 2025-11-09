/**
 * Script para atualizar roles existentes para formato numérico
 * Executa a migration e converte roles de string para int
 */

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function updateRoles() {
  try {
    console.log("🔄 Iniciando atualização de roles...");

    // Buscar todos os usuários
    const users = await prisma.user.findMany({
      select: {
        id: true,
        role: true,
      },
    });

    console.log(`📊 Encontrados ${users.length} usuários para atualizar`);

    let updated = 0;
    let errors = 0;

    for (const user of users) {
      try {
        // Se já for número, pular
        if (typeof user.role === "number") {
          console.log(
            `⏭️  Usuário ${user.id} já tem role numérico: ${user.role}`
          );
          continue;
        }

        // Converter string para número
        let roleNumber;
        const roleStr = (user.role || "").toLowerCase().trim();

        if (roleStr === "admin" || roleStr === "administrador") {
          roleNumber = 1;
        } else if (roleStr === "barbeiro" || roleStr === "barber") {
          roleNumber = 2;
        } else {
          roleNumber = 3; // Cliente por padrão
        }

        // Verificar se é barbeiro (tem registro na tabela barber)
        if (roleNumber === 3) {
          const barber = await prisma.barber.findUnique({
            where: { userId: user.id },
          });
          if (barber) {
            roleNumber = 2; // É barbeiro
          }
        }

        // Atualizar role
        await prisma.user.update({
          where: { id: user.id },
          data: { role: roleNumber },
        });

        console.log(
          `✅ Usuário ${user.id}: "${user.role}" → ${roleNumber} (${roleNumber === 1 ? "Admin" : roleNumber === 2 ? "Barbeiro" : "Cliente"})`
        );
        updated++;
      } catch (error) {
        console.error(`❌ Erro ao atualizar usuário ${user.id}:`, error);
        errors++;
      }
    }

    console.log("\n📈 Resumo:");
    console.log(`✅ Atualizados: ${updated}`);
    console.log(`❌ Erros: ${errors}`);
    console.log(`📊 Total processado: ${users.length}`);

    // Estatísticas finais
    const stats = await prisma.user.groupBy({
      by: ["role"],
      _count: true,
    });

    console.log("\n📊 Distribuição final de roles:");
    stats.forEach(stat => {
      const roleName =
        stat.role === 1 ? "Admin" : stat.role === 2 ? "Barbeiro" : "Cliente";
      console.log(`   ${roleName} (${stat.role}): ${stat._count} usuários`);
    });
  } catch (error) {
    console.error("❌ Erro ao atualizar roles:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateRoles();
