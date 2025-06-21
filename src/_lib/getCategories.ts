// @/lib/getCategories.ts
import { cache } from "react";
import { db } from "./prisma";

export const getCategories = cache(async () => {
  return db.barberCategory.findMany();
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
