import "dotenv/config";
import mysql from "mysql2/promise";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import { createTables } from "./database.js";
import uploadRoutes from "./routes/uploadFiles.js";
import registerRoutes from "./routes/registerUsers.js";
import loginRoutes from "./routes/loginUsers.js";
import chatRoutes from "./routes/chatSession.js";

const app = express();
const port = process.env.PORT || 8000;

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((s) => s.trim().replace(/\/$/, ""));
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.set("trust proxy", 1);
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));
app.use(["/login", "/register"], rateLimit({ windowMs: 15 * 60 * 1000, limit: 30 }));

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ...(process.env.DB_SSL === "true" ? { ssl: { rejectUnauthorized: false } } : {}),
};
const dbName = process.env.DB_NAME || "pdf_chatbot";

const bootstrap = await mysql.createConnection(dbConfig);
await bootstrap.query(`create database if not exists \`${dbName}\``);
await bootstrap.end();

export const db = mysql.createPool({
  ...dbConfig,
  database: dbName,
  waitForConnections: true,
  connectionLimit: 10,
});
console.log("Connected to MySQL database");
await createTables(db);

app.get("/", (req, res) => {
  res.send("server is running");
});
app.use("/chat", chatRoutes);
app.use("/upload", uploadRoutes);
app.use("/register", registerRoutes);
app.use("/login", loginRoutes);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});