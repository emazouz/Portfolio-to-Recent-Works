// // authMiddleware.ts

// import { NextFunction, Response, Request } from "express";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import { sendResponse } from "./response";
// import { StatusCodes } from "http-status-codes";

// // Import your existing Role type from Prisma/database schema
// // Assuming you have a Role enum defined elsewhere, import it:
// // import { Role } from "@prisma/client"; // or wherever your Role type is defined

// // If you don't have it imported yet, define it to match your database:
// export enum Role {
//   USER = "USER",
//   ADMIN = "ADMIN",
//   MODERATOR = "MODERATOR",
// }

// // Define AuthenticatedRequest to include 'user' property
// export interface AuthenticatedRequest extends Request {
//   user?: {
//     userId: string;
//     email: string;
//     role: Role;
//   };
// }

// // Define the expected JWT payload structure
// export interface MyTokenPayload extends jwt.JwtPayload {
//   userId: string;
//   email: string;
//   role: Role;
// }

// // Error response interface for consistency
// interface AuthErrorResponse {
//   success: false;
//   error: string;
//   message: string;
//   expiredAt?: Date;
// }

// // Centralized error responses
// const AUTH_ERRORS = {
//   ACCESS_TOKEN_MISSING: {
//     success: false,
//     error: "ACCESS_TOKEN_MISSING",
//     message: "Access token is missing",
//   },
//   TOKEN_EXPIRED: (expiredAt: Date): AuthErrorResponse => ({
//     success: false,
//     error: "TOKEN_EXPIRED",
//     message: "Access token has expired. Please refresh your token.",
//     expiredAt,
//   }),
//   INVALID_TOKEN: {
//     success: false,
//     error: "INVALID_TOKEN",
//     message: "Invalid access token",
//   },
//   TOKEN_VERIFICATION_ERROR: {
//     success: false,
//     error: "TOKEN_VERIFICATION_ERROR",
//     message: "Token verification failed",
//   },
//   JWT_SECRET_MISSING: {
//     success: false,
//     error: "SERVER_CONFIGURATION_ERROR",
//     message: "Server configuration error",
//   },
// } as const;

// // Helper function to get JWT secret
// const getJwtSecret = (): string => {
//   const secret = process.env.JWT_SECRET;
//   if (!secret) {
//     console.error("❌ JWT_SECRET is not defined in environment variables");
//     throw new Error("JWT_SECRET is not defined in environment variables");
//   }
//   return secret;
// };

// // Helper function to validate token payload
// const validateTokenPayload = (decoded: any): decoded is MyTokenPayload => {
//   return (
//     decoded &&
//     typeof decoded === "object" &&
//     typeof decoded.userId === "string" &&
//     typeof decoded.email === "string" &&
//     typeof decoded.role === "string" &&
//     Object.values(Role).includes(decoded.role)
//   );
// };

// export const authenticateJwt = async (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     // Check for access token in cookies or Authorization header
//     let accessToken = req.cookies?.accessToken;

//     if (!accessToken) {
//       const authHeader = req.headers.authorization;
//       if (authHeader?.startsWith("Bearer ")) {
//         accessToken = authHeader.substring(7);
//       }
//     }

//     if (!accessToken) {
//       res
//         .status(StatusCodes.UNAUTHORIZED)
//         .json(AUTH_ERRORS.ACCESS_TOKEN_MISSING);
//       return;
//     }

//     const secret = getJwtSecret();
//     const decoded = jwt.verify(accessToken, secret);

//     // Validate the token payload structure
//     if (!validateTokenPayload(decoded)) {
//       console.error("❌ Invalid token payload structure:", decoded);
//       res.status(StatusCodes.UNAUTHORIZED).json(AUTH_ERRORS.INVALID_TOKEN);
//       return;
//     }

//     // Set user data on request
//     req.user = {
//       userId: decoded.userId,
//       email: decoded.email,
//       role: decoded.role,
//     };

//     next();
//   } catch (error) {
//     console.error("❌ JWT verification failed:", error);

//     // Handle specific JWT errors
//     if (error instanceof jwt.TokenExpiredError) {
//       res
//         .status(StatusCodes.UNAUTHORIZED)
//         .json(AUTH_ERRORS.TOKEN_EXPIRED(error.expiredAt));
//       return;
//     }

