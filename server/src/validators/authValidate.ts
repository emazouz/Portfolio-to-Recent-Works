import { Role } from "@prisma/client";
import { z } from "zod";

// Register Schema

export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),

    confirmPassword: z.string().min(1, "Please confirm your password"),

    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters"),

    termsAgreed: z
      .boolean()
      .refine(
        (val) => val === true,
        "You must agree to the terms and conditions"
      ),

    subscribeNewsletter: z.boolean().default(false),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Login Schema

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  rememberMe: z.boolean().optional().default(false),
});

// Change Password Schema
export const changePasswordSchema = z.object({
  oldPassword: z
    .string()
    .min(8, "Old Password must be at least 8 characters")
    .regex(/[A-Z]/, "Old Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Old Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Old Password must contain at least one number"),
  newPassword: z
    .string()
    .min(8, "New Password must be at least 8 characters")
    .regex(/[A-Z]/, "New Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "New Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "New Password must contain at least one number"),
});

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export const validateTokenSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  token: z.string().min(1, "Token is required"),
});

// Reset Password Schema

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  token: z.string().min(1, "Token is required"),
  newPassword: z
    .string()
    .min(8, "New Password must be at least 8 characters")
    .regex(/[A-Z]/, "New Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "New Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "New Password must contain at least one number"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
    .optional(),

  gender: z
    .enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"], {
      message: "Gender must be MALE, FEMALE, OTHER, or PREFER_NOT_TO_SAY",
    })
    .optional(),

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
  subscribeNewsletter: z.preprocess((val) => {
    if (val === undefined || val === null) return undefined;
    if (typeof val === "boolean") return val;
    if (typeof val === "string") {
      return val === "true";
    }
    return false;
  }, z.boolean().optional()),
});
