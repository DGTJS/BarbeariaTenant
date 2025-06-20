// @/lib/getCategories.ts
import { cache } from "react";
import { db } from "./prisma";

export const getBarberShops = cache(async () => {
  return db.barberShop.findMany();
});

export const getBarberShopsId = cache(async (id: string) => {
  return db.barberShop.findUnique({
    where: { id },
  });
});
