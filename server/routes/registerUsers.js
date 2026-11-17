import { validate } from "../middleware/validate.js";
import { registerSchema } from "../schema.js";

import express from "express";
import {register} from"../controllers/registerController.js";
const router=express.Router();
router.post("/users", validate(registerSchema), register);
export default router;