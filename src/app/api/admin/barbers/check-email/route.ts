import { NextRequest, NextResponse } from "next/server";
import { db } from "@/_lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email é obrigatório" },
        { status: 400 }
      );
    }

    // Verificar se email já existe em usuários
    const existingUser = await db.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    });

    // Verificar se email já existe em barbeiros
    const existingBarber = await db.barber.findUnique({
      where: { email },
      select: { id: true, email: true },
    });

    const exists = !!(existingUser || existingBarber);

    return NextResponse.json({
      exists,
      available: !exists,
    });
  } catch (error) {
    console.error("Erro ao verificar email:", error);
    return NextResponse.json(
      {
        error: "Erro ao verificar email",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
