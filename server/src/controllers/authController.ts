// authController.ts

import { NextFunction, Request, Response } from "express";
import { prisma } from "../utils/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { sendResetEmail } from "../utils/email";
import { resetPasswordMessage } from "../lib/reset-password";
import {
  AuthenticatedRequest,
  MyTokenPayload,
  requireAuth,
} from "../middleware/auth";
import { emailVerificationMessage } from "../lib/email-verification";
import { asyncHandler } from "../middleware/asyncHandler";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  updateProfileSchema,
  validateTokenSchema,
} from "../validators/authValidate";
import { sendResponse } from "../middleware/response";
import { StatusCodes } from "http-status-codes";
import { Role } from "@prisma/client";
import {
  BCRYPT_SALT_ROUNDS,
  PASSWORD_HASH_ROUNDS,
  RESET_TOKEN_EXPIRY_HOURS,
} from "../constants/auth";
import { FileRequest } from "../types/FileRequest";
import { getFiles } from "../middleware/upload";
import { uploadToCloudinary } from "../utils/cloudinary";

// find user by email
const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const authenticateWithRefresh = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken) {
    return res.status(401).json({
      success: false,
      error: "ACCESS_TOKEN_MISSING",
      message: "Access token is missing",
    });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(accessToken, secret);
    const userPayload = decoded as MyTokenPayload;

    req.user = {
      userId: userPayload.userId,
      email: userPayload.email,
      role: userPayload.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError && refreshToken) {
      // محاولة تجديد التوكن
      try {
        const user = await prisma.user.findFirst({
          where: { refreshToken },
        });

        if (user) {
          // إنشاء توكن جديد
          const newAccessToken = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "15m" }
          );

          // تحديث الكوكيز
          res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 15 * 60 * 1000, // 15 minutes
          });

          req.user = {
            userId: user.id,
            email: user.email,
            role: user.role as Role,
          };

          return next();
        }
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
      }
    }

    return res.status(401).json({
      success: false,
      error: "TOKEN_EXPIRED",
      message: "Please login again",
    });
  }
};

// generate tokens
const generateTokens = (userId: string, email: string, role: string) => {
  const accessToken = jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" } // access token expires in 7 days
  );
  const refreshToken = uuidv4();
  return { accessToken, refreshToken };
};

// update refresh token
const updateRefreshToken = async (
  userId: string,
  refreshToken: string | null
) => {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken },
  });
};

// set auth cookies
const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction ? true : false,
    sameSite: isProduction ? "strict" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction ? true : false,
    sameSite: isProduction ? "strict" : "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

// --- Controllers ---
export const getUser = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!requireAuth(req, res)) return;

      const userId = req.user?.userId;

      if (!userId) {
        return sendResponse(
          res,
          StatusCodes.UNAUTHORIZED,
          false,
          "User not authenticated"
        );
      }
      // 2. Find user by id
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          reviews: {
            select: {
              id: true,
              rating: true,
              comment: true,
              createdAt: true,
              updatedAt: true,
              verified: true,
              project: {
                select: {
                  id: true,
                  title_en: true,
                  title_ar: true,
                },
              },
            },
          },
        },
      });

      // This should not happen if the token is valid, but it's a good check.
      if (!user) {
        sendResponse(res, StatusCodes.NOT_FOUND, false, "User not found");
        return;
      }
      sendResponse(res, StatusCodes.OK, true, "Get user is successfully", user);
    } catch (error) {
      sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Internal server error. Please try again later."
      );
    }
  }
);

