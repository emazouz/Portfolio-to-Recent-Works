import { Request, Response } from "express";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../middleware/asyncHandler";
import { AuthenticatedRequest, requireAdmin } from "../middleware/auth";
import { addReviewsSchema } from "../validators/reviewValidate";
import { sendResponse } from "../middleware/response";
import { prisma } from "../utils/prisma";

// ==================== TYPES ====================

type GetReviewsOptions = {
  page?: number;
  limit?: number;
  minRating?: number;
  maxRating?: number;
  userId?: string;
  projectId?: number;
  verifiedOnly?: boolean | string;
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Update project rating statistics after review changes
 */
async function updateProjectRatingStats(projectId: number): Promise<void> {
  try {
    const reviews = await prisma.review.findMany({
      where: { projectId },
      select: { rating: true },
    });

    if (reviews.length === 0) {
      await prisma.project.update({
        where: { id: projectId },
        data: {
          rating: 0,
          ratingsCount: 0,
        },
      });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await prisma.project.update({
      where: { id: projectId },
      data: {
        rating: Math.round(averageRating * 10) / 10,
        ratingsCount: reviews.length,
      },
    });
  } catch (error) {
    console.error("Error updating project rating stats:", error);
  }
}

/**
 * Validate and parse numeric ID from params
 */
function parseNumericId(id: string, fieldName: string = "ID"): number | null {
  const parsed = parseInt(id);
  if (isNaN(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

// ==================== REVIEW CONTROLLERS ====================

/**
 * Add a new review to a project
 * @route POST /api/projects/:id/reviews
 * @access Private
 */
export const addReview = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { rating, comment } = addReviewsSchema.parse(req.body);
      const projectId = parseNumericId(req.params.id, "Project ID");
      const userId = req.user?.userId;

      if (!projectId) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Valid project ID is required"
        );
      }

      if (!userId) {
        return sendResponse(
          res,
          StatusCodes.UNAUTHORIZED,
          false,
          "User authentication required"
        );
      }

      // Check if project exists
      const projectExists = await prisma.project.findUnique({
        where: { id: projectId },
        select: { id: true },
      });

      if (!projectExists) {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          false,
          "Project not found"
        );
      }

      // Check for existing review
      const existingReview = await prisma.review.findUnique({
        where: {
          projectId_userId: {
            projectId,
            userId,
          },
        },
      });

      if (existingReview) {
        return sendResponse(
          res,
          StatusCodes.CONFLICT,
          false,
          "You have already reviewed this project. You can edit your existing review instead."
        );
      }

      // Create review
      const review = await prisma.review.create({
        data: {
          rating,
          comment: comment || null,
          projectId,
          userId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
      });

      await updateProjectRatingStats(projectId);

      return sendResponse(
        res,
        StatusCodes.CREATED,
        true,
        "Review added successfully",
        { review }
      );
    } catch (error) {
      console.error("Add review error:", error);

      if (error instanceof z.ZodError) {
        const errorMessages = error.issues.map((err) => err.message).join(", ");
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          `Validation error: ${errorMessages}`
        );
      }

      if (error instanceof Error) {
        if (
          error.message.includes("Unique constraint") ||
          error.message.includes("unique_constraint")
        ) {
          return sendResponse(
            res,
            StatusCodes.CONFLICT,
            false,
            "You have already reviewed this project"
          );
        }

        if (error.message.includes("Foreign key constraint")) {
          return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            false,
            "Invalid user or project reference"
          );
        }
      }

      return sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Failed to add review"
      );
    }
  }
);

/**
 * Get all reviews for a specific project
 * @route GET /api/projects/:id/reviews
 * @access Public
 */
export const getProjectReviews = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const projectId = parseNumericId(req.params.id, "Project ID");

      if (!projectId) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Valid project ID is required"
        );
      }

      const reviews = await prisma.review.findMany({
        where: { projectId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          project: {
            select: {
              title_en: true,
              title_ar: true,
              rating: true,
            },
          },
        },
        orderBy: [{ verified: "desc" }, { createdAt: "desc" }],
      });

      return sendResponse(
        res,
        StatusCodes.OK,
        true,
        "Reviews fetched successfully",
        { reviews, count: reviews.length }
      );
    } catch (error) {
      console.error("Get reviews error:", error);
      return sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Failed to fetch reviews"
      );
    }
  }
);

/**
 * Get all reviews with filtering and pagination
 * @route GET /api/reviews
 * @access Public/Admin
 */
