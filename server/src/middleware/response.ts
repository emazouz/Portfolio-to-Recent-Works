import { Response } from "express";
import { StatusCodes } from "http-status-codes";

const generateRequestId = (): string => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const sendResponse = (
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data?: any,
  meta?: any,
  errors?: any[]
) => {
  const response: any = {
    success,
    message,
    timestamp: new Date().toISOString(),
    requestId: res.locals.requestId || generateRequestId(),
  };

  if (data !== undefined) response.data = data;
  if (meta !== undefined) response.meta = meta;
  if (errors && errors.length > 0) response.errors = errors;
  if (res.locals.processingTime) {
    response.meta = {
      ...response.meta,
      processingTimeMs: res.locals.processingTime,
    };
  }

  res.status(statusCode).json(response);
};

export { generateRequestId };
