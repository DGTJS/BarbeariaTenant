// @/lib/getCategories.ts
import { cache } from "react";
import { db } from "./prisma";

export const getCategories = cache(async () => {
  return db.barberCategory.findMany();
});
