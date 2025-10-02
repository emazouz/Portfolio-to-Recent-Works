import { Response, NextFunction } from "express";
import { generateRequestId } from "./response";
import { AuthenticatedRequest } from "./auth";

export const asyncHandler =
  (fn: Function) =>
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    res.locals.requestId = generateRequestId();

    try {
      await Promise.resolve(fn(req, res, next));
    } catch (error) {
      const processingTime = Date.now() - startTime;

      const errorLog = {
        requestId: res.locals.requestId,
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        userId: req.user?.userId,
        userRole: req.user?.role,
        path: req.path,
        method: req.method,
        query: req.query,
        body: req.method !== "GET" ? req.body : undefined,
        processingTimeMs: processingTime,
        timestamp: new Date().toISOString(),
        functionName: fn.name,
      };

      console.error("API Error:", errorLog);
      res.locals.processingTime = processingTime;
      next(error);
    } finally {
      if (!res.locals.processingTime) {
        res.locals.processingTime = Date.now() - startTime;
      }
    }
  };
