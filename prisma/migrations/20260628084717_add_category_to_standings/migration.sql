/*
  Warnings:

  - A unique constraint covering the columns `[tournament_id,team_id,category_id]` on the table `standings` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "standings_team_id_key";

-- AlterTable
ALTER TABLE "standings" ADD COLUMN     "category_id" TEXT;

-- CreateIndex
CREATE INDEX "standings_tournament_id_category_id_idx" ON "standings"("tournament_id", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "standings_tournament_id_team_id_category_id_key" ON "standings"("tournament_id", "team_id", "category_id");

-- AddForeignKey
ALTER TABLE "standings" ADD CONSTRAINT "standings_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
