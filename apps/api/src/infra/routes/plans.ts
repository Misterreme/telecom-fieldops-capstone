/**
 * plans.ts – Fake endpoints para /plans
 * Usa datos del seed-data.json como fuente in-memory.
 */
import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';

const router = Router();

// ─── In-memory seed data ──────────────────────────────────────────────────────
interface Plan {
  id: string;
  name: string;
  type: string;
  price: number;
  currency: string;
  isActive: boolean;
  // Extended fields for plansService (types/plans.ts compat)
  description: string;
  category: string;
  status: string;
  monthlyPrice: number;
  downloadSpeedMbps: number | null;
  uploadSpeedMbps: number | null;
  dataLimitGB: number | null;
  createdAt: string;
  updatedAt: string;
}

const SEED: Plan[] = [
  {
    id: 'plan_home_200', name: 'Internet Hogar 200Mbps', type: 'HOME_INTERNET',
    price: 1850, currency: 'DOP', isActive: true,
    description: 'Fibra óptica simétrica 200 Mbps', category: 'RESIDENCIAL',
    status: 'ACTIVE', monthlyPrice: 1850,
    downloadSpeedMbps: 200, uploadSpeedMbps: 200, dataLimitGB: null,
    createdAt: '2025-01-15T10:00:00Z', updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'plan_home_500', name: 'Internet Hogar 500Mbps', type: 'HOME_INTERNET',
    price: 2950, currency: 'DOP', isActive: true,
    description: 'Fibra óptica simétrica 500 Mbps', category: 'RESIDENCIAL',
    status: 'ACTIVE', monthlyPrice: 2950,
    downloadSpeedMbps: 500, uploadSpeedMbps: 500, dataLimitGB: null,
    createdAt: '2025-02-01T10:00:00Z', updatedAt: '2025-02-01T10:00:00Z',
  },
  {
    id: 'plan_mobile_20gb', name: 'Móvil 20GB', type: 'MOBILE_DATA',
    price: 1299, currency: 'DOP', isActive: true,
    description: 'Plan móvil con 20 GB de datos 5G', category: 'MOVIL',
    status: 'ACTIVE', monthlyPrice: 1299,
    downloadSpeedMbps: null, uploadSpeedMbps: null, dataLimitGB: 20,
    createdAt: '2025-03-01T10:00:00Z', updatedAt: '2025-03-01T10:00:00Z',
  },
  {
    id: 'plan_voice_600', name: 'Voz 600 min', type: 'VOICE',
    price: 799, currency: 'DOP', isActive: true,
    description: '600 minutos nacionales e internacionales', category: 'MOVIL',
    status: 'ACTIVE', monthlyPrice: 799,
    downloadSpeedMbps: null, uploadSpeedMbps: null, dataLimitGB: null,
    createdAt: '2025-03-15T10:00:00Z', updatedAt: '2025-03-15T10:00:00Z',
  },
  {
    id: 'plan_business_1g', name: 'Business 1Gbps', type: 'BUSINESS',
    price: 199, currency: 'USD', isActive: true,
    description: 'Enlace dedicado 1 Gbps para empresas', category: 'EMPRESARIAL',
    status: 'ACTIVE', monthlyPrice: 199,
    downloadSpeedMbps: 1000, uploadSpeedMbps: 1000, dataLimitGB: null,
    createdAt: '2025-04-01T10:00:00Z', updatedAt: '2025-04-01T10:00:00Z',
  },
];

const plans: Plan[] = [...SEED];

// ─── GET /plans ───────────────────────────────────────────────────────────────
router.get('/plans', (_req: Request, res: Response) => {
  res.json(plans);
});

// ─── GET /plans/:id ───────────────────────────────────────────────────────────
router.get('/plans/:id', (req: Request, res: Response) => {
  const plan = plans.find(p => p.id === req.params.id);
  if (!plan) {
    res.status(404).json({
      type: 'about:blank', title: 'Plan no encontrado',
      status: 404, detail: `No existe plan con id ${req.params.id}`,
      instance: req.originalUrl, correlationId: randomUUID(),
    });
    return;
  }
  res.json(plan);
});

// ─── POST /plans ──────────────────────────────────────────────────────────────
router.post('/plans', (req: Request, res: Response) => {
  const now = new Date().toISOString();
  const newPlan: Plan = {
    id: `plan_${randomUUID().slice(0, 8)}`,
    name: req.body.name ?? 'Nuevo Plan',
    type: req.body.type ?? 'HOME_INTERNET',
    price: req.body.price ?? 0,
    currency: req.body.currency ?? 'DOP',
    isActive: req.body.isActive ?? true,
    description: req.body.description ?? '',
    category: req.body.category ?? 'RESIDENCIAL',
    status: req.body.isActive === false ? 'INACTIVE' : 'ACTIVE',
    monthlyPrice: req.body.price ?? 0,
    downloadSpeedMbps: req.body.downloadSpeedMbps ?? null,
    uploadSpeedMbps: req.body.uploadSpeedMbps ?? null,
    dataLimitGB: req.body.dataLimitGB ?? null,
    createdAt: now,
    updatedAt: now,
  };
  plans.push(newPlan);
  res.status(201).json(newPlan);
});

// ─── PATCH /plans/:id ─────────────────────────────────────────────────────────
router.patch('/plans/:id', (req: Request, res: Response) => {
  const idx = plans.findIndex(p => p.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({
      type: 'about:blank', title: 'Plan no encontrado',
      status: 404, detail: `No existe plan con id ${req.params.id}`,
      instance: req.originalUrl, correlationId: randomUUID(),
    });
    return;
  }
  plans[idx] = { ...plans[idx], ...req.body, updatedAt: new Date().toISOString() };
  res.json(plans[idx]);
});

// ─── PATCH /plans/:id/activate ────────────────────────────────────────────────
router.patch('/plans/:id/activate', (req: Request, res: Response) => {
  const idx = plans.findIndex(p => p.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({
      type: 'about:blank', title: 'Plan no encontrado',
      status: 404, detail: `No existe plan con id ${req.params.id}`,
      instance: req.originalUrl, correlationId: randomUUID(),
    });
    return;
  }
  plans[idx] = { ...plans[idx], isActive: true, status: 'ACTIVE', updatedAt: new Date().toISOString() };
  res.json(plans[idx]);
});

// ─── PATCH /plans/:id/deactivate ──────────────────────────────────────────────
router.patch('/plans/:id/deactivate', (req: Request, res: Response) => {
  const idx = plans.findIndex(p => p.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({
      type: 'about:blank', title: 'Plan no encontrado',
      status: 404, detail: `No existe plan con id ${req.params.id}`,
      instance: req.originalUrl, correlationId: randomUUID(),
    });
    return;
  }
  plans[idx] = { ...plans[idx], isActive: false, status: 'INACTIVE', updatedAt: new Date().toISOString() };
  res.json(plans[idx]);
});

// ─── DELETE /plans/:id ────────────────────────────────────────────────────────
router.delete('/plans/:id', (req: Request, res: Response) => {
  const idx = plans.findIndex(p => p.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({
      type: 'about:blank', title: 'Plan no encontrado',
      status: 404, detail: `No existe plan con id ${req.params.id}`,
      instance: req.originalUrl, correlationId: randomUUID(),
    });
    return;
  }
  plans.splice(idx, 1);
  res.status(204).send();
});

export default router;
