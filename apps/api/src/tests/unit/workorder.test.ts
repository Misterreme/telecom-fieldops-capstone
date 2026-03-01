import { workOrderService } from '../../domain/services/workorder.service';

async function runTests() {
  console.log('🧪 workorder.service unit tests');
  try {
    // create a new work order
    const order = workOrderService.createWorkOrder(
      { type: 'EQUIPMENT_ONLY_SALE', customerId: 'cust123' },
      'test-user',
      'corr-1',
    );
    if (order.status !== 'DRAFT') throw new Error('initial status should be DRAFT');
    console.log('✅ created work order');

    // list returns
    const list = workOrderService.listWorkOrders();
    if (!list.find((o) => o.id === order.id)) throw new Error('order not in list');
    console.log('✅ order appears in list');

    // valid transition
    const updated = workOrderService.updateStatus(order.id, { newStatus: 'SUBMITTED', baseVersion: 0 }, null, 'corr-2');
    if (updated.status !== 'SUBMITTED') throw new Error('status did not change');
    console.log('✅ status changed to SUBMITTED');

    // invalid transition
    try {
      workOrderService.updateStatus(order.id, { newStatus: 'COMPLETED', baseVersion: updated.version }, null, 'corr-3');
      throw new Error('invalid transition should have thrown');
    } catch (err) {
      if (!(err instanceof Error) || !err.message.includes('Invalid transition')) {
        throw new Error('unexpected error for invalid transition');
      }
      console.log('✅ invalid transition rejected');
    }

    // version mismatch
    try {
      workOrderService.updateStatus(order.id, { newStatus: 'INVENTORY_RESERVATION', baseVersion: 0 }, null, 'corr-4');
      throw new Error('version mismatch should have thrown');
    } catch (err) {
      if (!(err instanceof Error) || !err.message.includes('Version mismatch')) {
        throw new Error('unexpected error for version mismatch');
      }
      console.log('✅ version mismatch detected');
    }

    console.log('All work order tests passed');
  } catch (err) {
    console.error('workorder.service tests failed', err);
    process.exit(1);
  }
}

void runTests();