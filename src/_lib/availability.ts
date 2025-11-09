import { db as defaultDb } from "./prisma";
import { PrismaClient } from "@prisma/client";
import {
  startOfDay,
  endOfDay,
  parse,
  format,
  addMinutes,
  isAfter,
  isBefore,
  isWithinInterval,
} from "date-fns";

interface TimeSlot {
  start: string; // "09:00"
  end: string; // "09:30"
  available: boolean;
  price: number;
}

interface DayAvailability {
  date: string; // "2025-10-30"
  available: boolean;
  slots: TimeSlot[];
}

/**
 * Calcula disponibilidade de um barbeiro para um serviço em um período
 */
export async function calculateBarberAvailability(
  barberId: string,
  serviceId: string,
  fromDate: Date,
  toDate: Date,
  db?: PrismaClient
): Promise<DayAvailability[]> {
  // Usar banco fornecido ou banco padrão
  const dbToUse = db || defaultDb;
  
  // 1. Verificar se o serviço existe (não precisamos mais da duração, pois será da opção)
  const service = await dbToUse.barberShopService.findUnique({
    where: { id: serviceId },
    select: {
      id: true,
    },
  });

  if (!service) {
    throw new Error("Serviço não encontrado");
  }

  // 2. Verificar se o barbeiro oferece este serviço
  const barberService = await dbToUse.barberService.findUnique({
    where: {
      barberId_serviceId: {
        barberId,
        serviceId,
      },
    },
    select: {
      active: true,
    },
  });

  // Se barber_service não está ativo, retornar vazio
  if (barberService && !barberService.active) {
    return [];
  }

  // Preço é apenas das opções - se não houver opção, usar 0
  const finalPrice = 0;

  // 3. Buscar horários de trabalho do barbeiro
  const workingHours = await dbToUse.barberWorkingHour.findMany({
    where: { barberId },
    include: {
      pauses: true,
    },
  });

  // 4. Buscar exceções (férias, feriados)
  const exceptions = await dbToUse.scheduleException.findMany({
    where: {
      barberId,
      date: {
        gte: fromDate,
        lte: toDate,
      },
    },
  });

  // 5. Buscar agendamentos (Confirmado e Aguardando Pagamento bloqueiam horários)
  // Excluir apenas os cancelados
  const bookings = await dbToUse.booking.findMany({
    where: {
      barberId,
      dateTime: {
        gte: fromDate,
        lte: toDate,
      },
      status: {
        notIn: [
          "Cancelada",
          "Cancelado",
          "Cancelled",
          "cancelada",
          "cancelado",
          "cancelled",
        ],
      },
    },
  });

  // Buscar opções para cada booking
  const bookingsWithOptions = await Promise.all(
    bookings.map(async booking => {
      const serviceOptionBooking = await dbToUse.serviceOptionBooking.findFirst({
        where: { bookingId: booking.id },
        include: {
          serviceOption: {
            select: { duration: true },
          },
        },
      });
      return {
        ...booking,
        serviceOption: serviceOptionBooking?.serviceOption || null,
      };
    })
  );

  // 6. Buscar holds ativos
  const holds = await dbToUse.appointmentHold.findMany({
    where: {
      barberId,
      startDateTime: {
        gte: fromDate,
        lte: toDate,
      },
      expiresAt: {
        gt: new Date(), // Apenas holds que não expiraram
      },
    },
  });

  // 7. Gerar disponibilidade para cada dia
  const result: DayAvailability[] = [];
  let currentDate = new Date(fromDate);

  while (currentDate <= toDate) {
    // Nota: Esta função não recebe optionId, então usa padrão de 30 minutos
    // O cálculo real será feito com base nas opções dos bookings existentes
    const defaultDuration = 30; // padrão quando não há opção específica
    const dayAvailability = calculateDayAvailability(
      currentDate,
      workingHours,
      exceptions,
      bookingsWithOptions,
      holds,
      defaultDuration,
      finalPrice
    );

    result.push(dayAvailability);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
}

/**
 * Calcula disponibilidade de um único dia
 */
function calculateDayAvailability(
  date: Date,
  workingHours: any[],
  exceptions: any[],
  bookings: any[], // bookings já incluem serviceOption
  holds: any[],
  defaultServiceDuration: number, // duração padrão quando não há opção
  price: number
): DayAvailability {
  const weekday = date.getDay();
  const dateStr = format(date, "yyyy-MM-dd");

  // Verificar se há exceção para este dia (bloqueio)
  const exception = exceptions.find(
    e => format(new Date(e.date), "yyyy-MM-dd") === dateStr
  );

  if (exception && exception.type === "blocked" && !exception.startTime) {
    // Dia inteiro bloqueado
    return {
      date: dateStr,
      available: false,
      slots: [],
    };
  }

  // Buscar horário de trabalho do dia da semana
  const workingHour = workingHours.find(wh => wh.weekday === weekday);

  if (!workingHour) {
    // Barbeiro não trabalha neste dia da semana
    return {
      date: dateStr,
      available: false,
      slots: [],
    };
  }

  // Gerar slots de 30 em 30 minutos
  const slots = generateTimeSlots(
    workingHour.startTime,
    workingHour.endTime,
    date,
    30 // intervalo de 30 minutos
  );

  // Marcar slots ocupados
  const availableSlots = slots.map(slot => {
    const isAvailable = isSlotAvailable(
      slot,
      date,
      bookings,
      holds,
      workingHour.pauses || [],
      defaultServiceDuration
    );

    return {
      ...slot,
      available: isAvailable,
      price,
    };
  });

  return {
    date: dateStr,
    available: availableSlots.some(s => s.available),
    slots: availableSlots,
  };
}

/**
 * Gera slots de tempo com intervalo específico
 */
function generateTimeSlots(
  startTime: string, // "09:00"
  endTime: string, // "18:00"
  date: Date,
  intervalMinutes: number
): Array<{ start: string; end: string }> {
  const slots: Array<{ start: string; end: string }> = [];

  const startDate = parse(startTime, "HH:mm", date);
  const endDate = parse(endTime, "HH:mm", date);

  let current = startDate;

  while (isBefore(current, endDate)) {
    const slotEnd = addMinutes(current, intervalMinutes);

    if (isAfter(slotEnd, endDate)) break;

    slots.push({
      start: format(current, "HH:mm"),
      end: format(slotEnd, "HH:mm"),
    });

    current = slotEnd;
  }

  return slots;
}

/**
 * Verifica se um slot está disponível
 */
function isSlotAvailable(
  slot: { start: string; end: string },
  date: Date,
  bookings: any[], // bookings já incluem serviceOption
  holds: any[],
  pauses: any[],
  defaultServiceDuration: number // duração padrão quando não há opção
): boolean {
  const slotStart = parse(slot.start, "HH:mm", date);
  const slotEnd = addMinutes(slotStart, defaultServiceDuration);

  // Verificar se o horário ainda não passou (apenas para hoje)
  const now = new Date();
  const isToday = format(now, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
  if (isToday && slotStart.getTime() <= now.getTime()) {
    return false; // Horário já passou
  }

  // Verificar se o serviço cabe no slot
  const slotMaxEnd = parse(slot.end, "HH:mm", date);
  if (isAfter(slotEnd, slotMaxEnd)) {
    return false; // Serviço não cabe neste slot
  }

  // Verificar conflito com pausas (almoço, limpeza)
  for (const pause of pauses) {
    const pauseStart = parse(pause.startTime, "HH:mm", date);
    const pauseEnd = parse(pause.endTime, "HH:mm", date);

    if (
      isWithinInterval(slotStart, { start: pauseStart, end: pauseEnd }) ||
      isWithinInterval(slotEnd, { start: pauseStart, end: pauseEnd }) ||
      (isBefore(slotStart, pauseStart) && isAfter(slotEnd, pauseEnd))
    ) {
      return false; // Conflito com pausa
    }
  }

  // Verificar conflito com bookings
  for (const booking of bookings) {
    const bookingStart = new Date(booking.dateTime);
    // Usar duração da opção se disponível, senão usar padrão de 30 minutos
    const bookingDuration =
      booking.serviceOption?.duration || defaultServiceDuration;
    const bookingEnd = addMinutes(bookingStart, bookingDuration);

    if (
      isWithinInterval(slotStart, { start: bookingStart, end: bookingEnd }) ||
      isWithinInterval(slotEnd, { start: bookingStart, end: bookingEnd }) ||
      (isBefore(slotStart, bookingStart) && isAfter(slotEnd, bookingEnd))
    ) {
      return false; // Conflito com booking existente
    }
  }

  // Verificar conflito com holds
  for (const hold of holds) {
    const holdStart = new Date(hold.startDateTime);
    const holdEnd = new Date(hold.endDateTime);

    if (
      isWithinInterval(slotStart, { start: holdStart, end: holdEnd }) ||
      isWithinInterval(slotEnd, { start: holdStart, end: holdEnd }) ||
      (isBefore(slotStart, holdStart) && isAfter(slotEnd, holdEnd))
    ) {
      return false; // Conflito com hold ativo
    }
  }

  return true; // Slot disponível
}

/**
 * Encontra o próximo horário disponível
 */
export async function findNextAvailableSlot(
  barberId: string,
  serviceId: string,
  fromDate: Date = new Date(),
  db?: PrismaClient
): Promise<{ date: string; time: string } | null> {
  const toDate = new Date(fromDate);
  toDate.setDate(toDate.getDate() + 60); // Procurar até 60 dias no futuro

  const availability = await calculateBarberAvailability(
    barberId,
    serviceId,
    fromDate,
    toDate,
    db
  );

  for (const day of availability) {
    if (day.available) {
      const firstAvailable = day.slots.find(s => s.available);
      if (firstAvailable) {
        return {
          date: day.date,
          time: firstAvailable.start,
        };
      }
    }
  }

  return null; // Nenhum horário disponível nos próximos 60 dias
}
