import { NextResponse } from "next/server";
import { db } from "@/_lib/prisma";

// GET - Buscar todas as cores ativas organizadas por categoria
export async function GET() {
  try {
    const colors = await db.colorConfig.findMany({
      where: {
        isActive: true
      },
      orderBy: [
        { category: 'asc' },
        { order: 'asc' }
      ]
    });

    // Organizar cores por categoria
    const colorsByCategory = colors.reduce((acc, color) => {
      if (!acc[color.category]) {
        acc[color.category] = {};
      }
      acc[color.category][color.name] = color.value;
      return acc;
    }, {} as Record<string, Record<string, string>>);

    return NextResponse.json(colorsByCategory);
  } catch (error) {
    console.error("Error fetching active colors:", error);
    return NextResponse.json(
      { error: "Erro ao buscar cores ativas" },
      { status: 500 }
    );
  }
}

