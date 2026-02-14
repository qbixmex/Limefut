-- DropIndex
DROP INDEX "tournaments_permalink_category_format_idx";

-- CreateIndex
CREATE INDEX "tournaments_permalink_category_format_gender_idx" ON "tournaments"("permalink", "category", "format", "gender");
