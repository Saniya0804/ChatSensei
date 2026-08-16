//this file main function is to look at every incoming request check if it has a valid token and if so tell the rest of the app that the user is authenticated and who they are. If not, it will return an error message and not allow the request to continue.
import jwt from "jsonwebtoken";
export const requireAuth=(req,res,next)=>{
    const token=req.headers.authorization.split(" ")[1];
    if(!token)
    {
        return res.status(401).json({
            success: false,
            message: "No token provided",
        });
    }
    //jwt.verify(token, process.env.JWT_SECRET) — checks two things at once: (1) was this token actually signed with your secret (not forged), and (2) has it expired yet. If either check fails, jwt.verify throws an error — it doesn't return null or false, it throws.
    try{
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    req.userId=decoded.userId;
    next();
    }
    catch(error)
    {
        return res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
}