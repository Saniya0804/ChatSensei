import express from "express";
import {register} from"../controllers/registerController.js";
const router=express.Router();
router.post("/users",register);
export default router;