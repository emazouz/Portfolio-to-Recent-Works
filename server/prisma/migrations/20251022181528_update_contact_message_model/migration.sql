/*
  Warnings:

  - The values [IN_PROGRESS,CLOSED] on the enum `MessageStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [SUPPORT,BUSINESS,COMPLAINT,SUGGESTION] on the enum `MessageType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `assignedTo` on the `contact_messages` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `contact_messages` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `contact_messages` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `contact_messages` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MessageStatus_new" AS ENUM ('UNREAD', 'READ', 'RESPONDED', 'SPAM');
ALTER TABLE "contact_messages" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "contact_messages" ALTER COLUMN "status" TYPE "MessageStatus_new" USING ("status"::text::"MessageStatus_new");
ALTER TYPE "MessageStatus" RENAME TO "MessageStatus_old";
ALTER TYPE "MessageStatus_new" RENAME TO "MessageStatus";
DROP TYPE "MessageStatus_old";
ALTER TABLE "contact_messages" ALTER COLUMN "status" SET DEFAULT 'UNREAD';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "MessageType_new" AS ENUM ('GENERAL', 'PROJECT', 'JOB_OFFER', 'COLLABORATION', 'CONSULTATION');
ALTER TABLE "contact_messages" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "contact_messages" ALTER COLUMN "type" TYPE "MessageType_new" USING ("type"::text::"MessageType_new");
ALTER TYPE "MessageType" RENAME TO "MessageType_old";
ALTER TYPE "MessageType_new" RENAME TO "MessageType";
DROP TYPE "MessageType_old";
ALTER TABLE "contact_messages" ALTER COLUMN "type" SET DEFAULT 'GENERAL';
COMMIT;

-- AlterTable
ALTER TABLE "contact_messages" DROP COLUMN "assignedTo",
DROP COLUMN "phone",
DROP COLUMN "priority",
DROP COLUMN "updatedAt";

-- DropEnum
DROP TYPE "Priority";
