import express from "express";
import multer from "multer";
import { db } from "../server.js";
const storage=multer.memoryStorage();
const uploadMiddleware=multer({
    storage:storage
}).single("pdf");
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
        console.log("BODY:", req.body);
console.log("FILE:", req.file);
        console.log({ db }, "log .........................");
        const [result]=await db.query("insert into pdf_files(filename,userid,pdf_data) values(?,?,?)",[filename,userId,pdfData]);
       console.log(result);
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