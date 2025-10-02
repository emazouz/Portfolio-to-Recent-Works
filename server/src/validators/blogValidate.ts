import { z, ZodError } from "zod";

// Blog category enum matching Prisma
export const BlogCategoryEnum = z.enum([
  "WEB_DEVELOPMENT",
  "MOBILE_DEVELOPMENT",
  "UI_UX_DESIGN",
  "PROGRAMMING_TIPS",
  "TUTORIALS",
  "NEWS",
  "PERSONAL",
  "TECHNOLOGY",
  "OTHER",
]);

// Main blog creation schema
export const createBlogSchema = z.object({
  title_en: z
    .string()
    .min(1, "English title is required")
    .max(200, "English title too long"),
  title_ar: z
    .string()
    .min(1, "Arabic title is required")
    .max(200, "Arabic title too long"),
  content_en: z
    .string()
    .min(50, "English content must be at least 50 characters"),
  content_ar: z
    .string()
    .min(50, "Arabic content must be at least 50 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(100, "Slug too long")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
  excerpt_en: z.string().max(500, "English excerpt too long").optional(),
  excerpt_ar: z.string().max(500, "Arabic excerpt too long").optional(),
//   authorId: z.string().uuid("Invalid author ID").optional(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  category: BlogCategoryEnum.optional(),
  tags: z.array(z.string().min(1).max(50)).max(10, "Too many tags").default([]),
  readTime: z.number().int().min(1).max(999).optional(),
  // SEO fields
  metaTitle_en: z.string().max(60, "English meta title too long").optional(),
  metaTitle_ar: z.string().max(60, "Arabic meta title too long").optional(),
  metaDesc_en: z
    .string()
    .max(160, "English meta description too long")
    .optional(),
  metaDesc_ar: z
    .string()
    .max(160, "Arabic meta description too long")
    .optional(),
  keywords: z
    .array(z.string().min(1).max(30))
    .max(15, "Too many keywords")
    .default([]),
  // Scheduling
  publishDate: z.string().datetime().optional().or(z.date().optional()),
});

// Schema for updating blogs (all fields optional except slug validation)
export const updateBlogSchema = createBlogSchema.partial().extend({
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(100, "Slug too long")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    )
    .optional(),
});

// File validation schema
export const blogFileSchema = z.object({
  gallery: z.array(z.any()).max(1, "Only one image allowed").optional(),
});

// Query parameters schema
export const blogQuerySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .refine((n) => n > 0)
    .optional(),
  limit: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .refine((n) => n > 0 && n <= 100)
    .optional(),
  published: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  featured: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  category: BlogCategoryEnum.optional(),
//   authorId: z.string().uuid().optional(),
  search: z.string().min(1).max(100).optional(),
  sortBy: z
    .enum(["createdAt", "updatedAt", "title_en", "views", "likes"])
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

// TypeScript types
export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
export type BlogQueryParams = z.infer<typeof blogQuerySchema>;
export type BlogCategory = z.infer<typeof BlogCategoryEnum>;

// Validation helper functions
function extractZodErrors(error: ZodError): string[] {
  return error.issues.map((err: z.ZodIssue) => err.message);
}

export function validateBlogData(body: any): {
  isValid: boolean;
  errors: string[];
  data?: CreateBlogInput;
} {
  try {
    const validatedData = createBlogSchema.parse(body);
    return {
      isValid: true,
      errors: [],
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        isValid: false,
        errors: extractZodErrors(error),
      };
    }
    return {
      isValid: false,
      errors: ["Unknown validation error occurred"],
    };
  }
}

export function validateBlogUpdate(body: any): {
  isValid: boolean;
  errors: string[];
  data?: UpdateBlogInput;
} {
  try {
    const validatedData = updateBlogSchema.parse(body);
    return {
      isValid: true,
      errors: [],
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        isValid: false,
        errors: extractZodErrors(error),
      };
    }
    return {
      isValid: false,
      errors: ["Unknown validation error occurred"],
    };
  }
}

export function validateBlogFiles(files: any): string[] {
  try {
    blogFileSchema.parse(files);
    return [];
  } catch (error) {
    if (error instanceof ZodError) {
      return extractZodErrors(error).map((msg) => `File error: ${msg}`);
    }
    return ["Unknown file validation error occurred"];
  }
}

export function validateQueryParams(query: any): {
  isValid: boolean;
  errors: string[];
  data?: BlogQueryParams;
} {
  try {
    const validatedData = blogQuerySchema.parse(query);
    return {
      isValid: true,
      errors: [],
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        isValid: false,
        errors: extractZodErrors(error),
      };
    }
    return {
      isValid: false,
      errors: ["Invalid query parameters"],
    };
  }
}
