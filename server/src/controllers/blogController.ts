import { asyncHandler } from "../middleware/asyncHandler";
import {
  AuthenticatedRequest,
  requireAdmin,
  requireAuth,
} from "../middleware/auth";
import { Request, Response } from "express";
import { sendResponse } from "../middleware/response";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../utils/prisma";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary";
import { Prisma } from "@prisma/client";
import {
  validateBlogData,
  validateBlogUpdate,
  validateBlogFiles,
  validateQueryParams,
  CreateBlogInput,
  UpdateBlogInput,
  BlogQueryParams,
} from "../validators/blogValidate";
import { FileRequest, MulterFiles } from "../types/FileRequest";
import { getFiles } from "../middleware/upload";

const processBlogData = (body: any): any => {
  const processed = { ...body };

  // Parse JSON fields if they're strings
  if (typeof processed.tags === "string") {
    try {
      processed.tags = JSON.parse(processed.tags);
    } catch {
      processed.tags = processed.tags
        .split(",")
        .map((tag: string) => tag.trim());
    }
  }

  if (typeof processed.keywords === "string") {
    try {
      processed.keywords = JSON.parse(processed.keywords);
    } catch {
      processed.keywords = processed.keywords
        .split(",")
        .map((keyword: string) => keyword.trim());
    }
  }

  // Convert string booleans
  if (typeof processed.published === "string") {
    processed.published = processed.published === "true";
  }

  if (typeof processed.featured === "string") {
    processed.featured = processed.featured === "true";
  }

  // Convert readTime to number
  if (processed.readTime && typeof processed.readTime === "string") {
    processed.readTime = parseInt(processed.readTime, 10);
  }

  return processed;
};

const calculateReadTime = (content_en: string, content_ar: string): number => {
  const wordsPerMinute = 200;
  const wordCount =
    content_en.split(/\s+/).length + content_ar.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// Create Blog
export const createBlog = asyncHandler(
  async (req: FileRequest, res: Response) => {
    if (!requireAdmin(req, res)) return;

    try {
      const files = getFiles(req.files);
      const processedData = processBlogData(req.body);

      // Validate the processed data
      console.log("processedData :", processedData);
      console.log("files :", files);
      const validation = validateBlogData(processedData);
      const fileErrors = validateBlogFiles(files);

      const allErrors = [...(validation.errors || []), ...fileErrors];
      if (allErrors.length > 0) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Validation failed",
          undefined,
          undefined,
          allErrors
        );
      }

      const validData = validation.data!;

      // Handle image upload
      let imageUrl: string | undefined;
      if (files.gallery && files.gallery[0]) {
        try {
          const uploadedImage = await uploadToCloudinary(
            files.gallery[0],
            "Blog/gallery"
          );
          imageUrl = uploadedImage.url;
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            false,
            "Failed to upload image. Please try again."
          );
        }
      }

      // Check for duplicate slugs
      const existingBlog = await prisma.blog.findFirst({
        where: { slug: validData.slug },
      });

      if (existingBlog) {
        // Clean up uploaded image if slug validation fails
        if (imageUrl) {
          try {
            await deleteFromCloudinary(imageUrl);
          } catch (cleanupError) {
            console.warn("Failed to cleanup uploaded image:", cleanupError);
          }
        }

        return sendResponse(
          res,
          StatusCodes.CONFLICT,
          false,
          "A blog with this slug already exists"
        );
      }

      // Calculate read time if not provided
      const readTime =
        validData.readTime ||
        calculateReadTime(validData.content_en, validData.content_ar);

      // Create the blog with transaction for data integrity
      const blog = await prisma.$transaction(async (tx) => {
        return tx.blog.create({
          data: {
            title_en: validData.title_en,
            title_ar: validData.title_ar,
            content_en: validData.content_en,
            content_ar: validData.content_ar,
            slug: validData.slug,
            excerpt_en: validData.excerpt_en,
            excerpt_ar: validData.excerpt_ar,
            authorId: req.user?.userId,
            // authorId: validData.authorId || req.user?.userId,
            published: validData.published,
            featured: validData.featured,
            category: validData.category,
            tags: validData.tags,
            imageUrl,
            readTime,
            metaTitle_en: validData.metaTitle_en,
            metaTitle_ar: validData.metaTitle_ar,
            metaDesc_en: validData.metaDesc_en,
            metaDesc_ar: validData.metaDesc_ar,
            keywords: validData.keywords,
            publishDate: validData.publishDate
              ? new Date(validData.publishDate)
              : undefined,
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        });
      });

      return sendResponse(
        res,
        StatusCodes.CREATED,
        true,
        "Blog created successfully",
        blog
      );
    } catch (error: any) {
      console.error("Error creating blog:", error);

      // Handle specific Prisma errors
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return sendResponse(
            res,
            StatusCodes.CONFLICT,
            false,
            "A blog with this information already exists"
          );
        }
        if (error.code === "P2003") {
          return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            false,
            "Invalid data provided"
          );
        }
      }

      return sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Server error while creating blog"
      );
    }
  }
);

