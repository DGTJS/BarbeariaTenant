-- CreateTable
CREATE TABLE "BarberWorkingHour" (
    "id" TEXT NOT NULL,
    "barberId" TEXT NOT NULL,
    "weekday" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,

    CONSTRAINT "BarberWorkingHour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pause" (
    "id" TEXT NOT NULL,
    "workingHourId" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,

    CONSTRAINT "Pause_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BarberWorkingHour" ADD CONSTRAINT "BarberWorkingHour_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "barber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pause" ADD CONSTRAINT "Pause_workingHourId_fkey" FOREIGN KEY ("workingHourId") REFERENCES "BarberWorkingHour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
