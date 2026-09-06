import express from "express";
import {
  createSpotlight,
  getCommonSpotlights,
  getMySpotlights,
} from "../controllers/spotlightController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createSpotlight);

router.get("/common", getCommonSpotlights);

router.get("/my", authMiddleware, getMySpotlights);

export default router;
