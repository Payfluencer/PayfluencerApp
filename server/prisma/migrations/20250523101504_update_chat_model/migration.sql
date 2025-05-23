-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_report_id_fkey";

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "company_id" TEXT,
ADD COLUMN     "is_admin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_company" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "report_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "Report"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
