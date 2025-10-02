import { z } from "zod";

// ============ VALIDATION SCHEMAS ============

export const createCommentSchema = z.object({
  blogId: z.number().int().positive("Invalid blog ID"),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name too long")
    .trim(),
  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email too long")
    .toLowerCase(),
  content: z
    .string()
    .min(10, "Comment must be at least 10 characters")
    .max(2000, "Comment too long")
    .trim(),
  parentId: z.number().int().positive().optional().nullable().default(null),
});

export const updateCommentSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name too long")
    .trim()
    .optional(),
  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email too long")
    .toLowerCase()
    .optional(),
  content: z
    .string()
    .min(10, "Comment must be at least 10 characters")
    .max(2000, "Comment too long")
    .trim()
    .optional(),
});

export const commentQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  approved: z.coerce.boolean().optional(),
  sortBy: z.enum(["createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const blogCommentsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  approved: z.coerce.boolean().default(true),
});

// ============ TYPES ============

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
export type CommentQueryParams = z.infer<typeof commentQuerySchema>;
export type BlogCommentsQueryParams = z.infer<typeof blogCommentsQuerySchema>;
