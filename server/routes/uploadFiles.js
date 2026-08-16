import express from "express";
import {upload,uploadMiddleware,fetch,deleteFile} from"../controllers/uploadController.js";
import { requireAuth } from "../middleware/auth.js";
const router=express.Router();
router.post("/files",requireAuth,uploadMiddleware,upload);
router.get("/files",requireAuth,fetch);
router.delete("/deleteFiles/:id",requireAuth,deleteFile);
export default router;