// register user
export const register = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = registerSchema.parse(req.body);

      // 2. check if user exists
      const existingUser = await findUserByEmail(validatedData.email);
      if (existingUser) {
        sendResponse(
          res,
          StatusCodes.CONFLICT,
          false,
          "This email is already registered"
        );
      }

      // 3. hash password
      const hashedPassword = await bcrypt.hash(
        validatedData.password,
        PASSWORD_HASH_ROUNDS
      );

      // 4. create user in database
      const user = await prisma.user.create({
        data: {
          email: validatedData.email,
          password: hashedPassword,
          name: validatedData.name,
          role: "ADMIN",
          termsAgreed: validatedData.termsAgreed,
          subscribeNewsletter: validatedData.subscribeNewsletter,
          emailVerified: false,
        },
      });

      // 5. remove password from user object
      const { password: _, ...userWithoutPassword } = user;

      sendResponse(
        res,
        StatusCodes.CREATED,
        true,
        "User registered successfully",
        userWithoutPassword
      );
    } catch (error) {
      console.error("Error registering user:", error);
      sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "An unexpected error occurred"
      );
    }
  }
);

// login user
export const login = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = loginSchema.parse(req.body);

      // 2. find user by email
      const user = await findUserByEmail(validatedData.email);
      if (!user) {
        sendResponse(res, StatusCodes.NOT_FOUND, false, "User not found");
        return;
      }

      // 3. check if password is valid
      const isPasswordValid = await bcrypt.compare(
        validatedData.password,
        user.password
      );
      if (!isPasswordValid) {
        sendResponse(
          res,
          StatusCodes.UNAUTHORIZED,
          false,
          "Invalid email or password"
        );
      }

      // 4. generate tokens
      const { accessToken, refreshToken } = generateTokens(
        user.id,
        user.email,
        user.role
      );

      // 5. update refresh token and remember token if requested
      const updateData: any = { refreshToken };

      if (validatedData.rememberMe) {
        const rememberTokenExpiresAt = new Date();
        rememberTokenExpiresAt.setDate(rememberTokenExpiresAt.getDate() + 30); // 30 days

        updateData.rememberToken = true;
        updateData.rememberTokenExpiresAt = rememberTokenExpiresAt;
      } else {
        updateData.rememberToken = false;
        updateData.rememberTokenExpiresAt = null;
      }

      await prisma.user.update({
        where: { id: user.id },
        data: updateData,
      });

      // 6. set auth cookies with remember me duration if requested
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite:
          process.env.NODE_ENV === "production"
            ? ("strict" as const)
            : ("lax" as const),
        path: "/",
        maxAge: validatedData.rememberMe
          ? 30 * 24 * 60 * 60 * 1000
          : 24 * 60 * 60 * 1000, // 30 days if remember me, else 24 hours
      };

      res.cookie("accessToken", accessToken, cookieOptions);
      res.cookie("refreshToken", refreshToken, cookieOptions);

      sendResponse(res, StatusCodes.OK, true, "Login successful", {
        id: user.id,
        email: user.email,
        username: user.name,
        role: user.role,
        termsAgreed: user.termsAgreed,
        // rememberToken: user.rememberToken,
      });
    } catch (error) {
      console.error("Error logging in:", error);
      sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "An unexpected error occurred"
      );
    }
  }
);

// refresh access token
export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies.refreshToken;

    // 1. check if refresh token is provided
    if (!refreshToken) {
      sendResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        false,
        "Access denied. Refresh token is not provided"
      );
    }

    try {
      // 2. find user by refresh token
      const user = await prisma.user.findFirst({
        where: { refreshToken },
      });

      if (!user) {
        // if refresh token is provided but is invalid (maybe it was already used or stolen)
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        sendResponse(
          res,
          StatusCodes.FORBIDDEN,
          false,
          "Refresh token is invalid"
        );
        return;
      }

      // 3. generate new tokens (with refresh token rotation)
      const { accessToken, refreshToken: newRefreshToken } = generateTokens(
        user.id,
        user.email,
        user.role
      );

      // 4. update refresh token in database
      await updateRefreshToken(user.id, newRefreshToken);

      setAuthCookies(res, accessToken, newRefreshToken);

      sendResponse(
        res,
        StatusCodes.OK,
        true,
        "Access token refreshed successfully",
        accessToken
      );
    } catch (error) {
      console.error("Error refreshing access token:", error);
      sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "An unexpected error occurred"
      );
    }
  }
);

