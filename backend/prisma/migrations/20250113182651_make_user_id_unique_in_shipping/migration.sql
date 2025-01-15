/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `ShippingDetails` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ShippingDetails_user_id_key" ON "ShippingDetails"("user_id");
