/**
 * Script para recalcular e atualizar preços de agendamentos antigos
 *
 * Este script:
 * 1. Busca agendamentos com totalPrice = 0 ou NULL
 * 2. Recalcula o preço baseado no serviço, barbeiro e opções
 * 3. Atualiza o totalPrice no banco de dados
 *
 * Uso: node scripts/fix-booking-prices.js
 */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function fixBookingPrices() {
  console.log("🔄 Iniciando correção de preços dos agendamentos...\n");

  try {
    // Buscar TODOS os agendamentos primeiro (filtro será feito em JavaScript)
    const allBookings = await prisma.booking.findMany({
      include: {
        service: {
          select: {
            id: true,
            price: true,
          },
        },
        barber: {
          select: {
            id: true,
          },
        },
      },
    });

    // Filtrar agendamentos com preço zerado ou nulo em JavaScript
    const bookingsToFix = allBookings.filter(booking => {
      const price = Number(booking.totalPrice || 0);
      return price === 0 || booking.totalPrice === null;
    });

    console.log(
      `📊 Encontrados ${bookingsToFix.length} agendamentos para corrigir\n`
    );

    if (bookingsToFix.length === 0) {
      console.log("✅ Nenhum agendamento precisa ser corrigido!");
      return;
    }

    let updated = 0;
    let errors = 0;

    for (const booking of bookingsToFix) {
      try {
        // Preço é apenas das opções - não há mais preço base do serviço
        // Buscar opções de serviço selecionadas neste agendamento
        const serviceOptions = await prisma.serviceOptionBooking.findMany({
          where: {
            bookingId: booking.id,
          },
          include: {
            serviceOption: {
              select: {
                price: true,
              },
            },
          },
        });

        // Calcular preço total
        // Se há opções, usar APENAS o preço da primeira opção
        // Caso contrário, usar 0 (sem preço)
        let totalPrice = 0;
        if (serviceOptions.length > 0) {
          // Se há opção, usar apenas o preço da opção
          totalPrice = Number(serviceOptions[0].serviceOption.price || 0);
        }

        // Atualizar o agendamento
        await prisma.booking.update({
          where: { id: booking.id },
          data: { totalPrice },
        });

        updated++;
        console.log(
          `✅ Booking ${booking.id}: R$ ${totalPrice.toFixed(2)} (Base: R$ ${basePrice.toFixed(2)} + Opções: R$ ${optionsTotal.toFixed(2)})`
        );
      } catch (error) {
        errors++;
        console.error(
          `❌ Erro ao corrigir booking ${booking.id}:`,
          error.message
        );
      }
    }

    console.log(`\n📊 Resumo:`);
    console.log(`   ✅ Atualizados: ${updated}`);
    console.log(`   ❌ Erros: ${errors}`);
    console.log(`   📦 Total processado: ${bookingsToFix.length}`);

    // Calcular receita total após correção
    const totalRevenue = await prisma.booking.aggregate({
      where: {
        totalPrice: {
          gt: 0,
        },
      },
      _sum: {
        totalPrice: true,
      },
    });

    console.log(
      `\n💰 Receita total calculada: R$ ${Number(totalRevenue._sum.totalPrice || 0).toFixed(2)}`
    );
    console.log("\n✅ Correção concluída!");
  } catch (error) {
    console.error("❌ Erro geral:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar o script
fixBookingPrices().catch(error => {
  console.error("❌ Erro fatal:", error);
  process.exit(1);
});
