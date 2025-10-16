import express from "express";
import {
  addReview,
  getProjectReviews,
  updateReview,
  deleteReview,
  getAllReviews,
  toggleVerified,
} from "../controllers/reviewController";
import { authenticateJwt } from "../middleware/auth";

const router = express.Router();

// Public route - get reviews for a template
router.get("/:id", getProjectReviews);
router.get("/admin/all", authenticateJwt, getAllReviews);

// Protected routes - require authentication
router.post("/:id", authenticateJwt, addReview);
router.put("/:reviewId", authenticateJwt, updateReview);
router.put("/:reviewId/verified", authenticateJwt, toggleVerified);
router.delete("/:reviewId", authenticateJwt, deleteReview);

export default router;
