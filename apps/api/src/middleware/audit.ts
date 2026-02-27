import { v4 as uuidv4 } from 'uuid';
import { logger, baseReqLog } from "../infra/logger/logger";
import { Request, Response, NextFunction } from 'express';

export const auditMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const correlationId = (req.headers['x-correlation-id'] as string) || uuidv4();
  
  (req as any).correlationId = correlationId; 
  res.setHeader('X-Correlation-Id', correlationId);

  next();
};

type AuditPayload = {
  action: string;
  entityType: string;
  entityId: string;
  before: any;
  after: any;
};

export async function writeAudit(req: Request, payload: AuditPayload) {
  const user = (req as any).user;
  const actorUserId = user?.id ?? "anonymous";
  const correlationId = (req as any).correlationId ?? "c_unknown";

  logger.info(
    {
      ...baseReqLog(req),
      actorUserId,
      correlationId,
      audit: payload,
    },
    "AUDIT_EVENT"
  );

}
