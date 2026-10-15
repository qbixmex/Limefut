-- CreateEnum
CREATE TYPE "Mode" AS ENUM ('league', 'friendly');

-- AlterTable
ALTER TABLE "matches" ADD COLUMN     "mode" "Mode" NOT NULL DEFAULT 'league';
