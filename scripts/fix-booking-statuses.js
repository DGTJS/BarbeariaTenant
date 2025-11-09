/**
 * Script para corrigir status de agendamentos antigos
 *
 * Este script:
 * 1. Atualiza "aguardandopagamento" para "Aguardando Pagamento"
 * 2. Atualiza "Pendente" ou "Agendado" para "Confirmado" quando o método de pagamento é Dinheiro
 * 3. Mantém "Aguardando Pagamento" quando método de pagamento é PIX
 *
 * Uso: node scripts/fix-booking-statuses.js
 */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function fixBookingStatuses() {
  console.log("🔄 Iniciando correção de status dos agendamentos...\n");

  try {
    // 1. Corrigir "aguardandopagamento" para "Aguardando Pagamento"
    // Buscar todos os agendamentos e filtrar no código
    const allBookings = await prisma.booking.findMany({
      select: {
        id: true,
        status: true,
      },
    });

    const waitingPaymentBookings = allBookings.filter(
      booking =>
        booking.status &&
        (booking.status.toLowerCase().includes("aguardandopagamento") ||
          booking.status === "AguardandoPagamento")
    );

    if (waitingPaymentBookings.length > 0) {
      console.log(
        `🔎 Encontrados ${waitingPaymentBookings.length} agendamentos com status incorreto "aguardandopagamento".`
      );

      for (const booking of waitingPaymentBookings) {
        await prisma.booking.update({
          where: { id: booking.id },
          data: { status: "Aguardando Pagamento" },
        });
        console.log(
          `  ✅ Agendamento ${booking.id} atualizado para "Aguardando Pagamento"`
        );
      }
    }

    // 2. Atualizar "Pendente" ou "Agendado" para "Confirmado" quando método de pagamento é Dinheiro
    const pendingCashBookings = await prisma.booking.findMany({
      where: {
        OR: [
          { status: { equals: "Pendente" } },
          { status: { equals: "Agendado" } },
          { status: { equals: "pending" } },
        ],
      },
      select: {
        id: true,
        status: true,
        paymentMethod: true,
      },
    });

    // Filtrar no código para case-insensitive
    const filteredPendingCash = pendingCashBookings.filter(
      booking =>
        booking.paymentMethod &&
        booking.paymentMethod.toLowerCase() === "dinheiro" &&
        booking.status &&
        (booking.status === "Pendente" ||
          booking.status === "Agendado" ||
          booking.status.toLowerCase() === "pending")
    );

    if (filteredPendingCash.length > 0) {
      console.log(
        `\n🔎 Encontrados ${filteredPendingCash.length} agendamentos "Pendente/Agendado" com pagamento em Dinheiro.`
      );

      for (const booking of filteredPendingCash) {
        await prisma.booking.update({
          where: { id: booking.id },
          data: { status: "Confirmado" },
        });
        console.log(
          `  ✅ Agendamento ${booking.id} atualizado para "Confirmado"`
        );
      }
    }

    // 3. Garantir que agendamentos com PIX e status incorreto sejam atualizados
    const pixBookingsRaw = await prisma.booking.findMany({
      where: {
        paymentMethod: {
          equals: "PIX",
        },
      },
      select: {
        id: true,
        status: true,
        paymentMethod: true,
      },
    });

    // Filtrar no código para case-insensitive e status incorreto
    const pixBookings = pixBookingsRaw.filter(
      booking =>
        booking.paymentMethod &&
        booking.paymentMethod.toLowerCase() === "pix" &&
        booking.status &&
        booking.status !== "Aguardando Pagamento"
    );

    if (pixBookings.length > 0) {
      console.log(
        `\n🔎 Encontrados ${pixBookings.length} agendamentos PIX com status incorreto.`
      );

      for (const booking of pixBookings) {
        // Só atualizar se não estiver cancelado ou concluído
        const status = (booking.status || "").toUpperCase();
        if (
          status !== "CANCELLED" &&
          status !== "CANCELADO" &&
          status !== "COMPLETED" &&
          status !== "CONCLUIDO"
        ) {
          await prisma.booking.update({
            where: { id: booking.id },
            data: { status: "Aguardando Pagamento" },
          });
          console.log(
            `  ✅ Agendamento ${booking.id} atualizado para "Aguardando Pagamento"`
          );
        }
      }
    }

    console.log("\n✅ Correção de status concluída.");
  } catch (error) {
    console.error("❌ Erro fatal no script de correção:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixBookingStatuses();
