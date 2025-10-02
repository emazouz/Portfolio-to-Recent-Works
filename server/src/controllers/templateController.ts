// templateController.ts

import { asyncHandler } from "../middleware/asyncHandler";
import {
  AuthenticatedRequest,
  requireAuth,
  requireAdmin,
} from "../middleware/auth";
import { Request, Response } from "express";
import { sendResponse } from "../middleware/response";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../utils/prisma";
import { z, ZodError } from "zod";
import { Prisma, TemplateCategory, Difficulty } from "@prisma/client";

// ============ TYPES ============

type PaginationResult = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

// ============ HELPER FUNCTIONS ============

function extractZodErrors(error: ZodError): string[] {
  return error.issues.map((err) => err.message);
}

function parseIntParam(param: string | undefined): number | null {
  if (!param) return null;
  const parsed = parseInt(param, 10);
  if (isNaN(parsed) || parsed <= 0) return null;
  return parsed;
}

// ============ VALIDATION SCHEMAS ============

const createTemplateSchema = z.object({
  title_en: z.string().min(1, "English title is required").max(200).trim(),
  title_ar: z.string().min(1, "Arabic title is required").max(200).trim(),
  description_en: z.string().min(10, "English description must be at least 10 characters").trim(),
  description_ar: z.string().min(10, "Arabic description must be at least 10 characters").trim(),
  price: z.number().min(0, "Price must be non-negative"),
  originalPrice: z.number().min(0).optional(),
  tags: z.array(z.string().min(1).max(50)).min(1, "At least one tag is required").max(20),
  category: z.nativeEnum(TemplateCategory),
  imageUrl: z.string().url("Invalid image URL"),
  previewImages: z.array(z.string().url()).default([]),
  previewUrl: z.string().url().optional(),
  downloadUrl: z.string().url().optional(),
  fileSize: z.string().max(50).optional(),
  difficulty: z.nativeEnum(Difficulty).default("BEGINNER"),
  featured: z.boolean().default(false),
  slug_en: z.string().min(3, "English slug must be at least 3 characters").max(200)
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  slug_ar: z.string().min(3, "Arabic slug must be at least 3 characters").max(200),
  metaTitle_en: z.string().max(60).optional(),
  metaTitle_ar: z.string().max(60).optional(),
  metaDesc_en: z.string().max(160).optional(),
  metaDesc_ar: z.string().max(160).optional(),
  version: z.string().default("1.0.0"),
  changelog: z.string().optional(),
});

const updateTemplateSchema = createTemplateSchema.partial();

const queryTemplatesSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  category: z.nativeEnum(TemplateCategory).optional(),
  difficulty: z.nativeEnum(Difficulty).optional(),
  featured: z.coerce.boolean().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  search: z.string().trim().optional(),
  sortBy: z.enum(["createdAt", "price", "rating", "downloads", "views", "updatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

const bulkOperationSchema = z.object({
  templateIds: z.array(z.number().int().positive()).min(1, "At least one template ID is required"),
  operation: z.enum(["activate", "deactivate", "feature", "unfeature", "delete"]),
});

// ============ CONTROLLERS ============

/**
 * Create Template
 * POST /api/templates
 * Auth: Required (Admin only)
 */
export const createTemplate = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!requireAdmin(req, res)) return;

    const validation = createTemplateSchema.safeParse(req.body);

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

    const validatedData = validation.data;

    // Check for duplicate slugs
    const existingTemplate = await prisma.template.findFirst({
      where: {
        OR: [
          { slug_en: validatedData.slug_en },
          { slug_ar: validatedData.slug_ar },
        ],
      },
      select: { id: true, slug_en: true, slug_ar: true },
    });

    if (existingTemplate) {
      const duplicateSlug = existingTemplate.slug_en === validatedData.slug_en 
        ? existingTemplate.slug_en 
        : existingTemplate.slug_ar;
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        `Slug already exists: ${duplicateSlug}`
      );
    }

    // Validate price consistency
    if (validatedData.originalPrice && validatedData.originalPrice < validatedData.price) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "Original price cannot be less than current price"
      );
    }

    const template = await prisma.template.create({
      data: {
        ...validatedData,
        price: new Prisma.Decimal(validatedData.price),
        originalPrice: validatedData.originalPrice
          ? new Prisma.Decimal(validatedData.originalPrice)
          : null,
      },
      include: {
        _count: {
          select: {
            orders: true,
            reviews: true,
          },
        },
      },
    });

    return sendResponse(
      res,
      StatusCodes.CREATED,
      true,
      "Template created successfully",
      template
    );
  }
);

