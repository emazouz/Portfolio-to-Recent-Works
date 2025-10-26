import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import {
  detectLanguage,
  translateBatch,
  translateText,
  healthCheck,
} from "../controllers/translationController";

const router = Router();

// Middleware: Request logging
const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.path} - ${
        res.statusCode
      } (${duration}ms)`
    );
  });

  next();
};

// Middleware: Validate JSON body
const validateJSON = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === "POST" && !req.is("application/json")) {
    return res.status(415).json({
      error: "Unsupported Media Type",
      message: "Content-Type must be application/json",
    });
  }
  next();
};

// Middleware: Error handler for async routes
const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Middleware: CORS headers (if needed)
const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Adjust origins as needed for your application
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || ["*"];
  const origin = req.headers.origin;

  if (
    allowedOrigins.includes("*") ||
    (origin && allowedOrigins.includes(origin))
  ) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Max-Age", "86400"); // 24 hours
  }

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  next();
};

// Apply global middleware to all routes
router.use(corsMiddleware);
router.use(requestLogger);
router.use(validateJSON);

// Health check endpoint
router.get("/health", asyncHandler(healthCheck));

// Translation endpoints
router.post(
  "/translate",
  // translationLimiter, // Uncomment to enable rate limiting
  asyncHandler(translateText)
);

router.post(
  "/translate/batch",
  // batchLimiter, // Uncomment to enable rate limiting
  asyncHandler(translateBatch)
);

router.post(
  "/translate/detect",
  // translationLimiter, // Uncomment to enable rate limiting
  asyncHandler(detectLanguage)
);

// Catch-all for undefined routes in this router
router.all("*", (req: Request, res: Response) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.path} not found`,
    availableEndpoints: [
      "GET /api/health",
      "POST /api/translate",
      "POST /api/translate/batch",
      "POST /api/translate/detect",
    ],
  });
});

// Error handling middleware (must be last)
router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Router error:", err);

  // Handle specific error types
  if (err.name === "SyntaxError" && "body" in err) {
    return res.status(400).json({
      error: "Invalid JSON",
      message: "Request body contains invalid JSON",
    });
  }

  // Generic error response
  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "production"
        ? "An unexpected error occurred"
        : err.message,
  });
});

export default router;
