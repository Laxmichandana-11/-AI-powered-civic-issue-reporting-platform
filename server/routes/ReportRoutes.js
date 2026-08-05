import express from "express";
import multer from "multer";
import path from "path";
import { createReport, getReports, getReportById, addComment, likeReport, deleteComment, getStats, getRecentReports, getMyReports, getActivity, getMyActivity } from "../controllers/ReportController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// validate file types and size
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Invalid file type"));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// Public: list reports
router.get("/", getReports);

// Dashboard / quick endpoints (specific routes before parameterized id)
router.get("/stats/summary", getStats);
router.get("/recent", getRecentReports);
router.get("/activity", getActivity);
router.get("/my-activity", authMiddleware, getMyActivity);
router.get("/me", authMiddleware, getMyReports);

// Get single report + comments
router.get("/:id", getReportById);

// Protected: create report with single image upload
router.post("/", authMiddleware, upload.single("image"), createReport);

// Protected: add comment to report
router.post("/:id/comments", authMiddleware, addComment);

// Protected: like / unlike a report
router.post("/:id/like", authMiddleware, likeReport);

// Protected: delete a comment
router.delete("/:id/comments/:commentId", authMiddleware, deleteComment);

export default router;
