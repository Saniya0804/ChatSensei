import "dotenv/config";
import { initDb } from "./db.js";
import { app } from "./app.js";

await initDb();

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`server is running on port ${port}`));