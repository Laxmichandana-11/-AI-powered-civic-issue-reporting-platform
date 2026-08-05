import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { listReportsAdmin, updateReportStatus, deleteReportAdmin, listUsersAdmin, deleteUserAdmin, restoreReportAdmin } from "../controllers/AdminController.js";

const router = express.Router();

// All routes here require authentication; controller checks admin role
router.get("/reports", authMiddleware, listReportsAdmin);
router.patch("/reports/:id/status", authMiddleware, updateReportStatus);
router.delete("/reports/:id", authMiddleware, deleteReportAdmin);
router.patch("/reports/:id/restore", authMiddleware, restoreReportAdmin);

router.get("/users", authMiddleware, listUsersAdmin);
router.delete("/users/:id", authMiddleware, deleteUserAdmin);

export default router;
