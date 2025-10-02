import { asyncHandler } from "../middleware/asyncHandler";
import { AuthenticatedRequest, requireAuth } from "../middleware/auth";
import { Request, Response } from "express";
import { sendResponse } from "../middleware/response";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../utils/prisma";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import {
  blogCommentsQuerySchema,
  commentQuerySchema,
  createCommentSchema,
  updateCommentSchema,
} from "../validators/commentValidate";

function extractZodErrors(error: ZodError): string[] {
  return error.issues.map((err) => err.message);
}

function parseIntParam(
  param: string | undefined,
  paramName: string
): number | null {
  if (!param) return null;
  const parsed = parseInt(param, 10);
  if (isNaN(parsed) || parsed <= 0) return null;
  return parsed;
}

// ============ CONTROLLERS ============

/**
 * Create a new comment
 * POST /api/blogs/:id/comments
 * Auth: Required
 */
export const createComment = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    // Check authentication
    if (!requireAuth(req, res)) return;

    const userId = req.user?.userId;
    const blogId = parseIntParam(req.params.id, "blogId");

    if (!blogId) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "Invalid blog ID"
      );
    }

    // Validate request body
    const requestData = { ...req.body, blogId };
    const validation = createCommentSchema.safeParse(requestData);

    if (!validation.success) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "Validation failed",
        undefined,
        undefined,
        extractZodErrors(validation.error)
      );
    }

    const validData = validation.data;

    // Check if blog exists
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      select: { id: true },
    });

    if (!blog) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, "Blog not found");
    }

    // If parentId is provided, verify parent comment exists and belongs to this blog
    if (validData.parentId) {
      const parentComment = await prisma.comment.findFirst({
        where: {
          id: validData.parentId,
          blogId: blogId,
        },
        select: { id: true },
      });

      if (!parentComment) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Parent comment not found or doesn't belong to this blog"
        );
      }
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        blogId: blogId,
        userId: userId,
        name: validData.name,
        email: validData.email,
        content: validData.content,
        parentId: validData.parentId || null,
        approved: false, // Comments need approval by default
      },
      include: {
        replies: {
          where: { approved: true },
          orderBy: { createdAt: "asc" },
        },
        parent: {
          select: {
            id: true,
            name: true,
            content: true,
          },
        },
      },
    });

    return sendResponse(
      res,
      StatusCodes.CREATED,
      true,
      "Comment created successfully. It will be visible after approval.",
      comment
    );
  }
);

/**
 * Get comments for a specific blog
 * GET /api/blogs/:id/comments
 * Auth: Not required (public endpoint)
 */
export const getCommentsByBlogId = asyncHandler(
  async (req: Request, res: Response) => {
    const blogId = parseIntParam(req.params.id, "blogId");

    if (!blogId) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "Invalid blog ID"
      );
    }

    // Validate query parameters
    const queryValidation = blogCommentsQuerySchema.safeParse(req.query);

    if (!queryValidation.success) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "Invalid query parameters",
        undefined,
        undefined,
        extractZodErrors(queryValidation.error)
      );
    }

    const { page, limit, approved } = queryValidation.data;

    // Check if blog exists
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      select: { id: true },
    });

    if (!blog) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, "Blog not found");
    }

    // Build where clause
    const where: Prisma.CommentWhereInput = {
      blogId: blogId,
      parentId: null, // Only top-level comments
      approved: approved,
    };

    // Get comments with nested replies
    const [comments, totalCount] = await Promise.all([
      prisma.comment.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          replies: {
            where: { approved: true },
            orderBy: { createdAt: "asc" },
            include: {
              replies: {
                where: { approved: true },
                orderBy: { createdAt: "asc" },
              },
            },
          },
        },
      }),
      prisma.comment.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return sendResponse(
      res,
      StatusCodes.OK,
      true,
      "Comments retrieved successfully",
      {
        comments,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      }
    );
  }
);

/**
 * Update a comment
 * PUT /api/comments/:commentId
 * Auth: Required (Admin only)
 */
export const updateComment = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!requireAuth(req, res)) return;

    const commentId = parseIntParam(req.params.commentId, "commentId");

    if (!commentId) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "Invalid comment ID"
      );
    }

    // Validate update data
    const validation = updateCommentSchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "Validation failed",
        undefined,
        undefined,
        extractZodErrors(validation.error)
      );
    }

    const validData = validation.data;

    // Check if there's actually something to update
    if (Object.keys(validData).length === 0) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "No valid fields to update"
      );
    }

    // Check if comment exists
    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true },
    });

    if (!existingComment) {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        false,
        "Comment not found"
      );
    }

    // Update comment
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: validData,
      include: {
        replies: {
          where: { approved: true },
          orderBy: { createdAt: "asc" },
        },
        parent: {
          select: {
            id: true,
            name: true,
            content: true,
          },
        },
      },
    });

    return sendResponse(
      res,
      StatusCodes.OK,
      true,
      "Comment updated successfully",
      updatedComment
    );
  }
);

