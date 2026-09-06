import express from "express";
import {
  createPoll,
  getPolls,
  votePoll,
} from "../controllers/pollController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/", getPolls);


router.post("/", authMiddleware, createPoll);
router.post("/:id/vote", authMiddleware, votePoll);

export default router;
