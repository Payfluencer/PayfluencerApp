/*
  Warnings:

  - Added the required column `description` to the `Bounty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Bounty` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bounty" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "status" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;
