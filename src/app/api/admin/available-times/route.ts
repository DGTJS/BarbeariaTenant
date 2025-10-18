import { NextRequest, NextResponse } from "next/server";
import { db } from "@/_lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const barberId = searchParams.get('barberId');
    const date = searchParams.get('date');
    const serviceId = searchParams.get('serviceId');

    if (!barberId || !date || !serviceId) {
      return NextResponse.json(
        { error: 'ID do barbeiro, data e ID do serviço são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar horários de trabalho do barbeiro
    const workingHours = await db.barberWorkingHour.findMany({
      where: {
        barberId,
        weekday: new Date(date).getDay()
      },
      include: {
        pauses: true
      }
    });

    if (workingHours.length === 0) {
      return NextResponse.json([]);
    }

    // Buscar agendamentos existentes para o dia
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBookings = await db.booking.findMany({
      where: {
        barberId,
        dateTime: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: {
          not: 'Cancelada'
        }
      },
      include: {
        service: {
          select: {
            duration: true
          }
        }
      }
    });

    // Buscar duração do serviço
    const service = await db.barberShopService.findUnique({
      where: { id: serviceId },
      select: { duration: true }
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Serviço não encontrado' },
        { status: 404 }
      );
    }

    // Gerar horários disponíveis
    const availableTimes: string[] = [];
    
    for (const workingHour of workingHours) {
      const startTime = workingHour.startTime.split(':');
      const endTime = workingHour.endTime.split(':');
      
      const startHour = parseInt(startTime[0]);
      const startMinute = parseInt(startTime[1]);
      const endHour = parseInt(endTime[0]);
      const endMinute = parseInt(endTime[1]);

      // Gerar slots de 30 minutos
      for (let hour = startHour; hour < endHour || (hour === endHour && startMinute < endMinute); hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          if (hour === startHour && minute < startMinute) continue;
          if (hour === endHour && minute >= endMinute) break;

          const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          
          // Verificar se não conflita com pausas
          const isInPause = workingHour.pauses.some(pause => {
            const pauseStart = pause.startTime.split(':');
            const pauseEnd = pause.endTime.split(':');
            const pauseStartMin = parseInt(pauseStart[0]) * 60 + parseInt(pauseStart[1]);
            const pauseEndMin = parseInt(pauseEnd[0]) * 60 + parseInt(pauseEnd[1]);
            const timeMin = hour * 60 + minute;
            
            return timeMin >= pauseStartMin && timeMin < pauseEndMin;
          });

          if (isInPause) continue;

          // Verificar se não conflita com agendamentos existentes
          const timeDate = new Date(date);
          timeDate.setHours(hour, minute, 0, 0);
          
          const hasConflict = existingBookings.some(booking => {
            const bookingStart = new Date(booking.dateTime);
            const bookingEnd = new Date(bookingStart.getTime() + booking.service.duration * 60000);
            
            return timeDate >= bookingStart && timeDate < bookingEnd;
          });

          if (!hasConflict) {
            availableTimes.push(timeString);
          }
        }
      }
    }

    return NextResponse.json(availableTimes);
  } catch (error) {
    console.error('Erro ao buscar horários disponíveis:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar horários disponíveis', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}
