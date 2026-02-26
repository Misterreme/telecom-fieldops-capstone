import express from "express";
import cors from "cors";
import helmet from "helmet";

import { correlationId } from "../middleware/correlationId";
import { errorHandler } from "../middleware/errorHandler";
import { buildApiRouter } from "../infra/routes";


export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: true }));
  app.use(express.json({ limit: "1mb" }));

  // Request tracing
  app.use(correlationId());

  // Mount API v1
  app.use("/api/v1", buildApiRouter());

  // Global error handler (last)
  app.use(errorHandler());

  return app;
}