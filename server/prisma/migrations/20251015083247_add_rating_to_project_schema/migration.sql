/*
  Warnings:

  - You are about to drop the column `verified` on the `reviews` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "rating" INTEGER;

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "verified";
