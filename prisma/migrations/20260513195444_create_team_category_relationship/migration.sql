-- CreateTable
CREATE TABLE "team_category" (
    "teamId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "team_category_pkey" PRIMARY KEY ("teamId","categoryId")
);

-- AddForeignKey
ALTER TABLE "team_category" ADD CONSTRAINT "team_category_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_category" ADD CONSTRAINT "team_category_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
