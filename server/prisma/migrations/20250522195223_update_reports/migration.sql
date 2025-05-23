/*
  Warnings:

  - You are about to drop the column `company_id` on the `Report` table. All the data in the column will be lost.
  - The `status` column on the `Report` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `bounty_id` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Made the column `title` on table `Report` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Report` required. This step will fail if there are existing NULL values in that column.
  - Made the column `platform` on table `Report` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_company_id_fkey";

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "company_id",
ADD COLUMN     "bounty_id" TEXT NOT NULL,
ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "platform" SET NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "ReportStatus" DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_bounty_id_fkey" FOREIGN KEY ("bounty_id") REFERENCES "Bounty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
