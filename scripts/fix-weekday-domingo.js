/**
 * Script para corrigir weekday de domingo de 7 para 0
 *
 * Este script corrige horários de trabalho que foram salvos com weekday = 7 (domingo)
 * e atualiza para weekday = 0 (que é o correto segundo JavaScript Date.getDay())
 *
 * Uso: node scripts/fix-weekday-domingo.js
 */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function fixWeekdayDomingo() {
  console.log("🔄 Iniciando correção de weekday para domingo...\n");

  try {
    // Buscar todos os horários de trabalho com weekday = 7 (domingo incorreto)
    const incorrectHours = await prisma.barberWorkingHour.findMany({
      where: {
        weekday: 7,
      },
      include: {
        pauses: true,
      },
    });

    console.log(
      `📊 Encontrados ${incorrectHours.length} horários com weekday = 7 (domingo incorreto)\n`
    );

    if (incorrectHours.length === 0) {
      console.log("✅ Nenhum horário precisa ser corrigido!");
      return;
    }

    let updated = 0;
    let errors = 0;

    for (const hour of incorrectHours) {
      try {
        // Atualizar weekday de 7 para 0
        await prisma.barberWorkingHour.update({
          where: { id: hour.id },
          data: { weekday: 0 },
        });

        updated++;
        console.log(
          `✅ Horário ${hour.id} atualizado: weekday 7 → 0 (Barbeiro: ${hour.barberId})`
        );
      } catch (error) {
        errors++;
        console.error(
          `❌ Erro ao atualizar horário ${hour.id}:`,
          error.message
        );
      }
    }

    console.log(`\n📊 Resumo:`);
    console.log(`   ✅ Atualizados: ${updated}`);
    console.log(`   ❌ Erros: ${errors}`);
    console.log(`\n✅ Correção concluída!`);

    // Verificar se ainda há algum weekday = 7
    const remaining = await prisma.barberWorkingHour.count({
      where: { weekday: 7 },
    });

    if (remaining > 0) {
      console.log(
        `\n⚠️  ATENÇÃO: Ainda existem ${remaining} horários com weekday = 7!`
      );
      console.log(`   Isso pode indicar um conflito. Verifique manualmente.`);
    }
  } catch (error) {
    console.error("❌ Erro geral:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar o script
fixWeekdayDomingo().catch(error => {
  console.error("❌ Erro fatal:", error);
  process.exit(1);
});
