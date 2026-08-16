import express from "express";
import { db } from "../server.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const login=async(req,res)=>{
try{
    const {username,password}=req.body;
    const [rows]=await db.query(
        "SELECT * FROM users where username=?",[username]
    );
    if(rows.length>0)
    {
        const isMatch=await bcrypt.compare(password,rows[0].password);
        if(isMatch)
        {
            const token=jwt.sign(
                {userId: rows[0].userId,username: rows[0].username},
                process.env.JWT_SECRET,
                {expiresIn: process.env.JWT_EXPIRES_IN}
            );
            res.json({
                success: true,
                userid: rows[0].userId,
                token: token,
                message: "Login successful",
            });
        }
        else
        {
            res.json({
                success: false,
                message: "Invalid username or password",
            });
        }
    }
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