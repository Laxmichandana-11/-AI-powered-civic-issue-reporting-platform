import express from "express";
import multer from "multer";
import { register, login, getUserProfile, updateProfile } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getUserProfile);
router.put("/update-profile", authMiddleware, upload.single("avatar"), updateProfile);

export default router;
