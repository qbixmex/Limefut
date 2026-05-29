-- AlterTable
ALTER TABLE "announcements" ADD COLUMN     "image_public_id" TEXT,
ADD COLUMN     "image_url" TEXT;

-- CreateTable
CREATE TABLE "tournament_category" (
    "tournamentId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "tournament_category_pkey" PRIMARY KEY ("tournamentId","categoryId")
);

-- AddForeignKey
ALTER TABLE "tournament_category" ADD CONSTRAINT "tournament_category_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_category" ADD CONSTRAINT "tournament_category_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