// logout user
export const logout = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!requireAuth(req, res)) {
        sendResponse(
          res,
          StatusCodes.UNAUTHORIZED,
          false,
          "User not authenticated"
        );
      }
      const refreshToken = req.cookies.refreshToken;

      // 1. invalidate refresh token in database if it exists
      if (refreshToken) {
        const user = await prisma.user.findFirst({ where: { refreshToken } });
        if (user) {
          await updateRefreshToken(user.id, null);
        }
      }

      // 2. clear auth cookies
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      sendResponse(res, StatusCodes.OK, true, "Logout successful");
    } catch (error) {
      console.error("Error logging out:", error);
      sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "An unexpected error occurred"
      );
    }
  }
);

//  change password
export const changePassword = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!requireAuth(req, res)) {
        sendResponse(
          res,
          StatusCodes.UNAUTHORIZED,
          false,
          "User not authenticated"
        );
      }
      const userId = req.user?.userId;
      const validatedData = changePasswordSchema.parse(req.body);

      // 2. Find user by id
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      // This should not happen if the token is valid, but it's a good check.
      if (!user) {
        sendResponse(res, StatusCodes.NOT_FOUND, false, "User not found");
        return;
      }

      // 3. Check if old password is correct
      const isMatch = await bcrypt.compare(
        validatedData.oldPassword,
        user.password
      );
      if (!isMatch) {
        sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Incorrect old password"
        );
      }

      // 4. Hash new password and update user password
      const hashedPassword = await bcrypt.hash(
        validatedData.newPassword,
        PASSWORD_HASH_ROUNDS
      );
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      sendResponse(res, StatusCodes.OK, true, "Password changed successfully");
    } catch (err) {
      console.error("Error changing password:", err);
      // Handle potential JWT errors explicitly
      if (err instanceof jwt.JsonWebTokenError) {
        sendResponse(res, StatusCodes.UNAUTHORIZED, false, "Invalid token");
      }

      sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Internal server error"
      );
    }
  }
);

/**
 * Generate password reset token and send email
 * @route POST /api/auth/forgot-password
 */
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email } = forgotPasswordSchema.parse(req.body);

    // Find user by email
    const user = await findUserByEmail(email);

    // Always return success to prevent email enumeration
    const successMessage =
      "If an account exists with this email, a password reset link will be sent.";

    if (!user) {
      sendResponse(res, StatusCodes.OK, true, successMessage);
      return;
    }

    try {
      // Generate unhashed token and expiration
      const unhashedToken = uuidv4();
      const expiresAt = new Date(
        Date.now() + RESET_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000
      );

      // Hash token for database storage
      const hashedToken = await bcrypt.hash(unhashedToken, BCRYPT_SALT_ROUNDS);

      // Update user with hashed token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken: hashedToken,
          resetTokenExpiresAt: expiresAt,
        },
      });

      // Send reset email with unhashed token
      const resetLink = `${
        process.env.FRONTEND_URL
      }/auth/reset-password?token=${unhashedToken}&email=${encodeURIComponent(
        email
      )}`;

      await sendResetEmail(email, resetPasswordMessage(resetLink));

      sendResponse(res, StatusCodes.OK, true, successMessage);
    } catch (emailError) {
      // Clean up token if email fails
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken: null,
          resetTokenExpiresAt: null,
        },
      });

      console.error("Failed to send reset email:", emailError);
      sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Failed to send reset email. Please try again later."
      );
    }
  }
);

/**
 * Validate password reset token
 * @route POST /api/auth/validate-token
 */
