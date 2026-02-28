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
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [inventoryRows, setInventoryRows] = useState<InventoryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [branchRows, productRows] = await Promise.all([
          apiClient.get<Branch[]>('/api/v1/inventory/branches'),
          apiClient.get<Product[]>('/api/v1/inventory/products')
        ]);
        setBranches(branchRows);
        setProducts(productRows);
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
      await apiClient.post('/api/v1/inventory/reservations', {
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
      await apiClient.delete(`/api/v1/inventory/reservations/${encodeURIComponent(workOrderId)}`);
      await refreshInventory();
      setMessage('Reserva liberada correctamente.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo liberar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-5xl mx-auto">
      <header className="mb-6 pb-5 border-b border-slate-700">
        <button
          onClick={() => navigate('/home')}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors mb-2 flex items-center gap-1"
        >
          ← Panel Principal
        </button>
        <p className="text-[0.65rem] tracking-[0.25em] uppercase text-emerald-400 font-medium mb-1">
          Gestión de Inventario
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-50">
          Reservar Inventario
        </h1>
      </header>

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

      <ReservationForm
        products={products}
        loading={loading}
        onReserve={handleReserve}
        onRelease={handleRelease}
      />

      {message ? <p style={{ marginTop: '0.75rem' }}>{message}</p> : null}

      <InventoryTable rows={inventoryRows} />
    </main>
  );
}
