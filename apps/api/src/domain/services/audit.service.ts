import { v4 as uuidv4 } from 'uuid';

export interface AuditEvent {
  id: string;
  at: string;            
  actorUserId: string;    
  action: string;
  entityType: string;
  entityId: string;
  before: any;
  after: any;
  correlationId: string;
}

interface ListOptions {
  entityType?: string;
  entityId?: string;
  action?: string;
  limit?: number;
  offset?: number;
}

class AuditService {
  private events: AuditEvent[] = [];

  constructor() {
    this.events = [
      {
        id: 'aud_001',
        at: new Date('2025-02-25T10:00:00Z').toISOString(),
        actorUserId: 'usr_admin_01',
        action: 'USER_LOGIN',
        entityType: 'user',
        entityId: 'usr_admin_01',
        before: null,
        after: { username: 'admin' },
        correlationId: 'c_initial_001',
      },
      {
        id: 'aud_002',
        at: new Date('2025-02-25T10:30:00Z').toISOString(),
        actorUserId: 'usr_admin_01',
        action: 'WORK_ORDER_CREATED',
        entityType: 'workOrder',
        entityId: 'wo_10001',
        before: null,
        after: {
          id: 'wo_10001',
          type: 'NEW_SERVICE_INSTALL',
          status: 'DRAFT',
          customerId: 'cust_001',
        },
        correlationId: 'c_wo_create_001',
      },
      {
        id: 'aud_003',
        at: new Date('2025-02-25T11:00:00Z').toISOString(),
        actorUserId: 'usr_admin_01',
        action: 'INVENTORY_RESERVED',
        entityType: 'inventory',
        entityId: 'wo_10001',
        before: { qtyAvailable: 50, qtyReserved: 0 },
        after: { qtyAvailable: 47, qtyReserved: 3 },
        correlationId: 'c_inv_res_001',
      },
    ];
  }

  create(
    actorUserId: string,
    action: string,
    entityType: string,
    entityId: string,
    before: any,
    after: any,
    correlationId: string
  ): AuditEvent {
    const event: AuditEvent = {
      id: `aud_${Date.now()}_${uuidv4().substring(0, 8)}`,
      at: new Date().toISOString(),
      actorUserId,
      action,
      entityType,
      entityId,
      before,
      after,
      correlationId,
    };

    this.events.push(event);
    return event;
  }

  list(options: ListOptions = {}): {
    items: AuditEvent[];
    total: number;
  } {
    const { entityType, entityId, action, limit = 50, offset = 0 } = options;

    let filtered = [...this.events];

    if (entityType) {
      filtered = filtered.filter(e => e.entityType === entityType);
    }
    if (entityId) {
      filtered = filtered.filter(e => e.entityId === entityId);
    }
    if (action) {
      filtered = filtered.filter(e => e.action === action);
    }

    filtered.sort(
      (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
    );

    const total = filtered.length;
    const items = filtered.slice(offset, offset + limit);

    return { items, total };
  }

  getById(id: string): AuditEvent | null {
    return this.events.find(e => e.id === id) || null;
  }

  getHistory(
    entityType: string,
    entityId: string
  ): { events: AuditEvent[]; total: number } {
    const events = this.events
      .filter(e => e.entityType === entityType && e.entityId === entityId)
      .sort(
        (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
      );

    return {
      events,
      total: events.length,
    };
  }

  getByUser(actorUserId: string, limit = 100): AuditEvent[] {
    return this.events
      .filter(e => e.actorUserId === actorUserId)
      .sort(
        (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
      )
      .slice(0, limit);
  }

  getCount(): number {
    return this.events.length;
  }

  getByDateRange(startDate: Date, endDate: Date): AuditEvent[] {
    const start = startDate.getTime();
    const end = endDate.getTime();

    return this.events
      .filter(e => {
        const eventTime = new Date(e.at).getTime();
        return eventTime >= start && eventTime <= end;
      })
      .sort(
        (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
      );
  }
}

export const auditService = new AuditService();
