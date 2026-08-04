import express from "express";
import { db } from "../server.js";
const register=async(req,res)=>{
try{
    const {username,password}=req.body;
    console.log("test................");
    console.log(username);
    console.log(password);
    await db.query(
        "INSERT INTO users(username,password) VALUES(?,?)",
      [username,password]
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