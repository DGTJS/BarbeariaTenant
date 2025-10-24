import { NextResponse } from "next/server";
import { db } from "@/_lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get("serviceId");

    if (serviceId) {
      // Buscar opções de um serviço específico
      const options = await db.serviceOption.findMany({
        where: { serviceId },
        orderBy: { name: 'asc' }
      });
      return NextResponse.json(options);
    }

    // Buscar todas as opções
    const options = await db.serviceOption.findMany({
      include: {
        service: {
          select: { name: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(options);
  } catch (error) {
    console.error("Erro ao buscar opções:", error);
    return NextResponse.json(
      { error: "Erro ao buscar opções" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const option = await db.serviceOption.create({
      data: {
        serviceId: data.serviceId,
        name: data.name,
        description: data.description,
        price: data.price,
        duration: data.duration,
        status: data.status ?? true
      }
    });

    return NextResponse.json(option);
  } catch (error) {
    console.error("Erro ao criar opção:", error);
    return NextResponse.json(
      { error: "Erro ao criar opção" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    
    const option = await db.serviceOption.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        duration: data.duration,
        status: data.status
      }
    });

    return NextResponse.json(option);
  } catch (error) {
    console.error("Erro ao atualizar opção:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar opção" },
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

    await db.serviceOption.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar opção:", error);
    return NextResponse.json(
      { error: "Erro ao deletar opção" },
      { status: 500 }
    );
  }
}


