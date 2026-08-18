import { db } from "../server.js";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter }from "@langchain/textsplitters";
import { Document }from "@langchain/core/documents";
import {
    GoogleGenerativeAIEmbeddings
}from "@langchain/google-genai";
import { HNSWLib }from "@langchain/community/vectorstores/hnswlib";
import fs from "fs/promises";
import {getUserStorePath} from "../utils/vectorStore.js";
import dotenv from "dotenv";
dotenv.config();

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200
});

const migrate=async()=>{
    try{
        console.log("Starting migration of existing PDFs...");
        const [users]=await db.query("select distinct userid from pdf_files");
        console.log(`Found ${users.length} user(s) with PDFs.`);
const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "gemini-embedding-001",
      apiKey: process.env.GOOGLE_API_KEY,
    });

    for (const {userid} of users){
        console.log(`\nProcessing user ${userid}...`);

        const [rows] = await db.query(
        "select * from pdf_files where userid=?",
        [userid]
      );
const allDocs = [];

for (const row of rows) {
        console.log(`  Parsing: ${row.filename}`);
        const blob = new Blob([new Uint8Array(row.pdf_data)], {
          type: "application/pdf",
        });
        const loader = new PDFLoader(blob);
        const docs = await loader.load();
        const chunks = await splitter.splitDocuments(docs);
        allDocs.push(
          ...chunks.map(
            (c) =>
              new Document({
                pageContent: c.pageContent,
                metadata: { pdfId: row.id, filename: row.filename },
              })
          )
        );
    }
    if (allDocs.length === 0) {
        console.log(`  Skipping user ${userid} — no extractable text found.`);
        continue;
      }

      //it provide the string where index file of user might be existing or to create a index ile of that particular user if file not exist 
      const storePath = getUserStorePath(userid);
      //in this return is of utmost importance because if file does not exist it creates it if already exist does not create it and return the path of that file
await fs.mkdir(storePath, { recursive: true });

        const vectorStore = await HNSWLib.fromDocuments(allDocs, embeddings);
        await vectorStore.save(storePath);
        console.log(`  Saved index for user ${userid} (${allDocs.length} chunks).`);
    }
    console.log("\nMigration complete.");
    }
    catch(error)
    {
console.error("Migration failed:", error);
    }
};
migrate();