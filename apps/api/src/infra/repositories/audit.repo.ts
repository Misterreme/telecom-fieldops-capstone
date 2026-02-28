import { getDb } from '../db/connection';
import type { AuditEvent } from '../../domain/models/types';

export interface ListAuditOptions {
  limit?: number;
  offset?: number;
}

export const auditRepository = {
  insert(event: AuditEvent): AuditEvent {
    getDb().audits.push(event);
    return event;
  },

  list(opts?: ListAuditOptions): { items: AuditEvent[]; total: number } {
    const all = [...getDb().audits];
    const total = all.length;
    const offset = opts?.offset ?? 0;
    const limit = opts?.limit ?? total;
    const items = all.slice(offset, offset + limit);
    return { items, total };
  },

  getById(id: string): AuditEvent | undefined {
    return getDb().audits.find((e) => e.id === id);
  },

  getHistory(entityType: string, entityId: string): AuditEvent[] {
    return getDb().audits.filter(
      (e) => e.entityType === entityType && e.entityId === entityId
    );
  },

  getByUser(actorUserId: string): AuditEvent[] {
    return getDb().audits.filter((e) => e.actorUserId === actorUserId);
  },

  getByDateRange(from: string, to: string): AuditEvent[] {
    return getDb().audits.filter((e) => e.at >= from && e.at <= to);
  },
};
