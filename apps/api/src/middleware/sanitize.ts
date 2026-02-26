import { Request, Response, NextFunction } from "express";

function sanitizeValue(value: unknown): unknown {
  if (typeof value === "string") {
    return value.replace(/<[^>]*>/g, "").trim();
  }
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item));
  }
  if (value && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, nestedValue] of Object.entries(value as Record<string, unknown>)) {
      result[key] = sanitizeValue(nestedValue);
    }
    return result;
  }
  return value;
}

export function sanitizeBody(req: Request, _res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeValue(req.body);
  }
  next();
}
