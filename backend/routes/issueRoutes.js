import express from "express";
import upload from "../middleware/upload.js";
import protect from "../middleware/authMiddleware.js";
import {
  createIssue,
  getIssues,
  likeIssue,
  dislikeIssue,
  addComment,
  getComments,
  deleteComment,
  deleteIssue,
} from "../controllers/issueController.js";

const router = express.Router();

router.post("/", protect, upload.single("image"), createIssue);
router.get("/", getIssues);
router.put("/:id/like", protect, likeIssue);
router.put("/:id/dislike", protect, dislikeIssue);
router.post("/:id/comment", protect, addComment);
router.get("/:id/comments", getComments);
router.delete("/:id/comment/:commentId", protect, deleteComment);
router.delete("/:id", protect, deleteIssue);

export default router;
