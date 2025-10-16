import { z } from "zod";

// Base project schema
const baseProjectSchema = {
  title_en: z
    .string()
    .min(1, "English title is required")
    .max(200, "English title must be less than 200 characters")
    .trim(),

  title_ar: z
    .string()
    .min(1, "Arabic title is required")
    .max(200, "Arabic title must be less than 200 characters")
    .trim(),

  description_en: z
    .string()
    .min(10, "English description must be at least 10 characters")
    .max(2000, "English description must be less than 2000 characters")
    .trim(),

  description_ar: z
    .string()
    .min(10, "Arabic description must be at least 10 characters")
    .max(2000, "Arabic description must be less than 2000 characters")
    .trim(),

  category: z.enum([
    "WEB_DEVELOPMENT",
    "MOBILE_APP",
    "DESKTOP_APP",
    "API_DEVELOPMENT",
    "UI_UX_DESIGN",
    "OTHER",
  ]),

  status: z.enum(["PLANNING", "IN_PROGRESS", "COMPLETED", "ON_HOLD"]),

  liveUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),

  githubUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),

  slug_en: z
    .string()
    .min(1, "English slug is required")
    .max(100, "English slug must be less than 100 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "English slug can only contain lowercase letters, numbers, and hyphens"
    )
    .trim(),

  slug_ar: z
    .string()
    .min(1, "Arabic slug is required")
    .max(100, "Arabic slug must be less than 100 characters")
    .trim(),

  metaTitle_en: z
    .string()
    .max(60, "Meta title must be less than 60 characters")
    .optional()
    .or(z.literal("")),

  metaTitle_ar: z
    .string()
    .max(60, "Meta title must be less than 60 characters")
    .optional()
    .or(z.literal("")),

  metaDesc_en: z.string().optional().or(z.literal("")),

  metaDesc_ar: z.string().optional().or(z.literal("")),

  technologies: z
    .array(z.string().trim().min(1))
    .min(1, "At least one technology is required")
    .max(10, "Maximum 10 technologies allowed"),

  featured: z.boolean().default(false),

  sortOrder: z
    .number()
    .int("Sort order must be an integer")
    .min(0, "Sort order must be 0 or greater")
    .default(0),
};

// Create project schema (all fields required)
const createProjectSchema = z.object(baseProjectSchema);

// Update project schema (most fields optional)
const updateProjectSchema = z.object({
  title_en: baseProjectSchema.title_en.optional(),
  title_ar: baseProjectSchema.title_ar.optional(),
  description_en: baseProjectSchema.description_en.optional(),
  description_ar: baseProjectSchema.description_ar.optional(),
  category: baseProjectSchema.category.optional(),
  status: baseProjectSchema.status.optional(),
  liveUrl: baseProjectSchema.liveUrl,
  githubUrl: baseProjectSchema.githubUrl,
  slug_en: baseProjectSchema.slug_en.optional(),
  slug_ar: baseProjectSchema.slug_ar.optional(),
  metaTitle_en: baseProjectSchema.metaTitle_en,
  metaTitle_ar: baseProjectSchema.metaTitle_ar,
  metaDesc_en: baseProjectSchema.metaDesc_en,
  metaDesc_ar: baseProjectSchema.metaDesc_ar,
  technologies: baseProjectSchema.technologies.optional(),
  featured: baseProjectSchema.featured.optional(),
  sortOrder: baseProjectSchema.sortOrder.optional(),
});

// Type definitions
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

