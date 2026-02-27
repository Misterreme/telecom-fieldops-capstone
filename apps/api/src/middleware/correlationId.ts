import crypto from "node:crypto";
import { Request, Response, NextFunction } from "express";

export function correlationId(req: Request, res: Response, next: NextFunction): void {
  const incoming = req.header("x-correlation-id");
  const correlationId = incoming?.trim() || `c_${crypto.randomUUID().replaceAll("-", "").slice(0, 12)}`;
  req.correlationId = correlationId;
  res.setHeader("x-correlation-id", correlationId);
  next();
import { randomUUID } from 'crypto';
import type { NextFunction, Request, Response } from 'express';

const HEADER_NAME = 'x-correlation-id';

const handler = (req: Request, res: Response, next: NextFunction): void => {
  const incomingHeader = req.headers[HEADER_NAME];
  const incoming = typeof incomingHeader === 'string' ? incomingHeader : undefined;
  const correlationId = incoming && incoming.trim().length > 0 ? incoming.trim() : `c_${randomUUID()}`;

  req.correlationId = correlationId;
  res.setHeader('X-Correlation-Id', correlationId);
  next();
};

export const correlationIdMiddleware = handler;

export function correlationId() {
  return handler;
}
