-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_discussionId_fkey";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "Discussion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
