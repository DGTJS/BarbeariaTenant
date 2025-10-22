import { NextRequest, NextResponse } from "next/server";
import { db } from "@/_lib/prisma";

// GET - Buscar todos os temas
export async function GET() {
  try {
    const themes = await db.theme.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(themes);
  } catch (error) {
    console.error("Error fetching themes:", error);
    return NextResponse.json(
      { error: "Erro ao buscar temas" },
      { status: 500 }
    );
  }
}

// POST - Criar novo tema
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, type, colors } = body;

    if (!name || !type || !colors) {
      return NextResponse.json(
        { error: "Nome, tipo e cores são obrigatórios" },
        { status: 400 }
      );
    }

    const newTheme = await db.theme.create({
      data: {
        name,
        description,
        type,
        colors,
      },
    });

    return NextResponse.json(newTheme, { status: 201 });
  } catch (error) {
    console.error("Error creating theme:", error);
    return NextResponse.json(
      { error: "Erro ao criar tema" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar tema
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, description, type, colors, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID é obrigatório" },
        { status: 400 }
      );
    }

    // Se está ativando um tema, desativar todos os outros
    if (isActive) {
      await db.theme.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    const updatedTheme = await db.theme.update({
      where: { id },
      data: {
        name,
        description,
        type,
        colors,
        isActive,
      },
    });

    return NextResponse.json(updatedTheme);
  } catch (error) {
    console.error("Error updating theme:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar tema" },
      { status: 500 }
    );
  }
}

// DELETE - Deletar tema
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID é obrigatório" },
        { status: 400 }
      );
    }

    await db.theme.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Tema deletado com sucesso" });
  } catch (error) {
    console.error("Error deleting theme:", error);
    return NextResponse.json(
      { error: "Erro ao deletar tema" },
      { status: 500 }
    );
  }
}





