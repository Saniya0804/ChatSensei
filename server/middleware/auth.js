import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";

export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) throw new AppError(401, "No token provided");

  try {
    req.userId = jwt.verify(token, process.env.JWT_SECRET).userId;
    next();
  } catch {
    throw new AppError(401, "Invalid or expired token");
  }
};