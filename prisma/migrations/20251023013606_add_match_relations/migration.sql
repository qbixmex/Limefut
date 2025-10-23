/*
  Warnings:

  - You are about to drop the column `local` on the `matches` table. All the data in the column will be lost.
  - You are about to drop the column `visitor` on the `matches` table. All the data in the column will be lost.
  - Added the required column `local_id` to the `matches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visitor_id` to the `matches` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "matches" DROP COLUMN "local",
DROP COLUMN "visitor",
ADD COLUMN     "local_id" TEXT NOT NULL,
ADD COLUMN     "visitor_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_local_id_fkey" FOREIGN KEY ("local_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_visitor_id_fkey" FOREIGN KEY ("visitor_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