// Get All Blogs
export const getAllBlogs = asyncHandler(async (req: Request, res: Response) => {
  try {
    const queryValidation = validateQueryParams(req.query);

    if (!queryValidation.isValid) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "Invalid query parameters",
        undefined,
        undefined,
        queryValidation.errors
      );
    }

    const {
      page = 1,
      limit = 10,
      published,
      featured,
      category,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = queryValidation.data!;

    // Build where clause
    const where: Prisma.BlogWhereInput = {};

    if (published !== undefined) where.published = published;
    if (featured !== undefined) where.featured = featured;
    if (category) where.category = category;
    // if (authorId) where.authorId = authorId;

    if (search) {
      where.OR = [
        { title_en: { contains: search, mode: "insensitive" } },
        { title_ar: { contains: search, mode: "insensitive" } },
        { content_en: { contains: search, mode: "insensitive" } },
        { content_ar: { contains: search, mode: "insensitive" } },
        { tags: { hasSome: [search] } },
        { keywords: { hasSome: [search] } },
      ];
    }

    // Execute queries in parallel
    const [blogs, totalCount] = await Promise.all([
      prisma.blog.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          comments: true,
        },
      }),
      prisma.blog.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return sendResponse(
      res,
      StatusCodes.OK,
      true,
      "Blogs retrieved successfully",
      {
        blogs,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      }
    );
  } catch (error: any) {
    console.error("Error fetching blogs:", error);
    return sendResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      "Server error while fetching blogs"
    );
  }
});

// Get Single Blog
export const getBlogById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;

      if (!id || isNaN(Number(id))) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Invalid blog ID"
        );
      }

      const blog = await prisma.blog.findUnique({
        where: { id: Number(id) },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          comments: {
            where: { parentId: null }, // Only top-level comments
            include: {
              replies: {
                include: {
                  replies: true, // Support nested replies
                },
              },
            },
            orderBy: { createdAt: "desc" },
          },
          blogLikes: {
            select: {
              userId: true,
              isLiked: true,
            },
            where: {
              isLiked: true,
            },
          },
        },
      });

      if (!blog) {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          false,
          "Blog not found"
        );
      }

      let userLiked = false;
      if (userId) {
        userLiked = blog.blogLikes.some(
          (like) => like.userId === userId && like.isLiked
        );
      }

      await prisma.blog.update({
        where: { id: Number(id) },
        data: { views: { increment: 1 } },
      });

      const { blogLikes, ...rest } = blog;

      return sendResponse(
        res,
        StatusCodes.OK,
        true,
        "Blog retrieved successfully",
        {
          ...rest,
          views: blog.views + 1,
          userLiked,
        }
      );
    } catch (error: any) {
      console.error("Error fetching blog:", error);
      return sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Server error while fetching blog"
      );
    }
  }
);

// Get Blog by Slug
export const getBlogBySlug = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;

      if (!slug) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Slug is required"
        );
      }

      const blog = await prisma.blog.findUnique({
        where: { slug },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          comments: {
            where: { parentId: null },
            include: {
              replies: {
                include: {
                  replies: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
          },
        },
      });

      if (!blog) {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          false,
          "Blog not found"
        );
      }

      // Increment views count
      await prisma.blog.update({
        where: { slug },
        data: { views: { increment: 1 } },
      });

      return sendResponse(
        res,
        StatusCodes.OK,
        true,
        "Blog retrieved successfully",
        { ...blog, views: blog.views + 1 }
      );
    } catch (error: any) {
      console.error("Error fetching blog:", error);
      return sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Server error while fetching blog"
      );
    }
  }
);

// Update Blog
export const updateBlog = asyncHandler(
  async (req: FileRequest, res: Response) => {
    if (!requireAdmin(req, res)) return;

    try {
      const { id } = req.params;

      if (!id || isNaN(Number(id))) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Invalid blog ID"
        );
      }

      // Check if blog exists
      const existingBlog = await prisma.blog.findUnique({
        where: { id: Number(id) },
      });

      if (!existingBlog) {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          false,
          "Blog not found"
        );
      }

      const files = getFiles(req.files);
      const processedData = processBlogData(req.body);

      // Validate the processed data
      const validation = validateBlogUpdate(processedData);
      const fileErrors = validateBlogFiles(files);

      const allErrors = [...(validation.errors || []), ...fileErrors];
      if (allErrors.length > 0) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Validation failed",
          undefined,
          undefined,
          allErrors
        );
      }

      const validData = validation.data!;

      // Check for duplicate slugs if slug is being updated
      if (validData.slug && validData.slug !== existingBlog.slug) {
        const duplicateSlug = await prisma.blog.findFirst({
          where: {
            slug: validData.slug,
            id: { not: Number(id) },
          },
        });

        if (duplicateSlug) {
          return sendResponse(
            res,
            StatusCodes.CONFLICT,
            false,
            "A blog with this slug already exists"
          );
        }
      }

      // Handle image upload/update
      let imageUrl = existingBlog.imageUrl;
      if (files.gallery && files.gallery[0]) {
        try {
          // Upload new image
          const uploadedImage = await uploadToCloudinary(
            files.gallery[0],
            "Blog/gallery"
          );

          // Delete old image if it exists
          if (existingBlog.imageUrl) {
            try {
              await deleteFromCloudinary(existingBlog.imageUrl);
            } catch (deleteError) {
              console.warn("Failed to delete old image:", deleteError);
            }
          }

          imageUrl = uploadedImage.url;
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            false,
            "Failed to upload image. Please try again."
          );
        }
      }

      // Update the blog
      const updatedBlog = await prisma.blog.update({
        where: { id: Number(id) },
        data: {
          ...validData,
          imageUrl,
          publishDate: validData.publishDate
            ? new Date(validData.publishDate)
            : existingBlog.publishDate,
          readTime:
            validData.readTime ||
            (validData.content_en && validData.content_ar
              ? calculateReadTime(validData.content_en, validData.content_ar)
              : existingBlog.readTime),
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return sendResponse(
        res,
        StatusCodes.OK,
        true,
        "Blog updated successfully",
        updatedBlog
      );
    } catch (error: any) {
      console.error("Error updating blog:", error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return sendResponse(
            res,
            StatusCodes.CONFLICT,
            false,
            "A blog with this information already exists"
          );
        }
      }

      return sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Server error while updating blog"
      );
    }
  }
);

