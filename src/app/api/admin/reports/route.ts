import { NextResponse } from "next/server";
import { db } from "@/_lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");
    
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);
    
    // Buscar agendamentos do período
    const bookings = await db.booking.findMany({
      where: {
        createdAt: {
          gte: dateFrom
        }
      },
      include: {
        service: {
          select: { name: true, price: true }
        },
        barber: {
          select: { name: true }
        }
      }
    });

    // Calcular receita total
    const totalRevenue = bookings.reduce((sum, booking) => {
      return sum + Number(booking.service.price);
    }, 0);

    // Total de agendamentos
    const totalBookings = bookings.length;

    // Buscar avaliações (rating está no próprio booking)
    const bookingsWithRatings = bookings.filter(b => b.rating !== null && b.rating !== undefined);

    const averageRating = bookingsWithRatings.length > 0
      ? bookingsWithRatings.reduce((sum, b) => sum + (b.rating || 0), 0) / bookingsWithRatings.length
      : 0;

    // Top serviços
    const servicesMap = new Map<string, { bookings: number; revenue: number }>();
    bookings.forEach(booking => {
      const serviceName = booking.service.name;
      const current = servicesMap.get(serviceName) || { bookings: 0, revenue: 0 };
      servicesMap.set(serviceName, {
        bookings: current.bookings + 1,
        revenue: current.revenue + Number(booking.service.price)
      });
    });

    const topServices = Array.from(servicesMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Top barbeiros
    const barbersMap = new Map<string, { bookings: number; totalRating: number; ratingCount: number }>();
    bookings.forEach(booking => {
      const barberName = booking.barber.name;
      const current = barbersMap.get(barberName) || { bookings: 0, totalRating: 0, ratingCount: 0 };
      barbersMap.set(barberName, {
        bookings: current.bookings + 1,
        totalRating: current.totalRating,
        ratingCount: current.ratingCount
      });
    });

    // Adicionar ratings aos barbeiros (do próprio booking)
    bookingsWithRatings.forEach(booking => {
      const barberName = booking.barber.name;
      const current = barbersMap.get(barberName);
      if (current && booking.rating) {
        current.totalRating += booking.rating;
        current.ratingCount += 1;
      }
    });

    const topBarbers = Array.from(barbersMap.entries())
      .map(([name, data]) => ({
        name,
        bookings: data.bookings,
        rating: data.ratingCount > 0 ? data.totalRating / data.ratingCount : 0
      }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 5);

    // Dados mensais
    const monthlyData: Array<{ month: string; revenue: number; bookings: number }> = [];
    const monthsToShow = Math.min(days / 30, 12);
    
    for (let i = monthsToShow - 1; i >= 0; i--) {
      const monthDate = new Date();
      monthDate.setMonth(monthDate.getMonth() - i);
      const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
      
      const monthBookings = bookings.filter(b => {
        const bookingDate = new Date(b.createdAt);
        return bookingDate >= monthStart && bookingDate <= monthEnd;
      });
      
      const monthRevenue = monthBookings.reduce((sum, b) => sum + Number(b.service.price), 0);
      
      monthlyData.push({
        month: monthDate.toLocaleDateString('pt-BR', { month: 'short' }),
        revenue: monthRevenue,
        bookings: monthBookings.length
      });
    }

    // Estatísticas diárias
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayBookings = await db.booking.count({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    });

    const todayBookingsData = await db.booking.findMany({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      },
      include: {
        service: { select: { price: true } }
      }
    });

    const todayRevenue = todayBookingsData.reduce((sum, b) => sum + Number(b.service.price), 0);

    const pendingBookings = await db.booking.count({
      where: {
        status: "Pendente"
      }
    });

    return NextResponse.json({
      totalRevenue,
      totalBookings,
      averageRating,
      topServices,
      topBarbers,
      monthlyData,
      dailyStats: {
        todayBookings,
        todayRevenue,
        pendingBookings
      }
    });
  } catch (error) {
    console.error("Erro ao buscar relatórios:", error);
    return NextResponse.json(
      { error: "Erro ao buscar relatórios" },
      { status: 500 }
    );
  }
}
