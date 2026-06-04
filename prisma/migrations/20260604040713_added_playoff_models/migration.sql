/*
  Warnings:

  - A unique constraint covering the columns `[playoff_match_id]` on the table `penalties_shootouts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "PlayoffRound" AS ENUM ('quarterfinal', 'semifinal', 'final');

-- DropForeignKey
ALTER TABLE "players" DROP CONSTRAINT "players_team_id_fkey";

-- AlterTable
ALTER TABLE "penalties_shootouts" ADD COLUMN     "playoff_match_id" TEXT,
ALTER COLUMN "match_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "playoffs" (
    "id" TEXT NOT NULL,
    "team_ids" TEXT[],
    "starting_round" "PlayoffRound" NOT NULL DEFAULT 'quarterfinal',
    "tournament_id" TEXT NOT NULL,
    "category_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "playoffs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "playoff_matches" (
    "id" TEXT NOT NULL,
    "round" "PlayoffRound" NOT NULL,
    "group" TEXT NOT NULL DEFAULT 'general',
    "position" INTEGER NOT NULL,
    "local_score" INTEGER DEFAULT 0,
    "visitor_score" INTEGER DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'scheduled',
    "match_date" TIMESTAMP(3),
    "referee" TEXT,
    "remarks" VARCHAR(255),
    "playoff_id" TEXT NOT NULL,
    "local_id" TEXT NOT NULL,
    "visitor_id" TEXT NOT NULL,
    "winner_id" TEXT,
    "field_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "playoff_matches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "playoff_matches_playoff_id_round_group_position_idx" ON "playoff_matches"("playoff_id", "round", "group", "position");

-- CreateIndex
CREATE UNIQUE INDEX "penalties_shootouts_playoff_match_id_key" ON "penalties_shootouts"("playoff_match_id");

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playoffs" ADD CONSTRAINT "playoffs_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playoffs" ADD CONSTRAINT "playoffs_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playoff_matches" ADD CONSTRAINT "playoff_matches_playoff_id_fkey" FOREIGN KEY ("playoff_id") REFERENCES "playoffs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playoff_matches" ADD CONSTRAINT "playoff_matches_local_id_fkey" FOREIGN KEY ("local_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playoff_matches" ADD CONSTRAINT "playoff_matches_visitor_id_fkey" FOREIGN KEY ("visitor_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playoff_matches" ADD CONSTRAINT "playoff_matches_winner_id_fkey" FOREIGN KEY ("winner_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playoff_matches" ADD CONSTRAINT "playoff_matches_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "fields"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penalties_shootouts" ADD CONSTRAINT "penalties_shootouts_playoff_match_id_fkey" FOREIGN KEY ("playoff_match_id") REFERENCES "playoff_matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
