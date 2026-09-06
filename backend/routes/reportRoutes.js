import express from "express";
import { createReport , getMyReports } from "../controllers/reportController.js";

const router = express.Router();

router.post("/", createReport);
router.get("/my/:userId", getMyReports);
export default router;
