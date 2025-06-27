import { cache } from "react";
import { db } from "./prisma";
import { Decimal } from "@prisma/client/runtime/library";

function sanitizeDecimal(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(sanitizeDecimal);
  }
  if (obj instanceof Decimal) {
    return obj.toNumber();
  }
  if (obj !== null && typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const key in obj as Record<string, unknown>) {
      result[key] = sanitizeDecimal((obj as Record<string, unknown>)[key]);
    }
    return result;
  }
  return obj;
}

export const getServices = cache(async () => {
  const servicesRaw = await db.barberShopService.findMany({
    where: { status: true },
    include: {
      priceAdjustments: true,
      category: true,
    },
  });

  const barbers = await db.barber.findMany({
    include: {
      categories: true,
      workingHours: {
        include: {
          pauses: true, // Caso queira trazer pausas
        },
      },
    },
  });

  const services = servicesRaw.map((service) => {
    const barbersOfTheCategory = barbers.filter((barber) =>
      barber.categories.some((cat) => cat.id === service.categoryId),
    );

    // Sanitiza o serviço inteiro, incluindo price e priceAdjustments
    const sanitizedService = sanitizeDecimal(service) as typeof service & {
      price: number;
      priceAdjustments?: { priceAdjustment: number }[];
    };

    return {
      ...sanitizedService,
      barber: barbersOfTheCategory.map((barber) => ({
        id: barber.id,
        name: barber.name,
        imageUrl: barber.photo,
        categories: barber.categories.map((cat) => ({
          id: cat.id,
          name: cat.name,
          IconUrl: cat.IconUrl,
        })),
        workingHours: (barber.workingHours ?? []).map((wh) => ({
          weekday: wh.weekday,
          startTime: wh.startTime,
          endTime: wh.endTime,
          pauses: (wh.pauses ?? []).map((pause) => ({
            startTime: pause.startTime,
            endTime: pause.endTime,
          })),
        })),
      })),
    };
  });

  return services;
});
