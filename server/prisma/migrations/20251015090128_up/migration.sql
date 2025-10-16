-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "ratingsCount" INTEGER;

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
