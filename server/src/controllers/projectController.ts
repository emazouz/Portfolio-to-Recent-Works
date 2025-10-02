import { asyncHandler } from "../middleware/asyncHandler";
import { AuthenticatedRequest, requireAdmin } from "../middleware/auth";
import { Request, Response } from "express";
import { sendResponse } from "../middleware/response";
import { StatusCodes } from "http-status-codes";
import {
  validateProjectData,
  validateQueryParams,
} from "../validators/projectValidate";
import { prisma } from "../utils/prisma";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary";
import { Prisma } from "@prisma/client";
import { FileRequest } from "../types/FileRequest";

interface QueryParams {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  category?: string;
  status?: string;
  featured?: string;
  search?: string;
}

// Helper function to safely get files from multer
const getFiles = (
  files: any
): { [fieldname: string]: Express.Multer.File[] } => {
  if (!files) return {};

  // Handle both formats that multer can return
  if (Array.isArray(files)) {
    return { gallery: files };
  }

  return files as { [fieldname: string]: Express.Multer.File[] };
};

// Fix: Enhanced query parameter parsing with proper validation
const parseQueryParams = (query: QueryParams) => {
  // Validate query parameters first
  const queryValidationErrors = validateQueryParams(query);
  if (queryValidationErrors.length > 0) {
    throw new Error(
      `Invalid query parameters: ${queryValidationErrors.join(", ")}`
    );
  }

  const page = Math.max(1, parseInt(query.page || "1"));
  const limit = Math.max(1, Math.min(50, parseInt(query.limit || "10"))); // Max 50 items per page
  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";

  const filters: Prisma.ProjectWhereInput = {};

  // Add filters with proper type checking
  if (query.category && typeof query.category === "string") {
    // Validate category enum
    const validCategories = [
      "WEB_DEVELOPMENT",
      "MOBILE_APP",
      "DESKTOP_APP",
      "API_DEVELOPMENT",
      "UI_UX_DESIGN",
      "OTHER",
    ];
    if (validCategories.includes(query.category)) {
      filters.category = query.category as any;
    }
  }

  if (query.status && typeof query.status === "string") {
    // Validate status enum
    const validStatuses = ["PLANNING", "IN_PROGRESS", "COMPLETED", "ON_HOLD"];
    if (validStatuses.includes(query.status)) {
      filters.status = query.status as any;
    }
  }

  if (query.featured !== undefined) {
    filters.featured = query.featured === "true";
  }

  if (
    query.search &&
    typeof query.search === "string" &&
    query.search.trim().length > 0
  ) {
    const searchTerm = query.search.trim();
    filters.OR = [
      { title_en: { contains: searchTerm, mode: "insensitive" } },
      { title_ar: { contains: searchTerm, mode: "insensitive" } },
      { description_en: { contains: searchTerm, mode: "insensitive" } },
      { description_ar: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  return { page, limit, sortBy, sortOrder, filters };
};

// Fix: Enhanced data processing with better type safety
const processProjectData = (body: any) => {
  const processedData = { ...body };

  // Parse JSON fields that come as strings from FormData
  if (typeof processedData.technologies === "string") {
    try {
      const parsed = JSON.parse(processedData.technologies);
      processedData.technologies = Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn("Failed to parse technologies JSON:", error);
      processedData.technologies = [];
    }
  }

  // Ensure arrays are properly formatted
  if (!Array.isArray(processedData.technologies)) {
    processedData.technologies = processedData.technologies
      ? [processedData.technologies]
      : [];
  }

  // Filter out empty technologies
  processedData.technologies = processedData.technologies
    .filter((tech: any) => typeof tech === "string" && tech.trim().length > 0)
    .map((tech: string) => tech.trim());

  // Convert string booleans to actual booleans
  if (typeof processedData.featured === "string") {
    processedData.featured = processedData.featured.toLowerCase() === "true";
  } else if (typeof processedData.featured !== "boolean") {
    processedData.featured = false;
  }

  // Convert string numbers to actual numbers
  if (typeof processedData.sortOrder === "string") {
    processedData.sortOrder = parseInt(processedData.sortOrder) || 0;
  } else if (typeof processedData.sortOrder !== "number") {
    processedData.sortOrder = 0;
  }

  // Ensure required fields are properly trimmed
  const stringFields = [
    "title_en",
    "title_ar",
    "description_en",
    "description_ar",
    "slug_en",
    "slug_ar",
    "metaTitle_en",
    "metaTitle_ar",
    "metaDesc_en",
    "metaDesc_ar",
    "liveUrl",
    "githubUrl",
  ];

  stringFields.forEach((field) => {
    if (typeof processedData[field] === "string") {
      processedData[field] = processedData[field].trim();
    }
  });

  // Convert empty strings to null for optional fields
  const optionalFields = [
    "liveUrl",
    "githubUrl",
    "metaTitle_en",
    "metaTitle_ar",
    "metaDesc_en",
    "metaDesc_ar",
  ];
  optionalFields.forEach((field) => {
    if (processedData[field] === "") {
      processedData[field] = null;
    }
  });

  return processedData;
};

// Fix: Validate sortBy field to prevent injection
const validateSortBy = (sortBy: string): boolean => {
  const allowedSortFields = [
    "createdAt",
    "updatedAt",
    "title_en",
    "title_ar",
    "category",
    "status",
    "featured",
    "sortOrder",
    "id",
  ];
  return allowedSortFields.includes(sortBy);
};

// CREATE Project
export const createProject = asyncHandler(
  async (req: FileRequest, res: Response) => {
    if (!requireAdmin(req, res)) return;

    try {
      const files = getFiles(req.files);
      // Process the form data
      const processedData = processProjectData(req.body);

      // Validate the processed data
      const validationErrors = validateProjectData(processedData, files);

      if (validationErrors.length > 0) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Validation failed",
          undefined,
          undefined,
          validationErrors
        );
      }

      // Handle image upload
      let imageUrl: string | undefined;
      if (files.gallery && files.gallery[0]) {
        try {
          const uploadedImage = await uploadToCloudinary(
            files.gallery[0],
            "project/gallery"
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
      console.log("xxxxxxx :");

      // Fix: Check for duplicate slugs more efficiently
      const duplicateCheckPromises = [];
      if (processedData.slug_en) {
        duplicateCheckPromises.push(
          prisma.project.findFirst({
            where: { slug_en: processedData.slug_en },
          })
        );
      }
      if (
        processedData.slug_ar &&
        processedData.slug_ar !== processedData.slug_en
      ) {
        duplicateCheckPromises.push(
          prisma.project.findFirst({
            where: { slug_ar: processedData.slug_ar },
          })
        );
      }

      const duplicateResults = await Promise.all(duplicateCheckPromises);
      const hasDuplicates = duplicateResults.some((result) => result !== null);

      if (hasDuplicates) {
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
          "A project with this slug already exists"
        );
      }

      if (!imageUrl) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Failed to upload image. Please try again."
        );
      }

      // Create the project with transaction for data integrity
      const project = await prisma.$transaction(async (tx) => {
        return tx.project.create({
          data: {
            title_en: processedData.title_en,
            title_ar: processedData.title_ar,
            description_en: processedData.description_en,
            description_ar: processedData.description_ar,
            category: processedData.category,
            status: processedData.status,
            imageUrl,
            liveUrl: processedData.liveUrl,
            githubUrl: processedData.githubUrl,
            slug_en: processedData.slug_en,
            slug_ar: processedData.slug_ar,
            metaTitle_en: processedData.metaTitle_en,
            metaTitle_ar: processedData.metaTitle_ar,
            metaDesc_en: processedData.metaDesc_en,
            metaDesc_ar: processedData.metaDesc_ar,
            technologies: processedData.technologies,
            featured: Boolean(processedData.featured),
            sortOrder: Number(processedData.sortOrder) || 0,
          },
        });
      });

      return sendResponse(
        res,
        StatusCodes.CREATED,
        true,
        "Project created successfully",
        project
      );
    } catch (error: any) {
      console.error("Error creating project:", error);

      // Handle specific Prisma errors
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return sendResponse(
            res,
            StatusCodes.CONFLICT,
            false,
            "A project with this information already exists"
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

      // Handle validation errors from parseQueryParams
      if (error.message && error.message.includes("Invalid query parameters")) {
        return sendResponse(res, StatusCodes.BAD_REQUEST, false, error.message);
      }

      return sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Server error while creating project"
      );
    }
  }
);

// GET All Projects (with pagination, filtering, sorting)
export const getProjects = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { page, limit, sortBy, sortOrder, filters } = parseQueryParams(
      req.query
    );

    // Fix: Validate sortBy field
    if (!validateSortBy(sortBy)) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "Invalid sort field"
      );
    }

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Build order by clause safely
    const orderBy: Prisma.ProjectOrderByWithRelationInput = {};
    (orderBy as any)[sortBy] = sortOrder;

    // Get projects and total count with error handling
    const [projects, totalCount] = await Promise.all([
      prisma.project.findMany({
        where: filters,
        orderBy,
        skip: offset,
        take: limit,
        select: {
          id: true,
          title_en: true,
          title_ar: true,
          description_en: true,
          description_ar: true,
          category: true,
          status: true,
          imageUrl: true,
          liveUrl: true,
          githubUrl: true,
          slug_en: true,
          slug_ar: true,
          metaTitle_en: true,
          metaTitle_ar: true,
          metaDesc_en: true,
          metaDesc_ar: true,
          technologies: true,
          featured: true,
          sortOrder: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.project.count({ where: filters }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    const response = {
      data: projects,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };

    return sendResponse(
      res,
      StatusCodes.OK,
      true,
      "Projects retrieved successfully",
      response
    );
  } catch (error: any) {
    console.error("Error fetching projects:", error);

    if (error.message && error.message.includes("Invalid query parameters")) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, false, error.message);
    }

    return sendResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      "Server error while fetching projects"
    );
  }
});

