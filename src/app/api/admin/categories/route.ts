import { NextResponse } from "next/server";
import { db } from "@/_lib/prisma";

export async function GET() {
  try {
    const categories = await db.barberCategory.findMany({
      orderBy: {
        name: 'asc'
      },
      include: {
        _count: {
          select: { services: true }
        }
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    return NextResponse.json(
      { error: "Erro ao buscar categorias" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const category = await db.barberCategory.create({
      data: {
        name: data.name,
        IconUrl: data.iconUrl || '/icons/default.svg',
        description: data.description
      }
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    return NextResponse.json(
      { error: "Erro ao criar categoria" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    
    const category = await db.barberCategory.update({
      where: { id: data.id },
      data: {
        name: data.name,
        IconUrl: data.iconUrl,
        description: data.description
      }
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar categoria" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID não fornecido" },
        { status: 400 }
      );
    }

    await db.barberCategory.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar categoria:", error);
    return NextResponse.json(
      { error: "Erro ao deletar categoria" },
      { status: 500 }
    );
  }
}
