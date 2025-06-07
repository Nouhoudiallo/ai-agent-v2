-- DropForeignKey
ALTER TABLE "Discussion" DROP CONSTRAINT "Discussion_authorId_fkey";

-- AddForeignKey
ALTER TABLE "Discussion" ADD CONSTRAINT "Discussion_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
