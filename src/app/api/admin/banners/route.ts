import { NextRequest, NextResponse } from "next/server";
import { db } from "@/_lib/prisma";

export async function GET() {
  try {
    const banners = await db.banner.findMany({
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(banners);
  } catch (error) {
    console.error('Erro ao buscar banners:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar banners', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, subtitle, imageUrl, isActive, order } = body;

    if (!title || !subtitle || !imageUrl) {
      return NextResponse.json(
        { error: 'Título, subtítulo e imagem são obrigatórios' },
        { status: 400 }
      );
    }

    const banner = await db.banner.create({
      data: {
        title,
        subtitle,
        imageUrl,
        isActive: isActive ?? true,
        order: order ?? 1
      }
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.error('Erro ao criar banner:', error);
    return NextResponse.json(
      { error: 'Erro ao criar banner', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, subtitle, imageUrl, isActive, order } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID do banner é obrigatório' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (subtitle !== undefined) updateData.subtitle = subtitle;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (order !== undefined) updateData.order = order;

    const banner = await db.banner.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.error('Erro ao atualizar banner:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar banner', details: error instanceof Error ? error.message : 'Erro desconhecido' },
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
        { error: 'ID do banner é obrigatório' },
        { status: 400 }
      );
    }

    await db.banner.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Banner excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir banner:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir banner', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}

