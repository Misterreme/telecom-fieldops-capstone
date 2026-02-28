import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';

export type PlanType = 'HOME_INTERNET' | 'MOBILE_DATA' | 'VOICE' | 'TV' | 'BUSINESS';
export type PlanCurrency = 'DOP' | 'USD';
export type PlanCategory = 'RESIDENCIAL' | 'MOVIL' | 'EMPRESARIAL' | 'TV';
export type PlanStatus = 'ACTIVE' | 'INACTIVE';

export interface Plan {
  id: string;
  name: string;
  type: PlanType;
  price: number;
  currency: PlanCurrency;
  isActive: boolean;
  description: string;
  category: PlanCategory;
  status: PlanStatus;
  monthlyPrice: number;
  downloadSpeedMbps: number | null;
  uploadSpeedMbps: number | null;
  dataLimitGB: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlanInput {
  name: string;
  type: PlanType;
  price: number;
  currency: PlanCurrency;
  isActive?: boolean;
  description?: string;
  category?: PlanCategory;
  downloadSpeedMbps?: number | null;
  uploadSpeedMbps?: number | null;
  dataLimitGB?: number | null;
}

export interface UpdatePlanInput {
  name?: string;
  type?: PlanType;
  price?: number;
  currency?: PlanCurrency;
  isActive?: boolean;
  description?: string;
  category?: PlanCategory;
  status?: PlanStatus;
  monthlyPrice?: number;
  downloadSpeedMbps?: number | null;
  uploadSpeedMbps?: number | null;
  dataLimitGB?: number | null;
}

interface SeedPlan {
  id: string;
  name: string;
  type: PlanType;
  price: number;
  currency: PlanCurrency;
  isActive: boolean;
}

interface SeedData {
  plans: SeedPlan[];
}

const seedPath = path.resolve(__dirname, '../../../../../scripts/seed-data.json');

const typeToCategory: Record<PlanType, PlanCategory> = {
  HOME_INTERNET: 'RESIDENCIAL',
  MOBILE_DATA: 'MOVIL',
  VOICE: 'MOVIL',
  TV: 'TV',
  BUSINESS: 'EMPRESARIAL',
};

const defaultsById: Record<string, Pick<Plan, 'description' | 'downloadSpeedMbps' | 'uploadSpeedMbps' | 'dataLimitGB'>> = {
  plan_home_200: {
    description: 'Fibra óptica simétrica 200 Mbps',
    downloadSpeedMbps: 200,
    uploadSpeedMbps: 200,
    dataLimitGB: null,
  },
  plan_home_500: {
    description: 'Fibra óptica simétrica 500 Mbps',
    downloadSpeedMbps: 500,
    uploadSpeedMbps: 500,
    dataLimitGB: null,
  },
  plan_mobile_20gb: {
    description: 'Plan móvil con 20 GB de datos 5G',
    downloadSpeedMbps: null,
    uploadSpeedMbps: null,
    dataLimitGB: 20,
  },
  plan_voice_600: {
    description: '600 minutos nacionales e internacionales',
    downloadSpeedMbps: null,
    uploadSpeedMbps: null,
    dataLimitGB: null,
  },
  plan_business_1g: {
    description: 'Enlace dedicado 1 Gbps para empresas',
    downloadSpeedMbps: 1000,
    uploadSpeedMbps: 1000,
    dataLimitGB: null,
  },
};

const defaultPlanFields = (seedPlan: SeedPlan): Pick<Plan, 'description' | 'downloadSpeedMbps' | 'uploadSpeedMbps' | 'dataLimitGB'> => {
  return (
    defaultsById[seedPlan.id] ?? {
      description: seedPlan.name,
      downloadSpeedMbps: null,
      uploadSpeedMbps: null,
      dataLimitGB: null,
    }
  );
};

const loadSeedPlans = (): Plan[] => {
  const raw = fs.readFileSync(seedPath, 'utf-8');
  const data = JSON.parse(raw) as SeedData;
  const now = new Date().toISOString();

  return data.plans.map((seedPlan) => {
    const defaults = defaultPlanFields(seedPlan);
    return {
      id: seedPlan.id,
      name: seedPlan.name,
      type: seedPlan.type,
      price: seedPlan.price,
      currency: seedPlan.currency,
      isActive: seedPlan.isActive,
      description: defaults.description,
      category: typeToCategory[seedPlan.type],
      status: seedPlan.isActive ? 'ACTIVE' : 'INACTIVE',
      monthlyPrice: seedPlan.price,
      downloadSpeedMbps: defaults.downloadSpeedMbps,
      uploadSpeedMbps: defaults.uploadSpeedMbps,
      dataLimitGB: defaults.dataLimitGB,
      createdAt: now,
      updatedAt: now,
    };
  });
};

const plans: Plan[] = loadSeedPlans();

export const plansRepository = {
  listAll(): Plan[] {
    return plans;
  },

  findById(id: string): Plan | null {
    return plans.find((plan) => plan.id === id) ?? null;
  },

  create(input: CreatePlanInput): Plan {
    const now = new Date().toISOString();
    const isActive = input.isActive ?? true;

    const created: Plan = {
      id: `plan_${randomUUID().slice(0, 8)}`,
      name: input.name,
      type: input.type,
      price: input.price,
      currency: input.currency,
      isActive,
      description: input.description ?? '',
      category: input.category ?? 'RESIDENCIAL',
      status: isActive ? 'ACTIVE' : 'INACTIVE',
      monthlyPrice: input.price,
      downloadSpeedMbps: input.downloadSpeedMbps ?? null,
      uploadSpeedMbps: input.uploadSpeedMbps ?? null,
      dataLimitGB: input.dataLimitGB ?? null,
      createdAt: now,
      updatedAt: now,
    };

    plans.push(created);
    return created;
  },

  update(id: string, input: UpdatePlanInput): Plan | null {
    const index = plans.findIndex((plan) => plan.id === id);
    if (index === -1) {
      return null;
    }

    const payload = { ...input };

    if (typeof payload.isActive === 'boolean') {
      payload.status = payload.isActive ? 'ACTIVE' : 'INACTIVE';
    } else if (payload.status) {
      payload.isActive = payload.status === 'ACTIVE';
    }

    if (typeof payload.price === 'number' && typeof payload.monthlyPrice !== 'number') {
      payload.monthlyPrice = payload.price;
    }

    const updated: Plan = {
      ...plans[index],
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    plans[index] = updated;
    return updated;
  },

  activate(id: string): Plan | null {
    return this.update(id, { isActive: true, status: 'ACTIVE' });
  },

  deactivate(id: string): Plan | null {
    return this.update(id, { isActive: false, status: 'INACTIVE' });
  },

  delete(id: string): boolean {
    const index = plans.findIndex((plan) => plan.id === id);
    if (index === -1) {
      return false;
    }

    plans.splice(index, 1);
    return true;
  },
};
