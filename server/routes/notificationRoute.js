import express from "express";
import { getApplicationsCount } from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/applications-count", protect, getApplicationsCount);

export default router;
