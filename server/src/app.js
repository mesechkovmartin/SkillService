import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// handle preflight
app.options(/.*/, cors());

app.use("/auth", authRoutes);

app.get("/health", (req, res) => {
  res.json({ ok: true, message: "API is running" });
});

export default app;