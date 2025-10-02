import express from "express";
import multer from "multer";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getFeaturedProjects,
  getProjectBySlug,
} from "../controllers/projectController";
import { validateQueryParams } from "../validators/projectValidate";
import { sendResponse } from "../middleware/response";
import { StatusCodes } from "http-status-codes";
import uploadMiddleware from "../middleware/upload";
import { authenticateJwt } from "../middleware/auth";

const router = express.Router();

// Middleware to handle multer errors
const handleMulterError = (
  error: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "File size too large. Maximum size is 5MB."
      );
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "Too many files. Only 1 file is allowed."
      );
    }
    return sendResponse(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      `Upload error: ${error.message}`
    );
  }

  if (error.message.includes("Invalid file type")) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, false, error.message);
  }

  next(error);
};

// Middleware to validate query parameters
const validateQuery = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const errors = validateQueryParams(req.query);
  if (errors.length > 0) {
    return sendResponse(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      "Invalid query parameters",
      undefined,
      undefined,
      errors.map((error) => ({ field: "query", message: error }))
    );
  }
  next();
};

// Public routes (no authentication required)

/**
 * @route   GET /api/projects
 * @desc    Get all projects with filtering, sorting, and pagination
 * @access  Public
 * @query   page?: number, limit?: number, sortBy?: string, sortOrder?: 'asc'|'desc'
 *          category?: string, status?: string, featured?: boolean, search?: string
 */
router.get("/", validateQuery, getProjects);

/**
 * @route   GET /api/projects/featured
 * @desc    Get featured projects
 * @access  Public
 * @query   limit?: number
 */
router.get("/featured", getFeaturedProjects);

/**
 * @route   GET /api/projects/slug/:slug
 * @desc    Get project by slug
 * @access  Public
 * @query   lang?: 'en'|'ar'
 */
router.get("/slug/:slug", getProjectBySlug);

/**
 * @route   GET /api/projects/:id
 * @desc    Get single project by ID
 * @access  Public
 */
router.get("/:id", getProjectById);

// Protected routes (authentication required)

/**
 * @route   POST /api/projects
 * @desc    Create a new project
 * @access  Private (Admin only)
 * @body    CreateProjectInput + image file
 */
router.post(
  "/",
  authenticateJwt,
  uploadMiddleware,
  handleMulterError,
  createProject
);

/**
 * @route   PUT /api/projects/:id
 * @desc    Update a project
 * @access  Private (Admin only)
 * @body    UpdateProjectInput + optional image file
 */
router.put(
  "/:id",
  authenticateJwt,
  uploadMiddleware,
  handleMulterError,
  updateProject
);

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete a project
 * @access  Private (Admin only)
 */
router.delete("/:id", authenticateJwt, deleteProject);

// Error handling for undefined routes
router.all("*", (req: express.Request, res: express.Response) => {
  sendResponse(
    res,
    StatusCodes.NOT_FOUND,
    false,
    `Route ${req.originalUrl} not found`
  );
});

export default router;
