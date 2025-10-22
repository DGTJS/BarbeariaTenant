// @/lib/getCategories.ts
import { cache } from "react";
import { db } from "./prisma";

export const getCategories = cache(async () => {
  const categories = await db.barberCategory.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Deduplica por nome, mantendo a mais recente (devido ao orderBy desc)
  const uniqueByName = new Map<string, (typeof categories)[number]>();
  for (const category of categories) {
    if (!uniqueByName.has(category.name)) {
      uniqueByName.set(category.name, category);
    }
  }

  return Array.from(uniqueByName.values());
});

export const getCategoriesId = cache(async (id: string) => {
  return db.barberCategory.findMany({
    where: { id },
  });
});

export const getCategoriesFromBarberShop = async (barberShopId: string) => {
  const services = await db.barberShopService.findMany({
    where: { barberShopId, status: true },
    include: {
      category: true,
    },
  });

  const uniqueCategoriesMap = new Map();

  for (const service of services) {
    if (service.category) {
      uniqueCategoriesMap.set(service.category.id, service.category);
    }
  }

  return Array.from(uniqueCategoriesMap.values());
};

export const getBarberFromBarberShop = async (barberShopId: string) => {
  const barbers = await db.barber.findMany({
    where: { barberShopId },
  });

  // Buscar avaliações para cada barbeiro individualmente
  const reviewsMap = new Map();
  
  for (const barber of barbers) {
    const reviews = await db.booking.aggregate({
      where: {
        barberId: barber.id,
        rating: {
          not: null,
        },
      },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });
    
    reviewsMap.set(barber.id, {
      average: reviews._avg.rating || 0,
      count: reviews._count.rating || 0,
    });
  }

  // Adicionar avaliações aos barbeiros
  return barbers.map((barber: any) => {
    const review = reviewsMap.get(barber.id);
    return {
      ...barber,
      averageRating: review?.average ? Math.min(review.average, 5) : null,
      totalReviews: review?.count || 0,
    };
  });
};
