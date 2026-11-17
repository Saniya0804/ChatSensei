import express from "express";
import {login} from"../controllers/loginController.js";
import { validate } from "../middleware/validate.js";
import { loginSchema } from "../schema.js";
const router=express.Router();
router.post("/users", validate(loginSchema), login);
export default router;