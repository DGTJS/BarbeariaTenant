-- CreateTable
CREATE TABLE "ServicePriceAdjustment" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "barberId" TEXT NOT NULL,
    "priceAdjustment" DECIMAL(10,2) NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServicePriceAdjustment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ServicePriceAdjustment" ADD CONSTRAINT "ServicePriceAdjustment_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "BarberShopService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicePriceAdjustment" ADD CONSTRAINT "ServicePriceAdjustment_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "barber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
