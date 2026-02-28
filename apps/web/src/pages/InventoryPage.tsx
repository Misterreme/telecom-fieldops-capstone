import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InventoryTable from '../components/InventoryTable';
import { apiClient } from '../services/apiClient';

// types copied from reservation page

type Branch = {
  id: string;
  name: string;
  isMain: boolean;
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

export default function InventoryPage() {
  const navigate = useNavigate();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [inventoryRows, setInventoryRows] = useState<InventoryRow[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [branchRows] = await Promise.all([
          apiClient.get<Branch[]>('/api/v1/inventory/branches'),
        ]);
        setBranches(branchRows);
        const first = branchRows[0]?.id ?? '';
        setSelectedBranchId(first);
      } catch (err) {
        setMessage(err instanceof Error ? err.message : 'Error cargando sucursales');
      }
    };
    void load();
  }, []);

  useEffect(() => {
    if (!selectedBranchId) {
      setInventoryRows([]);
      return;
    }
    const loadInv = async () => {
      try {
        const rows = await apiClient.get<InventoryRow[]>(
          `/api/v1/inventory?branchId=${encodeURIComponent(selectedBranchId)}`
        );
        setInventoryRows(rows);
      } catch (err) {
        setMessage(err instanceof Error ? err.message : 'Error cargando inventario');
      }
    };
    void loadInv();
  }, [selectedBranchId]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-8 sm:mb-10 pb-6 border-b border-slate-700">
        <div>
          <button
            onClick={() => navigate('/home')}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors mb-2 flex items-center gap-1"
          >
            ← Panel Principal
          </button>
          <p className="text-[0.65rem] tracking-[0.25em] uppercase text-emerald-400 font-medium mb-1">
            Inventario
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-50">
            Inventario por sucursal
          </h1>
          <p className="mt-1 text-sm text-slate-400">Consulta la disponibilidad de productos según la sucursal.</p>
        </div>
      </header>

      <section className="mb-6">
        <label className="block max-w-sm">
          <span className="text-sm text-slate-300">Sucursal</span>
          <select
            value={selectedBranchId}
            onChange={(e) => setSelectedBranchId(e.target.value)}
            className="mt-1 block w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
          >
            {branches.map((b) => (
              <option key={b.id} value={b.id} className="bg-slate-800">
                {b.name}
              </option>
            ))}
          </select>
        </label>
      </section>

      {message && (
        <div className="mb-4 bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 text-sm text-rose-400">
          {message}
        </div>
      )}

      <InventoryTable rows={inventoryRows} />
    </div>
  );
}
