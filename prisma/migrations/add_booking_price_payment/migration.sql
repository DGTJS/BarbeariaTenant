-- AlterTable
ALTER TABLE "booking" ADD COLUMN "totalPrice" DECIMAL(10,2) DEFAULT 0,
ADD COLUMN "paymentMethod" TEXT DEFAULT 'Dinheiro';

