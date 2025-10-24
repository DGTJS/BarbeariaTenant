import { NextResponse } from "next/server";
import { db } from "@/_lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Pegar o range dos query params
    const searchParams = request.nextUrl.searchParams;
    const range = searchParams.get('range') || '7days';

    // Calcular datas baseado no range
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();
    
    switch(range) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case '7days':
        startDate.setDate(now.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case '30days':
        startDate.setDate(now.getDate() - 30);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'future7':
        startDate.setHours(0, 0, 0, 0);
        endDate.setDate(now.getDate() + 7);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'future30':
        startDate.setHours(0, 0, 0, 0);
        endDate.setDate(now.getDate() + 30);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'all':
        startDate = new Date('2020-01-01');
        endDate.setDate(now.getDate() + 365);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    
    // Buscar contadores básicos (filtrados pelo período)
    const totalBookings = await db.booking.count({
      where: {
        dateTime: {
          gte: startDate,
          lte: endDate
        }
      }
    }).catch(() => 0);
    
    const totalBarbers = await db.barber.count().catch(() => 0);
    const totalServices = await db.barberShopService.count().catch(() => 0);
    
    const todayBookings = await db.booking.count({
      where: {
        dateTime: {
          gte: today,
          lte: todayEnd
        }
      }
    }).catch(() => 0);
    
    const pendingBookings = await db.booking.count({
      where: { 
        status: "Pendente",
        dateTime: {
          gte: startDate,
          lte: endDate
        }
      }
    }).catch(() => 0);
    
    // Buscar agendamentos recentes (filtrados pelo período)
    const recentBookings = await db.booking.findMany({
      where: {
        dateTime: {
          gte: startDate,
          lte: endDate
        }
      },
      take: 5,
      orderBy: { dateTime: 'desc' },
      include: {
        user: {
          select: { name: true }
        },
        service: {
          select: { name: true, price: true }
        },
        barber: {
          select: { name: true }
        }
      }
    }).catch(() => []);
    
    // Buscar todos os agendamentos para cálculos (filtrados pelo período)
    const allBookings = await db.booking.findMany({
      where: {
        dateTime: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        service: {
          select: { price: true }
        }
      }
    }).catch(() => []);
    
    // Buscar serviços
    const services = await db.barberShopService.findMany({
      include: {
        _count: {
          select: { booking: true }
        }
      }
    }).catch(() => []);

    // Calcular receita total
    const totalRevenue = allBookings.reduce((sum, booking) => {
      return sum + Number(booking.service.price);
    }, 0);

    // Calcular avaliação média (apenas de bookings com rating)
    const bookingsWithRating = allBookings.filter(b => b.rating && b.rating > 0);
    const ratingsSum = bookingsWithRating.reduce((sum, booking) => {
      return sum + (booking.rating || 0);
    }, 0);
    const averageRating = bookingsWithRating.length > 0 
      ? ratingsSum / bookingsWithRating.length 
      : 0;

    // Dados do período (dividido em intervalos)
    const weeklyData = [];
    const daysInRange = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const intervals = Math.min(daysInRange, 7); // Máximo de 7 intervalos para o gráfico
    const intervalSize = Math.ceil(daysInRange / intervals);
    
    for (let i = 0; i < intervals; i++) {
      const intervalStart = new Date(startDate);
      intervalStart.setDate(startDate.getDate() + (i * intervalSize));
      
      const intervalEnd = new Date(intervalStart);
      intervalEnd.setDate(intervalStart.getDate() + intervalSize);
      if (intervalEnd > endDate) intervalEnd.setTime(endDate.getTime());
      
      const dayBookings = await db.booking.findMany({
        where: {
          dateTime: {
            gte: intervalStart,
            lt: intervalEnd
          }
        },
        include: {
          service: {
            select: { price: true }
          }
        }
      });
      
      const dayRevenue = dayBookings.reduce((sum, b) => {
        return sum + Number(b.service.price);
      }, 0);
      
      const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      
      // Se for range pequeno, mostra dia da semana, senão mostra data
      let label;
      if (daysInRange <= 7) {
        label = dayNames[intervalStart.getDay()];
      } else {
        label = `${intervalStart.getDate()}/${intervalStart.getMonth() + 1}`;
      }
      
      weeklyData.push({
        day: label,
        revenue: dayRevenue,
        bookings: dayBookings.length
      });
    }

    // Distribuição de serviços
    const serviceDistribution = services
      .filter(s => s._count.booking > 0)
      .map(service => ({
        name: service.name,
        value: service._count.booking
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    // Performance dos barbeiros
    const barbers = await db.barber.findMany({
      include: {
        _count: {
          select: { booking: true }
        }
      }
    }).catch(() => []);

    const barberPerformance = barbers
      .map(barber => ({
        name: barber.name,
        bookings: barber._count.booking
      }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 5);

    // Formatar agendamentos recentes
    const formattedRecentBookings = recentBookings.map(booking => ({
      id: booking.id,
      customerName: booking.user.name || "Cliente",
      service: booking.service.name,
      barber: booking.barber.name,
      time: booking.dateTime.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      status: booking.status.toLowerCase(),
      price: Number(booking.service.price)
    }));

    return NextResponse.json({
      totalBookings,
      totalRevenue,
      totalBarbers,
      totalServices,
      todayBookings,
      pendingBookings,
      averageRating,
      weeklyData,
      serviceDistribution,
      barberPerformance,
      recentBookings: formattedRecentBookings
    });

  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar dados' },
      { status: 500 }
    );
  }
}

