/*
  Warnings:

  - You are about to drop the column `team_id` on the `fields` table. All the data in the column will be lost.
  - You are about to drop the column `headquarters` on the `teams` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "fields" DROP CONSTRAINT "fields_team_id_fkey";

-- AlterTable
ALTER TABLE "fields" DROP COLUMN "team_id";

-- AlterTable
ALTER TABLE "teams" DROP COLUMN "headquarters";

-- CreateTable
CREATE TABLE "team_fields" (
    "teamId" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,

    CONSTRAINT "team_fields_pkey" PRIMARY KEY ("teamId","fieldId")
);

-- AddForeignKey
ALTER TABLE "team_fields" ADD CONSTRAINT "team_fields_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_fields" ADD CONSTRAINT "team_fields_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "fields"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