export const validateToken = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { token, email } = validateTokenSchema.parse(req.body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        resetToken: true,
        resetTokenExpiresAt: true,
      },
    });

    // Validate user exists and has a reset token
    if (!user?.resetToken) {
      sendResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        false,
        "Invalid or expired reset token"
      );
      return;
    }

    // Check token expiration
    if (user.resetTokenExpiresAt && user.resetTokenExpiresAt < new Date()) {
      await cleanupExpiredToken(user.id);
      sendResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        false,
        "Reset token has expired"
      );
      return;
    }

    // Compare unhashed token with hashed token
    const isTokenValid = await bcrypt.compare(token, user.resetToken);

    if (!isTokenValid) {
      sendResponse(res, StatusCodes.UNAUTHORIZED, false, "Invalid reset token");
      return;
    }

    // Token is valid
    sendResponse(res, StatusCodes.OK, true, "Token validated successfully", {
      userId: user.id,
    });
  }
);

/**
 * Reset user password with valid token
 * @route POST /api/auth/reset-password
 */
export const resetPassword = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { token, email, newPassword } = resetPasswordSchema.parse(req.body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        resetToken: true,
        resetTokenExpiresAt: true,
      },
    });

    // Validate user exists and has a reset token
    if (!user?.resetToken) {
      sendResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        false,
        "Invalid or expired reset token"
      );
      return;
    }

    // Check token expiration
    if (user.resetTokenExpiresAt && user.resetTokenExpiresAt < new Date()) {
      await cleanupExpiredToken(user.id);
      sendResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        false,
        "Reset token has expired"
      );
      return;
    }

    // Verify token validity
    const isTokenValid = await bcrypt.compare(token, user.resetToken);

    if (!isTokenValid) {
      sendResponse(res, StatusCodes.UNAUTHORIZED, false, "Invalid reset token");
      return;
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, PASSWORD_HASH_ROUNDS);

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiresAt: null,
      },
    });

    sendResponse(
      res,
      StatusCodes.OK,
      true,
      "Password has been reset successfully"
    );
  }
);

/**
 * Helper function to clean up expired tokens
 */
async function cleanupExpiredToken(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      resetToken: null,
      resetTokenExpiresAt: null,
    },
  });
}
interface VerifyEmailRequest extends AuthenticatedRequest {
  body: {
    code: string;
  };
}

interface EmailChangeRequest extends AuthenticatedRequest {
  body: {
    newEmail: string;
    currentPassword: string;
    code?: string;
  };
}

// Constants
const EMAIL_VERIFICATION_TYPES = {
  EMAIL_VERIFICATION: "EMAIL_VERIFICATION",
  CHANGE_EMAIL: "CHANGE_EMAIL",
} as const;

const CODE_LENGTH = 6;
const CODE_EXPIRY_HOURS = 1;

// Utility functions
const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const getExpiryDate = (hours: number = CODE_EXPIRY_HOURS): Date => {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
};

