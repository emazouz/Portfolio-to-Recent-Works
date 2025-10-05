import z from "zod";
import { TemplateCategory, Difficulty } from "@prisma/client";

export const createTemplateSchema = z
  .object({
    title_en: z.string().min(1, "English title is required").max(200).trim(),
    title_ar: z.string().min(1, "Arabic title is required").max(200).trim(),
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
    price: z.coerce
      .number()
      .min(0, "Price must be non-negative")
      .max(10000, "Price must be less than 10,000"),
    originalPrice: z.coerce
      .number()
      .min(0, "Original price must be non-negative")
      .max(10000, "Original price must be less than 10,000")
      .optional(),
    tags: z.preprocess((val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return val
            .split(",")
            .map((tag: string) => tag.trim())
            .filter(Boolean);
        }
      }
      return val;
    }, z.array(z.string().min(1, "Tag cannot be empty").max(50, "Tag must be less than 50 characters")).min(1, "At least one tag is required").max(20, "Maximum 20 tags allowed")),
    category: z.nativeEnum(TemplateCategory).default("OTHER"),
    previewUrl: z.union([
      z.string().url("Please enter a valid URL").optional(),
      z.literal(""),
    ]),
    difficulty: z.nativeEnum(Difficulty).default(Difficulty.BEGINNER),
    featured: z
      .union([
        z.boolean(),
        z.string().transform((val) => val === "true" || val === "1"),
        z.coerce.boolean(),
      ])
      .default(false),
    slug_en: z
      .string()
      .min(3, "English slug must be at least 3 characters")
      .max(200, "English slug must be less than 200 characters")
      .regex(
        /^[a-z0-9-]+$/,
        "English slug must contain only lowercase letters, numbers, and hyphens"
      )
      .transform((val) => val.toLowerCase()),
    slug_ar: z
      .string()
      .min(3, "Arabic slug must be at least 3 characters")
      .max(200, "Arabic slug must be less than 200 characters")
      .regex(
        /^[\p{Script=Arabic}a-zA-Z0-9-\s]+$/u,
        "Arabic slug can only contain Arabic letters, English letters, numbers, spaces, and hyphens"
      )
      .trim(),
    metaTitle_en: z
      .string()
      .max(60, "English meta title must be less than 60 characters")
      .optional()
      .or(z.literal("")),
    metaTitle_ar: z
      .string()
      .max(60, "Arabic meta title must be less than 60 characters")
      .optional()
      .or(z.literal("")),
    metaDesc_en: z
      .string()
      .max(160, "English meta description must be less than 160 characters")
      .optional()
      .or(z.literal("")),
    metaDesc_ar: z
      .string()
      .max(160, "Arabic meta description must be less than 160 characters")
      .optional()
      .or(z.literal("")),
    version: z
      .string()
      .regex(/^\d+\.\d+\.\d+$/, "Version must be in format: x.x.x")
      .default("1.0.0"),
    changelog: z
      .string()
      .max(1000, "Changelog must be less than 1000 characters")
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.originalPrice && data.price > data.originalPrice) {
        return false;
      }
      return true;
    },
    {
      message: "Price cannot be greater than original price",
      path: ["price"],
    }
  );

export const updateTemplateSchema = createTemplateSchema.partial();

export const queryTemplatesSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  category: z.nativeEnum(TemplateCategory).optional(),
  difficulty: z.nativeEnum(Difficulty).optional(),
  featured: z.coerce.boolean().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  search: z.string().trim().optional(),
  sortBy: z
    .enum(["createdAt", "price", "rating", "downloads", "views", "updatedAt"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const bulkOperationSchema = z.object({
  templateIds: z
    .array(z.number().int().positive())
    .min(1, "At least one template ID is required"),
  operation: z.enum([
    "activate",
    "deactivate",
    "feature",
    "unfeature",
    "delete",
  ]),
});

export const versionSchema = z.object({
  version: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/, "Version must be in format X.Y.Z"),
  changelog: z.string().optional(),
  downloadUrl: z.string().url().optional(),
});

export const queryValidation = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
});

export const addReviewsSchema = z.object({
  rating: z
    .number()
    .min(1, "Rating must be at least 1 star")
    .max(5, "Rating cannot exceed 5 stars")
    .int("Rating must be a whole number")
    .positive("Rating must be positive"),
  
  comment: z
    .string()
    .min(1, "Comment is required")
    .min(10, "Comment must be at least 10 characters long")
    .max(1000, "Comment cannot exceed 1000 characters")
    .trim(),
});
