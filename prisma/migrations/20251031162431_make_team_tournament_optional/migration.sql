-- DropForeignKey
ALTER TABLE "public"."teams" DROP CONSTRAINT "teams_tournament_id_fkey";

-- AlterTable
ALTER TABLE "teams" ALTER COLUMN "tournament_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
