import { NextRequest, NextResponse } from "next/server";
;
import { requireAdminOnly } from "@/_lib/admin-auth";
import { db } from "@/_lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // CRÍTICO: Verificar permissão usando sistema customizado
    try {
      await requireAdminOnly(null, request);
    } catch (error) {
      return NextResponse.json(
        {
          message: error instanceof Error ? error.message : "Unauthorized",
        },
        { status: 403 }
      );
    }

    // CRÍTICO: Obter banco do tenant correto
    // Usando banco único
    const hostname = request.headers.get("host") || "";
    console.log(`🔍 [ADMIN-CLIENTS-GET] Buscando clientes no tenant: ${hostname}`);

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const hasBookings = searchParams.get("hasBookings");
    const filter = searchParams.get("filter"); // 'all', 'with-bookings', 'without-bookings', 'active', 'inactive'

    // Filtro base: apenas clientes (role = 3)
    const whereConditions: any[] = [
      { role: 3 }, // Cliente
    ];

    // Busca por nome ou email
    if (search) {
      whereConditions.push({
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      });
    }

    // Filtros de remarketing
    if (filter === "with-bookings" || hasBookings === "true") {
      whereConditions.push({
        booking: { some: {} },
      });
    } else if (filter === "without-bookings") {
      whereConditions.push({
        booking: { none: {} },
      });
    }

    const where: any = {
      AND: whereConditions,
    };

    let clients = await db.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        emailNotifications: true,
        whatsappNotifications: true,
        whatsappNumber: true,
        pushNotifications: true,
        createdAt: true,
        booking: {
          select: {
            id: true,
            dateTime: true,
            status: true,
          },
          orderBy: {
            dateTime: "desc",
          },
          take: 1,
        },
        _count: {
          select: {
            booking: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
      take: 100,
    });

    // Adicionar informações de remarketing
    const enrichedClients = clients.map(client => {
      const lastBooking = client.booking[0];
      const daysSinceLastBooking = lastBooking
        ? Math.floor(
            (new Date().getTime() - new Date(lastBooking.dateTime).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : null;

      return {
        ...client,
        booking: undefined, // Remove array de bookings
        lastBookingDate: lastBooking?.dateTime,
        daysSinceLastBooking,
        isActive: daysSinceLastBooking ? daysSinceLastBooking <= 30 : false,
        totalBookings: client._count.booking,
        hasBookings: client._count.booking > 0,
      };
    });

    // Aplicar filtros de active/inactive se necessário
    let filteredClients = enrichedClients;
    if (filter === "active") {
      filteredClients = enrichedClients.filter(c => c.isActive);
    } else if (filter === "inactive") {
      filteredClients = enrichedClients.filter(
        c => c.hasBookings && !c.isActive
      );
    }

    console.log(`✅ [ADMIN-CLIENTS-GET] ${filteredClients.length} clientes encontrados no tenant: ${hostname}`);

    return NextResponse.json(filteredClients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
