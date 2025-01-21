-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "isdeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "isdeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isdeleted" BOOLEAN NOT NULL DEFAULT false;
