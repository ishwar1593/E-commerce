/*
  Warnings:

  - A unique constraint covering the columns `[order_id]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "order_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Cart_order_id_key" ON "Cart"("order_id");

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
