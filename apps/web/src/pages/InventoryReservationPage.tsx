import { useEffect, useState } from 'react';
import InventoryTable from '../components/InventoryTable';
import { apiClient, type Branch, type InventoryRow } from '../services/apiClient';

export default function InventoryReservationPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [inventoryRows, setInventoryRows] = useState<InventoryRow[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const branchRows = await apiClient.getBranches();
        setBranches(branchRows);
        const firstBranchId = branchRows[0]?.id ?? '';
        setSelectedBranchId(firstBranchId);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Error cargando datos');
      }
    };

    void loadInitialData();
  }, []);

  useEffect(() => {
    if (!selectedBranchId) {
      setInventoryRows([]);
      return;
    }
    const loadInventory = async () => {
      try {
        const rows = await apiClient.getInventory(selectedBranchId);
        setInventoryRows(rows);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Error cargando inventario');
      }
    };

    void loadInventory();
  }, [selectedBranchId]);

  const refreshInventory = async () => {
    if (!selectedBranchId) {
      return;
    }
    const rows = await apiClient.getInventory(selectedBranchId);
    setInventoryRows(rows);
  };

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '1rem', maxWidth: 960, margin: '0 auto', backgroundColor: 'white', borderRadius: 8, boxShadow: '0 0 8px rgba(0,0,0,0.1)' }}>
      <h1 style={{ color: '#007bff' }}>Inventario por sucursal</h1>

      <section style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'grid', gap: '0.35rem', maxWidth: 360 }}>
          Sucursal
          <select
            value={selectedBranchId}
            onChange={(event) => setSelectedBranchId(event.target.value)}
            style={{ padding: '0.45rem 0.55rem', border: '1px solid #ccc', borderRadius: 6 }}
          >
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </label>
      </section>

      {message ? <p style={{ marginTop: '0.75rem', color: 'red' }}>{message}</p> : null}

      <InventoryTable rows={inventoryRows} />
    </main>
  );
}
