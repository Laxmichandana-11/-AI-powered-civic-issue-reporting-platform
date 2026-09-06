import express from "express";
import { updateMemberActivity, getTopMembers } from "../controllers/memberController.js";

const router = express.Router();

router.post("/update", updateMemberActivity);
router.get("/", getTopMembers);

export default router;
