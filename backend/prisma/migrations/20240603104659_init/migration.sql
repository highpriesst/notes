/*
  Warnings:

  - You are about to drop the column `authorEmail` on the `Note` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_authorEmail_fkey";

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "authorEmail",
ADD COLUMN     "authorId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
