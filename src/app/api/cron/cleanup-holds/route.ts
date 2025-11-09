import { NextResponse } from "next/server";
import { db } from "@/_lib/prisma";

/**
 * GET /api/cron/cleanup-holds
 * Remove holds expirados do banco de dados
 * 
 * Este endpoint deve ser chamado periodicamente (ex: a cada minuto)
 * Configure no Vercel Cron ou similar
 */
export async function GET() {
  try {
    const now = new Date();

    // Deletar holds expirados
    const result = await db.appointmentHold.deleteMany({
      where: {
        expiresAt: {
          lt: now
        }
      }
    });

    console.log(`[CLEANUP] ${result.count} holds expirados removidos`);

    return NextResponse.json({
      success: true,
      deletedCount: result.count,
      timestamp: now.toISOString()
    });
  } catch (error: any) {
    console.error("Erro ao limpar holds:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao limpar holds" },
      { status: 500 }
    );
  }
}

