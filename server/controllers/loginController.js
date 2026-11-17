import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";

export const login = async (req, res) => {
  const { username, password } = req.body;

  const [rows] = await db.query("SELECT * FROM users WHERE username=?", [username]);
  const valid = rows.length > 0 && (await bcrypt.compare(password, rows[0].password));
  if (!valid) throw new AppError(401, "Invalid username or password");

  const token = jwt.sign(
    { userId: rows[0].userId, username: rows[0].username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  res.json({ success: true, userid: rows[0].userId, token, message: "Login successful" });
};