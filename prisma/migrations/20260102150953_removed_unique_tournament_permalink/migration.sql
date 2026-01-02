-- DropIndex
DROP INDEX "tournaments_category_format_idx";

-- DropIndex
DROP INDEX "tournaments_permalink_key";

-- CreateIndex
CREATE INDEX "tournaments_permalink_category_format_idx" ON "tournaments"("permalink", "category", "format");