const validateCode = (code: string): boolean => {
  return /^\d{6}$/.test(code);
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Middleware to ensure authentication
const ensureAuthenticated = (
  req: AuthenticatedRequest,
  res: Response
): string | null => {
  if (!requireAuth(req, res)) {
    sendResponse(
      res,
      StatusCodes.UNAUTHORIZED,
      false,
      "User not authenticated"
    );
    return null;
  }

  const userId = req.user?.userId;
  if (!userId) {
    sendResponse(
      res,
      StatusCodes.UNAUTHORIZED,
      false,
      "User not authenticated"
    );
    return null;
  }

  return userId;
};

export const requestEmailVerified = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = ensureAuthenticated(req, res);
    if (!userId) return;

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        sendResponse(res, StatusCodes.NOT_FOUND, false, "User not found");
        return;
      }

      if (user.emailVerified) {
        sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Email is already verified"
        );
        return;
      }

      // Clean up existing verification codes
      await prisma.emailVerification.deleteMany({
        where: {
          userId: userId,
          type: EMAIL_VERIFICATION_TYPES.EMAIL_VERIFICATION,
        },
      });

      const code = generateVerificationCode();
      const expiresAt = getExpiryDate();

      await prisma.emailVerification.create({
        data: {
          userId: userId,
          code,
          expiresAt,
          type: EMAIL_VERIFICATION_TYPES.EMAIL_VERIFICATION,
          email: user.email,
        },
      });

      try {
        await sendResetEmail(
          user.email,
          emailVerificationMessage(
            code,
            EMAIL_VERIFICATION_TYPES.EMAIL_VERIFICATION
          )
        );

        sendResponse(
          res,
          StatusCodes.OK,
          true,
          "A verification code has been sent to your email address.",
          {
            email: user.email,
            expiresAt: expiresAt.toISOString(),
          }
        );
      } catch (emailError) {
        console.error("Error sending email:", emailError);

        // Clean up on email failure
        await prisma.emailVerification.deleteMany({
          where: {
            userId: userId,
            code: code,
            type: EMAIL_VERIFICATION_TYPES.EMAIL_VERIFICATION,
          },
        });

        sendResponse(
          res,
          StatusCodes.INTERNAL_SERVER_ERROR,
          false,
          "Failed to send email verification code. Please try again."
        );
      }
    } catch (error) {
      console.error("Error in requestEmailVerified:", error);
      sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Internal server error. Please try again later."
      );
    }
  }
);

export const verifyEmailVerified = asyncHandler(
  async (req: VerifyEmailRequest, res: Response) => {
    const userId = ensureAuthenticated(req, res);
    if (!userId) return;

    const { code } = req.body;

    if (!code) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "Verification code is required"
      );
    }

    if (!validateCode(code)) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "Invalid verification code format"
      );
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        sendResponse(res, StatusCodes.NOT_FOUND, false, "User not found");
        return;
      }

      if (user.emailVerified) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Email is already verified"
        );
      }

      const emailConfirmation = await prisma.emailVerification.findFirst({
        where: {
          userId: userId,
          code: code,
          type: EMAIL_VERIFICATION_TYPES.EMAIL_VERIFICATION,
        },
      });

      if (!emailConfirmation) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Invalid or expired verification code"
        );
      }

      if (new Date() > emailConfirmation.expiresAt) {
        await prisma.emailVerification.delete({
          where: { id: emailConfirmation.id },
        });

        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Verification code has expired. Please request a new one."
        );
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { emailVerified: true },
        select: {
          id: true,
          email: true,
          emailVerified: true,
          name: true,
          role: true,
        },
      });

      // Clean up verification codes
      await prisma.emailVerification.deleteMany({
        where: {
          userId: userId,
          type: EMAIL_VERIFICATION_TYPES.EMAIL_VERIFICATION,
        },
      });

      sendResponse(res, StatusCodes.OK, true, "Email verified successfully!", {
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error in verifyEmailVerified:", error);
      sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Internal server error. Please try again later."
      );
    }
  }
);

