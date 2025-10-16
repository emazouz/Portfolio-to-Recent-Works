-- CreateEnum
CREATE TYPE "BlogStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED', 'IN_PROGRESS');

-- AlterTable
ALTER TABLE "blogs" ADD COLUMN     "status" "BlogStatus" NOT NULL DEFAULT 'DRAFT';
