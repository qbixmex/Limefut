/*
  Warnings:

  - You are about to drop the column `coach` on the `teams` table. All the data in the column will be lost.
  - You are about to drop the column `tournament` on the `teams` table. All the data in the column will be lost.
  - Added the required column `tournament_id` to the `teams` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "players" ADD COLUMN     "team_id" TEXT;

-- AlterTable
ALTER TABLE "teams" DROP COLUMN "coach",
DROP COLUMN "tournament",
ADD COLUMN     "coach_id" TEXT,
ADD COLUMN     "tournament_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "credentials" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "curp" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "jersey_number" INTEGER NOT NULL,
    "player_id" TEXT NOT NULL,
    "tournament_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credentials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "credentials_curp_key" ON "credentials"("curp");

-- CreateIndex
CREATE UNIQUE INDEX "credentials_player_id_key" ON "credentials"("player_id");

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_coach_id_fkey" FOREIGN KEY ("coach_id") REFERENCES "coaches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