//     if (error instanceof jwt.JsonWebTokenError) {
//       res.status(StatusCodes.UNAUTHORIZED).json(AUTH_ERRORS.INVALID_TOKEN);
//       return;
//     }

//     // Handle server configuration errors
//     if (error instanceof Error && error.message.includes("JWT_SECRET")) {
//       res
//         .status(StatusCodes.INTERNAL_SERVER_ERROR)
//         .json(AUTH_ERRORS.JWT_SECRET_MISSING);
//       return;
//     }

//     // Generic token verification error
//     res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json(AUTH_ERRORS.TOKEN_VERIFICATION_ERROR);
//   }
// };

// export const requireAuth = (
//   req: AuthenticatedRequest,
//   res: Response
// ): boolean => {
//   console.log({
//     method: req.method,
//     url: req.url,
//     headers: req.headers,
//     cookies: req.cookies,
//     body: req.body,
//     user: req.user,
//   });

//   if (!req.user?.userId) {
//     sendResponse(
//       res,
//       StatusCodes.UNAUTHORIZED,
//       false,
//       "Authentication required - please log in"
//     );
//     return false;
//   }
//   return true;
// };

// export const requireAdmin = (
//   req: AuthenticatedRequest,
//   res: Response
// ): boolean => {
//   if (!requireAuth(req, res)) return false;

//   const adminRoles: Role[] = [Role.ADMIN, Role.MODERATOR];

//   if (!req.user?.role || !adminRoles.includes(req.user.role)) {
//     sendResponse(
//       res,
//       StatusCodes.FORBIDDEN,
//       false,
//       "Administrative privileges required"
//     );
//     return false;
//   }
//   return true;
// };

// export const requireRole = (allowedRoles: Role[]) => {
//   return (req: AuthenticatedRequest, res: Response): boolean => {
//     if (!requireAuth(req, res)) return false;

//     if (!req.user?.role || !allowedRoles.includes(req.user.role)) {
//       sendResponse(
//         res,
//         StatusCodes.FORBIDDEN,
//         false,
//         `Access denied. Required roles: ${allowedRoles.join(", ")}`
//       );
//       return false;
//     }
//     return true;
//   };
// };

// // Middleware wrapper for easier usage in routes
// export const authMiddleware = () => authenticateJwt;

// export const adminMiddleware =
//   () => (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//     if (requireAdmin(req, res)) {
//       next();
//     }
//   };

// export const roleMiddleware =
//   (allowedRoles: Role[]) =>
//   (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//     if (requireRole(allowedRoles)(req, res)) {
//       next();
//     }
//   };

// authMiddleware.ts

import { NextFunction, Response, Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { sendResponse } from "./response";
import { StatusCodes } from "http-status-codes";
// Import Role from Prisma instead of defining your own
import { Role } from "@prisma/client";

// Define AuthenticatedRequest to include 'user' property
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: Role;
  };
}

// Define the expected JWT payload structure
export interface MyTokenPayload extends jwt.JwtPayload {
  userId: string;
  email: string;
  role: Role;
}

// Error response interface for consistency
interface AuthErrorResponse {
  success: false;
  error: string;
  message: string;
  expiredAt?: Date;
}

// Centralized error responses
const AUTH_ERRORS = {
  ACCESS_TOKEN_MISSING: {
    success: false,
    error: "ACCESS_TOKEN_MISSING",
    message: "Access token is missing",
  },
  TOKEN_EXPIRED: (expiredAt: Date): AuthErrorResponse => ({
    success: false,
    error: "TOKEN_EXPIRED",
    message: "Access token has expired. Please refresh your token.",
    expiredAt,
  }),
  INVALID_TOKEN: {
    success: false,
    error: "INVALID_TOKEN",
    message: "Invalid access token",
  },
  TOKEN_VERIFICATION_ERROR: {
    success: false,
    error: "TOKEN_VERIFICATION_ERROR",
    message: "Token verification failed",
  },
  JWT_SECRET_MISSING: {
    success: false,
    error: "SERVER_CONFIGURATION_ERROR",
    message: "Server configuration error",
  },
} as const;

// Helper function to get JWT secret
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("❌ JWT_SECRET is not defined in environment variables");
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return secret;
};

