import express from "express";
import multer from "multer";
import {
  createStory,
  getStories,
  getMyStories,
} from "../controllers/storyController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = file.originalname.split(".").pop();
    cb(null, `story-${uniqueSuffix}.${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 4 }, 
});

router.get("/", getStories);

router.get("/my", authMiddleware, getMyStories);

router.post("/", authMiddleware, upload.array("images", 4), createStory);

export default router;

