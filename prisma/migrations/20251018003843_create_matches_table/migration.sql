-- CreateEnum
CREATE TYPE "Status" AS ENUM ('scheduled', 'inProgress', 'completed', 'postPosed', 'canceled');

-- CreateTable
CREATE TABLE "matches" (
    "id" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "visitor" TEXT NOT NULL,
    "local_score" INTEGER DEFAULT 0,
    "visitor_score" INTEGER DEFAULT 0,
    "place" TEXT NOT NULL,
    "match_date" TIMESTAMP(3) NOT NULL,
    "week" INTEGER NOT NULL,
    "referee" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'scheduled',
    "tournament_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
