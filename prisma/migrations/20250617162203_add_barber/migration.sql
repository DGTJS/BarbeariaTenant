/*
  Warnings:

  - Added the required column `barberId` to the `booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "booking" ADD COLUMN     "barberId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "barber" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "photo" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "barberShopId" TEXT NOT NULL,

    CONSTRAINT "barber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "barber_userId_key" ON "barber"("userId");

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "barber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "barber" ADD CONSTRAINT "barber_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "barber" ADD CONSTRAINT "barber_barberShopId_fkey" FOREIGN KEY ("barberShopId") REFERENCES "BarberShop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
