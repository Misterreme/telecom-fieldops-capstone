import { randomUUID } from 'crypto';
import type {
  WorkOrder,
  WorkOrderItem,
  WorkOrderType,
  WorkOrderStatus,
} from '../../domain/models/types';

export interface CreateWorkOrderInput {
  type: WorkOrderType;
  customerId: string;
  branchId?: string;
  planId?: string;
  items?: WorkOrderItem[];
}

export interface UpdateWorkOrderInput {
  status?: WorkOrderStatus;
  version?: number;
  branchId?: string;
  planId?: string;
  assignedTechUserId?: string;
  items?: WorkOrderItem[];
}

const workOrders: WorkOrder[] = [];

export const workOrderRepository = {
  listAll(): WorkOrder[] {
    return workOrders;
  },

  findById(id: string): WorkOrder | null {
    return workOrders.find((wo) => wo.id === id) ?? null;
  },

  create(input: CreateWorkOrderInput): WorkOrder {
    const now = new Date().toISOString();
    const order: WorkOrder = {
      id: `wo_${randomUUID().slice(0, 8)}`,
      type: input.type,
      status: 'DRAFT',
      customerId: input.customerId,
      branchId: input.branchId,
      planId: input.planId,
      version: 0,
      items: input.items ? [...input.items] : [],
      createdAt: now,
      updatedAt: now,
    };
    workOrders.push(order);
    return order;
  },

  update(id: string, input: UpdateWorkOrderInput): WorkOrder | null {
    const idx = workOrders.findIndex((wo) => wo.id === id);
    if (idx === -1) return null;
    const existing = workOrders[idx];
    const now = new Date().toISOString();
    const updated: WorkOrder = {
      ...existing,
      ...input,
      version: typeof input.version === 'number' ? input.version : existing.version + 1,
      updatedAt: now,
    } as WorkOrder;
    workOrders[idx] = updated;
    return updated;
  },
};
