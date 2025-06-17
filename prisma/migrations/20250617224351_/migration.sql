-- AlterTable
ALTER TABLE "BarberShopService" ADD COLUMN     "categoryId" TEXT;

-- CreateTable
CREATE TABLE "BarberCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "IconUrl" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BarberCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BarberShopService" ADD CONSTRAINT "BarberShopService_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "BarberCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
