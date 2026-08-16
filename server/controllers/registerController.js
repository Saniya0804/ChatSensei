import express from "express";
import { db } from "../server.js";
import bcrypt from "bcryptjs";
const register=async(req,res)=>{
try{
    const {username,password}=req.body;
    const [existing]=await db.query(
        "SELECT * FROM users where username=?",[username]
    );
    if(existing.length>0)
    {
        res.json({
            success: false,
            message: "Username already exists",
        });
        return;
    }
    const hashedPassword=await bcrypt.hash(password,10);
    await db.query(
        "INSERT INTO users(username,password) VALUES(?,?)",
      [username,hashedPassword]
    );
    res.json({
        success: true,
      message: "User registered",
    })
}
catch(error)
{
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
}
}
export {register};