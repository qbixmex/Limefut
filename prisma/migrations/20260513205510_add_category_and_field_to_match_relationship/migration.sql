-- AlterTable
ALTER TABLE "matches" ADD COLUMN     "category_id" TEXT,
ADD COLUMN     "field_id" TEXT;

-- CreateIndex
CREATE INDEX "matches_tournament_id_local_id_visitor_id_category_id_field_idx" ON "matches"("tournament_id", "local_id", "visitor_id", "category_id", "field_id");

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "fields"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