// GET Single Project by ID
export const getProjectById = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // Fix: Validate ID format
      if (!id) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Valid project ID is required"
        );
      }

      const project = await prisma.project.findUnique({
        where: { id: Number(id) },
      });

      if (!project) {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          false,
          "Project not found"
        );
      }

      return sendResponse(
        res,
        StatusCodes.OK,
        true,
        "Project retrieved successfully",
        project
      );
    } catch (error: any) {
      console.error("Error fetching project:", error);

      // Handle invalid ID format
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2023"
      ) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Invalid project ID format"
        );
      }

      return sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Server error while fetching project"
      );
    }
  }
);

// UPDATE Project
export const updateProject = asyncHandler(
  async (req: FileRequest, res: Response) => {
    if (!requireAdmin(req, res)) return;

    try {
      const { id } = req.params;
      const files = getFiles(req.files);

      // Fix: Validate ID format
      if (!id) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Valid project ID is required"
        );
      }

      // Check if project exists
      const existingProject = await prisma.project.findUnique({
        where: { id: Number(id) },
      });

      if (!existingProject) {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          false,
          "Project not found"
        );
      }

      // Process the form data
      const processedData = processProjectData(req.body);

      // Validate the processed data (for updates, image might be optional)
      const validationErrors = validateProjectData(processedData, files, true);

      if (validationErrors.length > 0) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Validation failed",
          undefined,
          undefined,
          validationErrors
        );
      }

      // Handle image upload if new image provided
      let imageUrl = existingProject.imageUrl;
      let oldImageUrl = null;

      if (files.gallery && files.gallery[0]) {
        try {
          // Store old image URL for cleanup after successful update
          oldImageUrl = existingProject.imageUrl;

          // Upload new image
          const uploadedImage = await uploadToCloudinary(
            files.gallery[0],
            "project/gallery"
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

      // Fix: Check for duplicate slugs more efficiently (excluding current project)
      const duplicateCheckPromises = [];
      if (
        processedData.slug_en &&
        processedData.slug_en !== existingProject.slug_en
      ) {
        duplicateCheckPromises.push(
          prisma.project.findFirst({
            where: {
              slug_en: processedData.slug_en,
              id: { not: Number(id) },
            },
          })
        );
      }
      if (
        processedData.slug_ar &&
        processedData.slug_ar !== existingProject.slug_ar
      ) {
        duplicateCheckPromises.push(
          prisma.project.findFirst({
            where: {
              slug_ar: processedData.slug_ar,
              id: { not: Number(id) },
            },
          })
        );
      }

      if (duplicateCheckPromises.length > 0) {
        const duplicateResults = await Promise.all(duplicateCheckPromises);
        const hasDuplicates = duplicateResults.some(
          (result) => result !== null
        );

        if (hasDuplicates) {
          // Clean up new uploaded image if slug validation fails
          if (imageUrl && imageUrl !== existingProject.imageUrl) {
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
            "A project with this slug already exists"
          );
        }
      }

      // Update the project with transaction for data integrity
      const updatedProject = await prisma.$transaction(async (tx) => {
        return tx.project.update({
          where: { id: Number(id) },
          data: {
            title_en: processedData.title_en || existingProject.title_en,
            title_ar: processedData.title_ar || existingProject.title_ar,
            description_en:
              processedData.description_en || existingProject.description_en,
            description_ar:
              processedData.description_ar || existingProject.description_ar,
            category: processedData.category || existingProject.category,
            status: processedData.status || existingProject.status,
            imageUrl,
            liveUrl:
              processedData.liveUrl !== undefined
                ? processedData.liveUrl
                : existingProject.liveUrl,
            githubUrl:
              processedData.githubUrl !== undefined
                ? processedData.githubUrl
                : existingProject.githubUrl,
            slug_en: processedData.slug_en || existingProject.slug_en,
            slug_ar: processedData.slug_ar || existingProject.slug_ar,
            metaTitle_en:
              processedData.metaTitle_en !== undefined
                ? processedData.metaTitle_en
                : existingProject.metaTitle_en,
            metaTitle_ar:
              processedData.metaTitle_ar !== undefined
                ? processedData.metaTitle_ar
                : existingProject.metaTitle_ar,
            metaDesc_en:
              processedData.metaDesc_en !== undefined
                ? processedData.metaDesc_en
                : existingProject.metaDesc_en,
            metaDesc_ar:
              processedData.metaDesc_ar !== undefined
                ? processedData.metaDesc_ar
                : existingProject.metaDesc_ar,
            technologies:
              processedData.technologies || existingProject.technologies,
            featured:
              processedData.featured !== undefined
                ? Boolean(processedData.featured)
                : existingProject.featured,
            sortOrder:
              processedData.sortOrder !== undefined
                ? Number(processedData.sortOrder)
                : existingProject.sortOrder,
          },
        });
      });

      // Clean up old image after successful update
      if (oldImageUrl && oldImageUrl !== imageUrl) {
        try {
          await deleteFromCloudinary(oldImageUrl);
        } catch (cleanupError) {
          console.warn(
            "Failed to delete old image from Cloudinary:",
            cleanupError
          );
          // Don't fail the request if image cleanup fails
        }
      }

      return sendResponse(
        res,
        StatusCodes.OK,
        true,
        "Project updated successfully",
        updatedProject
      );
    } catch (error: any) {
      console.error("Error updating project:", error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return sendResponse(
            res,
            StatusCodes.CONFLICT,
            false,
            "A project with this information already exists"
          );
        }
        if (error.code === "P2023") {
          return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            false,
            "Invalid project ID format"
          );
        }
        if (error.code === "P2025") {
          return sendResponse(
            res,
            StatusCodes.NOT_FOUND,
            false,
            "Project not found"
          );
        }
      }

      return sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Server error while updating project"
      );
    }
  }
);

