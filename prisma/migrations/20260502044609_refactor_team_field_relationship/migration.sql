-- DropForeignKey
ALTER TABLE "team_fields" DROP CONSTRAINT "team_fields_fieldId_fkey";

-- DropForeignKey
ALTER TABLE "team_fields" DROP CONSTRAINT "team_fields_teamId_fkey";

-- AddForeignKey
ALTER TABLE "team_fields" ADD CONSTRAINT "team_fields_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_fields" ADD CONSTRAINT "team_fields_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;
