import fs from "fs/promises";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import multer from "multer";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import { withPrisma } from "../methode/withPrisma";
const upload = multer({ dest: "uploads/" });

export const handleUploadDocument = withPrisma(
  async (req, res, prisma): Promise<void> => {
    try {
      // Multer ne gère pas le fichier si le middleware n'est pas appelé explicitement
      await new Promise<void>((resolve, reject) => {
        upload.single("file")(req, res, (err: any) => {
          if (err) reject(err);
          else resolve();
        });
      });
      const file = req.file 
      const { userId } = req.body; // à sécuriser selon votre auth
      if (!file) {
        res.status(400).json({ error: "Aucun fichier envoyé." });
        return;
      }

      // Création du document en base
      const document = await prisma.document.create({
        data: {
          filename: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          uploaderId: userId,
        },
      });

      // Sélection du loader selon le type de fichier
      let loader;
      if (
        file.mimetype === "application/pdf" ||
        file.originalname.endsWith(".pdf")
      ) {
        loader = new PDFLoader(file.path);
      } else if (
        file.mimetype ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.originalname.endsWith(".docx")
      ) {
        loader = new DocxLoader(file.path);
      } else {
        loader = new TextLoader(file.path);
      }

      const docs = await loader.load();
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      const splitDocs = await splitter.splitDocuments(docs);

      // Stockage des chunks
      await Promise.all(
        splitDocs.map((chunk, idx) =>
          prisma.documentChunk.create({
            data: {
              content: chunk.pageContent,
              metadata: chunk.metadata || {},
              documentId: document.id,
              index: idx,
            },
          })
        )
      );

      // Nettoyage du fichier temporaire
      await fs.unlink(file.path);

      res.json({
        success: true,
        documentId: document.id,
        chunks: splitDocs.length,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);
