import { ZodError } from "zod";
import {
  emailChangeSchema,
  imageUploadSchema,
  passwordChangeSchema,
  profileUpdateSchema,
  verificationCodeSchema,
} from "./profile.validate";

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const getInitials = (name: string): string => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const formatReviewDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  return date.toLocaleDateString();
};

// Helper to format Zod errors for display
export const formatZodError = (error: ZodError): string => {
  return error.errors.map((err) => err.message).join(", ");
};

// Helper to get first error message
export const getFirstZodError = (error: ZodError): string => {
  return error.errors[0]?.message || "Validation failed";
};

// Helper to get errors by field
export const getZodErrorsByField = (
  error: ZodError
): Record<string, string> => {
  const errors: Record<string, string> = {};
  error.errors.forEach((err) => {
    const path = err.path.join(".");
    errors[path] = err.message;
  });
  return errors;
};

export const validateProfileData = (data: unknown) => {
  return profileUpdateSchema.safeParse(data);
};

export const validatePasswordData = (data: unknown) => {
  return passwordChangeSchema.safeParse(data);
};

export const validateEmailData = (data: unknown) => {
  return emailChangeSchema.safeParse(data);
};

export const validateVerificationCode = (code: string) => {
  return verificationCodeSchema.safeParse({ code });
};

export const validateImageFile = (file: File) => {
  return imageUploadSchema.safeParse({ file });
};
