import { NextRequest, NextResponse } from "next/server";
import { db } from "@/_lib/prisma";

export async function GET() {
  try {
    console.log('Iniciando busca de barbeiros...');
    
    const barbers = await db.barber.findMany({
      include: {
        categories: true,
        workingHours: {
          include: {
            pauses: true
          }
        },
        user: {
          select: {
            email: true,
            phone: true
          }
        }
      }
    });

    console.log('Barbeiros encontrados:', barbers.length);
    return NextResponse.json(barbers);
  } catch (error) {
    console.error('Erro ao buscar barbeiros:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar barbeiros', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, photo, specialties } = body;

    // Buscar uma barbearia
    const barberShop = await db.barberShop.findFirst();
    if (!barberShop) {
      return NextResponse.json(
        { error: 'Nenhuma barbearia encontrada' },
        { status: 400 }
      );
    }

    // Criar usuário
    const user = await db.user.create({
      data: {
        email,
        name,
        phone,
        role: 'Barbeiro'
      }
    });

    // Criar barbeiro
    const barber = await db.barber.create({
      data: {
        name,
        phone,
        photo: photo || "/logo.png",
        userId: user.id,
        barberShopId: barberShop.id,
        categories: {
          connect: specialties.map((id: string) => ({ id }))
        },
        workingHours: {
          create: [
            { weekday: 1, startTime: "09:00", endTime: "18:00" },
            { weekday: 2, startTime: "09:00", endTime: "18:00" },
            { weekday: 3, startTime: "09:00", endTime: "18:00" },
            { weekday: 4, startTime: "09:00", endTime: "18:00" },
            { weekday: 5, startTime: "09:00", endTime: "18:00" }
          ]
        }
      },
      include: {
        categories: true,
        workingHours: true,
        user: true
      }
    });

    return NextResponse.json(barber);
  } catch (error) {
    console.error('Erro ao criar barbeiro:', error);
    return NextResponse.json(
      { error: 'Erro ao criar barbeiro' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, phone, email, photo, specialties } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID do barbeiro é obrigatório' },
        { status: 400 }
      );
    }

    const barber = await db.barber.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!barber) {
      return NextResponse.json(
        { error: 'Barbeiro não encontrado' },
        { status: 404 }
      );
    }

    // Atualizar dados do barbeiro
    const updatedBarber = await db.barber.update({
      where: { id },
      data: {
        name,
        phone,
        photo: photo || barber.photo,
        user: {
          update: {
            email,
            name,
            phone
          }
        }
      }
    });

    // Atualizar categorias se fornecidas
    if (specialties) {
      await db.barber.update({
        where: { id },
        data: {
          categories: {
            set: specialties.map((categoryId: string) => ({ id: categoryId }))
          }
        }
      });
    }

    // Buscar barbeiro atualizado com relacionamentos
    const finalBarber = await db.barber.findUnique({
      where: { id },
      include: {
        categories: true,
        workingHours: {
          include: {
            pauses: true
          }
        },
        user: {
          select: {
            email: true,
            phone: true
          }
        }
      }
    });

    return NextResponse.json(finalBarber);
  } catch (error) {
    console.error('Erro ao atualizar barbeiro:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar barbeiro' },
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
        { error: 'ID do barbeiro é obrigatório' },
        { status: 400 }
      );
    }

    const barber = await db.barber.findUnique({
      where: { id },
      include: { 
        user: true,
        booking: true,
        priceAdjustment: true
      }
    });

    if (!barber) {
      return NextResponse.json(
        { error: 'Barbeiro não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se há agendamentos ativos
    const activeBookings = await db.booking.findMany({
      where: {
        barberId: id,
        status: {
          not: 'Cancelada'
        }
      }
    });

    if (activeBookings.length > 0) {
      return NextResponse.json(
        { error: 'Não é possível deletar barbeiro com agendamentos ativos. Cancele os agendamentos primeiro.' },
        { status: 400 }
      );
    }

    // Usar transação para garantir consistência
    await db.$transaction(async (tx) => {
      // Deletar ajustes de preço
      await tx.servicePriceAdjustment.deleteMany({
        where: { barberId: id }
      });

      // Deletar horários de trabalho e pausas
      const workingHours = await tx.barberWorkingHour.findMany({
        where: { barberId: id }
      });

      for (const workingHour of workingHours) {
        await tx.pause.deleteMany({
          where: { workingHourId: workingHour.id }
        });
      }

      await tx.barberWorkingHour.deleteMany({
        where: { barberId: id }
      });

      // Deletar relacionamentos com categorias
      await tx.barber.update({
        where: { id },
        data: {
          categories: {
            set: []
          }
        }
      });

      // Deletar barbeiro
      await tx.barber.delete({
        where: { id }
      });

      // Deletar usuário associado
      await tx.user.delete({
        where: { id: barber.userId }
      });
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Barbeiro deletado com sucesso' 
    });
  } catch (error) {
    console.error('Erro ao deletar barbeiro:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao deletar barbeiro', 
        details: error instanceof Error ? error.message : 'Erro desconhecido' 
      },
      { status: 500 }
    );
  }
}
