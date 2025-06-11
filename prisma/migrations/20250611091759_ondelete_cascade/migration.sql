-- DropForeignKey
ALTER TABLE "ApiKey" DROP CONSTRAINT "ApiKey_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_uploaderId_fkey";

-- DropForeignKey
ALTER TABLE "DocumentChunk" DROP CONSTRAINT "DocumentChunk_documentId_fkey";

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentChunk" ADD CONSTRAINT "DocumentChunk_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
