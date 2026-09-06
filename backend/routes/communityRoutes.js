import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getPolls,
  createPoll,
  votePoll,
  getMembers,
  addMember,
  joinCommunity,
  leaveCommunity,
  getMyCommunities,
} from "../controllers/communityController.js";

const router = express.Router();

router.get("/polls", getPolls);
router.post("/polls", createPoll);
router.put("/polls/vote", votePoll);

router.get("/members", getMembers);
router.post("/members", addMember);

router.post("/:id/join", authMiddleware, joinCommunity);
router.post("/:id/leave", authMiddleware, leaveCommunity);
router.get("/my", authMiddleware, getMyCommunities);

export default router;