export const getAllReviews = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const {
        page = 1,
        limit = 20,
        minRating,
        maxRating,
        userId,
        projectId,
        verifiedOnly,
      } = req.query as GetReviewsOptions;

      const pageNum = Number(page);
      const limitNum = Number(limit);
      const minRatingNum = minRating ? Number(minRating) : undefined;
      const maxRatingNum = maxRating ? Number(maxRating) : undefined;
      const projectIdNum = projectId ? Number(projectId) : undefined;

      // Validate pagination parameters
      if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Invalid pagination parameters"
        );
      }

      // Build where clause
      const whereClause: any = {};

      if (minRatingNum !== undefined && maxRatingNum !== undefined) {
        whereClause.rating = { gte: minRatingNum, lte: maxRatingNum };
      } else if (minRatingNum !== undefined) {
        whereClause.rating = { gte: minRatingNum };
      } else if (maxRatingNum !== undefined) {
        whereClause.rating = { lte: maxRatingNum };
      }

      if (userId) {
        whereClause.userId = userId;
      }

      if (projectIdNum) {
        whereClause.projectId = projectIdNum;
      }

      if (verifiedOnly !== undefined) {
        whereClause.verified = verifiedOnly === "true" || verifiedOnly === true;
      }

      const [reviews, totalCount] = await Promise.all([
        prisma.review.findMany({
          skip: (pageNum - 1) * limitNum,
          take: limitNum,
          where: whereClause,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
            project: {
              select: {
                id: true,
                title_en: true,
                title_ar: true,
                rating: true,
              },
            },
          },
          orderBy: [{ verified: "desc" }, { createdAt: "desc" }],
        }),
        prisma.review.count({ where: whereClause }),
      ]);

      const totalPages = Math.ceil(totalCount / limitNum);

      return sendResponse(
        res,
        StatusCodes.OK,
        true,
        "Reviews fetched successfully",
        reviews,
        {
          pagination: {
            page: pageNum,
            limit: limitNum,
            total: totalCount,
            totalPages,
            hasNext: pageNum < totalPages,
            hasPrev: pageNum > 1,
          },
        }
      );
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      return sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Failed to fetch reviews"
      );
    }
  }
);

/**
 * Update user's own review
 * @route PUT /api/reviews/:reviewId
 * @access Private
 */
export const updateReview = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { rating, comment } = addReviewsSchema.parse(req.body);
      const reviewId = parseNumericId(req.params.reviewId, "Review ID");
      const userId = req.user?.userId;

      if (!reviewId) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Valid review ID is required"
        );
      }

      if (!userId) {
        return sendResponse(
          res,
          StatusCodes.UNAUTHORIZED,
          false,
          "User authentication required"
        );
      }

      // Check if review exists and belongs to user
      const existingReview = await prisma.review.findFirst({
        where: {
          id: reviewId,
          userId,
        },
      });

      if (!existingReview) {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          false,
          "Review not found or you don't have permission to edit it"
        );
      }

      // Update review
      const updatedReview = await prisma.review.update({
        where: { id: reviewId },
        data: {
          rating,
          comment: comment || null,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
      });

      await updateProjectRatingStats(existingReview.projectId);

      return sendResponse(
        res,
        StatusCodes.OK,
        true,
        "Review updated successfully",
        { review: updatedReview }
      );
    } catch (error) {
      console.error("Update review error:", error);

      if (error instanceof z.ZodError) {
        const errorMessages = error.issues.map((err) => err.message).join(", ");
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          `Validation error: ${errorMessages}`
        );
      }

      return sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Failed to update review"
      );
    }
  }
);

/**
 * Delete a review (Admin only)
 * @route DELETE /api/reviews/:reviewId
 * @access Admin
 */
export const deleteReview = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!requireAdmin(req, res)) return;

    try {
      const reviewId = parseNumericId(req.params.reviewId, "Review ID");

      if (!reviewId) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Valid review ID is required"
        );
      }

      // Check if review exists
      const existingReview = await prisma.review.findUnique({
        where: { id: reviewId },
      });

      if (!existingReview) {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          false,
          "Review not found"
        );
      }

      // Delete review
      await prisma.review.delete({
        where: { id: reviewId },
      });

      await updateProjectRatingStats(existingReview.projectId);

      return sendResponse(
        res,
        StatusCodes.OK,
        true,
        "Review deleted successfully"
      );
    } catch (error) {
      console.error("Delete review error:", error);
      return sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Failed to delete review"
      );
    }
  }
);

/**
 * Toggle verified status of a review (Admin only)
 * @route PATCH /api/reviews/:reviewId/verify
 * @access Admin
 */
export const toggleVerified = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!requireAdmin(req, res)) return;

    try {
      const reviewId = parseNumericId(req.params.reviewId, "Review ID");
      const { isVerified } = req.body;

      if (!reviewId) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Valid review ID is required"
        );
      }

      // Validate isVerified parameter
      if (typeof isVerified !== "boolean") {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "isVerified must be a boolean value"
        );
      }

      // Check if review exists
      const existingReview = await prisma.review.findUnique({
        where: { id: reviewId },
        select: {
          id: true,
          verified: true,
          projectId: true,
        },
      });

      if (!existingReview) {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          false,
          "Review not found"
        );
      }

      // Toggle verified status
      const updatedReview = await prisma.review.update({
        where: { id: reviewId },
        data: {
          verified: isVerified,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          project: {
            select: {
              id: true,
              title_en: true,
              title_ar: true,
              rating: true,
            },
          },
        },
      });

      const statusMessage = isVerified
        ? "Review marked as verified"
        : "Review verification removed";

      return sendResponse(res, StatusCodes.OK, true, statusMessage, {
        review: updatedReview,
      });
    } catch (error) {
      console.error("Toggle verified review error:", error);

      return sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Failed to update review verification status"
      );
    }
  }
);