/**
 * Get All Templates
 * GET /api/templates
 * Auth: Not required (public endpoint)
 */
// export const getTemplates = asyncHandler(
//   async (req: Request, res: Response) => {
//     const queryValidation = queryTemplatesSchema.safeParse(req.query);

//     if (!queryValidation.success) {
//       return sendResponse(
//         res,
//         StatusCodes.BAD_REQUEST,
//         false,
//         "Invalid query parameters",
//         undefined,
//         undefined,
//         extractZodErrors(queryValidation.error)
//       );
//     }

//     const { page, limit, isActive, featured, category, sortBy, sortOrder } = queryValidation.data;
//     const skip = (page - 1) * limit;

//     const where: Prisma.TemplateWhereInput = {
//       ...(isActive !== undefined && { isActive }),
//       ...(featured !== undefined && { featured }),
//       ...(category && { category }),
//     };

//     const [templates, totalCount] = await Promise.all([
//       prisma.template.findMany({
//         where,
//         orderBy: { [sortBy]: sortOrder },
//         skip,
//         take: limit,
//         include: {
//           _count: {
//             select: {
//               orders: true,
//               reviews: true,
//             },
//           },
//         },
//       }),
//       prisma.template.count({ where }),
//     ]);

//     const totalPages = Math.ceil(totalCount / limit);

//     return sendResponse(
//       res,
//       StatusCodes.OK,
//       true,
//       "Templates retrieved successfully",
//       {
//         templates,
//         pagination: {
//           currentPage: page,
//           totalPages,
//           totalCount,
//           hasNextPage: page < totalPages,
//           hasPrevPage: page > 1,
//         },
//       }
//     );
//   }
// );

/**
 * Get Templates Analytics Dashboard
 * GET /api/admin/templates/analytics
 * Auth: Required (Admin only)
 */
export const getTemplateAnalytics = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!requireAdmin(req, res)) return;

    const [
      totalTemplates,
      activeTemplates,
      featuredTemplates,
      totalRevenue,
      totalDownloads,
      totalViews,
      categoryStats,
      topPerformers,
      recentTemplates,
    ] = await Promise.all([
      prisma.template.count(),
      prisma.template.count({ where: { isActive: true } }),
      prisma.template.count({ where: { featured: true, isActive: true } }),
      prisma.order.aggregate({
        where: { status: "COMPLETED" },
        _sum: { finalPrice: true },
      }),
      prisma.template.aggregate({
        _sum: { downloads: true },
      }),
      prisma.template.aggregate({
        _sum: { views: true },
      }),
      prisma.template.groupBy({
        by: ["category"],
        where: { isActive: true },
        _count: { id: true },
        _sum: { downloads: true },
      }),
      prisma.template.findMany({
        where: { isActive: true },
        orderBy: { downloads: "desc" },
        take: 5,
        select: {
          id: true,
          title_en: true,
          downloads: true,
          views: true,
          rating: true,
          _count: {
            select: {
              orders: true,
            },
          },
        },
      }),
      prisma.template.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          title_en: true,
          createdAt: true,
          isActive: true,
          featured: true,
        },
      }),
    ]);

    const analytics = {
      overview: {
        totalTemplates,
        activeTemplates,
        inactiveTemplates: totalTemplates - activeTemplates,
        featuredTemplates,
        totalRevenue: totalRevenue._sum.finalPrice?.toString() || "0",
        totalDownloads: totalDownloads._sum.downloads || 0,
        totalViews: totalViews._sum.views || 0,
      },
      categoryBreakdown: categoryStats.map((stat) => ({
        category: stat.category,
        count: stat._count.id,
        downloads: stat._sum.downloads || 0,
      })),
      topPerformingTemplates: topPerformers,
      recentlyAdded: recentTemplates,
    };

    return sendResponse(
      res,
      StatusCodes.OK,
      true,
      "Template analytics retrieved successfully",
      analytics
    );
  }
);

/**
 * Search Templates (Advanced)
 * POST /api/templates/search
 * Auth: Not required (public endpoint)
 */
