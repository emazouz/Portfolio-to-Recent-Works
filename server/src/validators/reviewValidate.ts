import z from "zod";

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