// Validation function with enhanced error handling
export const validateProjectData = (
  data: any,
  files: any,
  isUpdate: boolean = false
): Array<{ field: string; message: string }> => {
  const errors: Array<{ field: string; message: string }> = [];

  try {
    // Choose schema based on operation type
    const schema = isUpdate ? updateProjectSchema : createProjectSchema;

    // Process data before validation
    const processedData = { ...data };

    // Handle technologies if it's a JSON string
    if (typeof processedData.technologies === "string") {
      try {
        processedData.technologies = JSON.parse(processedData.technologies);
      } catch (e) {
        processedData.technologies = [];
      }
    }

    // Convert string booleans to actual booleans
    if (typeof processedData.featured === "string") {
      processedData.featured = processedData.featured === "true";
    }

    // Convert string numbers to actual numbers
    if (typeof processedData.sortOrder === "string") {
      processedData.sortOrder = parseInt(processedData.sortOrder) || 0;
    }

    // Clean empty string URLs
    if (processedData.liveUrl === "") {
      processedData.liveUrl = undefined;
    }
    if (processedData.githubUrl === "") {
      processedData.githubUrl = undefined;
    }

    // Validate the processed data
    const result = schema.safeParse(processedData);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const field = issue.path.join(".");
        errors.push({ field, message: issue.message });
      });
    }

    // Validate image file for create operations
    if (!isUpdate) {
      if (!files.gallery || !files.gallery[0]) {
        errors.push({ field: "gallery", message: "Project image is required" });
      } else {
        const imageFile = files.gallery[0];
        const validImageTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
        ];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!validImageTypes.includes(imageFile.mimetype)) {
          errors.push({
            field: "gallery",
            message: "Please upload a valid image file (JPEG, PNG, WebP)",
          });
        }

        if (imageFile.size > maxSize) {
          errors.push({
            field: "gallery",
            message: "Image size should be less than 5MB",
          });
        }
      }
    } else {
      // For updates, validate image if provided
      if (files.gallery && files.gallery[0]) {
        const imageFile = files.gallery[0];
        const validImageTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
        ];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!validImageTypes.includes(imageFile.mimetype)) {
          errors.push({
            field: "gallery",
            message: "Please upload a valid image file (JPEG, PNG, WebP)",
          });
        }

        if (imageFile.size > maxSize) {
          errors.push({
            field: "gallery",
            message: "Image size should be less than 5MB",
          });
        }
      }
    }

    // Additional custom validations

    // Validate technologies array length and content
    if (
      processedData.technologies &&
      Array.isArray(processedData.technologies)
    ) {
      if (processedData.technologies.length === 0) {
        errors.push({
          field: "technologies",
          message: "At least one technology is required",
        });
      }

      if (processedData.technologies.length > 10) {
        errors.push({
          field: "technologies",
          message: "Maximum 10 technologies allowed",
        });
      }

      // Check for empty or invalid technology names
      processedData.technologies.forEach((tech: any, index: number) => {
        if (typeof tech !== "string" || tech.trim().length === 0) {
          errors.push({
            field: `technologies[${index}]`,
            message: "Technology name cannot be empty",
          });
        }
        if (typeof tech === "string" && tech.length > 50) {
          errors.push({
            field: `technologies[${index}]`,
            message: "Technology name must be less than 50 characters",
          });
        }
      });
    }

    // Validate URL formats more strictly
    if (processedData.liveUrl) {
      try {
        const url = new URL(processedData.liveUrl);
        if (!["http:", "https:"].includes(url.protocol)) {
          errors.push({
            field: "liveUrl",
            message: "Live URL must use HTTP or HTTPS protocol",
          });
        }
      } catch {
        errors.push({ field: "liveUrl", message: "Please enter a valid URL" });
      }
    }

    if (processedData.githubUrl) {
      try {
        const url = new URL(processedData.githubUrl);
        if (!["http:", "https:"].includes(url.protocol)) {
          errors.push({
            field: "githubUrl",
            message: "GitHub URL must use HTTP or HTTPS protocol",
          });
        }
      } catch {
        errors.push({
          field: "githubUrl",
          message: "Please enter a valid URL",
        });
      }
    }

    // Validate slug uniqueness patterns
    if (processedData.slug_en) {
      // Check for reserved words
      const reservedWords = [
        "admin",
        "api",
        "www",
        "mail",
        "ftp",
        "localhost",
        "app",
        "assets",
      ];
      if (reservedWords.includes(processedData.slug_en.toLowerCase())) {
        errors.push({
          field: "slug_en",
          message: "This slug is reserved and cannot be used",
        });
      }

      // Check slug format
      if (
        processedData.slug_en.startsWith("-") ||
        processedData.slug_en.endsWith("-")
      ) {
        errors.push({
          field: "slug_en",
          message: "Slug cannot start or end with a hyphen",
        });
      }

      // Check for consecutive hyphens
      if (processedData.slug_en.includes("--")) {
        errors.push({
          field: "slug_en",
          message: "Slug cannot contain consecutive hyphens",
        });
      }
    }

    if (processedData.slug_ar) {
      if (
        processedData.slug_ar.startsWith("-") ||
        processedData.slug_ar.endsWith("-")
      ) {
        errors.push({
          field: "slug_ar",
          message: "Slug cannot start or end with a hyphen",
        });
      }

      if (processedData.slug_ar.includes("--")) {
        errors.push({
          field: "slug_ar",
          message: "Slug cannot contain consecutive hyphens",
        });
      }
    }

    // Validate that required fields are not just whitespace
    const requiredFields = isUpdate
      ? []
      : ["title_en", "title_ar", "description_en", "description_ar"];
    requiredFields.forEach((field) => {
      if (
        processedData[field] &&
        typeof processedData[field] === "string" &&
        processedData[field].trim().length === 0
      ) {
        errors.push({
          field,
          message: `${field.replace("_", " ")} cannot be empty`,
        });
      }
    });

    // Validate sortOrder range
    if (processedData.sortOrder !== undefined) {
      if (processedData.sortOrder < 0 || processedData.sortOrder > 999999) {
        errors.push({
          field: "sortOrder",
          message: "Sort order must be between 0 and 999999",
        });
      }
    }
  } catch (error) {
    console.error("Validation error:", error);
    errors.push({ field: "general", message: "Invalid data format" });
  }

  return errors;
};