// Delete Blog
export const deleteBlog = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!requireAdmin(req, res)) return;

    try {
      const { id } = req.params;

      if (!id || isNaN(Number(id))) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Invalid blog ID"
        );
      }

      const blog = await prisma.blog.findUnique({
        where: { id: Number(id) },
      });

      if (!blog) {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          false,
          "Blog not found"
        );
      }

      // Delete associated image from Cloudinary
      if (blog.imageUrl) {
        try {
          await deleteFromCloudinary(blog.imageUrl);
        } catch (deleteError) {
          console.warn("Failed to delete image from Cloudinary:", deleteError);
        }
      }

      // Delete the blog (comments will be cascade deleted)
      await prisma.blog.delete({
        where: { id: Number(id) },
      });

      return sendResponse(
        res,
        StatusCodes.OK,
        true,
        "Blog deleted successfully"
      );
    } catch (error: any) {
      console.error("Error deleting blog:", error);
      return sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Server error while deleting blog"
      );
    }
  }
);

// Like Blog
export const likeBlog = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!requireAuth(req, res)) return;
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!id || isNaN(Number(id))) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Invalid blog ID"
        );
      }

      const blog = await prisma.blog.findUnique({
        where: { id: Number(id) },
      });

      if (!blog) {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          false,
          "Blog not found"
        );
      }

      const existingLike = await prisma.blogLike.findUnique({
        where: {
          blogId_userId: {
            blogId: Number(id),
            userId: String(userId),
          },
          isLiked: true,
        },
      });

      if (existingLike) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "You already liked this blog"
        );
      }

      await prisma.blogLike.create({
        data: {
          blogId: Number(id),
          userId: String(userId),
          isLiked: true,
        },
      });

      const updatedBlog = await prisma.blog.update({
        where: { id: Number(id) },
        data: { likes: { increment: 1 } },
      });

      return sendResponse(
        res,
        StatusCodes.OK,
        true,
        "Blog liked successfully",
        {
          likes: updatedBlog.likes,
        }
      );
    } catch (error: any) {
      console.error("Error liking blog:", error);
      return sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Server error while liking blog"
      );
    }
  }
);

// Get Blog Analytics (Admin only)
export const getBlogAnalytics = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!requireAdmin(req, res)) return;

    try {
      const [
        totalBlogs,
        publishedBlogs,
        featuredBlogs,
        totalViews,
        totalLikes,
        topViewedBlogs,
        topLikedBlogs,
        categoriesCount,
      ] = await Promise.all([
        prisma.blog.count(),
        prisma.blog.count({ where: { published: true } }),
        prisma.blog.count({ where: { featured: true } }),
        prisma.blog.aggregate({ _sum: { views: true } }),
        prisma.blog.aggregate({ _sum: { likes: true } }),
        prisma.blog.findMany({
          orderBy: { views: "desc" },
          take: 10,
          select: { id: true, title_en: true, views: true, slug: true },
        }),
        prisma.blog.findMany({
          orderBy: { likes: "desc" },
          take: 10,
          select: { id: true, title_en: true, likes: true, slug: true },
        }),
        prisma.blog.groupBy({
          by: ["category"],
          _count: { category: true },
        }),
      ]);

      return sendResponse(
        res,
        StatusCodes.OK,
        true,
        "Blog analytics retrieved successfully",
        {
          overview: {
            totalBlogs,
            publishedBlogs,
            featuredBlogs,
            totalViews: totalViews._sum.views || 0,
            totalLikes: totalLikes._sum.likes || 0,
          },
          topContent: {
            topViewedBlogs,
            topLikedBlogs,
          },
          categoriesDistribution: categoriesCount,
        }
      );
    } catch (error: any) {
      console.error("Error fetching blog analytics:", error);
      return sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Server error while fetching analytics"
      );
    }
  }
);
