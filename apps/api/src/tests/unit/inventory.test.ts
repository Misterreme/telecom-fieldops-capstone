import { inventoryService } from '../../domain/services/invetory.service';

// simple sanity checks for RF‑06

function test1_listInventory_filtersByBranch() {
  const rows = inventoryService.listInventory('br_main');
  for (const row of rows) {
    if (row.branchId !== 'br_main') {
      throw new Error(`❌ row with wrong branchId ${row.branchId}`);
    }
  }
  console.log('✅ Test 1 PASSED: listInventory returns only requested branch');
}

function test2_listInventory_emptyIfMissing() {
  const rows = inventoryService.listInventory('nonexistent');
  if (rows.length !== 0) {
    throw new Error('❌ expected empty array for unknown branch');
  }
  console.log('✅ Test 2 PASSED: unknown branch returns empty array');
}

(async function run() {
  console.log('🧪 inventory.service unit tests');
  try {
    test1_listInventory_filtersByBranch();
    test2_listInventory_emptyIfMissing();
    console.log('All inventory.service tests passed');
  } catch (err) {
    console.error('inventory.service tests failed', err);
    process.exit(1);
  }
})();