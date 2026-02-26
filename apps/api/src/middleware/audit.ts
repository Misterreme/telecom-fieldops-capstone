import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export const audit = (req: Request, res: Response, next: NextFunction) => {
  const correlationId = uuidv4();
  
  res.setHeader('X-Correlation-Id', correlationId);
  
  req.correlationId = correlationId; 

  console.log(`[${new Date().toISOString()}] Action: ${req.method} ${req.url} | ID: ${correlationId}`);
  
  next();
};