/*
  Warnings:

  - A unique constraint covering the columns `[manager_id]` on the table `Company` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'COMPANY_MANAGER';

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "manager_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Company_manager_id_key" ON "Company"("manager_id");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
