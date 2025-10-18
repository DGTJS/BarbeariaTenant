import { NextRequest, NextResponse } from "next/server";
import { db } from "@/_lib/prisma";

export async function GET() {
  try {
    const categories = await db.barberCategory.findMany({
      orderBy: { name: 'asc' }
    });

    // Remover duplicatas baseado no nome
    const uniqueCategories = categories.filter((category, index, self) => 
      index === self.findIndex(c => c.name === category.name)
    );

    return NextResponse.json(uniqueCategories);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar categorias' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, iconUrl, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Nome da categoria é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se já existe uma categoria com o mesmo nome
    const existingCategory = await db.barberCategory.findFirst({
      where: { name }
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Já existe uma categoria com este nome' },
        { status: 400 }
      );
    }

    const category = await db.barberCategory.create({
      data: {
        name,
        IconUrl: iconUrl || "/IconCategorycabelo.svg",
        description: description || null
      }
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    return NextResponse.json(
      { error: 'Erro ao criar categoria' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, iconUrl, description } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID da categoria é obrigatório' },
        { status: 400 }
      );
    }

    const category = await db.barberCategory.findUnique({
      where: { id }
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 404 }
      );
    }

    const updatedCategory = await db.barberCategory.update({
      where: { id },
      data: {
        name: name || category.name,
        IconUrl: iconUrl || category.IconUrl,
        description: description !== undefined ? description : category.description
      }
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar categoria' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID da categoria é obrigatório' },
        { status: 400 }
      );
    }

    const category = await db.barberCategory.findUnique({
      where: { id }
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 404 }
      );
    }

    // Verificar se há barbeiros usando esta categoria
    const barbersUsingCategory = await db.barber.findMany({
      where: {
        categories: {
          some: { id }
        }
      }
    });

    if (barbersUsingCategory.length > 0) {
      return NextResponse.json(
        { error: 'Não é possível deletar categoria que está sendo usada por barbeiros' },
        { status: 400 }
      );
    }

    await db.barberCategory.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar categoria' },
      { status: 500 }
    );
  }
}