-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT,
    "division" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "tournament" TEXT NOT NULL,
    "state" TEXT,
    "phone_one" TEXT,
    "phone_two" TEXT,
    "phone_three" TEXT,
    "main_contact" TEXT NOT NULL,
    "emails" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "local_court" TEXT NOT NULL,
    "days_of_week" TEXT[],
    "available_hours" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "teams_name_key" ON "teams"("name");
