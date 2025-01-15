/*
  Warnings:

  - Made the column `address_type` on table `ShippingDetails` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ShippingDetails" ALTER COLUMN "address_type" SET NOT NULL;
