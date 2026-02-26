import { Request, Response, NextFunction } from "express";
import { HttpError } from "../domain/services/GestionUsuarios";

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    type: "urn:telecom:error:not-found",
    title: "Not Found",
    status: 404,
    detail: `Route not found: ${req.method} ${req.path}`,
    correlationId: req.correlationId,
  });
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      type: err.type,
      title: err.status >= 500 ? "Internal Server Error" : "Request failed",
      status: err.status,
      detail: err.message,
      correlationId: req.correlationId,
      errors: err.errors,
    });
    return;
  }

  res.status(500).json({
    type: "urn:telecom:error:internal",
    title: "Internal Server Error",
    status: 500,
    detail: "Unexpected error.",
    correlationId: req.correlationId,
  });
}
