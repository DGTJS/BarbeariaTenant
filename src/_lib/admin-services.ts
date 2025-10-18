import { db } from "./prisma";

export async function getServices() {
  try {
    const services = await db.barberShopService.findMany({
      include: {
        category: true,
        priceAdjustments: {
          include: {
            barber: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });
    return services;
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    return [];
  }
}

export async function getServiceById(id: string) {
  try {
    const service = await db.barberShopService.findUnique({
      where: { id },
      include: {
        category: true,
        priceAdjustments: {
          include: {
            barber: true
          }
        }
      }
    });
    return service;
  } catch (error) {
    console.error('Erro ao buscar serviço:', error);
    return null;
  }
}

export async function createService(data: {
  name: string;
  description: string;
  price: number;
  duration: number;
  imageUrl: string;
  barberShopId: string;
  categoryId?: string;
}) {
  try {
    const service = await db.barberShopService.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        duration: data.duration,
        imageUrl: data.imageUrl,
        barberShopId: data.barberShopId,
        categoryId: data.categoryId
      },
      include: {
        category: true
      }
    });
    return service;
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    throw error;
  }
}

export async function updateService(id: string, data: {
  name?: string;
  description?: string;
  price?: number;
  duration?: number;
  imageUrl?: string;
  categoryId?: string;
  status?: boolean;
}) {
  try {
    const service = await db.barberShopService.update({
      where: { id },
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
        category: true
      }
    });
    return service;
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error);
    throw error;
  }
}

export async function deleteService(id: string) {
  try {
    await db.barberShopService.delete({
      where: { id }
    });
    return true;
  } catch (error) {
    console.error('Erro ao deletar serviço:', error);
    throw error;
  }
}

export async function toggleServiceStatus(id: string) {
  try {
    const service = await db.barberShopService.findUnique({
      where: { id }
    });
    
    if (!service) {
      throw new Error('Serviço não encontrado');
    }
    
    const updatedService = await db.barberShopService.update({
      where: { id },
      data: { status: !service.status }
    });
    
    return updatedService;
  } catch (error) {
    console.error('Erro ao alterar status do serviço:', error);
    throw error;
  }
}

export async function getServiceCategories() {
  try {
    const categories = await db.barberCategory.findMany({
      orderBy: { name: 'asc' }
    });
    return categories;
  } catch (error) {
    console.error('Erro ao buscar categorias de serviços:', error);
    return [];
  }
}

export async function getServiceStats() {
  try {
    const totalServices = await db.barberShopService.count();
    const activeServices = await db.barberShopService.count({
      where: { status: true }
    });
    
    const avgPriceResult = await db.barberShopService.aggregate({
      _avg: {
        price: true
      }
    });
    
    const avgDurationResult = await db.barberShopService.aggregate({
      _avg: {
        duration: true
      }
    });
    
    return {
      totalServices,
      activeServices,
      averagePrice: avgPriceResult._avg.price || 0,
      averageDuration: avgDurationResult._avg.duration || 0
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas dos serviços:', error);
    return {
      totalServices: 0,
      activeServices: 0,
      averagePrice: 0,
      averageDuration: 0
    };
  }
}
