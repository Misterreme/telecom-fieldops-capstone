import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { productsService } from '../domain/services/products.service';
import { validateBody, validateParams } from '../middleware/validate';

const router = Router();

const productCategorySchema = z.enum([
  'ROUTER',
  'MODEM',
  'ONT',
  'STB',
  'ANTENNA',
  'CABLE',
  'PHONE',
  'TABLET',
  'LAPTOP',
  'SIM',
]);

const productIdParamsSchema = z.object({
  id: z.string().min(1),
});

const createProductSchema = z.object({
  name: z.string().min(1),
  category: productCategorySchema,
  isSerialized: z.boolean(),
});

const updateProductSchema = z
  .object({
    name: z.string().min(1).optional(),
    category: productCategorySchema.optional(),
    isSerialized: z.boolean().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be provided.',
  });

router.get('/products', (_req: Request, res: Response) => {
  res.json(productsService.listProducts());
});

router.get('/products/:id', validateParams(productIdParamsSchema), (req: Request, res: Response) => {
  res.json(productsService.getProductById(req.params.id));
});

router.post('/products', validateBody(createProductSchema), (req: Request, res: Response) => {
  const created = productsService.createProduct(req.body);
  res.status(201).json(created);
});

router.patch('/products/:id', validateParams(productIdParamsSchema), validateBody(updateProductSchema), (req: Request, res: Response) => {
  const updated = productsService.updateProduct(req.params.id, req.body);
  res.json(updated);
});

router.delete('/products/:id', validateParams(productIdParamsSchema), (req: Request, res: Response) => {
  productsService.deleteProduct(req.params.id);
  res.status(204).send();
});

export default router;
