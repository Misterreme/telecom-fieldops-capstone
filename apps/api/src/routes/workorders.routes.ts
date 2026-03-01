import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ApiError } from '../domain/errors/apiError';
import { workOrderService } from '../domain/services/workorder.service';
import { authenticate } from '../middleware/auth';
import { requirePermissions } from '../middleware/rbac';
import { validateBody, validateParams } from '../middleware/validate';

const router = Router();

const WORK_ORDER_TYPES = [
  'NEW_SERVICE_INSTALL',
  'CLAIM_TROUBLESHOOT',
  'PLAN_AND_EQUIPMENT_SALE',
  'EQUIPMENT_ONLY_SALE',
  'MONTHLY_PAYMENT',
  'SERVICE_UPGRADE',
  'SERVICE_DOWN_OUTAGE',
] as const;

const workOrderIdParams = z.object({ id: z.string().min(1) });

const createSchema = z.object({
  type: z.enum(WORK_ORDER_TYPES),
  customerId: z.string().min(1),
  branchId: z.string().min(1).optional(),
  planId: z.string().min(1).optional(),
  items: z.array(
    z.object({ productId: z.string().min(1), qty: z.number().int().positive() }),
  ).optional(),
});

const updateStatusSchema = z.object({
  newStatus: z.string().min(1),
  baseVersion: z.number().int().nonnegative(),
});

router.use(authenticate);

router.get(
  '/',
  requirePermissions(['workorders:read']),
  (_req: Request, res: Response) => {
    const list = workOrderService.listWorkOrders();
    res.status(200).json(list);
  },
);

router.get(
  '/:id',
  requirePermissions(['workorders:read']),
  validateParams(workOrderIdParams),
  (req: Request, res: Response, next: NextFunction) => {
    const wo = workOrderService.getWorkOrder(req.params.id);
    if (!wo) {
      next(new ApiError(404, 'Not Found', 'Work order not found', 'urn:telecom:error:workorder-not-found'));
      return;
    }
    res.status(200).json(wo);
  },
);

router.post(
  '/',
  requirePermissions(['workorders:create']),
  validateBody(createSchema),
  (req: Request, res: Response) => {
    const created = workOrderService.createWorkOrder(
      req.body,
      req.user?.id ?? null,
      req.correlationId,
    );
    res.status(201).json(created);
  },
);

router.patch(
  '/:id/status',
  requirePermissions(['workorders:update-state']),
  validateParams(workOrderIdParams),
  validateBody(updateStatusSchema),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = workOrderService.updateStatus(
        req.params.id,
        req.body,
        req.user?.id ?? null,
        req.correlationId,
      );
      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
