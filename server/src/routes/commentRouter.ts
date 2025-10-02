import { Router } from "express";
import {
  approveComment,
  createComment,
  deleteComment,
  getAllComments,
  getCommentsAnalytics,
  getCommentsByBlogId,
  updateComment,
} from "../controllers/commentController";
import { authenticateJwt } from "../middleware/auth";

const router = Router();

// Public comment routes
router.get("/:id", getCommentsByBlogId); // GET /api/blogs/123/comments?page=1&limit=20
router.post("/:id", authenticateJwt, createComment); // POST /api/blogs/123/comments

// Admin comment routes
router.get("/admin", authenticateJwt, getAllComments); // GET /api/blogs/admin/comments?approved=false
router.put("/:commentId", authenticateJwt, updateComment); // PUT /api/blogs/comments/456
router.post("/:commentId/approve", authenticateJwt, approveComment); // POST /api/blogs/comments/456/approve
router.delete("/:commentId", authenticateJwt, deleteComment); // DELETE /api/blogs/comments/456

// Comment analytics (admin only)
router.get("/admin/analytics", authenticateJwt, getCommentsAnalytics); // GET /api/blogs/admin/comments/analytics

export default router;