export const advancedSearch = asyncHandler(
  async (req: Request, res: Response) => {
    const searchSchema = z.object({
      query: z.string().min(1).trim(),
      categories: z.array(z.nativeEnum(TemplateCategory)).optional(),
      difficulties: z.array(z.nativeEnum(Difficulty)).optional(),
      minPrice: z.number().min(0).optional(),
      maxPrice: z.number().min(0).optional(),
      minRating: z.number().min(0).max(5).optional(),
      tags: z.array(z.string()).optional(),
      featured: z.boolean().optional(),
      page: z.number().int().positive().default(1),
      limit: z.number().int().positive().max(50).default(12),
    });

    const validation = searchSchema.safeParse(req.body);

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

    const {
      query,
      categories,
      difficulties,
      minPrice,
      maxPrice,
      minRating,
      tags,
      featured,
      page,
      limit,
    } = validation.data;

    const skip = (page - 1) * limit;

    const where: Prisma.TemplateWhereInput = {
      isActive: true,
      AND: [
        {
          OR: [
            { title_en: { contains: query, mode: "insensitive" } },
            { title_ar: { contains: query } },
            { description_en: { contains: query, mode: "insensitive" } },
            { description_ar: { contains: query } },
            { tags: { hasSome: [query] } },
          ],
        },
        ...(categories && categories.length > 0 ? [{ category: { in: categories } }] : []),
        ...(difficulties && difficulties.length > 0 ? [{ difficulty: { in: difficulties } }] : []),
        ...(minPrice !== undefined ? [{ price: { gte: new Prisma.Decimal(minPrice) } }] : []),
        ...(maxPrice !== undefined ? [{ price: { lte: new Prisma.Decimal(maxPrice) } }] : []),
        ...(minRating !== undefined ? [{ rating: { gte: minRating } }] : []),
        ...(tags && tags.length > 0 ? [{ tags: { hasEvery: tags } }] : []),
        ...(featured !== undefined ? [{ featured }] : []),
      ],
    };

    const [templates, totalCount] = await Promise.all([
      prisma.template.findMany({
        where,
        orderBy: [{ rating: "desc" }, { downloads: "desc" }],
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              orders: true,
              reviews: true,
            },
          },
        },
      }),
      prisma.template.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return sendResponse(
      res,
      StatusCodes.OK,
      true,
      "Search results retrieved successfully",
      {
        templates,
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
 * Get Similar Templates
 * GET /api/templates/:id/similar
 * Auth: Not required (public endpoint)
 */
export const getSimilarTemplates = asyncHandler(
  async (req: Request, res: Response) => {
    const templateId = parseIntParam(req.params.id);

    if (!templateId) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "Invalid template ID"
      );
    }

    const template = await prisma.template.findUnique({
      where: { id: templateId },
      select: { category: true, difficulty: true, tags: true, price: true },
    });

    if (!template) {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        false,
        "Template not found"
      );
    }

    const limit = Math.min(parseInt(req.query.limit as string) || 6, 20);

    // Find similar templates based on category, tags, and price range
    const similarTemplates = await prisma.template.findMany({
      where: {
        id: { not: templateId },
        isActive: true,
        OR: [
          { category: template.category },
          { difficulty: template.difficulty },
          { tags: { hasSome: template.tags } },
          {
            AND: [
              { price: { gte: new Prisma.Decimal(template.price.toNumber() * 0.7) } },
              { price: { lte: new Prisma.Decimal(template.price.toNumber() * 1.3) } },
            ],
          },
        ],
      },
      take: limit,
      orderBy: { rating: "desc" },
      include: {
        _count: {
          select: {
            orders: true,
            reviews: true,
          },
        },
      },
    });

    return sendResponse(
      res,
      StatusCodes.OK,
      true,
      "Similar templates retrieved successfully",
      similarTemplates
    );
  }
);

/**
 * Toggle Template Feature Status
 * PATCH /api/templates/:id/featured
 * Auth: Required (Admin only)
 */