// Helper function to sanitize and prepare data for database
export const sanitizeProjectData = (data: any): Partial<CreateProjectInput> => {
  const sanitized: any = {};

  // Sanitize strings by trimming and removing excessive whitespace
  const stringFields = [
    "title_en",
    "title_ar",
    "description_en",
    "description_ar",
    "liveUrl",
    "githubUrl",
    "slug_en",
    "slug_ar",
    "metaTitle_en",
    "metaTitle_ar",
    "metaDesc_en",
    "metaDesc_ar",
  ];

  stringFields.forEach((field) => {
    if (data[field] !== undefined) {
      if (typeof data[field] === "string") {
        const trimmed = data[field].trim();
        sanitized[field] = trimmed || null;
      } else {
        sanitized[field] = data[field];
      }
    }
  });

  // Handle enum fields
  if (data.category) {
    sanitized.category = data.category;
  }
  if (data.status) {
    sanitized.status = data.status;
  }

  // Handle boolean fields
  if (data.featured !== undefined) {
    sanitized.featured = Boolean(data.featured);
  }

  // Handle number fields
  if (data.sortOrder !== undefined) {
    sanitized.sortOrder = Number(data.sortOrder) || 0;
  }

  // Handle array fields
  if (data.technologies) {
    if (typeof data.technologies === "string") {
      try {
        sanitized.technologies = JSON.parse(data.technologies);
      } catch {
        sanitized.technologies = [];
      }
    } else if (Array.isArray(data.technologies)) {
      sanitized.technologies = data.technologies
        .filter(
          (tech: string) => typeof tech === "string" && tech.trim().length > 0
        )
        .map((tech: string) => tech.trim());
    }
  }

  return sanitized;
};

// Query parameter validation
export const validateQueryParams = (query: any) => {
  const errors: string[] = [];

  // Validate page
  if (query.page !== undefined) {
    const page = Number(query.page);
    if (isNaN(page) || page < 1) {
      errors.push("Page must be a positive integer");
    }
  }

  // Validate limit
  if (query.limit !== undefined) {
    const limit = Number(query.limit);
    if (isNaN(limit) || limit < 1 || limit > 100) {
      errors.push("Limit must be between 1 and 100");
    }
  }

  // Validate sortOrder
  if (query.sortOrder !== undefined) {
    if (!["asc", "desc"].includes(query.sortOrder)) {
      errors.push('Sort order must be "asc" or "desc"');
    }
  }

  // Validate sortBy
  if (query.sortBy !== undefined) {
    const allowedSortFields = [
      "createdAt",
      "updatedAt",
      "title_en",
      "title_ar",
      "category",
      "status",
      "featured",
      "sortOrder",
    ];
    if (!allowedSortFields.includes(query.sortBy)) {
      errors.push(`Sort by must be one of: ${allowedSortFields.join(", ")}`);
    }
  }

  // Validate category
  if (query.category !== undefined) {
    const validCategories = [
      "WEB_DEVELOPMENT",
      "MOBILE_APP",
      "DESKTOP_APP",
      "API_DEVELOPMENT",
      "UI_UX_DESIGN",
      "OTHER",
    ];
    if (!validCategories.includes(query.category)) {
      errors.push(`Category must be one of: ${validCategories.join(", ")}`);
    }
  }

  // Validate status
  if (query.status !== undefined) {
    const validStatuses = ["PLANNING", "IN_PROGRESS", "COMPLETED", "ON_HOLD"];
    if (!validStatuses.includes(query.status)) {
      errors.push(`Status must be one of: ${validStatuses.join(", ")}`);
    }
  }

  // Validate featured
  if (query.featured !== undefined) {
    if (!["true", "false"].includes(query.featured.toLowerCase())) {
      errors.push('Featured must be "true" or "false"');
    }
  }

  // Validate search
  if (query.search !== undefined) {
    if (typeof query.search !== "string" || query.search.trim().length === 0) {
      errors.push("Search query cannot be empty");
    }
    if (query.search.length > 100) {
      errors.push("Search query must be less than 100 characters");
    }
  }

  return errors;
};

// Export schemas for external use
export { createProjectSchema, updateProjectSchema };
