import { NextRequest, NextResponse } from "next/server";
import { db } from "@/_lib/prisma";

// GET - Buscar todas as configurações de cores
export async function GET() {
  try {
    const colors = await db.colorConfig.findMany({
      orderBy: [
        { category: 'asc' },
        { order: 'asc' }
      ]
    });

    return NextResponse.json(colors);
  } catch (error) {
    console.error("Error fetching colors:", error);
    return NextResponse.json(
      { error: "Erro ao buscar configurações de cores" },
      { status: 500 }
    );
  }
}

// POST - Criar nova configuração de cor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category, value, description, order } = body;

    if (!name || !category || !value) {
      return NextResponse.json(
        { error: "Nome, categoria e valor são obrigatórios" },
        { status: 400 }
      );
    }

    const color = await db.colorConfig.create({
      data: {
        name,
        category,
        value,
        description,
        order: order || 1,
        isActive: true
      }
    });

    return NextResponse.json(color, { status: 201 });
  } catch (error) {
    console.error("Error creating color:", error);
    return NextResponse.json(
      { error: "Erro ao criar configuração de cor" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar configuração de cor
export async function PUT(request: NextRequest) {
  try {
    // Verificar se há conteúdo no body
    const contentLength = request.headers.get('content-length');
    if (!contentLength || contentLength === '0') {
      return NextResponse.json(
        { error: "Body da requisição está vazio" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { id, name, category, value, description, isActive, order } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID é obrigatório" },
        { status: 400 }
      );
    }

    const color = await db.colorConfig.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(category && { category }),
        ...(value && { value }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive }),
        ...(order !== undefined && { order })
      }
    });

    return NextResponse.json(color);
  } catch (error) {
    console.error("Error updating color:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar configuração de cor" },
      { status: 500 }
    );
  }
}

// DELETE - Deletar configuração de cor
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

    await db.colorConfig.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Configuração de cor deletada com sucesso" });
  } catch (error) {
    console.error("Error deleting color:", error);
    return NextResponse.json(
      { error: "Erro ao deletar configuração de cor" },
      { status: 500 }
    );
  }
}
