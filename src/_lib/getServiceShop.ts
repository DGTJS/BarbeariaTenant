import { cache } from "react";
import { db } from "./prisma";

export const getServiceBarberShop = cache(async (id: string) => {
  return db.barberShopService.findMany({
    where: { barberShopId: id, status: true },
  });
});
