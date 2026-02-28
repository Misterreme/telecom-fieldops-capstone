/**
 * plans.ts – Fake endpoints para /plans
 * Usa datos del seed-data.json como fuente in-memory.
 */
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { plansService } from '../../domain/services/plans.service';
import { validateBody, validateParams } from '../../middleware/validate';

const router = Router();

const planTypeSchema = z.enum(['HOME_INTERNET', 'MOBILE_DATA', 'VOICE', 'TV', 'BUSINESS']);
const currencySchema = z.enum(['DOP', 'USD']);
const categorySchema = z.enum(['RESIDENCIAL', 'MOVIL', 'EMPRESARIAL', 'TV']);
const statusSchema = z.enum(['ACTIVE', 'INACTIVE']);

const planIdParamsSchema = z.object({
  id: z.string().min(1),
});

const createPlanSchema = z.object({
  name: z.string().min(1),
  type: planTypeSchema,
  price: z.number().nonnegative(),
  currency: currencySchema,
  isActive: z.boolean().optional(),
  description: z.string().min(1).optional(),
  category: categorySchema.optional(),
  downloadSpeedMbps: z.number().int().nonnegative().nullable().optional(),
  uploadSpeedMbps: z.number().int().nonnegative().nullable().optional(),
  dataLimitGB: z.number().int().nonnegative().nullable().optional(),
});

const updatePlanSchema = z
  .object({
    name: z.string().min(1).optional(),
    type: planTypeSchema.optional(),
    price: z.number().nonnegative().optional(),
    currency: currencySchema.optional(),
    isActive: z.boolean().optional(),
    description: z.string().min(1).optional(),
    category: categorySchema.optional(),
    status: statusSchema.optional(),
    monthlyPrice: z.number().nonnegative().optional(),
    downloadSpeedMbps: z.number().int().nonnegative().nullable().optional(),
    uploadSpeedMbps: z.number().int().nonnegative().nullable().optional(),
    dataLimitGB: z.number().int().nonnegative().nullable().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be provided.',
  });

// ─── GET /plans ───────────────────────────────────────────────────────────────
router.get('/plans', (_req: Request, res: Response) => {
  res.json(plansService.listPlans());
});

// ─── GET /plans/:id ───────────────────────────────────────────────────────────
router.get('/plans/:id', validateParams(planIdParamsSchema), (req: Request, res: Response) => {
  res.json(plansService.getPlanById(req.params.id));
});

// ─── POST /plans ──────────────────────────────────────────────────────────────
router.post('/plans', validateBody(createPlanSchema), (req: Request, res: Response) => {
  const created = plansService.createPlan(req.body);
  res.status(201).json(created);
});

// ─── PATCH /plans/:id ─────────────────────────────────────────────────────────
router.patch('/plans/:id', validateParams(planIdParamsSchema), validateBody(updatePlanSchema), (req: Request, res: Response) => {
  const updated = plansService.updatePlan(req.params.id, req.body);
  res.json(updated);
});

// ─── PATCH /plans/:id/activate ────────────────────────────────────────────────
router.patch('/plans/:id/activate', validateParams(planIdParamsSchema), (req: Request, res: Response) => {
  const updated = plansService.activatePlan(req.params.id);
  res.json(updated);
});

// ─── PATCH /plans/:id/deactivate ──────────────────────────────────────────────
router.patch('/plans/:id/deactivate', validateParams(planIdParamsSchema), (req: Request, res: Response) => {
  const updated = plansService.deactivatePlan(req.params.id);
  res.json(updated);
});

// ─── DELETE /plans/:id ────────────────────────────────────────────────────────
router.delete('/plans/:id', validateParams(planIdParamsSchema), (req: Request, res: Response) => {
  plansService.deletePlan(req.params.id);
  res.status(204).send();
});

export default router;
