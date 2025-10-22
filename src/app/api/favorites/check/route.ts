import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/_providers/auth-options";
import { db } from "@/_lib/prisma";

// GET - Verificar se um barbeiro é favorito
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ isFavorite: false });
    }

    const { searchParams } = new URL(request.url);
    const barberId = searchParams.get("barberId");

    if (!barberId) {
      return NextResponse.json({ error: "ID do barbeiro é obrigatório" }, { status: 400 });
    }

    const favorite = await db.$queryRaw`
      SELECT * FROM favorite_barbers 
      WHERE "userId" = ${session.user.id} AND "barberId" = ${barberId}
    `;

    return NextResponse.json({ isFavorite: Array.isArray(favorite) && favorite.length > 0 });
  } catch (error) {
    console.error("Erro ao verificar favorito:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
