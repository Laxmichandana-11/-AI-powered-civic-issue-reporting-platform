
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

import authRoutes from "./routes/authRoutes.js";
import issueRoutes from "./routes/issueRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import discussionRoutes from "./routes/discussionRoutes.js";
import pollRoutes from "./routes/pollRoutes.js";
import compareRoutes from "./routes/compareRoutes.js";
import areaRoutes from "./routes/areaRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import spotlightRoutes from "./routes/spotlightRoutes.js";
import storyRoutes from "./routes/storyRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "devsecret";
  console.warn("JWT_SECRET not set. Using insecure development secret.");
}

connectDB();

const ensureDefaultAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ email: "admin@civix.com" });
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash("admin123", 10);
      await User.create({
        username: "admin",
        name: "Civix Admin",
        email: "admin@civix.com",
        password: passwordHash,
        phone: "0000000000",
        gender: "other",
        role: "admin",
      });
      console.log("Default admin account created: admin@civix.com / admin123");
    }
  } catch (error) {
    console.error("Failed to create default admin:", error.message);
  }
};

const app = express();
const server = createServer(app);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://127.0.0.1:5173",

    "https://myonemile.vercel.app/",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      console.log(` Blocked CORS from: ${origin}`);
      return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});


app.use((req, res, next) => {
  req.io = io;
  next();
});


app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/compare", compareRoutes);
app.use("/api/areas", areaRoutes);
app.use("/api/user", userRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/spotlights", spotlightRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/admin", adminRoutes);


app.get("/", (req, res) => {
  res.send("🌐 Meri Awaj API is running successfully!");
});


io.on("connection", (socket) => {
  console.log(" User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


const PORT = process.env.PORT || 4000;
server.listen(PORT, async () => {
  console.log(` Server running on port ${PORT}`);
  await ensureDefaultAdmin();
});
 