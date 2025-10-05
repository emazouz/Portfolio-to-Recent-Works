// templatesRouter.ts

import { Router } from "express";
import {
  createTemplate,
  getTemplates,
  getTemplateById,
  getTemplateBySlug,
  updateTemplate,
  deleteTemplate,
  getFeaturedTemplates,
  getPopularTemplates,
  getNewTemplates,
  getTopRatedTemplates,
  getTemplatesByCategory,
  getTemplateStats,
  incrementDownloads,
  bulkOperations,
  getTemplateAnalytics,
  getSimilarTemplates,
  getCategoryStats,
  updateTemplateVersion,
  getMyPurchasedTemplates,
} from "../controllers/templateController";
import { authenticateJwt } from "../middleware/auth";
import uploadMiddleware from "../middleware/upload";

const router = Router();

// ============ PUBLIC ROUTES (No Authentication Required) ============

/**
 * @route   GET /api/templates
 * @desc    Get all active templates with filtering, sorting, and pagination
 * @access  Public
 * @query   page, limit, category, difficulty, featured, minPrice, maxPrice, search, sortBy, sortOrder
 */
router.get("/", getTemplates);

/**
 * @route   GET /api/templates/featured
 * @desc    Get featured templates
 * @access  Public
 * @query   limit (optional, default: 6, max: 20)
 */
router.get("/featured", getFeaturedTemplates);

/**
 * @route   GET /api/templates/popular
 * @desc    Get popular templates based on downloads
 * @access  Public
 * @query   limit (optional, default: 6, max: 20)
 */
router.get("/popular", getPopularTemplates);

/**
 * @route   GET /api/templates/new
 * @desc    Get newest templates
 * @access  Public
 * @query   limit (optional, default: 6, max: 20)
 */
router.get("/new", getNewTemplates);

/**
 * @route   GET /api/templates/top-rated
 * @desc    Get top-rated templates
 * @access  Public
 * @query   limit (optional, default: 6, max: 20)
 */
router.get("/top-rated", getTopRatedTemplates);

/**
 * @route   GET /api/templates/categories/stats
 * @desc    Get category statistics
 * @access  Public
 */
router.get("/categories/stats", getCategoryStats);

/**
 * @route   GET /api/templates/category/:category
 * @desc    Get templates by category
 * @access  Public
 * @params  category (TemplateCategory enum)
 * @query   page, limit
 */
router.get("/category/:category", getTemplatesByCategory);

/**
 * @route   GET /api/templates/slug/:slug
 * @desc    Get template by slug (multi-language support)
 * @access  Public
 * @params  slug
 * @query   lang (optional, default: 'en', values: 'en' | 'ar')
 */
router.get("/slug/:slug", getTemplateBySlug);

/**
 * @route   GET /api/templates/:id
 * @desc    Get template by ID
 * @access  Public
 * @params  id (template ID)
 */
router.get("/:id", getTemplateById);

/**
 * @route   GET /api/templates/:id/similar
 * @desc    Get similar templates based on category, tags, and price
 * @access  Public
 * @params  id (template ID)
 * @query   limit (optional, default: 6, max: 20)
 */
router.get("/:id/similar", getSimilarTemplates);

// ============ USER ROUTES (Authentication Required) ============

/**
 * @route   GET /api/templates/my-purchases
 * @desc    Get user's purchased templates
 * @access  Private (User)
 */
router.get("/user/purchases", authenticateJwt, getMyPurchasedTemplates);

/**
 * @route   POST /api/templates/:id/download
 * @desc    Get download link (requires purchase verification)
 * @access  Private (User)
 * @params  id (template ID)
 */
router.post("/:id/download", incrementDownloads);

// ============ ADMIN ROUTES (Admin Authentication Required) ============

/**
 * @route   POST /api/templates
 * @desc    Create new template
 * @access  Private (Admin)
 * @body    All template fields (see createTemplateSchema)
 */
router.post("/", authenticateJwt, uploadMiddleware, createTemplate);

/**
 * @route   PUT /api/templates/:id
 * @desc    Update template
 * @access  Private (Admin)
 * @params  id (template ID)
 * @body    Fields to update (partial template data)
 */
router.put("/:id", authenticateJwt, updateTemplate);

/**
 * @route   DELETE /api/templates/:id
 * @desc    Soft delete template (set isActive to false)
 * @access  Private (Admin)
 * @params  id (template ID)
 */
router.delete("/:id", deleteTemplate);

/**
 * @route   PATCH /api/templates/:id/restore
 * @desc    Restore soft-deleted template
 * @access  Private (Admin)
 * @params  id (template ID)
 */

/**
 * @route   PATCH /api/templates/:id/version
 * @desc    Update template version and changelog
 * @access  Private (Admin)
 * @params  id (template ID)
 * @body    version, changelog, downloadUrl (optional)
 */
router.patch("/:id/version", updateTemplateVersion);

/**
 * @route   GET /api/templates/:id/stats
 * @desc    Get detailed template statistics
 * @access  Private (Admin)
 * @params  id (template ID)
 */
router.get("/:id/stats", getTemplateStats);

/**
 * @route   POST /api/templates/bulk
 * @desc    Perform bulk operations on templates
 * @access  Private (Admin)
 * @body    templateIds (array), operation (activate|deactivate|feature|unfeature|delete)
 */
router.post("/bulk", bulkOperations);

/**
 * @route   GET /api/templates/admin/all
 * @desc    Get all templates including inactive (admin view)
 * @access  Private (Admin)
 * @query   page, limit, isActive, featured, category, sortBy, sortOrder
 */
// router.get("/admin/all", getAllTemplatesAdmin);

/**
 * @route   GET /api/templates/admin/analytics
 * @desc    Get comprehensive template analytics dashboard
 * @access  Private (Admin)
 */
router.get("/admin/analytics", authenticateJwt, getTemplateAnalytics);

export default router;
