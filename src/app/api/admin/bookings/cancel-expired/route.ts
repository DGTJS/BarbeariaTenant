import { NextRequest, NextResponse } from "next/server";
;
import { requireAdmin } from "@/_lib/admin-auth";
import { getSession } from "@/_lib/auth";
import { db } from "@/_lib/prisma";

/**
 * POST /api/admin/bookings/cancel-expired
 * GET /api/admin/bookings/cancel-expired
 * Cancela automaticamente agendamentos que expiraram
 * Pode ser chamado por um cron job ou manualmente
 * Se chamado por cron, não precisa de autenticação (verifica header X-Cron-Secret)
 *
 * IMPORTANTE: Agendamentos são cancelados automaticamente APENAS se:
 * - Status é "Aguardando Pagamento" E foi criado há mais de 1 hora (independente de dateTime)
 *
 * NÃO cancela agendamentos "Confirmado" mesmo que dateTime tenha passado
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar se é chamada do cron (Vercel envia um header especial)
    const cronSecret = request.headers.get("x-cron-secret");
    const isVercelCron =
      request.headers.get("user-agent")?.includes("vercel") ||
      cronSecret === process.env.CRON_SECRET;

    // Obter banco do tenant correto
    // Usando banco único
    const hostname = request.headers.get("host") || "";
    console.log(
      `🔍 [CANCEL-EXPIRED] Verificando agendamentos expirados no tenant: ${hostname}`
    );

    // Se não for cron, exigir autenticação
    if (!isVercelCron) {
      const session = await getSession(request);
      await requireAdmin(session, request);
    }

    const now = new Date();
    // Verificar agendamentos expirados baseado em paymentExpiresAt se disponível, senão usar createdAt
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // Buscar APENAS agendamentos "Aguardando Pagamento" que expiraram
    // NOTA: Como o banco é MySQL, vamos buscar todos e filtrar em memória para evitar problemas com case-insensitive
    const allBookings = await db.booking.findMany({
      where: {
        OR: [
          // Agendamentos com paymentExpiresAt que já passou
          {
            paymentExpiresAt: {
              lte: now,
            },
          },
          // Agendamentos criados há mais de 1 hora (fallback se não tiver paymentExpiresAt)
          {
            createdAt: {
              lte: oneHourAgo,
            },
          },
        ],
      },
      select: {
        id: true,
        dateTime: true,
        totalPrice: true,
        createdAt: true,
        paymentExpiresAt: true,
        status: true,
      },
    });

    // Filtrar em memória para case-insensitive
    const expiredBookings = allBookings.filter((booking: any) => {
      const status = (booking.status || "").toLowerCase();
      const isCancelledOrCompleted =
        status.includes("cancelado") ||
        status.includes("cancel") ||
        status.includes("concluído") ||
        status.includes("completed");

      // Se já está cancelado/concluído, não incluir
      if (isCancelledOrCompleted) {
        return false;
      }

      // APENAS cancelar "Aguardando Pagamento" que foi criado há mais de 1 hora
      const isWaitingPayment =
        status.includes("aguardando") && status.includes("pagamento");

      if (isWaitingPayment) {
        // Se tem paymentExpiresAt e já passou, cancelar
        if (
          booking.paymentExpiresAt &&
          new Date(booking.paymentExpiresAt) <= now
        ) {
          return true;
        }
        // Se não tem paymentExpiresAt mas foi criado há mais de 1 hora, cancelar
        if (!booking.paymentExpiresAt && booking.createdAt <= oneHourAgo) {
          return true;
        }
      }

      // NÃO cancelar outros status (Confirmado, etc) mesmo que dateTime tenha passado
      return false;
    });

    if (expiredBookings.length === 0) {
      return NextResponse.json({
        message: "Nenhum agendamento expirado encontrado",
        cancelled: 0,
      });
    }

    // Cancelar agendamentos expirados
    const result = await db.booking.updateMany({
      where: {
        id: {
          in: expiredBookings.map((b: any) => b.id),
        },
      },
      data: {
        status: "Cancelado",
      },
    });

    console.log(
      `✅ [CANCEL-EXPIRED] ${result.count} agendamento(s) cancelado(s) automaticamente`,
      {
        totalFound: expiredBookings.length,
        cancelled: result.count,
        timestamp: now.toISOString(),
        expiredBookings: expiredBookings.map((b: any) => ({
          id: b.id,
          status: b.status,
          dateTime: b.dateTime,
          paymentExpiresAt: b.paymentExpiresAt,
          createdAt: b.createdAt,
        })),
      }
    );

    return NextResponse.json({
      message: `${result.count} agendamento(s) cancelado(s) automaticamente`,
      cancelled: result.count,
      expiredBookings: expiredBookings.map((b: any) => ({
        id: b.id,
        dateTime: b.dateTime,
        totalPrice: Number(b.totalPrice),
        status: b.status,
      })),
    });
  } catch (error) {
    console.error("Erro ao cancelar agendamentos expirados:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao cancelar agendamentos expirados",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/bookings/cancel-expired
 * Verifica quantos agendamentos estão expirados (sem cancelar)
 * Também pode ser usado pelo cron job da Vercel (que usa GET)
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar se é chamada do cron (Vercel envia um header especial)
    const cronSecret = request.headers.get("x-cron-secret");
    const isVercelCron =
      request.headers.get("user-agent")?.includes("vercel") ||
      cronSecret === process.env.CRON_SECRET;

    // Obter banco do tenant correto
    // Usando banco único
    const hostname = request.headers.get("host") || "";
    console.log(
      `🔍 [CANCEL-EXPIRED-GET] Verificando agendamentos expirados no tenant: ${hostname}`
    );

    // Se não for cron, exigir autenticação
    if (!isVercelCron) {
      const session = await getSession(request);
      await requireAdmin(session, request);
    }

    const now = new Date();
    // Verificar agendamentos expirados baseado em paymentExpiresAt se disponível, senão usar createdAt
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // Se for cron, cancelar automaticamente (mesmo comportamento do POST)
    if (isVercelCron) {
      const allBookings = await db.booking.findMany({
        where: {
          OR: [
            // Agendamentos com paymentExpiresAt que já passou
            {
              paymentExpiresAt: {
                lte: now,
              },
            },
            // Agendamentos criados há mais de 1 hora (fallback se não tiver paymentExpiresAt)
            {
              createdAt: {
                lte: oneHourAgo,
              },
            },
          ],
        },
        select: {
          id: true,
          dateTime: true,
          totalPrice: true,
          createdAt: true,
          paymentExpiresAt: true,
          status: true,
        },
      });

      const expiredBookings = allBookings.filter((booking: any) => {
        const status = (booking.status || "").toLowerCase();
        const isCancelledOrCompleted =
          status.includes("cancelado") ||
          status.includes("cancel") ||
          status.includes("concluído") ||
          status.includes("completed");

        if (isCancelledOrCompleted) {
          return false;
        }

        // APENAS cancelar "Aguardando Pagamento" que foi criado há mais de 1 hora
        const isWaitingPayment =
          status.includes("aguardando") && status.includes("pagamento");

        if (isWaitingPayment) {
          // Se tem paymentExpiresAt e já passou, cancelar
          if (
            booking.paymentExpiresAt &&
            new Date(booking.paymentExpiresAt) <= now
          ) {
            return true;
          }
          // Se não tem paymentExpiresAt mas foi criado há mais de 1 hora, cancelar
          if (!booking.paymentExpiresAt && booking.createdAt <= oneHourAgo) {
            return true;
          }
        }

        // NÃO cancelar outros status (Confirmado, etc) mesmo que dateTime tenha passado
        return false;
      });

      if (expiredBookings.length > 0) {
        const result = await db.booking.updateMany({
          where: {
            id: {
              in: expiredBookings.map((b: any) => b.id),
            },
          },
          data: {
            status: "Cancelado",
          },
        });

        console.log(
          `✅ [CANCEL-EXPIRED-GET] ${result.count} agendamento(s) cancelado(s) automaticamente`,
          {
            totalFound: expiredBookings.length,
            cancelled: result.count,
            timestamp: now.toISOString(),
          }
        );

        return NextResponse.json({
          message: `${result.count} agendamento(s) cancelado(s) automaticamente`,
          cancelled: result.count,
          expiredBookings: expiredBookings.map((b: any) => ({
            id: b.id,
            dateTime: b.dateTime,
            totalPrice: Number(b.totalPrice),
            createdAt: b.createdAt,
            paymentExpiresAt: b.paymentExpiresAt,
            status: b.status,
          })),
        });
      }
    }

    // Se não for cron ou não houver expirados, apenas retornar contagem
    const allBookingsForCount = await db.booking.findMany({
      where: {
        OR: [
          // Agendamentos com paymentExpiresAt que já passou
          {
            paymentExpiresAt: {
              lte: now,
            },
          },
          // Agendamentos criados há mais de 1 hora (fallback se não tiver paymentExpiresAt)
          {
            createdAt: {
              lte: oneHourAgo,
            },
          },
        ],
      },
      select: {
        id: true,
        dateTime: true,
        totalPrice: true,
        createdAt: true,
        paymentExpiresAt: true,
        status: true,
      },
    });

    const expiredBookingsForCount = allBookingsForCount.filter(
      (booking: any) => {
        const status = (booking.status || "").toLowerCase();
        const isCancelledOrCompleted =
          status.includes("cancelado") ||
          status.includes("cancel") ||
          status.includes("concluído") ||
          status.includes("completed");

        if (isCancelledOrCompleted) {
          return false;
        }

        // APENAS cancelar "Aguardando Pagamento" que foi criado há mais de 1 hora
        const isWaitingPayment =
          status.includes("aguardando") && status.includes("pagamento");

        if (isWaitingPayment) {
          // Se tem paymentExpiresAt e já passou, cancelar
          if (
            booking.paymentExpiresAt &&
            new Date(booking.paymentExpiresAt) <= now
          ) {
            return true;
          }
          // Se não tem paymentExpiresAt mas foi criado há mais de 1 hora, cancelar
          if (!booking.paymentExpiresAt && booking.createdAt <= oneHourAgo) {
            return true;
          }
        }

        // NÃO cancelar outros status (Confirmado, etc) mesmo que dateTime tenha passado
        return false;
      }
    );

    return NextResponse.json({
      count: expiredBookingsForCount.length,
      expiredBookings: expiredBookingsForCount.map((b: any) => ({
        id: b.id,
        dateTime: b.dateTime,
        totalPrice: Number(b.totalPrice),
        createdAt: b.createdAt,
        paymentExpiresAt: b.paymentExpiresAt,
        status: b.status,
      })),
    });
  } catch (error) {
    console.error("Erro ao verificar agendamentos expirados:", error);
    return NextResponse.json(
      { error: "Erro ao verificar agendamentos expirados" },
      { status: 500 }
    );
  }
}
