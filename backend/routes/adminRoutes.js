import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getAdminSummary,
  updateIssueStatus,
  updateReportStatus,
  blockUser,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(protect);

router.get("/summary", getAdminSummary);
router.patch("/issues/:id/status", updateIssueStatus);
router.patch("/reports/:id/status", updateReportStatus);
router.patch("/users/:id/block", blockUser);

export default router;
