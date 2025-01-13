-- AlterTable
ALTER TABLE "User" ADD COLUMN     "reset_expiry" TIMESTAMP(3),
ADD COLUMN     "reset_token" TEXT;
