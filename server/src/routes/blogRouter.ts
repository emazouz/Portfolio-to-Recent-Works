import { Router } from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
  likeBlog,
  getBlogAnalytics,
} from "../controllers/blogController";
import { authenticateJwt } from "../middleware/auth";
import uploadMiddleware from "../middleware/upload";

const router = Router();

// ===============================
// BLOG ROUTES
// ===============================

// Public blog routes
router.get("/", getAllBlogs); // GET /api/blogs?page=1&limit=10&category=WEB_DEVELOPMENT&search=react
router.get("/slug/:slug", getBlogBySlug); // GET /api/blogs/slug/my-blog-post
router.get("/:id", authenticateJwt, getBlogById); // GET /api/blogs/123
router.post("/:id/like", authenticateJwt, likeBlog); // POST /api/blogs/123/like

// Admin blog routes (require authentication and admin role)
router.post("/", authenticateJwt, uploadMiddleware, createBlog); // POST /api/blogs (with image upload)

router.put("/:id", authenticateJwt, uploadMiddleware, updateBlog); // PUT /api/blogs/123 (with optional image update)

router.delete("/:id", authenticateJwt, deleteBlog); // DELETE /api/blogs/123

// Analytics route (admin only)
router.get("/analytics/overview", authenticateJwt, getBlogAnalytics); // GET /api/blogs/analytics/overview

export default router;
