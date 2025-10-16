/*
  Warnings:

  - You are about to drop the column `templateId` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the `orders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `templates` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[projectId,userId]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `projectId` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_templateId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_userId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_templateId_fkey";

-- DropIndex
DROP INDEX "reviews_templateId_userId_key";

-- AlterTable
ALTER TABLE "blogs" ALTER COLUMN "metaDesc_en" SET DATA TYPE TEXT,
ALTER COLUMN "metaDesc_ar" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "templateId",
ADD COLUMN     "projectId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "orders";

-- DropTable
DROP TABLE "templates";

-- DropEnum
DROP TYPE "Difficulty";

-- DropEnum
DROP TYPE "OrderStatus";

-- DropEnum
DROP TYPE "PaymentMethod";

-- DropEnum
DROP TYPE "TemplateCategory";

-- CreateIndex
CREATE UNIQUE INDEX "reviews_projectId_userId_key" ON "reviews"("projectId", "userId");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
