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
} from "../validators/authValidate";
import { sendResponse } from "../middleware/response";
import { StatusCodes } from "http-status-codes";
import { Role } from "@prisma/client";

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
      const hashedPassword = await bcrypt.hash(validatedData.password, 12);

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

      sendResponse(res, StatusCodes.OK, false, "Logout successful");
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
      const hashedPassword = await bcrypt.hash(validatedData.newPassword, 12);
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

// forgot password
export const forgotPassword = asyncHandler(
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
      const validatedEmail = forgotPasswordSchema.parse(req.body);

      // 2. find user by email
      const user = await findUserByEmail(validatedEmail.email);
      if (!user) {
        sendResponse(res, StatusCodes.NOT_FOUND, false, "User not found");
        return;
      }

      const newToken = uuidv4();
      const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);

      // 3. update user with reset token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken: newToken,
          resetTokenExpiresAt: expiresAt,
        },
      });

      // 4. send reset email
      const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password?token=${newToken}`;
      try {
        await sendResetEmail(
          validatedEmail.email,
          resetPasswordMessage(resetLink)
        );
        sendResponse(
          res,
          StatusCodes.OK,
          true,
          "If an account exists with this email, a password reset link will be sent."
        );
      } catch (emailError) {
        // If email fails, clean up the reset token
        await prisma.user.update({
          where: { id: user.id },
          data: {
            resetToken: null,
            resetTokenExpiresAt: null,
          },
        });
        console.error("Error sending reset email:", emailError);

        sendResponse(
          res,
          StatusCodes.INTERNAL_SERVER_ERROR,
          false,
          "Failed to send reset email. Please try again later or contact support."
        );
      }
    } catch (error) {
      console.error("Error in forgot password:", error);
      sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "An unexpected error occurred. Please try again later."
      );
    }
  }
);

// reset password
export const resetPassword = asyncHandler(
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

      const validatedData = resetPasswordSchema.parse(req.body);

      // 1. find user by reset token
      const user = await prisma.user.findFirst({
        where: { resetToken: validatedData.token },
      });

      if (!user) {
        sendResponse(res, StatusCodes.NOT_FOUND, false, "User not found");
        return;
      }

      // 2. check if reset token is expired
      if (user.resetTokenExpiresAt && user.resetTokenExpiresAt < new Date()) {
        sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Reset token expired"
        );
        return;
      }

      // 3. hash new password and update user password
      const hashedPassword = await bcrypt.hash(validatedData.newPassword, 12);
      // 4. clear reset token and reset token expires at
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      sendResponse(res, StatusCodes.OK, true, "Password reset successfully");
    } catch (error) {
      console.error("Error resetting password:", error);
      sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Internal server error"
      );
    }
  }
);

interface VerifyEmailRequest extends AuthenticatedRequest {
  body: {
    code: string;
  };
}

export const requestEmailVerified = asyncHandler(
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

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || !userId) {
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

      await prisma.emailVerification.deleteMany({
        where: {
          userId: userId,
          type: "EMAIL_VERIFICATION",
        },
      });

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);

      await prisma.emailVerification.create({
        data: {
          userId: userId,
          code,
          expiresAt,
          type: "EMAIL_VERIFICATION",
          email: user.email,
        },
      });

      try {
        await sendResetEmail(
          user.email,
          emailVerificationMessage(code, "EMAIL_VERIFICATION")
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

        await prisma.emailVerification.deleteMany({
          where: {
            userId: userId,
            code: code,
            type: "EMAIL_VERIFICATION",
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

//   start xxx
export const verifyEmailVerified = asyncHandler(
  async (req: VerifyEmailRequest, res: Response) => {
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
      const { code } = req.body;

      if (!userId) {
        return sendResponse(
          res,
          StatusCodes.UNAUTHORIZED,
          false,
          "User not authenticated"
        );
      }

      if (!code) {
        return res.status(400).json({
          success: false,
          message: "Verification code is required",
        });
      }

      if (!/^\d{6}$/.test(code)) {
        return res.status(400).json({
          success: false,
          message: "Invalid verification code format",
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        sendResponse(res, StatusCodes.NOT_FOUND, false, "User not found");
        return;
      }

      if (user.emailVerified) {
        return res.status(400).json({
          success: false,
          message: "Email is already verified",
        });
      }

      const emailConfirmation = await prisma.emailVerification.findFirst({
        where: {
          userId: userId,
          code: code,
          type: "EMAIL_VERIFICATION",
        },
      });

      if (!emailConfirmation) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired verification code",
        });
      }

      if (new Date() > emailConfirmation.expiresAt) {
        await prisma.emailVerification.delete({
          where: { id: emailConfirmation.id },
        });

        return res.status(400).json({
          success: false,
          message: "Verification code has expired. Please request a new one.",
        });
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          emailVerified: true,
        },
        select: {
          id: true,
          email: true,
          emailVerified: true,
          name: true,
          role: true,
        },
      });

      await prisma.emailVerification.deleteMany({
        where: {
          userId: userId,
          type: "EMAIL_VERIFICATION",
        },
      });

      res.status(200).json({
        success: true,
        message: "Email verified successfully!",
        data: {
          user: updatedUser,
        },
      });
    } catch (error) {
      console.error("Error in verifyEmailVerified:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error. Please try again later.",
      });
    }
  }
);

export const requestEmailChange = async (
  req: AuthenticatedRequest,
  res: Response
) => {
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
    const { newEmail, currentPassword } = req.body;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!newEmail || !currentPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }
    if (!newEmail.includes("@") || !newEmail.includes(".")) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
      });
    }

    if (!user) {
      sendResponse(res, StatusCodes.NOT_FOUND, false, "User not found");
      return;
    }

    if (newEmail === user.email) {
      return res.status(400).json({
        success: false,
        message: "New email cannot be the same as the current email",
      });
    }
    // 1. check to existing email
    const existingEmail = await prisma.user.findUnique({
      where: { email: newEmail },
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    // 3. check if password is valid
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    await prisma.emailVerification.deleteMany({
      where: { type: "CHANGE_EMAIL" },
    });

    // generate code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    await prisma.emailVerification.upsert({
      where: { userId },
      update: {
        email: newEmail,
        code,
        expiresAt,
        type: "CHANGE_EMAIL",
      },
      create: {
        userId,
        email: newEmail,
        code,
        expiresAt,
        type: "CHANGE_EMAIL",
      },
    });

    try {
      await sendResetEmail(
        newEmail,
        emailVerificationMessage(code, "CHANGE_EMAIL")
      );
      res.status(200).json({
        success: true,
        message: "A verification code has been sent to your new email address.",
      });
    } catch (err) {
      console.error("Error sending email:", err);
      res.status(500).json({
        success: false,
        message: "Failed to send email verification code",
      });
    }
  } catch (err) {
    console.error("Error requesting email change:", err);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
    });
  }
};

// verify email change
export const verifyEmailChange = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Verification code is required",
      });
    }
    const emailVerification = await prisma.emailVerification.findUnique({
      where: { code },
    });

    if (!emailVerification) {
      return res.status(404).json({
        success: false,
        message: "Invalid verification code",
      });
    }

    if (emailVerification.expiresAt < new Date()) {
      console.log("3. Verification code has expired.");
      // Clean up expired token
      await prisma.emailVerification.delete({
        where: { id: emailVerification.id },
      });
      return res.status(400).json({
        success: false,
        message: "Verification code expired",
      });
    }

    // Use a transaction to update user and delete verification record
    await prisma.$transaction(async (tx) => {
      // 1. Update the user's email
      await tx.user.update({
        where: { id: emailVerification.userId },
        data: { email: emailVerification.email },
      });

      // 2. Delete the verification record
      await tx.emailVerification.delete({
        where: { id: emailVerification.id },
      });
    });

    console.log("6. Transaction completed. Sending success response.");
    return res.status(200).json({
      success: true,
      message: "Email updated successfully",
    });
  } catch (err) {
    console.error("7. Error verifying email change:", err);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
    });
  }
};

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
