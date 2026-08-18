import express from "express";
import multer from "multer";
import { db } from "../server.js";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import fs from "fs/promises";
import { getUserStorePath, storeExists } from "../utils/vectorStore.js";
import dotenv from "dotenv";
dotenv.config();
const storage=multer.memoryStorage();
const uploadMiddleware=multer({
    storage:storage
}).single("pdf");

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

const upload=async(req,res)=>{
 try{
        if(!req.file){
            return res.status(400).json({
                success:false,
                message:"No file uploaded"
            });
        }
        const filename=req.file.originalname;
        const pdfData=req.file.buffer;
        const userId=req.userId;
        const [result]=await db.query("insert into pdf_files(filename,userid,pdf_data) values(?,?,?)",[filename,userId,pdfData]);
       console.log(result);
       const pdfId = result.insertId;

       // 2. NEW: Parse this PDF into text
       const blob = new Blob([pdfData], { type: "application/pdf" });
    const loader = new PDFLoader(blob);
    const docs = await loader.load();

    // 3. NEW: Split into chunks
    const chunks = await splitter.splitDocuments(docs);
    const docsWithMetadata = chunks.map(
      (chunk) =>
        new Document({
          pageContent: chunk.pageContent,
          metadata: { pdfId, filename },
        })
    );

    // 4. NEW: Create embeddings, save/update the index on disk
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "gemini-embedding-001",
      apiKey: process.env.GOOGLE_API_KEY,
    });

    const storePath = getUserStorePath(userId);
    await fs.mkdir(storePath, { recursive: true });

    let vectorStore;
    if (await storeExists(storePath)) {
      vectorStore = await HNSWLib.load(storePath, embeddings);
      await vectorStore.addDocuments(docsWithMetadata);
    } else {
      vectorStore = await HNSWLib.fromDocuments(docsWithMetadata, embeddings);
    }
    await vectorStore.save(storePath);
res.json({
            success:true,
            message:"File uploaded successfully",
            //pdfId:result.insertId
        });
    }
        catch(error){
            console.error("Error uploading file:",error);
            res.status(500).json({
                success:false,
                message:"Error uploading file"
            });
        }
        
}
const fetch=async(req,res)=>{
try{
    const userid=req.userId;
    const [rows]=await db.query("select id,filename from pdf_files where userid=?",[userid]);
    console.log(rows);
    res.json({
        success:true,
        files:rows
    });
}
catch(error){
    console.log(error);
    res.status(500).json({
        success:false,
        message:"Server Error"
    });
}
};

const deleteFile=async(req,res)=>{
    try{
        const fileId=parseInt(req.params.id);
        const userId = req.userId;
        const [result]=await db.query("delete from pdf_files where id=? and userid=?",[fileId,userId]);
        if(result.affectedRows===0){
            return res.status(404).json({
                success:false,
                message:"File not found"
            });
        }
        // Delete the corresponding vector store file
        const [rows]=await db.query("select * from pdf_files where userid=?",[userId]);
        const storePath=getUserStorePath(userId);
        if(rows.length==0)
        {
            //no pdf left remove index folder completely
            await fs.rm(storePath,{recursive:true,force:true});
        }
        else
        {
            const allDocs=[];
            for(const row of rows){
                const blob=new blob([new Uint8Array(row.pdf_data)],{
                    type:"application/pdf"
                });
                const loader=new PDFLoader(blob);
                const docs=await loader.load();
                const chunks=await splitter.splitDocuments(docs);

                allDocs.push(
                    ...chunks.map((c)=>new Document({
                        pageContent:c.pageContent,
                        metadata:{pdfId:row.id,filename:row.filename}
                    }))
                );
            }
            const embeddings=new GoogleGenerativeAIEmbeddings({
                model:"gemini-embedding-001",
                apiKey:process.env.GOOGLE_API_KEY
            });
            const vectorStore=await HNSWLib.fromDocuments(allDocs,embeddings);
            await fs.mkdir(storePath,{recursive:true});
            await vectorStore.save(storePath);
        }
        res.json({
            success:true,
            message:"File deleted successfully"
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"Server Error"
        })
    }
}


export{
    upload,
    uploadMiddleware,
    fetch,
    deleteFile
};