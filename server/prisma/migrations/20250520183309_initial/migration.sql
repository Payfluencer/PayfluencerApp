/*
  Warnings:

  - Added the required column `platform` to the `Bounty` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bounty" ADD COLUMN     "pay_duration" TEXT,
ADD COLUMN     "platform" TEXT NOT NULL,
ADD COLUMN     "required_comments" INTEGER,
ADD COLUMN     "required_likes" INTEGER,
ADD COLUMN     "required_saves" INTEGER,
ADD COLUMN     "required_views" INTEGER,
ADD COLUMN     "show_other_brands" BOOLEAN,
ADD COLUMN     "specific_products" TEXT;
