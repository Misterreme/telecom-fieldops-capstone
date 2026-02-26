import { Request, Response, NextFunction } from "express";

export function requirePermissions(...required: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        type: "urn:telecom:error:unauthorized",
        title: "Unauthorized",
        status: 401,
        detail: "Authentication required.",
        correlationId: req.correlationId,
      });
      return;
    }

    if (!req.user.isActive) {
      res.status(403).json({
        type: "urn:telecom:error:forbidden",
        title: "Forbidden",
        status: 403,
        detail: "Blocked user cannot operate protected endpoints.",
        correlationId: req.correlationId,
      });
      return;
    }

    const allowed = required.every((permission) => req.user?.permissions.includes(permission));
    if (!allowed) {
      res.status(403).json({
        type: "urn:telecom:error:forbidden",
        title: "Forbidden",
        status: 403,
        detail: "Missing required permission.",
        correlationId: req.correlationId,
      });
      return;
    }

    next();
  };
}
