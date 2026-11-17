import "dotenv/config";
import mysql from "mysql2/promise";
import {createTables} from "./database.js";
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ...(process.env.DB_SSL === "true" ? { ssl: { rejectUnauthorized: false } } : {}),
};
export const dbName = process.env.DB_NAME || "pdf_chatbot";
export const db = mysql.createPool({
  ...dbConfig,
  database: dbName,
  waitForConnections: true,
  connectionLimit: 10,
});

export async function initDb() {
  const bootstrap = await mysql.createConnection(dbConfig);
  await bootstrap.query(`create database if not exists \`${dbName}\``);
  await bootstrap.end();
  await createTables(db);
  console.log("Connected to MySQL database");
}
