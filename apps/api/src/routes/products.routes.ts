import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';

const router = Router();

interface Product {
  id: string;
  name: string;
  category: string;
  isSerialized: boolean;
}

const SEED: Product[] = [
  { id: 'prod_router_ax',      name: 'Router WiFi 6 AX',   category: 'ROUTER',  isSerialized: true },
  { id: 'prod_modem_docsis',    name: 'Modem DOCSIS',       category: 'MODEM',   isSerialized: true },
  { id: 'prod_ont_fiber',       name: 'ONT Fibra',          category: 'ONT',     isSerialized: true },
  { id: 'prod_stb_tv',          name: 'Decodificador TV',   category: 'STB',     isSerialized: true },
  { id: 'prod_cable_fiber_10m', name: 'Cable Fibra 10m',    category: 'CABLE',   isSerialized: false },
  { id: 'prod_cable_copper_10m',name: 'Cable UTP 10m',      category: 'CABLE',   isSerialized: false },
  { id: 'prod_sim_5g',          name: 'SIM 5G',             category: 'SIM',     isSerialized: true },
  { id: 'prod_antenna_sector',  name: 'Antena Sectorial',   category: 'ANTENNA', isSerialized: true },
];

const products: Product[] = [...SEED];

router.get('/products', (_req: Request, res: Response) => {
  res.json(products);
});

router.get('/products/:id', (req: Request, res: Response) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    res.status(404).json({
      type: 'about:blank', title: 'Producto no encontrado',
      status: 404, detail: `No existe producto con id ${req.params.id}`,
      instance: req.originalUrl, correlationId: randomUUID(),
    });
    return;
  }
  res.json(product);
});

router.post('/products', (req: Request, res: Response) => {
  const newProduct: Product = {
    id: `prod_${randomUUID().slice(0, 8)}`,
    name: req.body.name ?? 'Nuevo Producto',
    category: req.body.category ?? 'ROUTER',
    isSerialized: req.body.isSerialized ?? false,
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

router.patch('/products/:id', (req: Request, res: Response) => {
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({
      type: 'about:blank', title: 'Producto no encontrado',
      status: 404, detail: `No existe producto con id ${req.params.id}`,
      instance: req.originalUrl, correlationId: randomUUID(),
    });
    return;
  }
  products[idx] = { ...products[idx], ...req.body };
  res.json(products[idx]);
});

router.delete('/products/:id', (req: Request, res: Response) => {
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({
      type: 'about:blank', title: 'Producto no encontrado',
      status: 404, detail: `No existe producto con id ${req.params.id}`,
      instance: req.originalUrl, correlationId: randomUUID(),
    });
    return;
  }
  products.splice(idx, 1);
  res.status(204).send();
});

export default router;
