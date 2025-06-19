/*
  Warnings:

  - You are about to drop the column `CategoryId` on the `barber` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "barber" DROP CONSTRAINT "barber_CategoryId_fkey";

-- AlterTable
ALTER TABLE "barber" DROP COLUMN "CategoryId";

-- CreateTable
CREATE TABLE "_BarberToCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BarberToCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_BarberToCategory_B_index" ON "_BarberToCategory"("B");

-- AddForeignKey
ALTER TABLE "_BarberToCategory" ADD CONSTRAINT "_BarberToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "BarberCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BarberToCategory" ADD CONSTRAINT "_BarberToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "barber"("id") ON DELETE CASCADE ON UPDATE CASCADE;
