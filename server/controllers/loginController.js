import express from "express";
import { db } from "../server.js";
const login=async(req,res)=>{
try{
    const {username,password}=req.body;
    console.log("test....");
    console.log(username);
    console.log(password);
    const [rows]=await db.query(
        "SELECT * FROM users where username=? and password=?",[username,password]
    );
    if(rows.length>0)
    res.json({
        success: true,
        userid: rows[0].userId,
      message: "Login successful",
    });
    else
    {
       res.json({
        success: false,
      message: "Invalid username or password",
    }); 
    }
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
export {login};