// DELETE Project
export const deleteProject = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!requireAdmin(req, res)) return;

    try {
      const { id } = req.params;

      // Fix: Validate ID format
      if (!id) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Valid project ID is required"
        );
      }

      // Check if project exists
      const existingProject = await prisma.project.findUnique({
        where: { id: Number(id) },
      });

      if (!existingProject) {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          false,
          "Project not found"
        );
      }

      // Delete the project first, then handle image cleanup
      await prisma.project.delete({
        where: { id: Number(id) },
      });

      // Delete image from cloudinary if it exists (after DB deletion)
      if (existingProject.imageUrl) {
        try {
          await deleteFromCloudinary(existingProject.imageUrl);
        } catch (cloudinaryError) {
          console.warn(
            "Failed to delete image from Cloudinary:",
            cloudinaryError
          );
          // Don't fail the request if image deletion fails
        }
      }

      return sendResponse(
        res,
        StatusCodes.OK,
        true,
        "Project deleted successfully"
      );
    } catch (error: any) {
      console.error("Error deleting project:", error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2023") {
          return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            false,
            "Invalid project ID format"
          );
        }
        if (error.code === "P2025") {
          return sendResponse(
            res,
            StatusCodes.NOT_FOUND,
            false,
            "Project not found"
          );
        }
      }

      return sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Server error while deleting project"
      );
    }
  }
);

