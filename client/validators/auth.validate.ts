import { PASSWORD_REQUIREMENTS } from "@/constants/auth.constants";
import { ValidationError } from "@/types/auth.types";
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
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
        "Password must contain at least one special character"
      ),

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

export type RegisterInput = z.infer<typeof registerSchema>;

export const validateForm = (formData: RegisterInput) => {
  const result = registerSchema.safeParse(formData);

  if (result.success) {
    return { success: true, errors: {} };
  }

  const errors: Record<string, string> = {};
  result.error.errors.forEach((err) => {
    const path = err.path[0] as string;
    errors[path] = err.message;
  });

  return { success: false, errors };
};

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

// Change Password Schema /start
export const changePasswordSchema = z.object({
  oldPassword: z
    .string()
    .min(8, "Old Password must be at least 8 characters")
    .regex(/[A-Z]/, "Old Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Old Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      "Password must contain at least one special character"
    ),
  newPassword: z
    .string()
    .min(8, "New Password must be at least 8 characters")
    .regex(/[A-Z]/, "New Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "New Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      "Password must contain at least one special character"
    ),
});

export type changePasswordInput = z.infer<typeof changePasswordSchema>;

// Change Password Schema /end

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

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Creates a dynamic Zod password schema based on requirements
 * @param requirements - Password requirements configuration
 * @returns Zod schema for password validation
 */
const createPasswordSchema = (requirements: typeof PASSWORD_REQUIREMENTS) => {
  let schema = z
    .string()
    .min(
      requirements.minLength,
      `Password must be at least ${requirements.minLength} characters`
    );

  if (requirements.requireUppercase) {
    schema = schema.regex(
      /[A-Z]/,
      "Password must contain at least one uppercase letter"
    );
  }

  if (requirements.requireLowercase) {
    schema = schema.regex(
      /[a-z]/,
      "Password must contain at least one lowercase letter"
    );
  }

  if (requirements.requireNumber) {
    schema = schema.regex(/\d/, "Password must contain at least one number");
  }

  if (requirements.requireSpecialChar) {
    schema = schema.regex(
      /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/'`~;]/,
      "Password must contain at least one special character"
    );
  }

  return z.object({
    password: schema,
  });
};

// Create the password validation schema
const PasswordValidationSchema = createPasswordSchema(PASSWORD_REQUIREMENTS);

/**
 * Validates a password against defined requirements using Zod
 * @param password - The password string to validate
 * @returns Array of validation errors, empty if valid
 */

export const validatePasswordZod = (password: string): ValidationError[] => {
  const result = PasswordValidationSchema.safeParse({ password });

  if (result.success) {
    return [];
  }

  return result.error.issues.map((issue) => ({
    field: (issue.path[0]?.toString() || "password") as "password",
    message: issue.message,
  }));
};

/**
 * Validates password confirmation match
 * @param password - The new password
 * @param confirmPassword - The confirmation password
 * @returns Validation error if passwords don't match, null otherwise
 */
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): ValidationError | null => {
  if (password !== confirmPassword) {
    return {
      field: "confirmPassword",
      message: "Passwords do not match",
    };
  }
  return null;
};

/**
 * Validates complete password form (password + confirmation)
 * @param password - The new password
 * @param confirmPassword - The confirmation password
 * @returns Array of all validation errors
 */
export const validatePasswordForm = (
  password: string,
  confirmPassword: string
): ValidationError[] => {
  const passwordErrors = validatePasswordZod(password);
  const matchError = validatePasswordMatch(password, confirmPassword);

  return matchError ? [...passwordErrors, matchError] : passwordErrors;
};