export const requestEmailChange = asyncHandler(
  async (req: EmailChangeRequest, res: Response) => {
    const userId = ensureAuthenticated(req, res);
    if (!userId) return;

    const { newEmail, currentPassword } = req.body;

    if (!newEmail || !currentPassword) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "New email and current password are required"
      );
    }

    if (!validateEmail(newEmail)) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "Invalid email address"
      );
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        sendResponse(res, StatusCodes.NOT_FOUND, false, "User not found");
        return;
      }

      if (newEmail === user.email) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "New email cannot be the same as current email"
        );
      }

      // Check if email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: newEmail },
      });

      if (existingUser) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Email already in use"
        );
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isPasswordValid) {
        return sendResponse(
          res,
          StatusCodes.UNAUTHORIZED,
          false,
          "Invalid password"
        );
      }

      // Clean up existing change email verifications
      await prisma.emailVerification.deleteMany({
        where: {
          userId: userId,
          type: EMAIL_VERIFICATION_TYPES.CHANGE_EMAIL,
        },
      });

      const code = generateVerificationCode();
      const expiresAt = getExpiryDate();

      await prisma.emailVerification.create({
        data: {
          userId,
          email: newEmail,
          code,
          expiresAt,
          type: EMAIL_VERIFICATION_TYPES.CHANGE_EMAIL,
        },
      });

      try {
        await sendResetEmail(
          newEmail,
          emailVerificationMessage(code, EMAIL_VERIFICATION_TYPES.CHANGE_EMAIL)
        );

        sendResponse(
          res,
          StatusCodes.OK,
          true,
          "A verification code has been sent to your new email address."
        );
      } catch (emailError) {
        console.error("Error sending email:", emailError);

        // Clean up on email failure
        await prisma.emailVerification.deleteMany({
          where: {
            userId: userId,
            code: code,
            type: EMAIL_VERIFICATION_TYPES.CHANGE_EMAIL,
          },
        });

        sendResponse(
          res,
          StatusCodes.INTERNAL_SERVER_ERROR,
          false,
          "Failed to send email verification code. Please try again."
        );
      }
    } catch (error) {
      console.error("Error requesting email change:", error);
      sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "An unexpected error occurred"
      );
    }
  }
);

export const verifyEmailChange = asyncHandler(
  async (req: EmailChangeRequest, res: Response) => {
    const userId = ensureAuthenticated(req, res);
    if (!userId) return;

    const { code } = req.body;

    if (!code) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "Verification code is required"
      );
    }

    if (!validateCode(code)) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "Invalid verification code format"
      );
    }

    try {
      const emailVerification = await prisma.emailVerification.findFirst({
        where: {
          code,
          type: EMAIL_VERIFICATION_TYPES.CHANGE_EMAIL,
          userId: userId, // Ensure the code belongs to the authenticated user
        },
      });

      if (!emailVerification) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Invalid verification code"
        );
      }

      if (new Date() > emailVerification.expiresAt) {
        await prisma.emailVerification.delete({
          where: { id: emailVerification.id },
        });

        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Verification code has expired"
        );
      }

      // Check if email is still available
      const existingUser = await prisma.user.findUnique({
        where: { email: emailVerification.email },
      });

      if (existingUser) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Email is already in use"
        );
      }

      // Use transaction for atomic operations
      await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: userId },
          data: { email: emailVerification.email },
        });

        await tx.emailVerification.delete({
          where: { id: emailVerification.id },
        });
      });

      sendResponse(res, StatusCodes.OK, true, "Email updated successfully");
    } catch (error) {
      console.error("Error verifying email change:", error);
      sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "An unexpected error occurred"
      );
    }
  }
);

/**
 * @desc    Update user profile and address
 * @route   PUT /api/profile
 * @access  Private
 */

