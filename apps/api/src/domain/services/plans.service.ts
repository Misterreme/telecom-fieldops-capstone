import { ApiError } from '../errors/apiError';
import {
  plansRepository,
  type CreatePlanInput,
  type Plan,
  type UpdatePlanInput,
} from '../../infra/repositories/plans.repo';

const notFoundError = (id: string) =>
  new ApiError(404, 'Not Found', `No existe plan con id ${id}`, 'urn:telecom:error:plan-not-found');

export const plansService = {
  listPlans(): Plan[] {
    return plansRepository.listAll();
  },

  getPlanById(id: string): Plan {
    const plan = plansRepository.findById(id);
    if (!plan) {
      throw notFoundError(id);
    }

    return plan;
  },

  createPlan(input: CreatePlanInput): Plan {
    return plansRepository.create(input);
  },

  updatePlan(id: string, input: UpdatePlanInput): Plan {
    const updated = plansRepository.update(id, input);
    if (!updated) {
      throw notFoundError(id);
    }

    return updated;
  },

  activatePlan(id: string): Plan {
    const updated = plansRepository.activate(id);
    if (!updated) {
      throw notFoundError(id);
    }

    return updated;
  },

  deactivatePlan(id: string): Plan {
    const updated = plansRepository.deactivate(id);
    if (!updated) {
      throw notFoundError(id);
    }

    return updated;
  },

  deletePlan(id: string): void {
    const deleted = plansRepository.delete(id);
    if (!deleted) {
      throw notFoundError(id);
    }
  },
};
