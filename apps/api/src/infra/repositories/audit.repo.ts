import { getDb } from '../db/connection';
import type { AuditEvent } from '../../domain/models/types';

export interface ListAuditOptions {
  limit?: number;
  offset?: number;
  entityType?: string;
  entityId?: string;
  action?: string;
}

export const auditRepository = {
  insert(event: AuditEvent): AuditEvent {
    getDb().audits.push(event);
    return event;
  },

  list(opts?: ListAuditOptions): { items: AuditEvent[]; total: number } {
    let all = [...getDb().audits];
    if (opts?.entityType) all = all.filter((e) => e.entityType === opts.entityType);
    if (opts?.entityId) all = all.filter((e) => e.entityId === opts.entityId);
    if (opts?.action) all = all.filter((e) => e.action === opts.action);
    const total = all.length;
    const offset = opts?.offset ?? 0;
    const limit = opts?.limit ?? total;
    const items = all.slice(offset, offset + limit);
    return { items, total };
  },

  getById(id: string): AuditEvent | undefined {
    return getDb().audits.find((e) => e.id === id);
  },

  getHistory(entityType: string, entityId: string): { events: AuditEvent[]; total: number } {
    const events = getDb().audits.filter(
      (e) => e.entityType === entityType && e.entityId === entityId
    );
    return { events, total: events.length };
  },

  getByUser(actorUserId: string, limit?: number): AuditEvent[] {
    const events = getDb().audits.filter((e) => e.actorUserId === actorUserId);
    if (limit != null && limit > 0) return events.slice(0, limit);
    return events;
  },

  getByDateRange(from: string | Date, to: string | Date): AuditEvent[] {
    const fromStr = typeof from === 'string' ? from : from.toISOString();
    const toStr = typeof to === 'string' ? to : to.toISOString();
    return getDb().audits.filter((e) => e.at >= fromStr && e.at <= toStr);
  },
};
