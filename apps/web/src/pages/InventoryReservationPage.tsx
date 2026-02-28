import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InventoryTable from '../components/InventoryTable';
import ReservationForm from '../components/ReservationForm';
import { apiClient } from '../services/apiClient';

type Branch = {
  id: string;
  name: string;
  isMain: boolean;
};

type Product = {
  id: string;
  name: string;
  category: string;
  isSerialized: boolean;
};

type InventoryRow = {
  id: string;
  branchId: string;
  productId: string;
  productName: string;
  qtyAvailable: number;
  qtyReserved: number;
  updatedAt: string;
};

export default function InventoryReservationPage() {
  const navigate = useNavigate();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [inventoryRows, setInventoryRows] = useState<InventoryRow[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [branchRows, productRows] = await Promise.all([
          apiClient.getBranches(),
          apiClient.getProducts()
        ]);
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
        const rows = await apiClient.get<InventoryRow[]>(
          `/api/v1/inventory?branchId=${encodeURIComponent(selectedBranchId)}`
        );
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
    const rows = await apiClient.get<InventoryRow[]>(
      `/api/v1/inventory?branchId=${encodeURIComponent(selectedBranchId)}`
    );
    setInventoryRows(rows);
  };

  const handleReserve = async (input: { workOrderId: string; productId: string; qty: number }) => {
    if (!selectedBranchId) {
      setMessage('Seleccione una sucursal');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      await apiClient.reserveInventory({
        workOrderId: input.workOrderId,
        branchId: selectedBranchId,
        items: [{ productId: input.productId, qty: input.qty }]
      });
      await refreshInventory();
      setMessage('Reserva creada correctamente.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo reservar');
    } finally {
      setLoading(false);
    }
  };

  const handleRelease = async (workOrderId: string) => {
    setLoading(true);
    setMessage('');
    try {
      await apiClient.releaseReservation(workOrderId);
      await refreshInventory();
      setMessage('Reserva liberada correctamente.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo liberar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '1rem', maxWidth: 960, margin: '0 auto' }}>
      <h1>RF-07 Reservar inventario para solicitud</h1>

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
