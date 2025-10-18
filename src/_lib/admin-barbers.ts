import { db } from "./prisma";

export async function getBarbers() {
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
    return barbers;
  } catch (error) {
    console.error('Erro ao buscar barbeiros:', error);
    return [];
  }
}

export async function getBarberById(id: string) {
  try {
    const barber = await db.barber.findUnique({
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
    return barber;
  } catch (error) {
    console.error('Erro ao buscar barbeiro:', error);
    return null;
  }
}

export async function createBarber(data: {
  name: string;
  phone: string;
  email: string;
  photo: string;
  barberShopId: string;
  categoryIds: string[];
  workingHours: {
    weekday: number;
    startTime: string;
    endTime: string;
  }[];
}) {
  try {
    // Primeiro, criar o usuário
    const user = await db.user.create({
      data: {
        email: data.email,
        name: data.name,
        phone: data.phone,
        role: 'Barbeiro'
      }
    });

    // Depois, criar o barbeiro
    const barber = await db.barber.create({
      data: {
        name: data.name,
        phone: data.phone,
        photo: data.photo,
        userId: user.id,
        barberShopId: data.barberShopId,
        categories: {
          connect: data.categoryIds.map(id => ({ id }))
        },
        workingHours: {
          create: data.workingHours.map(wh => ({
            weekday: wh.weekday,
            startTime: wh.startTime,
            endTime: wh.endTime
          }))
        }
      },
      include: {
        categories: true,
        workingHours: true,
        user: true
      }
    });

    return barber;
  } catch (error) {
    console.error('Erro ao criar barbeiro:', error);
    throw error;
  }
}

export async function updateBarber(id: string, data: {
  name?: string;
  phone?: string;
  email?: string;
  photo?: string;
  categoryIds?: string[];
  workingHours?: {
    weekday: number;
    startTime: string;
    endTime: string;
  }[];
}) {
  try {
    const barber = await db.barber.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!barber) {
      throw new Error('Barbeiro não encontrado');
    }

    // Atualizar dados do barbeiro
    const updatedBarber = await db.barber.update({
      where: { id },
      data: {
        name: data.name,
        phone: data.phone,
        photo: data.photo,
        user: {
          update: {
            email: data.email,
            name: data.name,
            phone: data.phone
          }
        }
      }
    });

    // Atualizar categorias se fornecidas
    if (data.categoryIds) {
      await db.barber.update({
        where: { id },
        data: {
          categories: {
            set: data.categoryIds.map(categoryId => ({ id: categoryId }))
          }
        }
      });
    }

    // Atualizar horários de trabalho se fornecidos
    if (data.workingHours) {
      // Deletar horários existentes
      await db.barberWorkingHour.deleteMany({
        where: { barberId: id }
      });

      // Criar novos horários
      await db.barberWorkingHour.createMany({
        data: data.workingHours.map(wh => ({
          barberId: id,
          weekday: wh.weekday,
          startTime: wh.startTime,
          endTime: wh.endTime
        }))
      });
    }

    return updatedBarber;
  } catch (error) {
    console.error('Erro ao atualizar barbeiro:', error);
    throw error;
  }
}

export async function deleteBarber(id: string) {
  try {
    const barber = await db.barber.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!barber) {
      throw new Error('Barbeiro não encontrado');
    }

    // Deletar barbeiro (cascade deletará workingHours)
    await db.barber.delete({
      where: { id }
    });

    // Deletar usuário associado
    await db.user.delete({
      where: { id: barber.userId }
    });

    return true;
  } catch (error) {
    console.error('Erro ao deletar barbeiro:', error);
    throw error;
  }
}

export async function getBarberCategories() {
  try {
    const categories = await db.barberCategory.findMany({
      orderBy: { name: 'asc' }
    });
    return categories;
  } catch (error) {
    console.error('Erro ao buscar categorias de barbeiros:', error);
    return [];
  }
}