export const toggleFeatured = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!requireAdmin(req, res)) return;

    const templateId = parseIntParam(req.params.id);

    if (!templateId) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "Invalid template ID"
      );
    }

    const template = await prisma.template.findUnique({
      where: { id: templateId },
      select: { id: true, featured: true, title_en: true },
    });

    if (!template) {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        false,
        "Template not found"
      );
    }

    const updatedTemplate = await prisma.template.update({
      where: { id: templateId },
      data: { featured: !template.featured },
      select: {
        id: true,
        title_en: true,
        featured: true,
      },
    });

    return sendResponse(
      res,
      StatusCodes.OK,
      true,
      `Template "${template.title_en}" ${updatedTemplate.featured ? "featured" : "unfeatured"} successfully`,
      updatedTemplate
    );
  }
);

/**
 * Get Template Categories with Counts
 * GET /api/templates/categories/stats
 * Auth: Not required (public endpoint)
 */
export const getCategoryStats = asyncHandler(
  async (req: Request, res: Response) => {
    const categoryStats = await prisma.template.groupBy({
      by: ["category"],
      where: { isActive: true },
      _count: { id: true },
      _avg: { price: true, rating: true },
      _sum: { downloads: true },
    });

    const stats = categoryStats.map((stat) => ({
      category: stat.category,
      count: stat._count.id,
      averagePrice: stat._avg.price?.toString() || "0",
      averageRating: stat._avg.rating || 0,
      totalDownloads: stat._sum.downloads || 0,
    }));

    return sendResponse(
      res,
      StatusCodes.OK,
      true,
      "Category statistics retrieved successfully",
      stats
    );
  }
);

/**
 * Update Template Version
 * PATCH /api/templates/:id/version
 * Auth: Required (Admin only)
 */
export const updateTemplateVersion = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!requireAdmin(req, res)) return;

    const templateId = parseIntParam(req.params.id);

    if (!templateId) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "Invalid template ID"
      );
    }

    const versionSchema = z.object({
      version: z.string().regex(/^\d+\.\d+\.\d+$/, "Version must be in format X.Y.Z"),
      changelog: z.string().optional(),
      downloadUrl: z.string().url().optional(),
    });

    const validation = versionSchema.safeParse(req.body);

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

    const template = await prisma.template.findUnique({
      where: { id: templateId },
      select: { id: true, version: true, title_en: true },
    });

    if (!template) {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        false,
        "Template not found"
      );
    }

    const updatedTemplate = await prisma.template.update({
      where: { id: templateId },
      data: validation.data,
      select: {
        id: true,
        title_en: true,
        version: true,
        changelog: true,
        updatedAt: true,
      },
    });

    return sendResponse(
      res,
      StatusCodes.OK,
      true,
      `Template "${template.title_en}" version updated to ${validation.data.version}`,
      updatedTemplate
    );
  }
);

/**
 * Get User's Purchased Templates
 * GET /api/templates/my-purchases
 * Auth: Required
 */
export const getMyPurchasedTemplates = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!requireAuth(req, res)) return;

    const userId = req.user!.userId;

    const purchases = await prisma.order.findMany({
      where: {
        userId,
        status: "COMPLETED",
      },
      include: {
        template: {
          select: {
            id: true,
            title_en: true,
            title_ar: true,
            description_en: true,
            description_ar: true,
            imageUrl: true,
            downloadUrl: true,
            version: true,
            category: true,
            difficulty: true,
            rating: true,
          },
        },
      },
      orderBy: { paidAt: "desc" },
    });

    return sendResponse(
      res,
      StatusCodes.OK,
      true,
      "Purchased templates retrieved successfully",
      purchases.map((purchase) => ({
        orderId: purchase.id,
        purchaseDate: purchase.paidAt,
        template: purchase.template,
      }))
    );
  }
);
     
/**
 * Get Template by ID
 * GET /api/templates/:id
 * Auth: Not required (public endpoint)
 */
export const getTemplateById = asyncHandler(
  async (req: Request, res: Response) => {
    const templateId = parseIntParam(req.params.id);

    if (!templateId) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "Invalid template ID"
      );
    }

    const template = await prisma.template.findFirst({
      where: { id: templateId, isActive: true },
      include: {
        reviews: {
          where: { verified: true },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: {
          select: {
            orders: true,
            reviews: true,
          },
        },
      },
    });

    if (!template) {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        false,
        "Template not found"
      );
    }

    // Increment views in background
    prisma.template.update({
      where: { id: templateId },
      data: { views: { increment: 1 } },
    }).catch(console.error);

    return sendResponse(
      res,
      StatusCodes.OK,
      true,
      "Template retrieved successfully",
      template
    );
  }
);

