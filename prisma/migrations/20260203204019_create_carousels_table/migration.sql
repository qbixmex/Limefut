-- CreateTable
CREATE TABLE "carousels" (
    "id" TEXT NOT NULL,
    "time" INTEGER NOT NULL DEFAULT 5,
    "play" BOOLEAN NOT NULL DEFAULT false,
    "loop" BOOLEAN NOT NULL DEFAULT false,
    "section" TEXT NOT NULL,
    "showControls" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carousels_pkey" PRIMARY KEY ("id")
);
