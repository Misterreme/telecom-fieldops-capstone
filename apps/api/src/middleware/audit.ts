import crypto from "node:crypto";
import { Request, Response, NextFunction } from "express";

export function withAudit(action: string, entityType: string) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const event = {
      id: `aud_${crypto.randomUUID().replaceAll("-", "").slice(0, 12)}`,
      at: new Date().toISOString(),
      actorUserId: req.user?.id ?? "anonymous",
      action,
      entityType,
      entityId: req.params.userId ?? "n/a",
      before: undefined,
      after: req.body,
      correlationId: req.correlationId,
    };
    req.auditEvents = req.auditEvents ?? [];
    req.auditEvents.push(event);
    next();
  };
}
