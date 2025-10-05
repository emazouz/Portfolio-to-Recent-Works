import express from "express";
import {
  addReview,
  getTemplateReviews,
  updateReview,
  deleteReview,
} from "../controllers/reviewController";
import { authenticateJwt } from "../middleware/auth";

const router = express.Router();

// Public route - get reviews for a template
router.get("/:id", getTemplateReviews);

// Protected routes - require authentication
router.post("/:id", authenticateJwt, addReview);
router.put("/:reviewId", authenticateJwt, updateReview);
router.delete("/:reviewId", authenticateJwt, deleteReview);

export default router;
