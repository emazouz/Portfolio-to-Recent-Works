import { ZodError } from "zod";

export function extractZodErrors(error: ZodError): string[] {
  return error.issues.map((err) => err.message);
}

export function parseIntParam(param: string | undefined): number | null {
  if (!param) return null;
  const parsed = parseInt(param, 10);
  if (isNaN(parsed) || parsed <= 0) return null;
  return parsed;
}
