import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/apiClient';

// types copied from backend contract

type WorkOrderItem = {
  productId: string;
  qty: number;
};

type WorkOrder = {
  id: string;
  type: string;
  status: string;
  customerId: string;
  branchId?: string;
  planId?: string;
  assignedTechUserId?: string;
  version: number;
  items?: WorkOrderItem[];
  createdAt: string;
  updatedAt: string;
  allowedTransitions: string[];
};

const WORK_ORDER_TYPES = [
  'NEW_SERVICE_INSTALL',
  'CLAIM_TROUBLESHOOT',
  'PLAN_AND_EQUIPMENT_SALE',
  'EQUIPMENT_ONLY_SALE',
  'MONTHLY_PAYMENT',
  'SERVICE_UPGRADE',
  'SERVICE_DOWN_OUTAGE',
];

export default function WorkOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // form state
  const [newType, setNewType] = useState(WORK_ORDER_TYPES[0]);
  const [newCustomer, setNewCustomer] = useState('');
  const [newBranch, setNewBranch] = useState('');
  const [newPlan, setNewPlan] = useState('');
  const [newItems, setNewItems] = useState<WorkOrderItem[]>([]);
  const [creating, setCreating] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<WorkOrder[]>('/api/v1/work-orders');
      setOrders(data);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Error cargando órdenes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOrders();
  }, []);

  const handleCreate = async () => {
    setCreating(true);
    setMessage('');
    try {
      await apiClient.post('/api/v1/work-orders', {
        type: newType,
        customerId: newCustomer,
        branchId: newBranch || undefined,
        planId: newPlan || undefined,
        items: newItems.length ? newItems : undefined,
      });
      setNewCustomer('');
      setNewBranch('');
      setNewPlan('');
      setNewItems([]);
      await loadOrders();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'No se pudo crear');
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = async (order: WorkOrder, newStatus: string) => {
    try {
      await apiClient.patch(`/api/v1/work-orders/${encodeURIComponent(order.id)}/status`, {
        newStatus,
        baseVersion: order.version,
      });
      await loadOrders();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Error actualizando estado');
    }
  };

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
          <p className="text-[0.65rem] tracking-[0.25em] uppercase text-rose-400 font-medium mb-1">
            Órdenes de Trabajo
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-50">
            Solicitudes por tipo
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Crea nueva orden y observa el flujo según tipo.
          </p>
        </div>
      </header>

      {/* create form */}
      <section className="mb-6 bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-bold text-slate-200 mb-4">Nueva orden</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            Tipo
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="mt-1 block w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
            >
              {WORK_ORDER_TYPES.map((t) => (
                <option key={t} value={t} className="bg-slate-800">
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            Cliente (ID)
            <input
              value={newCustomer}
              onChange={(e) => setNewCustomer(e.target.value)}
              className="mt-1 block w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
            />
          </label>
          <label className="block">
            Sucursal ID
            <input
              value={newBranch}
              onChange={(e) => setNewBranch(e.target.value)}
              className="mt-1 block w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
            />
          </label>
          <label className="block">
            Plan ID
            <input
              value={newPlan}
              onChange={(e) => setNewPlan(e.target.value)}
              className="mt-1 block w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
            />
          </label>
        </div>
        <button
          onClick={handleCreate}
          disabled={creating || !newCustomer}
          className="mt-4 px-4 py-2 bg-rose-600 rounded-lg hover:bg-rose-500 disabled:opacity-50"
        >
          Crear orden
        </button>
      </section>

      {message && <p className="text-rose-400 mb-4">{message}</p>}

      <section>
        <h2 className="text-lg font-bold text-slate-200 mb-4">Lista de órdenes</h2>
        {loading ? (
          <p>Cargando…</p>
        ) : orders.length === 0 ? (
          <p>No hay órdenes creadas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Tipo</th>
                  <th className="px-4 py-2 text-left">Estado</th>
                  <th className="px-4 py-2 text-left">Cliente</th>
                  <th className="px-4 py-2 text-left">Sucursal</th>
                  <th className="px-4 py-2 text-left">Versión</th>
                  <th className="px-4 py-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((wo) => (
                  <tr
                    key={wo.id}
                    className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-slate-200 font-mono">{wo.id}</td>
                    <td className="px-4 py-3">{wo.type}</td>
                    <td className="px-4 py-3">{wo.status}</td>
                    <td className="px-4 py-3">{wo.customerId}</td>
                    <td className="px-4 py-3">{wo.branchId ?? '-'}</td>
                    <td className="px-4 py-3">{wo.version}</td>
                    <td className="px-4 py-3">
                      {wo.allowedTransitions.length > 0 && (
                        <select
                          onChange={(e) => handleStatusChange(wo, e.target.value)}
                          className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200"
                        >
                          <option value="">—</option>
                          {wo.allowedTransitions.map((st) => (
                            <option key={st} value={st} className="bg-slate-800">
                              {st}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
