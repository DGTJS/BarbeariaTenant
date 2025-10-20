import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "@/_lib/prisma";

// GET - Buscar histórico de agendamentos do usuário
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    console.log("Buscando histórico para usuário:", session.user.id);
    
    const bookings = await db.$queryRaw`
      SELECT 
        b.id,
        b."dateTime",
        b.status,
        b.comment,
        b.rating,
        b."createdAt",
        b."updatedAt",
        s.name as "serviceName",
        s.description as "serviceDescription",
        s.price as "servicePrice",
        s.duration as "serviceDuration",
        barber.name as "barberName",
        barber.photo as "barberPhoto",
        barber.phone as "barberPhone",
        bs.name as "barberShopName",
        bs.address as "barberShopAddress"
      FROM booking b
      JOIN "BarberShopService" s ON b."serviceId" = s.id
      JOIN barber ON b."barberId" = barber.id
      LEFT JOIN "BarberShop" bs ON barber."barberShopId" = bs.id
      WHERE b."userId" = ${session.user.id}
      ORDER BY b."dateTime" DESC
    ` as any[];

    console.log("Agendamentos encontrados:", bookings.length);

    // Transformar dados para o formato esperado
    const formattedBookings = bookings.map(booking => ({
      id: booking.id,
      dateTime: booking.dateTime,
      status: booking.status,
      comment: booking.comment,
      rating: booking.rating,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      service: {
        id: booking.serviceId,
        name: booking.serviceName,
        description: booking.serviceDescription,
        price: booking.servicePrice,
        duration: booking.serviceDuration,
      },
      barber: {
        id: booking.barberId,
        name: booking.barberName,
        photo: booking.barberPhoto,
        phone: booking.barberPhone,
        barberShop: {
          name: booking.barberShopName,
          address: booking.barberShopAddress,
        },
      },
    }));

    return NextResponse.json(formattedBookings);
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