export const updateProfile = asyncHandler(
  async (req: FileRequest, res: Response) => {
    if (!requireAuth(req, res)) return;

    try {
      const userId = req.user?.userId;

      if (!userId) {
        return sendResponse(
          res,
          StatusCodes.UNAUTHORIZED,
          false,
          "User not authenticated"
        );
      }

      // Parse FormData fields
      const { name, gender, birthDate, subscribeNewsletter } = req.body;

      console.log("Received data:", { name, gender, birthDate });

      // ✅ Log avatar file properly
      let avatarFile = null;
      if (req.files && typeof req.files === "object") {
        if ("avatar" in req.files && Array.isArray(req.files.avatar)) {
          avatarFile = req.files.avatar[0];
        }
      }

      // Validate the parsed data
      const validateData = updateProfileSchema.safeParse({
        name: name || undefined,
        gender: gender || undefined,
        birthDate: birthDate || undefined,
        subscribeNewsletter: subscribeNewsletter || undefined,
      });

      if (!validateData.success) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Invalid data provided",
          {
            errors: validateData.error.issues.map((err) => ({
              field: err.path.join("."),
              message: err.message,
            })),
          }
        );
      }

      const validatedData = validateData.data;

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          false,
          "User not found"
        );
      }

      // Handle image upload
      let imageUrl: string | undefined;

      if (avatarFile) {
        try {
          console.log("Uploading avatar to Cloudinary...");
          const uploadedImage = await uploadToCloudinary(
            avatarFile,
            "Profile/avatar"
          );
          imageUrl = uploadedImage.url;
          console.log("Avatar uploaded successfully:", imageUrl);
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            false,
            "Failed to upload image. Please try again."
          );
        }
      }

      // Prepare update data
      const updateData: any = {
        updatedAt: new Date(),
      };

      // Only include fields that are provided
      if (validatedData.name !== undefined)
        updateData.name = validatedData.name;
      if (validatedData.gender !== undefined)
        updateData.gender = validatedData.gender;
      if (validatedData.birthDate !== undefined) {
        updateData.birthDate = new Date(validatedData.birthDate);
      }
      if (imageUrl !== undefined) updateData.avatar = imageUrl;
      if (validatedData.subscribeNewsletter !== undefined) {
        updateData.subscribeNewsletter = validatedData.subscribeNewsletter;
      }

      // Update user profile
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          gender: true,
          birthDate: true,
          role: true,
          emailVerified: true,
          subscribeNewsletter: true,
          termsAgreed: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      // Format birthDate for frontend
      const formattedUser = {
        ...updatedUser,
        birthDate: updatedUser.birthDate
          ? updatedUser.birthDate.toISOString().split("T")[0]
          : null,
      };

      return sendResponse(
        res,
        StatusCodes.OK,
        true,
        "Profile updated successfully",
        {
          user: formattedUser,
        }
      );
    } catch (error: any) {
      console.error("Error updating profile:", error);

      if (error.code === "P2002") {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "A user with this information already exists"
        );
      }

      return sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "An error occurred while updating profile"
      );
    }
  }
);

// -----------------------------------------------------------------------------------------
// --------------------- ADMIN -------------------------------------------------------------
// -----------------------------------------------------------------------------------------

// get all users

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: users,
      message: "Get all user is successfully",
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({
      success: false,
      data: null,
      message: "An unexpected error occurred while fetching users",
    });
  }
};

// get user by id

export const getUserByID = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "User ID is required in the URL params",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        birthDate: true,
        subscribeNewsletter: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      sendResponse(res, StatusCodes.NOT_FOUND, false, "User not found");
      return;
    }

    return res.status(200).json({
      success: true,
      data: user,
      message: "User retrieved successfully",
    });
  } catch (err) {
    console.error("Error fetching user:", err);
    return res.status(500).json({
      success: false,
      data: null,
      message: "An unexpected error occurred",
    });
  }
};

// updateUserRole

export const updateUserRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!id || !role) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Both 'id' and 'role' are required.",
    });
  }

  if (!["USER", "ADMIN"].includes(role)) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Invalid role. Allowed values: USER, ADMIN.",
    });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      sendResponse(res, StatusCodes.NOT_FOUND, false, "User not found");
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedUser,
      message: `User role updated to '${role}' successfully.`,
    });
  } catch (err) {
    console.error("Error updating user role:", err);
    return res.status(500).json({
      success: false,
      data: null,
      message: "An unexpected error occurred while updating role.",
    });
  }
};

// delete user

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "User ID is required.",
    });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      sendResponse(res, StatusCodes.NOT_FOUND, false, "User not found");
      return;
    }

    await prisma.user.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      data: null,
      message: "User deleted successfully.",
    });
  } catch (err) {
    console.error("Error deleting user:", err);
    return res.status(500).json({
      success: false,
      data: null,
      message: "An unexpected error occurred while deleting the user.",
    });
  }
};
