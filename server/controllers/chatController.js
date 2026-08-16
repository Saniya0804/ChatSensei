import { db } from "../server.js";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter }from "@langchain/textsplitters";
import { Document }from "@langchain/core/documents";
import {
    GoogleGenerativeAIEmbeddings,
    ChatGoogleGenerativeAI
}from "@langchain/google-genai";
import { HNSWLib }from "@langchain/community/vectorstores/hnswlib";
//import { MemoryVectorStore } from "@langchain/core/vectorstores";

import { RetrievalQAChain }from "@langchain/classic/chains";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200
});
const session=async(req,res)=>{
try{
    const userid=req.userId;
    const [result]=await db.query("insert into chat_session (user_id,session_name) values(?,?)",[userid,"temp"]);
res.json({
success:true,
sessionId:result.insertId,
})
}
catch(error){
    console.log(error);
    res.status(500).json({
        success:false,
    })
}
}
const ask=async(req,res)=>{
    try{
const userid=req.userId;
const question=req.body.question;
const sessionId=parseInt(req.body.sessionId);
let rows;
     [rows]=await db.query("select * from pdf_files where userid=?",[userid]);
if(rows.length==0){
    return res.status(404).json({
        success:false,
        message:"PDF file not found"
    }); 
}
const allDocs=[];     
console.log("rows.............",rows);
for(const row of rows){
    const blob = new Blob([new Uint8Array(row.pdf_data)], {
        type: "application/pdf"
    });
    const loader = new PDFLoader(blob);
    const docs = await loader.load();
    const chunks=await splitter.splitDocuments(docs);
    const docsWithMetadata=chunks.map((chunk)=>new Document({pageContent:chunk.pageContent,metadata:{pdfId:row.id,filename:row.filename}}));
    console.log("metdata...........",docsWithMetadata);
    allDocs.push(...docsWithMetadata);
}
console.log("alldocspersistent............",allDocs);
/*console.log(
    allDocs.map((d, i) => ({
        index: i,
        length: d.pageContent.length,
        text: d.pageContent.substring(0, 50)
    }))
);*/
//temporary pdf//
if(req.file)
{
    const blob=new Blob(
        [req.file.buffer],
        {
            type:"application/pdf"
        }
    )
    const loader=new PDFLoader(blob);
    const docs = await loader.load();

    console.log("PDF LOADED DOCS:", docs);
console.log("NUMBER OF DOCS:", docs.length);
    const chunks=await splitter.splitDocuments(docs);

    console.log("NUMBER OF CHUNKS:", chunks.length);
    const docsWithMetadata=chunks.map((chunk)=>new Document({pageContent:chunk.pageContent,metadata:{pdfId:1000,filename:req.file.originalname,temporary:true}}));
    console.log("docmetdatatemp..........",docsWithMetadata);
    allDocs.push(...docsWithMetadata);
}
console.log("alldoc after temp..................",allDocs);
if(allDocs.length===0)
{
    return res.status(404).json({
        success:false,
        message:"No pdf found"
    })
}

const googleApiKey = process.env.GOOGLE_API_KEY;
const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "gemini-embedding-001",
  apiKey: googleApiKey
});

const vectorStore = await HNSWLib.fromDocuments(
    allDocs,
    embeddings
);
console.log("vector store............................",vectorStore);

//now retrival//
//basically to take data from a vector storage and present it to the user in a way that is more relevant to the query.//
const vectorStoreRetriever=vectorStore.asRetriever();
//now after retrival we get two or more documents that are relevant to the query. we need to use those documents to answer the question.//
//we can use a chain to do that. a chain is a sequence of steps that are executed in order. each step takes the output of the previous step as input.//
const model=new ChatGoogleGenerativeAI({
  model:"gemini-2.5-flash",
  apiKey:googleApiKey
});
/*const queryVector = await embeddings.embedQuery(question);

console.log("Question:", question);
console.log("Query vector length:", queryVector.length);*/
const chain=RetrievalQAChain.fromLLM(model,vectorStoreRetriever);//we are giving retrival and model to the chain. the chain will use the retrival to get the relevant documents and then use the model to answer the question based on those documents.//

const answer=await chain.call({
    query:question
});
console.log("answer..................",answer);
await db.query(`insert into chat_messages(session_id,question,answer) values(?,?,?)`,[sessionId,question,answer.text||answer.result||JSON.stringify(answer)]);
await db.query(`update chat_session set session_name=? where id=? and session_name='temp'`,[question.substring(0,50),sessionId]);
res.json({
    success:true,
    answer:answer.text
});
}
catch(error)
{
    console.log(error);
    res.status(500).json({
        success:false,
        message:"server error"
    });
}
}
const getSession=async(req,res)=>{
    try{
        const userId=req.userId;
        console.log("userid...........",userId);
        const[rows]=await db.query(`select id,session_name from chat_session where user_id=? order by created_at DESC`,[userId]);
        console.log("rows.........",rows);
        res.json({
            success:true,
            sessions:rows
        })
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false
        })
    }
}
const getMessages=async(req,res)=>{
    try{
    const sessionId=parseInt(req.params.sessionId);
    const userId = req.userId;
    const [rows]=await db.query(`select cm.question,cm.answer from chat_messages cm join chat_session cs on cm.session_id=cs.id where cm.session_id=? and cs.user_id=? order by cm.id`,[sessionId,userId]);
    res.json({
        success:true,
        messages:rows
    })
}
catch(error)
{
    console.log(error);
    res.json({
        success:"false"
    })
}
}
export {
    session,
    ask,
    getSession,
    getMessages
}