/**
 * Approve a comment
 * PATCH /api/comments/:commentId/approve
 * Auth: Required (Admin only)
 */
export const approveComment = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!requireAuth(req, res)) return;

    const commentId = parseIntParam(req.params.commentId, "commentId");

    if (!commentId) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "Invalid comment ID"
      );
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true, approved: true },
    });

    if (!comment) {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        false,
        "Comment not found"
      );
    }

    if (comment.approved) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "Comment is already approved"
      );
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { approved: true },
      include: {
        blog: {
          select: {
            id: true,
            title_en: true,
            slug: true,
          },
        },
      },
    });

    return sendResponse(
      res,
      StatusCodes.OK,
      true,
      "Comment approved successfully",
      updatedComment
    );
  }
);

/**
 * Delete a comment
 * DELETE /api/comments/:commentId
 * Auth: Required (Admin only)
 */
export const deleteComment = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!requireAuth(req, res)) return;

    const commentId = parseIntParam(req.params.commentId, "commentId");

    if (!commentId) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "Invalid comment ID"
      );
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        id: true,
        _count: {
          select: { replies: true },
        },
      },
    });

    if (!comment) {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        false,
        "Comment not found"
      );
    }

    // Delete comment (cascade will handle replies)
    await prisma.comment.delete({
      where: { id: commentId },
    });

    return sendResponse(
      res,
      StatusCodes.OK,
      true,
      `Comment deleted successfully${
        comment._count.replies > 0
          ? ` along with ${comment._count.replies} replies`
          : ""
      }`
    );
  }
);

/**
 * Get all comments (for admin moderation)
 * GET /api/comments
 * Auth: Required (Admin only)
 */
export const getAllComments = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!requireAuth(req, res)) return;

    const queryValidation = commentQuerySchema.safeParse(req.query);

    if (!queryValidation.success) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "Invalid query parameters",
        undefined,
        undefined,
        extractZodErrors(queryValidation.error)
      );
    }

    const { page, limit, approved, sortBy, sortOrder } = queryValidation.data;

    const where: Prisma.CommentWhereInput = {};
    if (approved !== undefined) where.approved = approved;

    const [comments, totalCount] = await Promise.all([
      prisma.comment.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          blog: {
            select: {
              id: true,
              title_en: true,
              slug: true,
            },
          },
          parent: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              replies: true,
            },
          },
        },
      }),
      prisma.comment.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return sendResponse(
      res,
      StatusCodes.OK,
      true,
      "Comments retrieved successfully",
      {
        comments,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      }
    );
  }
);

/**
 * Get comments analytics
 * GET /api/comments/analytics
 * Auth: Required (Admin only)
 */
export const getCommentsAnalytics = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!requireAuth(req, res)) return;

    const [
      totalComments,
      approvedComments,
      pendingComments,
      recentComments,
      topCommentedBlogs,
    ] = await Promise.all([
      prisma.comment.count(),
      prisma.comment.count({ where: { approved: true } }),
      prisma.comment.count({ where: { approved: false } }),
      prisma.comment.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          blog: {
            select: {
              id: true,
              title_en: true,
              slug: true,
            },
          },
        },
      }),
      prisma.blog.findMany({
        select: {
          id: true,
          title_en: true,
          slug: true,
          _count: {
            select: {
              comments: {
                where: { approved: true },
              },
            },
          },
        },
        orderBy: {
          comments: {
            _count: "desc",
          },
        },
        take: 10,
        where: {
          comments: {
            some: {
              approved: true,
            },
          },
        },
      }),
    ]);

    const approvalRate =
      totalComments > 0
        ? ((approvedComments / totalComments) * 100).toFixed(1)
        : "0";

    return sendResponse(
      res,
      StatusCodes.OK,
      true,
      "Comments analytics retrieved successfully",
      {
        overview: {
          totalComments,
          approvedComments,
          pendingComments,
          approvalRate: `${approvalRate}%`,
        },
        recentActivity: recentComments,
        topCommentedBlogs: topCommentedBlogs.map((blog) => ({
          id: blog.id,
          title: blog.title_en,
          slug: blog.slug,
          commentCount: blog._count.comments,
        })),
      }
    );
  }
);
