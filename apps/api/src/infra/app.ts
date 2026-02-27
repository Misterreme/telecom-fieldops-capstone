import express from "express";
import cors from "cors";
import helmet from "helmet";

import { correlationId } from "../middleware/correlationId";
import { errorHandler } from "../middleware/errorHandler";
import { buildApiRouter } from "../infra/routes";
import { ca } from "zod/v4/locales";


export function createApp() {
  const app = express();

  const allowOrigin = [
    process.env.FRONTEND_URL,
    process.env.API_PUBLIC_URL,
    'http://localhost:5173',
    'http://localhost:3000',
  ].filter(Boolean) as string[];

  app.use(helmet());
  app.use(
         cors({
            origin: (origin, callback) => {
                if (!origin) return callback(null, true); 
                if (allowOrigin.includes(origin)) return callback(null, true);
                callback(new Error("Not allowed by CORS"));
            },
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true,
         })
       );
  app.use(express.urlencoded({ extended: true, limit: "1mb" })  
    );
  app.use(express.json({  limit: "1mb" }));

  // Request tracing
  app.use(correlationId());

  // Mount API v1
  app.use("/api/v1", buildApiRouter());

  // Global error handler (last)
  app.use(errorHandler());

  return app;
}