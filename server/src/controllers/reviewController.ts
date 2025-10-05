import { Response } from "express";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../middleware/asyncHandler";
import { AuthenticatedRequest } from "../middleware/auth";
import { addReviewsSchema } from "../validators/templateValidate";
import { sendResponse } from "../middleware/response";
import { prisma } from "../utils/prisma";


export const addReview = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Parse and validate request body
      const { rating, comment } = addReviewsSchema.parse(req.body);

      // Get template ID from params
      const templateId = parseInt(req.params.id);

      // Get authenticated user ID
      const userId = req.user?.userId;

      // Validate template ID
      if (!templateId || isNaN(templateId)) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Valid template ID is required"
        );
      }

      // Validate user authentication
      if (!userId) {
        return sendResponse(
          res,
          StatusCodes.UNAUTHORIZED,
          false,
          "User authentication required"
        );
      }

      // Check if template exists
      const templateExists = await prisma.template.findUnique({
        where: { id: templateId },
        select: { id: true, isActive: true },
      });

      if (!templateExists) {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          false,
          "Template not found"
        );
      }

      if (!templateExists.isActive) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Cannot review an inactive template"
        );
      }

      // Check if user has already reviewed this template
      const existingReview = await prisma.review.findUnique({
        where: {
          templateId_userId: {
            templateId,
            userId,
          },
        },
      });

      if (existingReview) {
        return sendResponse(
          res,
          StatusCodes.CONFLICT,
          false,
          "You have already reviewed this template. You can edit your existing review instead."
        );
      }

      // Check if user has purchased the template (for verified review)
      const hasPurchased = await prisma.order.findFirst({
        where: {
          userId,
          templateId,
          status: "COMPLETED",
        },
        select: { id: true },
      });

      // Create the review
      const review = await prisma.review.create({
        data: {
          rating,
          comment: comment || null,
          templateId,
          userId,
          verified: !!hasPurchased, // Automatically verify if purchased
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

      // Update template rating statistics
      await updateTemplateRatingStats(templateId);

      return sendResponse(
        res,
        StatusCodes.CREATED,
        true,
        "Review added successfully",
        { review }
      );
    } catch (error) {
      console.error("Add review error:", error);

      // Handle Zod validation errors
      if (error instanceof z.ZodError) {
        const errorMessages = error.issues.map((err) => err.message).join(", ");
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          `Validation error: ${errorMessages}`
        );
      }

      // Handle Prisma errors
      if (error instanceof Error) {
        // Unique constraint violation
        if (
          error.message.includes("Unique constraint") ||
          error.message.includes("unique_constraint")
        ) {
          return sendResponse(
            res,
            StatusCodes.CONFLICT,
            false,
            "You have already reviewed this template"
          );
        }

        // Foreign key constraint (user or template doesn't exist)
        if (error.message.includes("Foreign key constraint")) {
          return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            false,
            "Invalid user or template reference"
          );
        }
      }

      // Generic error response
      return sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Failed to add review"
      );
    }
  }
);



// Get reviews for a template
export const getTemplateReviews = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const templateId = parseInt(req.params.id);

      if (!templateId || isNaN(templateId)) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Valid template ID is required"
        );
      }

      const reviews = await prisma.review.findMany({
        where: { templateId },
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
        orderBy: [
          { verified: "desc" }, // Verified reviews first
          { createdAt: "desc" },
        ],
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

// Update review (user can edit their own review)
export const updateReview = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { rating, comment } = addReviewsSchema.parse(req.body);
      const reviewId = parseInt(req.params.reviewId);
      const userId = req.user?.userId;

      if (!reviewId || isNaN(reviewId)) {
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

      // Update template rating stats
      await updateTemplateRatingStats(existingReview.templateId);

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

// Delete review
export const deleteReview = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const reviewId = parseInt(req.params.reviewId);
      const userId = req.user?.userId;
      const isAdmin = req.user?.role === "ADMIN"; // Adjust based on your auth structure

      if (!reviewId || isNaN(reviewId)) {
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

      // Check permission (user owns review or is admin)
      if (existingReview.userId !== userId && !isAdmin) {
        return sendResponse(
          res,
          StatusCodes.FORBIDDEN,
          false,
          "You don't have permission to delete this review"
        );
      }

      // Delete review
      await prisma.review.delete({
        where: { id: reviewId },
      });

      // Update template rating stats
      await updateTemplateRatingStats(existingReview.templateId);

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











// Helper function to update template rating statistics
async function updateTemplateRatingStats(templateId: number) {
  try {
    // Get all reviews for this template
    const reviews = await prisma.review.findMany({
      where: { templateId },
      select: { rating: true },
    });

    if (reviews.length === 0) return;

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    // Update template with new rating stats
    await prisma.template.update({
      where: { id: templateId },
      data: {
        rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
        ratingsCount: reviews.length,
      },
    });
  } catch (error) {
    console.error("Error updating template rating stats:", error);
    // Don't throw error - this is a non-critical operation
  }
}