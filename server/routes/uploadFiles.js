import express from "express";
import {upload,uploadMiddleware,fetch,deleteFile} from"../controllers/uploadController.js";
const router=express.Router();
router.post("/files",uploadMiddleware,upload);
router.get("/files/:id",fetch);
router.delete("/deleteFiles/:id",deleteFile);
export default router;