import { time } from 'console';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export const audit = (req: Request, res: Response, next: NextFunction) => {
  const correlationId = uuidv4();
  
  res.setHeader('X-Correlation-Id', correlationId);
  
  req.correlationId = correlationId; 

  const auditInfo = {
    timestamp: new Date().toISOString(),
    event: 'API_Request',
    method: req.method,
    url: req.url || req.originalUrl,
    correlationId: correlationId,
    clientIp: req.ip
  };

  console.log(JSON.stringify(auditInfo));
  
  next();
};