/**
 * Get Template by Slug
 * GET /api/templates/slug/:slug
 * Auth: Not required (public endpoint)
 */
export const getTemplateBySlug = asyncHandler(
  async (req: Request, res: Response) => {
    const { slug } = req.params;
    const { lang = "en" } = req.query;

    if (!slug) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "Slug is required"
      );
    }

    const slugField = lang === "ar" ? "slug_ar" : "slug_en";

    const template = await prisma.template.findFirst({
      where: {
        [slugField]: slug,
        isActive: true,
      },
      include: {
        reviews: {
          where: { verified: true },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: {
          select: {
            orders: true,
            reviews: true,
          },
        },
      },
    });

    if (!template) {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        false,
        "Template not found"
      );
    }

    // Increment views in background
    prisma.template.update({
      where: { id: template.id },
      data: { views: { increment: 1 } },
    }).catch(console.error);

    return sendResponse(
      res,
      StatusCodes.OK,
      true,
      "Template retrieved successfully",
      template
    );
  }
);

/**
 * Update Template
 * PUT /api/templates/:id
 * Auth: Required (Admin only)
 */
export const updateTemplate = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!requireAdmin(req, res)) return;

    const templateId = parseIntParam(req.params.id);

    if (!templateId) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "Invalid template ID"
      );
    }

    const validation = updateTemplateSchema.safeParse(req.body);

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

    const validatedData = validation.data;

    // Check if there's something to update
    if (Object.keys(validatedData).length === 0) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "No valid fields to update"
      );
    }

    // Check if template exists
    const existingTemplate = await prisma.template.findUnique({
      where: { id: templateId },
      select: { id: true, slug_en: true, slug_ar: true },
    });

    if (!existingTemplate) {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        false,
        "Template not found"
      );
    }

    // Check for duplicate slugs if slugs are being updated
    if (validatedData.slug_en || validatedData.slug_ar) {
      const duplicateSlug = await prisma.template.findFirst({
        where: {
          AND: [
            { id: { not: templateId } },
            {
              OR: [
                ...(validatedData.slug_en ? [{ slug_en: validatedData.slug_en }] : []),
                ...(validatedData.slug_ar ? [{ slug_ar: validatedData.slug_ar }] : []),
              ],
            },
          ],
        },
        select: { slug_en: true, slug_ar: true },
      });

      if (duplicateSlug) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Slug already exists"
        );
      }
    }

    // Validate price consistency
    if (
      validatedData.originalPrice !== undefined &&
      validatedData.price !== undefined &&
      validatedData.originalPrice < validatedData.price
    ) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "Original price cannot be less than current price"
      );
    }

    const updateData: any = { ...validatedData };

    // Convert price fields to Decimal
    if (validatedData.price !== undefined) {
      updateData.price = new Prisma.Decimal(validatedData.price);
    }
    if (validatedData.originalPrice !== undefined) {
      updateData.originalPrice = new Prisma.Decimal(validatedData.originalPrice);
    }

    const template = await prisma.template.update({
      where: { id: templateId },
      data: updateData,
      include: {
        _count: {
          select: {
            orders: true,
            reviews: true,
          },
        },
      },
    });

    return sendResponse(
      res,
      StatusCodes.OK,
      true,
      "Template updated successfully",
      template
    );
  }
);

/**
 * Delete Template (Soft Delete)
 * DELETE /api/templates/:id
 * Auth: Required (Admin only)
 */
export const deleteTemplate = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!requireAdmin(req, res)) return;

    const templateId = parseIntParam(req.params.id);

    if (!templateId) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "Invalid template ID"
      );
    }

    const template = await prisma.template.findUnique({
      where: { id: templateId },
      select: { id: true, isActive: true, title_en: true },
    });

    if (!template) {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        false,
        "Template not found"
      );
    }

    if (!template.isActive) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "Template is already deleted"
      );
    }

    await prisma.template.update({
      where: { id: templateId },
      data: { isActive: false },
    });

    return sendResponse(
      res,
      StatusCodes.OK,
      true,
      `Template "${template.title_en}" deleted successfully`
    );
  }
);

/**
 * Restore Deleted Template
 * PATCH /api/templates/:id/restore
 * Auth: Required (Admin only)
 */