// Helper function to validate token payload
const validateTokenPayload = (decoded: any): decoded is MyTokenPayload => {
  return (
    decoded &&
    typeof decoded === "object" &&
    typeof decoded.userId === "string" &&
    typeof decoded.email === "string" &&
    typeof decoded.role === "string" &&
    Object.values(Role).includes(decoded.role)
  );
};

export const authenticateJwt = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log("🚀 Auth middleware started for:", req.path);
  
  try {
    // Check for access token in cookies or Authorization header
    let accessToken = req.cookies?.accessToken;
    
    console.log("🍪 Access token found:", !!accessToken);
    console.log("🍪 Token preview:", accessToken?.substring(0, 20) + "...");
    
    if (!accessToken) {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith("Bearer ")) {
        accessToken = authHeader.substring(7);
      }
    }

    if (!accessToken) {
      res.status(StatusCodes.UNAUTHORIZED).json(AUTH_ERRORS.ACCESS_TOKEN_MISSING);
      return;
    }

    const secret = getJwtSecret();
    const decoded = jwt.verify(accessToken, secret);

    // Validate the token payload structure
    if (!validateTokenPayload(decoded)) {
      console.error("❌ Invalid token payload structure:", decoded);
      res.status(StatusCodes.UNAUTHORIZED).json(AUTH_ERRORS.INVALID_TOKEN);
      return;
    }

    // Set user data on request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    console.log("✅ User authenticated:", {
      userId: req.user.userId,
      email: req.user.email,
      role: req.user.role
    });

    next();

  } catch (error) {
    console.error("❌ JWT verification failed:", error);

    // Handle specific JWT errors
    if (error instanceof jwt.TokenExpiredError) {
      res.status(StatusCodes.UNAUTHORIZED).json(
        AUTH_ERRORS.TOKEN_EXPIRED(error.expiredAt)
      );
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(StatusCodes.UNAUTHORIZED).json(AUTH_ERRORS.INVALID_TOKEN);
      return;
    }

    // Handle server configuration errors
    if (error instanceof Error && error.message.includes("JWT_SECRET")) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(AUTH_ERRORS.JWT_SECRET_MISSING);
      return;
    }

    // Generic token verification error
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(AUTH_ERRORS.TOKEN_VERIFICATION_ERROR);
  }
};

export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response
): boolean => {
  if (!req.user?.userId) {
    sendResponse(
      res,
      StatusCodes.UNAUTHORIZED,
      false,
      "Authentication required - please log in"
    );
    return false;
  }
  return true;
};

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response
): boolean => {
  if (!requireAuth(req, res)) return false;

  const adminRoles: Role[] = [Role.ADMIN, Role.MODERATOR];
  
  if (!req.user?.role || !adminRoles.includes(req.user.role)) {
    sendResponse(
      res,
      StatusCodes.FORBIDDEN,
      false,
      "Administrative privileges required"
    );
    return false;
  }
  return true;
};

// Additional role-based middleware functions
export const requireSuperAdmin = (
  req: AuthenticatedRequest,
  res: Response
): boolean => {
  if (!requireAuth(req, res)) return false;

  if (req.user?.role !== Role.MODERATOR) {
    sendResponse(
      res,
      StatusCodes.FORBIDDEN,
      false,
      "Super administrative privileges required"
    );
    return false;
  }
  return true;
};

export const requireRole = (allowedRoles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response): boolean => {
    if (!requireAuth(req, res)) return false;

    if (!req.user?.role || !allowedRoles.includes(req.user.role)) {
      sendResponse(
        res,
        StatusCodes.FORBIDDEN,
        false,
        `Access denied. Required roles: ${allowedRoles.join(", ")}`
      );
      return false;
    }
    return true;
  };
};

// Middleware wrapper for easier usage in routes
export const authMiddleware = () => authenticateJwt;

export const adminMiddleware = () => (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (requireAdmin(req, res)) {
    next();
  }
};

export const superAdminMiddleware = () => (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (requireSuperAdmin(req, res)) {
    next();
  }
};

export const roleMiddleware = (allowedRoles: Role[]) => (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (requireRole(allowedRoles)(req, res)) {
    next();
  }
};