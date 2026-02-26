import crypto from "node:crypto";
import { Request, Response, NextFunction } from "express";

export function correlationId(req: Request, res: Response, next: NextFunction): void {
  const incoming = req.header("x-correlation-id");
  const correlationId = incoming?.trim() || `c_${crypto.randomUUID().replaceAll("-", "").slice(0, 12)}`;
  req.correlationId = correlationId;
  res.setHeader("x-correlation-id", correlationId);
  next();
}
