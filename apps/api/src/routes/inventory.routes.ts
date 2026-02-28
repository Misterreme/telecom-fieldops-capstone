import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { inventoryService } from '../domain/services/invetory.service';
import { validateBody, validateParams, validate } from '../middleware/validate';


export function inventoryRouter() {

const router = Router();

const inventoryQuerySchema = z.object({
  branchId: z.string().min(1),
});

const reserveInventorySchema = z.object({
  workOrderId: z.string().min(1),
  branchId: z.string().min(1),
  items: z.array(z.object({
    productId: z.string().min(1),
    qty: z.number().int().positive(),
  })).min(1),
});

const releaseReservationParamsSchema = z.object({
  workOrderId: z.string().min(1),
});

router.get('/inventory/branches', (_req: Request, res: Response) => {
  res.status(200).json(inventoryService.listBranches());
});

router.get('/inventory/products', (_req: Request, res: Response) => {
  res.status(200).json(inventoryService.listProducts());
});

router.get('/inventory', validate(inventoryQuerySchema, 'query'), (req: Request, res: Response) => {
  const branchId = String(req.query.branchId);
  res.status(200).json(inventoryService.listInventory(branchId));
});

router.post('/inventory/reservations', validateBody(reserveInventorySchema), (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = inventoryService.reserveForRequest({
      workOrderId: req.body.workOrderId,
      branchId: req.body.branchId,
      items: req.body.items,
    });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete('/inventory/reservations/:workOrderId', validateParams(releaseReservationParamsSchema), (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = inventoryService.releaseForRequest(req.params.workOrderId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

return router;

}