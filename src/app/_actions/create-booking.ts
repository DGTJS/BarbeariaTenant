"use server";
import { db } from "@/_lib/prisma";

interface createBookingParams {
  userId: string;
  dateTime: Date;
  serviceId: string;
  barberId: string;
  status: string;
}

export const createBooking = async (params: createBookingParams) => {
  await db.booking.create({
    data: params,
  });
};
