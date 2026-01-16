import dotenv from "dotenv";


import app from "./app.js";
import { connectDB } from "./config/db.js";


dotenv.config({ path: "config.env" });

const PORT = process.env.PORT || 4000;

await connectDB(process.env.MONGO_URI);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});