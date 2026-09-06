import express from "express";
import {
  getMyPosts,
  getMyLikedPosts,
  getUserStats,
  deleteAccount,
  updateProfile,
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/myposts", protect, getMyPosts);
router.get("/mylikes", protect, getMyLikedPosts);
router.get("/stats", protect, getUserStats);
router.delete("/delete-account", protect, deleteAccount);
router.put("/update-profile", protect, updateProfile);

export default router;
