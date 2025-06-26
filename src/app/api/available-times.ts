import { db } from "@/_lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const barberId = searchParams.get("barberId");
  const serviceId = searchParams.get("serviceId");
  const date = searchParams.get("date"); // formato YYYY-MM-DD

  if (!barberId || !serviceId || !date) {
    return NextResponse.json({ error: "barberId, serviceId e date são obrigatórios" }, { status: 400 });
  }

  // 1. Buscar duração do serviço
  const service = await db.barberShopService.findUnique({
    where: { id: serviceId },
  });
  if (!service) {
    return NextResponse.json({ error: "Serviço não encontrado" }, { status: 404 });
  }
  const duration = service.duration; // em minutos

  // 1. Buscar horário de trabalho e pausas
  const weekday = new Date(date).getDay(); // 0 = domingo, 1 = segunda, ...
  const year = Number(date.split("-")[0]);
  const month = Number(date.split("-")[1]);
  const day = Number(date.split("-")[2]);

  const workingHour = await db.barberWorkingHour.findFirst({
    where: { barberId, weekday },
    include: { pauses: true },
  });

  if (!workingHour) {
    return NextResponse.json({ availableTimes: [] });
  }

  // 2. Gerar os horários possíveis
  const [startHour, startMinute] = workingHour.startTime.split(":").map(Number);
  const [endHour, endMinute] = workingHour.endTime.split(":").map(Number);

  const workingStart = new Date(year, month - 1, day, startHour, startMinute, 0);
  const workingEnd = new Date(year, month - 1, day, endHour, endMinute, 0);

  const pauseIntervals = workingHour.pauses.map((pause) => {
    const [pauseStartHour, pauseStartMinute] = pause.startTime.split(":").map(Number);
    const [pauseEndHour, pauseEndMinute] = pause.endTime.split(":").map(Number);
    return {
      start: new Date(year, month - 1, day, pauseStartHour, pauseStartMinute, 0),
      end: new Date(year, month - 1, day, pauseEndHour, pauseEndMinute, 0),
    };
  });

  // 1. Buscar agendamentos do barbeiro para o dia
  const bookings = await db.booking.findMany({
    where: {
      barberId,
      dateTime: {
        gte: new Date(`${date}T00:00:00.000Z`),
        lt: new Date(`${date}T23:59:59.999Z`),
      },
      status: { not: "Cancelada" },
    },
  });

  // 4. Gerar horários possíveis (exemplo: de 09:00 às 18:00, de 30 em 30 min)
  // Corrigido para usar horário local do Brasil
  const possibleSlots: string[] = [];
  let slot = new Date(workingStart);

  while (slot.getTime() + duration * 60000 <= workingEnd.getTime()) {
    const slotEnd = new Date(slot.getTime() + duration * 60000);

    // Verifica se está em uma pausa
    const isInPause = pauseIntervals.some(
      (pause) =>
        (slot >= pause.start && slot < pause.end) ||
        (slotEnd > pause.start && slotEnd <= pause.end) ||
        (slot <= pause.start && slotEnd >= pause.end)
    );

    // Verifica se está ocupado (já agendado)
    const isBusy = bookings.some((booking) => {
      const bookingStart = new Date(booking.dateTime);
      const bookingEnd = new Date(bookingStart.getTime() + service.duration * 60000);
      return (
        (slot >= bookingStart && slot < bookingEnd) ||
        (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
        (slot <= bookingStart && slotEnd >= bookingEnd)
      );
    });

    if (!isBusy && !isInPause) {
      possibleSlots.push(slot.toISOString());
    }
    slot = new Date(slot.getTime() + 30 * 60000); // Avança 30 minutos
  }

  console.log({
    barberId,
    serviceId,
    date,
    workingStart,
    workingEnd,
    duration,
    busySlots: bookings,
    possibleSlotsPreview: possibleSlots.slice(0, 5),
    possibleSlotsCount: possibleSlots.length,
  });

  return NextResponse.json({ availableTimes: possibleSlots });
} 