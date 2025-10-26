import { z } from "zod";

// Profile Update Schema
export const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),

  email: z.string().email("Invalid email address").optional(),

  birthDate: z
    .string()
    .or(z.date())
    .refine(
      (value) => {
        const date = new Date(value);
        return !isNaN(date.getTime());
      },
      { message: "Invalid date format" }
    )
    .refine(
      (value) => {
        const date = new Date(value);
        const today = new Date();
        return date <= today;
      },
      { message: "Birth date cannot be in the future" }
    )
    .refine(
      (value) => {
        const date = new Date(value);
        const hundredYearsAgo = new Date();
        hundredYearsAgo.setFullYear(hundredYearsAgo.getFullYear() - 120);
        return date >= hundredYearsAgo;
      },
      { message: "Birth date seems unrealistic" }
    )
    .optional(),

  gender: z
    .enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"], {
      errorMap: () => ({ message: "Please select a valid gender" }),
    })
    .optional(),

  subscribeNewsletter: z.boolean().optional(),
});

// Password Change Schema
export const passwordChangeSchema = z
  .object({
    current: z.string().min(1, "Current password is required"),

    new: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must not exceed 128 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number"
      ),

    confirm: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.new === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

// Email Change Schema
export const emailChangeSchema = z.object({
  newEmail: z
    .string()
    .email("Invalid email address")
    .min(5, "Email is too short")
    .max(255, "Email is too long"),

  password: z.string().min(1, "Password is required for email change"),
});

// Verification Code Schema
export const verificationCodeSchema = z.object({
  code: z
    .string()
    .length(6, "Verification code must be 6 digits")
    .regex(/^\d{6}$/, "Code must contain only numbers"),
});

// Image Upload Schema
export const imageUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 2 * 1024 * 1024,
      "File size must be less than 2MB"
    )
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
          file.type
        ),
      "Only JPG, PNG, GIF, and WebP images are allowed"
    ),
});

// Review Schema
export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must not exceed 5"),

  comment: z
    .string()
    .min(10, "Comment must be at least 10 characters")
    .max(2000, "Comment must not exceed 2000 characters"),

  productName: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name must not exceed 100 characters")
    .optional(),
});

// Type inference from schemas
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;
export type EmailChangeInput = z.infer<typeof emailChangeSchema>;
export type VerificationCodeInput = z.infer<typeof verificationCodeSchema>;
export type ImageUploadInput = z.infer<typeof imageUploadSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
