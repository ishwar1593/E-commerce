/*
  Warnings:

  - A unique constraint covering the columns `[ws_code]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Product_ws_code_key" ON "Product"("ws_code");

-- CreateIndex
CREATE INDEX "Product_name_ws_code_idx" ON "Product"("name", "ws_code");
