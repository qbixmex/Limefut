/*
  Warnings:

  - You are about to drop the `penalties_shoots` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ShootoutStatus" AS ENUM ('in_progress', 'completed');

-- DropForeignKey
ALTER TABLE "penalties_shoots" DROP CONSTRAINT "penalties_shoots_match_id_fkey";

-- DropForeignKey
ALTER TABLE "penalties_shoots" DROP CONSTRAINT "penalties_shoots_team_id_fkey";

-- DropTable
DROP TABLE "penalties_shoots";

-- CreateTable
CREATE TABLE "penalties_shootouts" (
    "id" TEXT NOT NULL,
    "match_id" TEXT NOT NULL,
    "local_team_id" TEXT NOT NULL,
    "visitor_team_id" TEXT NOT NULL,
    "local_goals" INTEGER NOT NULL DEFAULT 0,
    "visitor_goals" INTEGER NOT NULL DEFAULT 0,
    "winner_team_id" TEXT,
    "status" "ShootoutStatus" NOT NULL DEFAULT 'in_progress',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "penalties_shootouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "penalty_kicks" (
    "id" TEXT NOT NULL,
    "shootout_id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "player_id" TEXT,
    "shooter_name" TEXT,
    "order" INTEGER NOT NULL,
    "is_goal" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "penalty_kicks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "penalties_shootouts_match_id_key" ON "penalties_shootouts"("match_id");

-- CreateIndex
CREATE INDEX "penalties_shootouts_match_id_idx" ON "penalties_shootouts"("match_id");

-- CreateIndex
CREATE UNIQUE INDEX "penalty_kicks_shootout_id_team_id_order_key" ON "penalty_kicks"("shootout_id", "team_id", "order");

-- AddForeignKey
ALTER TABLE "penalties_shootouts" ADD CONSTRAINT "penalties_shootouts_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penalties_shootouts" ADD CONSTRAINT "penalties_shootouts_local_team_id_fkey" FOREIGN KEY ("local_team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penalties_shootouts" ADD CONSTRAINT "penalties_shootouts_visitor_team_id_fkey" FOREIGN KEY ("visitor_team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penalties_shootouts" ADD CONSTRAINT "penalties_shootouts_winner_team_id_fkey" FOREIGN KEY ("winner_team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penalty_kicks" ADD CONSTRAINT "penalty_kicks_shootout_id_fkey" FOREIGN KEY ("shootout_id") REFERENCES "penalties_shootouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penalty_kicks" ADD CONSTRAINT "penalty_kicks_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penalty_kicks" ADD CONSTRAINT "penalty_kicks_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE SET NULL ON UPDATE CASCADE;
