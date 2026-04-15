-- CreateTable
CREATE TABLE "fields" (
    "id" TEXT NOT NULL,
    "name" VARCHAR NOT NULL,
    "city" VARCHAR,
    "state" VARCHAR,
    "country" VARCHAR,
    "address" VARCHAR,
    "map" VARCHAR,
    "permalink" TEXT NOT NULL,
    "team_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fields_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fields_permalink_key" ON "fields"("permalink");

-- AddForeignKey
ALTER TABLE "fields" ADD CONSTRAINT "fields_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
