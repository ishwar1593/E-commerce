/*
  Warnings:

  - You are about to drop the column `order_id` on the `Cart` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_order_id_fkey";

-- DropIndex
DROP INDEX "Cart_order_id_key";

-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "order_id";
