import express from "express";
import multer from "multer";
import {session,ask,getSession,getMessages} from"../controllers/chatController.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { askSchema } from "../schema.js";
const router=express.Router();
const storage=multer.memoryStorage();
const upload=multer({
    storage
})
router.post("/session",requireAuth,session);
router.post("/ask", requireAuth, upload.single("tempPdf"), validate(askSchema), ask);
router.get("/session",requireAuth,getSession);
router.get("/messages/:sessionId",requireAuth,getMessages);
export default router;