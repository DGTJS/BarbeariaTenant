import { NextResponse } from "next/server";
import { db } from "@/_lib/prisma";

export async function GET() {
  try {
    const services = await db.barberShopService.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
            IconUrl: true
          }
        },
        serviceOptions: {
          where: { status: true },
          orderBy: { name: 'asc' }
        },
        _count: {
          select: { serviceOptions: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error("Erro ao buscar serviços:", error);
    return NextResponse.json(
      { error: "Erro ao buscar serviços" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Buscar a primeira barbearia (sistema unificado)
    const barberShop = await db.barberShop.findFirst();
    
    if (!barberShop) {
      return NextResponse.json(
        { error: "Nenhuma barbearia encontrada" },
        { status: 404 }
      );
    }

    const service = await db.barberShopService.create({
      data: {
        barberShopId: barberShop.id,
        name: data.name,
        description: data.description,
        price: data.price,
        duration: data.duration,
        imageUrl: data.imageUrl || '/icons/default.svg',
        categoryId: data.categoryId,
        status: data.status ?? true
      },
      include: {
        category: true,
        serviceOptions: true
      }
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error("Erro ao criar serviço:", error);
    return NextResponse.json(
      { error: "Erro ao criar serviço" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    
    const service = await db.barberShopService.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        duration: data.duration,
        imageUrl: data.imageUrl,
        categoryId: data.categoryId,
        status: data.status
      },
      include: {
        category: true,
        serviceOptions: true
      }
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error("Erro ao atualizar serviço:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar serviço" },
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

    // Verificar se existem bookings vinculados
    const bookingsCount = await db.booking.count({
      where: { serviceId: id }
    });

    if (bookingsCount > 0) {
      return NextResponse.json(
        { 
          error: `Não é possível excluir este serviço. Existem ${bookingsCount} agendamento(s) vinculado(s). Desative o serviço ao invés de excluí-lo.` 
        },
        { status: 400 }
      );
    }

    // Deletar opções de serviço relacionadas
    await db.serviceOption.deleteMany({
      where: { serviceId: id }
    });

    // Deletar o serviço
    await db.barberShopService.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar serviço:", error);
    return NextResponse.json(
      { error: "Erro ao deletar serviço" },
      { status: 500 }
    );
  }
}


