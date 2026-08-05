import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import authRoutes from "./routes/AuthRoutes.js";
import userRoutes from "./routes/UserRoutes.js";
import reportRoutes from "./routes/ReportRoutes.js";
import adminRoutes from "./routes/AdminRoutes.js";

dotenv.config();

const app = express();

// Connect Database
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.join(__dirname, "../client/dist");
const allowedOrigins = (process.env.ORIGIN || "http://localhost:5173,http://localhost:5174").split(",").map((origin) => origin.trim());

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy violation: ${origin}`));
      }
    },
    credentials: true,
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Private-Network", "true");
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve React production build
if (process.env.NODE_ENV === "production") {
  app.use(express.static(clientDistPath));
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

// Test Route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the AI Civic Issue Reporting API 🚀",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});