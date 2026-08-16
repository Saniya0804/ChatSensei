import mysql from "mysql2/promise";

import express from "express";
import cors from "cors";

import {createTables} from "./database.js";

const app=express();
app.use(cors({
  origin: "http://localhost:3000",
}));
app.use(express.json());
const port=8000;
import uploadRoutes from"./routes/uploadFiles.js";
import registerRoutes from "./routes/registerUsers.js";
import loginRoutes from "./routes/loginUsers.js";
import chatRoutes from "./routes/chatSession.js";
export const db=await mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
});
console.log("Connected to MySQL database");
await db.query("create database if not exists pdf_chatbot");
await db.query("use pdf_chatbot");
await createTables(db);
app.get("/",(req,res)=>{
    res.send("server is running");
})
app.use("/chat",chatRoutes);
app.use("/upload",uploadRoutes);
app.use("/register",registerRoutes);
app.use("/login",loginRoutes);
app.listen(port,()=>{
    console.log("server is running on port 8000");
})