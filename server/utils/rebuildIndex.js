import fs from "fs/promises";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { db } from "../server.js";
import { getUserStorePath } from "./vectorStore.js";

const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });

export const rebuildUserIndex = async (userId) => {
  const [rows] = await db.query("select * from pdf_files where userid=?", [userId]);
  if (rows.length === 0) return false;

  const allDocs = [];
  for (const row of rows) {
    const blob = new Blob([new Uint8Array(row.pdf_data)], { type: "application/pdf" });
    const docs = await new PDFLoader(blob).load();
    const chunks = await splitter.splitDocuments(docs);
    allDocs.push(
      ...chunks.map(
        (c) => new Document({ pageContent: c.pageContent, metadata: { pdfId: row.id, filename: row.filename } })
      )
    );
  }
  if (allDocs.length === 0) return false;

  const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "gemini-embedding-001",
    apiKey: process.env.GOOGLE_API_KEY,
  });
  const storePath = getUserStorePath(userId);
  const vectorStore = await HNSWLib.fromDocuments(allDocs, embeddings);
  await fs.mkdir(storePath, { recursive: true });
  await vectorStore.save(storePath);
  return true;
};