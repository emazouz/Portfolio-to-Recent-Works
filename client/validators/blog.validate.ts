import z from "zod";

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
const BlogStatusEnum = z.enum([
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
  "IN_PROGRESS",
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
  category: BlogCategoryEnum.default("WEB_DEVELOPMENT"),
  tags: z.array(z.string().min(1).max(50)).max(10, "Too many tags").default([]),
  readTime: z.number().int().min(1).max(999).optional(),
  // SEO fields
  metaTitle_en: z.string().max(60, "English meta title too long").optional(),
  metaTitle_ar: z.string().max(60, "Arabic meta title too long").optional(),
  metaDesc_en: z.string().optional(),

  status: BlogStatusEnum.default("DRAFT"),
  metaDesc_ar: z.string().optional(),
  keywords: z
    .array(z.string().min(1).max(30))
    .max(15, "Too many keywords")
    .default([]),
  // Scheduling
  publishDate: z.string().datetime().optional().or(z.date().optional()),


});

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

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
