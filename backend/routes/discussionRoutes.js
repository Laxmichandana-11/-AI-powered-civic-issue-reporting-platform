import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createDiscussion,
  getDiscussions,
  likeDiscussion,
  addComment,
  deleteComment,
  deleteDiscussion,
} from "../controllers/discussionController.js";

const router = express.Router();

router.get("/", getDiscussions);
router.post("/", authMiddleware, createDiscussion);


router.post("/:id/like", authMiddleware, likeDiscussion);


router.post("/:id/comments", authMiddleware, addComment);


router.delete("/:id/comments/:commentId", authMiddleware, deleteComment);


router.delete("/:id", authMiddleware, deleteDiscussion);

export default router;
