import express from "express";
import multer from "multer";
import {session,ask,getSession,getMessages} from"../controllers/chatController.js";
const router=express.Router();
const storage=multer.memoryStorage();
const upload=multer({
    storage
})
router.post("/session",session);
router.post("/ask/:id",upload.single("tempPdf"),ask);
router.get("/session/:userid",getSession);
router.get("/messages/:sessionId",getMessages);
export default router;