export const restoreTemplate = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!requireAdmin(req, res)) return;

    const templateId = parseIntParam(req.params.id);

    if (!templateId) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "Invalid template ID"
      );
    }

    const template = await prisma.template.findUnique({
      where: { id: templateId },
      select: { id: true, isActive: true, title_en: true },
    });

    if (!template) {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        false,
        "Template not found"
      );
    }

    if (template.isActive) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "Template is already active"
      );
    }

    const restoredTemplate = await prisma.template.update({
      where: { id: templateId },
      data: { isActive: true },
    });

    return sendResponse(
      res,
      StatusCodes.OK,
      true,
      `Template "${template.title_en}" restored successfully`,
      restoredTemplate
    );
  }
);

/**
 * Get Featured Templates
 * GET /api/templates/featured
 * Auth: Not required (public endpoint)
 */
export const getFeaturedTemplates = asyncHandler(
  async (req: Request, res: Response) => {
    const limitNum = Math.min(parseInt(req.query.limit as string) || 6, 20);

    const templates = await prisma.template.findMany({
      where: {
        featured: true,
        isActive: true,
      },
      orderBy: { createdAt: "desc" },
      take: limitNum,
      include: {
        _count: {
          select: {
            orders: true,
            reviews: true,
          },
        },
      },
    });

    return sendResponse(
      res,
      StatusCodes.OK,
      true,
      "Featured templates retrieved successfully",
      templates
    );
  }
);

/**
 * Get Popular Templates
 * GET /api/templates/popular
 * Auth: Not required (public endpoint)
 */
export const getPopularTemplates = asyncHandler(
  async (req: Request, res: Response) => {
    const limitNum = Math.min(parseInt(req.query.limit as string) || 6, 20);

    const templates = await prisma.template.findMany({
      where: { isActive: true },
      orderBy: { downloads: "desc" },
      take: limitNum,
      include: {
        _count: {
          select: {
            orders: true,
            reviews: true,
          },
        },
      },
    });

    return sendResponse(
      res,
      StatusCodes.OK,
      true,
      "Popular templates retrieved successfully",
      templates
    );
  }
);

/**
 * Get New Templates
 * GET /api/templates/new
 * Auth: Not required (public endpoint)
 */
export const getNewTemplates = asyncHandler(
  async (req: Request, res: Response) => {
    const limitNum = Math.min(parseInt(req.query.limit as string) || 6, 20);

    const templates = await prisma.template.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: limitNum,
      include: {
        _count: {
          select: {
            orders: true,
            reviews: true,
          },
        },
      },
    });

    return sendResponse(
      res,
      StatusCodes.OK,
      true,
      "New templates retrieved successfully",
      templates
    );
  }
);

/**
 * Get Top Rated Templates
 * GET /api/templates/top-rated
 * Auth: Not required (public endpoint)
 */
export const getTopRatedTemplates = asyncHandler(
  async (req: Request, res: Response) => {
    const limitNum = Math.min(parseInt(req.query.limit as string) || 6, 20);

    const templates = await prisma.template.findMany({
      where: { 
        isActive: true,
        ratingsCount: { gt: 0 },
      },
      orderBy: [
        { rating: "desc" },
        { ratingsCount: "desc" },
      ],
      take: limitNum,
      include: {
        _count: {
          select: {
            orders: true,
            reviews: true,
          },
        },
      },
    });

    return sendResponse(
      res,
      StatusCodes.OK,
      true,
      "Top rated templates retrieved successfully",
      templates
    );
  }
);

/**
 * Get Templates by Category
 * GET /api/templates/category/:category
 * Auth: Not required (public endpoint)
 */
