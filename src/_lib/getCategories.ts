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
