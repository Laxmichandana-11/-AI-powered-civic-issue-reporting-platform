import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createAreaCompare,
  getAllAreaCompares,
  getAreaCompareById,
  likeAreaCompare,
} from "../controllers/areaController.js";

const router = express.Router();

router.post("/add", authMiddleware, createAreaCompare);

router.get("/", getAllAreaCompares);
router.get("/:id", getAreaCompareById);
router.put("/:id/like", authMiddleware, likeAreaCompare);

export default router;
