import { z } from "zod";

// Enums matching your Prisma enums
export const ProjectStatusEnum = z.enum([
  "COMPLETED",
  "IN_PROGRESS",
  "PLANNING",
  "ON_HOLD",
]);

export const ProjectCategoryEnum = z.enum([
  "WEB_DEVELOPMENT",
  "MOBILE_APP",
  "DESKTOP_APP",
  "UI_UX_DESIGN",
  "API_DEVELOPMENT",
  "OTHER",
]);

// Zod schema for creating a project
export const createProjectSchema = z.object({
  title_en: z.string().min(1, "English title is required"),
  title_ar: z.string().min(1, "Arabic title is required"),
  description_en: z.string().min(1, "English description is required"),
  description_ar: z.string().min(1, "Arabic description is required"),
  //   imageUrl: z.string().url("Image URL must be valid"),
  category: ProjectCategoryEnum.default("WEB_DEVELOPMENT"),
  status: ProjectStatusEnum.default("IN_PROGRESS"),
  liveUrl: z.string().url(),
  githubUrl: z.string().url(),
  technologies: z.array(z.string()),
  featured: z.boolean().default(false),
  sortOrder: z.number().int(),

  // SEO
  slug_en: z.string().min(1, "English slug is required"),
  slug_ar: z.string().min(1, "Arabic slug is required"),
  metaTitle_en: z.string(),
  metaTitle_ar: z.string(),
  metaDesc_en: z.string(),
  metaDesc_ar: z.string(),
});

// TypeScript type inferred from Zod schema
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