// GET Featured Projects
export const getFeaturedProjects = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      // Fix: Validate limit parameter
      const limitParam = req.query.limit as string;
      let limit = 6; // default

      if (limitParam) {
        const parsedLimit = parseInt(limitParam);
        if (!isNaN(parsedLimit) && parsedLimit > 0 && parsedLimit <= 20) {
          limit = parsedLimit;
        } else {
          return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            false,
            "Limit must be a number between 1 and 20"
          );
        }
      }

      const projects = await prisma.project.findMany({
        where: { featured: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        take: limit,
        select: {
          id: true,
          title_en: true,
          title_ar: true,
          description_en: true,
          description_ar: true,
          category: true,
          imageUrl: true,
          liveUrl: true,
          githubUrl: true,
          slug_en: true,
          slug_ar: true,
          technologies: true,
          createdAt: true,
        },
      });

      return sendResponse(
        res,
        StatusCodes.OK,
        true,
        "Featured projects retrieved successfully",
        projects
      );
    } catch (error: any) {
      console.error("Error fetching featured projects:", error);
      return sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Server error while fetching featured projects"
      );
    }
  }
);

// GET Project by Slug
export const getProjectBySlug = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const { lang } = req.query;

      // Fix: Validate slug parameter
      if (!slug || typeof slug !== "string" || slug.trim().length === 0) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Valid project slug is required"
        );
      }

      // Fix: Validate lang parameter
      if (lang && typeof lang !== "string") {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Language parameter must be a string"
        );
      }

      const slugValue = slug.trim();
      const whereClause =
        lang === "ar" ? { slug_ar: slugValue } : { slug_en: slugValue };

      const project = await prisma.project.findFirst({
        where: whereClause,
      });

      if (!project) {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          false,
          "Project not found"
        );
      }

      return sendResponse(
        res,
        StatusCodes.OK,
        true,
        "Project retrieved successfully",
        project
      );
    } catch (error: any) {
      console.error("Error fetching project by slug:", error);
      return sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Server error while fetching project"
      );
    }
  }
);
