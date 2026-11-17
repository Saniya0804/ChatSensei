import { db } from "../db.js";
import bcrypt from "bcryptjs";
import { AppError } from "../utils/AppError.js";

export const register = async (req, res) => {
  const { username, password } = req.body;

  const [existing] = await db.query("SELECT 1 FROM users WHERE username=?", [username]);
  if (existing.length > 0) throw new AppError(409, "Username already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.query("INSERT INTO users(username, password) VALUES(?,?)", [username, hashedPassword]);

  res.status(201).json({ success: true, message: "User registered" });
};