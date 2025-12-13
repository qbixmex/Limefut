-- CreateTable
CREATE TABLE "penalties_shoots" (
    "id" TEXT NOT NULL,
    "match_id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "shooter_number" INTEGER NOT NULL,
    "is_goal" BOOLEAN NOT NULL,
    "shooter_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "penalties_shoots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "penalties_shoots_match_id_team_id_shooter_number_key" ON "penalties_shoots"("match_id", "team_id", "shooter_number");

-- AddForeignKey
ALTER TABLE "penalties_shoots" ADD CONSTRAINT "penalties_shoots_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penalties_shoots" ADD CONSTRAINT "penalties_shoots_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
