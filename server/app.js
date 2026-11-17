import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import uploadRoutes from "./routes/uploadFiles.js";
import registerRoutes from "./routes/registerUsers.js";
import loginRoutes from "./routes/loginUsers.js";
import chatRoutes from "./routes/chatSession.js";

import { errorHandler } from "./middleware/errorHandler.js";

export const app=express();

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((s) => s.trim().replace(/\/$/, ""));

  app.set("trust proxy", 1);//because on render every request arrive through a proxy server without this server would think every visitor has same addredd so rate limit would not work properly
app.use(helmet());
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "100kb" }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));
app.use(["/login", "/register"], rateLimit({ windowMs: 15 * 60 * 1000, limit: 30 }));

app.get("/", (req, res) => res.send("server is running"));
app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/chat", chatRoutes);
app.use("/upload", uploadRoutes);
app.use("/register", registerRoutes);
app.use("/login", loginRoutes);

app.use(errorHandler);