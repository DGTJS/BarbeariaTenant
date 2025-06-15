/*
  Warnings:

  - You are about to drop the column `photo` on the `BarberShop` table. All the data in the column will be lost.
  - You are about to drop the column `barberShopServiceId` on the `booking` table. All the data in the column will be lost.
  - Added the required column `imageUrl` to the `BarberShopService` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceId` to the `booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "booking" DROP CONSTRAINT "booking_barberShopServiceId_fkey";

-- AlterTable
ALTER TABLE "BarberShop" DROP COLUMN "photo",
ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "BarberShopService" ADD COLUMN     "imageUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "booking" DROP COLUMN "barberShopServiceId",
ADD COLUMN     "serviceId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "BarberShopService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
