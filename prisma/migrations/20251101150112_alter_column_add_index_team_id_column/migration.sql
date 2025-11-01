/*
  Warnings:

  - A unique constraint covering the columns `[team_id]` on the table `standings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "standings_team_id_key" ON "standings"("team_id");
