import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { dbConnect } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();             // load env first

const app = express();
const port = process.env.PORT || 8000;

// ✅ CORS FIRST
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://fogexplore.netlify.app",
      "https://6933c62b55b0a3afa2712e94--fogexplore.netlify.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// (optional but nice) handle preflight explicitly
app.options("*", cors());

// ✅ Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Simple health check route to test quickly
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Backend is alive" });
});

// ----------Routes----------
app.use("/api", authRoutes);
app.use("/api/mapData", gameRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

// ✅ Start after DB connects
dbConnect()
  .then(() => {
    app.listen(port, "0.0.0.0", () => {
      console.log(`Server running at port : ${port}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
    process.exit(1);
  });
