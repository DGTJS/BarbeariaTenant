-- CreateTable para sistema de agendamento profissional

-- 1. Tabela para preços override por barbeiro
CREATE TABLE "barber_services" (
    "id" TEXT NOT NULL,
    "barberId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "priceOverride" DECIMAL(10,2),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "barber_services_pkey" PRIMARY KEY ("id")
);

-- 2. Tabela para exceções na agenda (férias, feriados, bloqueios)
CREATE TABLE "schedule_exceptions" (
    "id" TEXT NOT NULL,
    "barberId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "type" TEXT NOT NULL DEFAULT 'blocked',
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "schedule_exceptions_pkey" PRIMARY KEY ("id")
);

-- 3. Tabela para holds temporários (segurar slots por 5 min)
CREATE TABLE "appointment_holds" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "barberId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "startDateTime" TIMESTAMP(3) NOT NULL,
    "endDateTime" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "appointment_holds_pkey" PRIMARY KEY ("id")
);

-- 4. Índices para performance
CREATE UNIQUE INDEX "barber_services_barberId_serviceId_key" ON "barber_services"("barberId", "serviceId");
CREATE INDEX "barber_services_barberId_idx" ON "barber_services"("barberId");
CREATE INDEX "barber_services_serviceId_idx" ON "barber_services"("serviceId");

CREATE INDEX "schedule_exceptions_barberId_idx" ON "schedule_exceptions"("barberId");
CREATE INDEX "schedule_exceptions_date_idx" ON "schedule_exceptions"("date");

CREATE INDEX "appointment_holds_barberId_startDateTime_endDateTime_idx" ON "appointment_holds"("barberId", "startDateTime", "endDateTime");
CREATE INDEX "appointment_holds_expiresAt_idx" ON "appointment_holds"("expiresAt");
CREATE INDEX "appointment_holds_userId_idx" ON "appointment_holds"("userId");

-- 5. Foreign Keys
ALTER TABLE "barber_services" ADD CONSTRAINT "barber_services_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "barber"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "barber_services" ADD CONSTRAINT "barber_services_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "BarberShopService"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "schedule_exceptions" ADD CONSTRAINT "schedule_exceptions_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "barber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "appointment_holds" ADD CONSTRAINT "appointment_holds_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "appointment_holds" ADD CONSTRAINT "appointment_holds_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "barber"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "appointment_holds" ADD CONSTRAINT "appointment_holds_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "BarberShopService"("id") ON DELETE CASCADE ON UPDATE CASCADE;