export const getTemplatesByCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { category } = req.params;
    
    if (!Object.values(TemplateCategory).includes(category as TemplateCategory)) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "Invalid category"
      );
    }

    const queryValidation = z.object({
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().positive().max(50).default(12),
    }).safeParse(req.query);

    if (!queryValidation.success) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "Invalid query parameters"
      );
    }

    const { page, limit } = queryValidation.data;
    const skip = (page - 1) * limit;

    const [templates, totalCount] = await Promise.all([
      prisma.template.findMany({
        where: {
          category: category as TemplateCategory,
          isActive: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              orders: true,
              reviews: true,
            },
          },
        },
      }),
      prisma.template.count({
        where: {
          category: category as TemplateCategory,
          isActive: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return sendResponse(
      res,
      StatusCodes.OK,
      true,
      `Templates in category ${category} retrieved successfully`,
      {
        templates,
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
 * Get Template Statistics
 * GET /api/templates/:id/stats
 * Auth: Required (Admin only)
 */
export const getTemplateStats = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!requireAdmin(req, res)) return;

    const templateId = parseIntParam(req.params.id);

    if (!templateId) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "Invalid template ID"
      );
    }

    const [template, orderStats, reviewStats] = await Promise.all([
      prisma.template.findUnique({
        where: { id: templateId },
        select: {
          id: true,
          title_en: true,
          title_ar: true,
          views: true,
          downloads: true,
          rating: true,
          ratingsCount: true,
          createdAt: true,
          price: true,
          featured: true,
          isActive: true,
        },
      }),
      prisma.order.aggregate({
        where: {
          templateId,
          status: "COMPLETED",
        },
        _sum: { finalPrice: true },
        _count: true,
      }),
      prisma.review.groupBy({
        by: ["rating"],
        where: { templateId },
        _count: { rating: true },
      }),
    ]);

    if (!template) {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        false,
        "Template not found"
      );
    }

    const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviewStats.forEach((stat) => {
      ratingDistribution[stat.rating] = stat._count.rating;
    });

    const stats = {
      template: {
        ...template,
        price: template.price.toString(),
      },
      revenue: orderStats._sum.finalPrice?.toString() || "0",
      totalOrders: orderStats._count,
      ratingDistribution,
      conversionRate: template.views > 0 
        ? ((orderStats._count / template.views) * 100).toFixed(2) + "%"
        : "0%",
    };

    return sendResponse(
      res,
      StatusCodes.OK,
      true,
      "Template statistics retrieved successfully",
      stats
    );
  }
);

/**
 * Increment Template Downloads
 * POST /api/templates/:id/download
 * Auth: Required
 */
export const incrementDownloads = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!requireAuth(req, res)) return;

    const templateId = parseIntParam(req.params.id);

    if (!templateId) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "Invalid template ID"
      );
    }

    // Check if user has purchased this template
    const purchase = await prisma.order.findFirst({
      where: {
        templateId,
        userId: req.user!.userId,
        status: "COMPLETED",
      },
    });

    if (!purchase) {
      return sendResponse(
        res,
        StatusCodes.FORBIDDEN,
        false,
        "You must purchase this template before downloading"
      );
    }

    const template = await prisma.template.update({
      where: { id: templateId },
      data: { downloads: { increment: 1 } },
      select: {
        id: true,
        title_en: true,
        downloadUrl: true,
        downloads: true,
        version: true,
      },
    });

    return sendResponse(
      res,
      StatusCodes.OK,
      true,
      "Download link retrieved successfully",
      {
        downloadUrl: template.downloadUrl,
        template: {
          id: template.id,
          title: template.title_en,
          version: template.version,
        },
      }
    );
  }
);

/**
 * Bulk Operations on Templates
 * POST /api/templates/bulk
 * Auth: Required (Admin only)
 */
export const bulkOperations = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!requireAdmin(req, res)) return;

    const validation = bulkOperationSchema.safeParse(req.body);

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

    const { templateIds, operation } = validation.data;

    let updateData: any = {};
    let message = "";

    switch (operation) {
      case "activate":
        updateData = { isActive: true };
        message = "Templates activated successfully";
        break;
      case "deactivate":
        updateData = { isActive: false };
        message = "Templates deactivated successfully";
        break;
      case "feature":
        updateData = { featured: true };
        message = "Templates featured successfully";
        break;
      case "unfeature":
        updateData = { featured: false };
        message = "Templates unfeatured successfully";
        break;
      case "delete":
        updateData = { isActive: false };
        message = "Templates deleted successfully";
        break;
    }

    const result = await prisma.template.updateMany({
      where: {
        id: { in: templateIds },
      },
      data: updateData,
    });

    return sendResponse(
      res,
      StatusCodes.OK,
      true,
      `${message} (${result.count} templates affected)`,
      { count: result.count }
    );
  }
);

/**
 * Get All Templates (Admin - including inactive)
 * GET /api/admin/templates
 * Auth: Required (Admin only)
 */