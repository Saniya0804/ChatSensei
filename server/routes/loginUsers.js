import express from "express";
import {login} from"../controllers/loginController.js";
const router=express.Router();
router.post("/users",login);
export default router;