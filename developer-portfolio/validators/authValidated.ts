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

// Reset Password Schema

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z
    .string()
    .min(8, "New Password must be at least 8 characters")
    .regex(/[A-Z]/, "New Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "New Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "New Password must contain at least one number"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
