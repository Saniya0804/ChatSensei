import { db } from "../server.js";
import {
    GoogleGenerativeAIEmbeddings,
    ChatGoogleGenerativeAI
}from "@langchain/google-genai";
import { HNSWLib }from "@langchain/community/vectorstores/hnswlib";
import { RetrievalQAChain }from "@langchain/classic/chains";
import { getUserStorePath, storeExists } from "../utils/vectorStore.js";
import dotenv from "dotenv";
dotenv.config();

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

const storePath=getUserStorePath(userid);
if(!await storeExists(storePath))
{
    return res.status(404).json({
        success:false,
        message:"No pdf found.please upload a document first",
    });
}

const googleApiKey = process.env.GOOGLE_API_KEY;
const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "gemini-embedding-001",
  apiKey: googleApiKey
});
// Load the already-built index from disk — no parsing, no re-embedding docs
const vectorStore = await HNSWLib.load(storePath,embeddings);

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