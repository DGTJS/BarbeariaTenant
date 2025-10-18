"use server";
import { db } from "@/_lib/prisma";

interface createBookingParams {
  userId: string;
  serviceId: string;
  barberId: string;
  dateTime: Date;
  status: string;
  comment?: string;
}

export const createBooking = async (params: createBookingParams) => {
  try {
    const booking = await db.booking.create({
      data: {
        userId: params.userId,
        serviceId: params.serviceId,
        barberId: params.barberId,
        dateTime: params.dateTime,
        status: params.status,
        comment: params.comment || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            duration: true,
          },
        },
        barber: {
          select: {
            id: true,
            name: true,
            photo: true,
          },
        },
      },
    });
    
    return booking;
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    throw new Error("Erro ao criar agendamento");
  }
};
