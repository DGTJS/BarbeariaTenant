import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/_providers/auth-options";
import { db } from "@/_lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Opcional: checar role admin se disponível em session.user.role
    // if (session.user.role !== 'Admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    // Buscar bookings com totalPrice <= 0 ou nulo
    const bookings = await db.booking.findMany({
      where: {
        OR: [{ totalPrice: null }, { totalPrice: { lte: 0 as any } }],
      },
      select: {
        id: true,
        serviceId: true,
      },
    });

    if (bookings.length === 0) {
      return NextResponse.json({ updated: 0 });
    }

    // Buscar preços das opções de serviço dos bookings
    // Preço é apenas das opções, não dos serviços
    let updated = 0;
    for (const b of bookings) {
      // Buscar a opção de serviço selecionada para este booking
      const serviceOptionBooking = await db.serviceOptionBooking.findFirst({
        where: { bookingId: b.id },
        include: {
          serviceOption: {
            select: { price: true },
          },
        },
      });

      const price = serviceOptionBooking?.serviceOption?.price
        ? Number(serviceOptionBooking.serviceOption.price)
        : 0;

      await db.booking.update({
        where: { id: b.id },
        data: { totalPrice: price },
      });
      updated++;
    }

    return NextResponse.json({ updated });
  } catch (error: any) {
    console.error("Erro ao backfill totalPrice:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao processar" },
      { status: 500 }
    );
  }
}
