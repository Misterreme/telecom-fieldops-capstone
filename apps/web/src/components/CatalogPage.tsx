/**
 * CatalogPage.tsx
 * Página principal de gestión del catálogo.
 * Tabs: Planes | Productos/Equipos
 * CRUD completo para ambos — Tailwind + TypeScript.
 */

import React, { useState } from 'react';
import {
  Plan, Product,
  CreatePlanDto, CreateProductDto,
  PLAN_TYPE_LABELS, PRODUCT_CATEGORY_LABELS,
} from '../types/catalog';
import { useCatalog }          from './useCatalog';
import { PlanFormModal }       from './PlanFormModal';
import { ProductFormModal }    from './ProductFormModal';
import { ConfirmDeleteModal }  from './ConfirmDeleteModal';

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = 'plans' | 'products';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat('es-DO', { style: 'currency', currency }).format(price);
}

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function EmptyState({ label, onAdd }: { label: string; onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-500">
      <span className="text-5xl opacity-20">◎</span>
      <p className="text-sm">No hay {label} registrados aún.</p>
      <button
        onClick={onAdd}
        className="text-xs border border-slate-700 px-4 py-2 rounded-lg hover:border-sky-500 hover:text-sky-400 transition-colors"
      >
        + Agregar primero
      </button>
    </div>
  );
}

function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 mb-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
      <span className="shrink-0">⚠</span>
      <span>{message}</span>
      <button
        onClick={onRetry}
        className="ml-auto text-xs border border-rose-500/35 px-3 py-1 rounded hover:bg-rose-500/15 transition-colors"
      >
        Reintentar
      </button>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-slate-800 animate-pulse">
      <div className="h-4 w-48 rounded bg-slate-800" />
      <div className="h-4 w-24 rounded bg-slate-800 ml-auto" />
      <div className="h-4 w-16 rounded bg-slate-800" />
      <div className="h-7 w-16 rounded bg-slate-800" />
      <div className="h-7 w-16 rounded bg-slate-800" />
    </div>
  );
}

// ─── Plans Table ──────────────────────────────────────────────────────────────
interface PlansTableProps {
  plans:      Plan[];
  deletingId: string | null;
  onEdit:     (p: Plan) => void;
  onDelete:   (p: Plan) => void;
}

function PlansTable({ plans, deletingId, onEdit, onDelete }: PlansTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-800">
            <th className="text-left px-4 py-2.5 text-[0.7rem] uppercase tracking-widest text-slate-500 font-medium">Nombre</th>
            <th className="text-left px-4 py-2.5 text-[0.7rem] uppercase tracking-widest text-slate-500 font-medium">Tipo</th>
            <th className="text-right px-4 py-2.5 text-[0.7rem] uppercase tracking-widest text-slate-500 font-medium">Precio</th>
            <th className="text-center px-4 py-2.5 text-[0.7rem] uppercase tracking-widest text-slate-500 font-medium">Estado</th>
            <th className="text-right px-4 py-2.5 text-[0.7rem] uppercase tracking-widest text-slate-500 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {plans.map(plan => (
            <tr
              key={plan.id}
              className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors"
            >
              <td className="px-4 py-3 text-slate-200 font-medium">{plan.name}</td>
              <td className="px-4 py-3">
                <span className="text-xs text-sky-400 bg-sky-400/10 border border-sky-400/20 px-2 py-0.5 rounded-full">
                  {PLAN_TYPE_LABELS[plan.type]}
                </span>
              </td>
              <td className="px-4 py-3 text-right font-mono text-slate-300 tabular-nums">
                {formatPrice(plan.price, plan.currency)}
              </td>
              <td className="px-4 py-3 text-center">
                <span className={cx(
                  'text-[0.65rem] uppercase tracking-widest font-medium px-2 py-0.5 rounded',
                  plan.isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                    : 'bg-slate-700/50 text-slate-500 border border-slate-700'
                )}>
                  {plan.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(plan)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:border-sky-500 hover:text-sky-400 transition-all"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(plan)}
                    disabled={deletingId === plan.id}
                    className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:border-rose-500 hover:text-rose-400 transition-all disabled:opacity-40"
                  >
                    {deletingId === plan.id ? (
                      <span className="w-3 h-3 border border-current border-r-transparent rounded-full animate-spin inline-block" />
                    ) : 'Eliminar'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Products Table ───────────────────────────────────────────────────────────
interface ProductsTableProps {
  products:   Product[];
  deletingId: string | null;
  onEdit:     (p: Product) => void;
  onDelete:   (p: Product) => void;
}

function ProductsTable({ products, deletingId, onEdit, onDelete }: ProductsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-800">
            <th className="text-left px-4 py-2.5 text-[0.7rem] uppercase tracking-widest text-slate-500 font-medium">Nombre</th>
            <th className="text-left px-4 py-2.5 text-[0.7rem] uppercase tracking-widest text-slate-500 font-medium">Categoría</th>
            <th className="text-center px-4 py-2.5 text-[0.7rem] uppercase tracking-widest text-slate-500 font-medium">Serializado</th>
            <th className="text-right px-4 py-2.5 text-[0.7rem] uppercase tracking-widest text-slate-500 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map(prod => (
            <tr
              key={prod.id}
              className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors"
            >
              <td className="px-4 py-3 text-slate-200 font-medium">{prod.name}</td>
              <td className="px-4 py-3">
                <span className="text-xs text-violet-400 bg-violet-400/10 border border-violet-400/20 px-2 py-0.5 rounded-full">
                  {PRODUCT_CATEGORY_LABELS[prod.category]}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <span className={cx(
                  'text-[0.65rem] uppercase tracking-widest font-medium px-2 py-0.5 rounded',
                  prod.isSerialized
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                    : 'bg-slate-700/50 text-slate-500 border border-slate-700'
                )}>
                  {prod.isSerialized ? 'Sí' : 'No'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(prod)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:border-violet-500 hover:text-violet-400 transition-all"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(prod)}
                    disabled={deletingId === prod.id}
                    className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:border-rose-500 hover:text-rose-400 transition-all disabled:opacity-40"
                  >
                    {deletingId === prod.id ? (
                      <span className="w-3 h-3 border border-current border-r-transparent rounded-full animate-spin inline-block" />
                    ) : 'Eliminar'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function CatalogPage() {
  const {
    plans, products,
    loadPlans, addPlan, editPlan, removePlan,
    loadProducts, addProduct, editProduct, removeProduct,
  } = useCatalog();

  const [activeTab, setActiveTab] = useState<Tab>('plans');

  // Plan modal state
  const [planModal,        setPlanModal]        = useState(false);
  const [editingPlan,      setEditingPlan]       = useState<Plan | null>(null);
  const [deletingPlan,     setDeletingPlan]      = useState<Plan | null>(null);

  // Product modal state
  const [productModal,     setProductModal]      = useState(false);
  const [editingProduct,   setEditingProduct]    = useState<Product | null>(null);
  const [deletingProduct,  setDeletingProduct]   = useState<Product | null>(null);

  // ── Plan handlers ──────────────────────────────────────────────────────────
  function openCreatePlan()  { setEditingPlan(null);  setPlanModal(true); }
  function openEditPlan(p: Plan) { setEditingPlan(p); setPlanModal(true); }
  function closePlanModal()  { setPlanModal(false); setEditingPlan(null); }

  async function handleSavePlan(dto: CreatePlanDto) {
    const ok = editingPlan
      ? await editPlan(editingPlan.id, dto)
      : await addPlan(dto);
    if (ok) closePlanModal();
  }

  async function handleDeletePlan() {
    if (!deletingPlan) return;
    const ok = await removePlan(deletingPlan.id);
    if (ok) setDeletingPlan(null);
  }

  // ── Product handlers ───────────────────────────────────────────────────────
  function openCreateProduct()  { setEditingProduct(null);   setProductModal(true); }
  function openEditProduct(p: Product) { setEditingProduct(p); setProductModal(true); }
  function closeProductModal()  { setProductModal(false); setEditingProduct(null); }

  async function handleSaveProduct(dto: CreateProductDto) {
    const ok = editingProduct
      ? await editProduct(editingProduct.id, dto)
      : await addProduct(dto);
    if (ok) closeProductModal();
  }

  async function handleDeleteProduct() {
    if (!deletingProduct) return;
    const ok = await removeProduct(deletingProduct.id);
    if (ok) setDeletingProduct(null);
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-8 max-w-6xl mx-auto">

      {/* ── Header ── */}
      <header className="mb-8 pb-6 border-b border-slate-800">
        <p className="text-[0.65rem] tracking-[0.25em] uppercase text-sky-400 font-medium mb-1">
          FieldOps Telecom Suite
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-50 leading-tight">
          Gestión de Catálogo
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Administra los planes de servicio y productos/equipos disponibles.
        </p>
      </header>

      {/* ── Stats ── */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
          <span className="text-2xl font-bold text-sky-400">{plans.items.length}</span>
          <p className="text-[0.65rem] text-slate-500 uppercase tracking-widest">Planes</p>
        </div>
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
          <span className="text-2xl font-bold text-emerald-400">
            {plans.items.filter((p: Plan) => p.isActive).length}
          </span>
          <p className="text-[0.65rem] text-slate-500 uppercase tracking-widest">Planes activos</p>
        </div>
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
          <span className="text-2xl font-bold text-violet-400">{products.items.length}</span>
          <p className="text-[0.65rem] text-slate-500 uppercase tracking-widest">Productos</p>
        </div>
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
          <span className="text-2xl font-bold text-amber-400">
            {products.items.filter((p: Product) => p.isSerialized).length}
          </span>
          <p className="text-[0.65rem] text-slate-500 uppercase tracking-widest">Serializados</p>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
          {(['plans', 'products'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cx(
                'px-5 py-2 rounded-lg text-sm font-medium transition-all',
                activeTab === tab
                  ? tab === 'plans'
                    ? 'bg-sky-500 text-slate-950'
                    : 'bg-violet-500 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              {tab === 'plans' ? `Planes (${plans.items.length})` : `Productos (${products.items.length})`}
            </button>
          ))}
        </div>

        {activeTab === 'plans' ? (
          <button
            onClick={openCreatePlan}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-sm font-semibold transition-all"
          >
            <span>+</span> Nuevo plan
          </button>
        ) : (
          <button
            onClick={openCreateProduct}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500 hover:bg-violet-400 text-white text-sm font-semibold transition-all"
          >
            <span>+</span> Nuevo producto
          </button>
        )}
      </div>

      {/* ── Content panel ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

        {/* Plans tab */}
        {activeTab === 'plans' && (
          <>
            {plans.error && (
              <div className="p-4">
                <ErrorBanner message={plans.error} onRetry={loadPlans} />
              </div>
            )}
            {plans.loading ? (
              <div>{Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}</div>
            ) : plans.items.length === 0 ? (
              <EmptyState label="planes" onAdd={openCreatePlan} />
            ) : (
              <PlansTable
                plans={plans.items}
                deletingId={plans.deletingId}
                onEdit={openEditPlan}
                onDelete={setDeletingPlan}
              />
            )}
          </>
        )}

        {/* Products tab */}
        {activeTab === 'products' && (
          <>
            {products.error && (
              <div className="p-4">
                <ErrorBanner message={products.error} onRetry={loadProducts} />
              </div>
            )}
            {products.loading ? (
              <div>{Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}</div>
            ) : products.items.length === 0 ? (
              <EmptyState label="productos" onAdd={openCreateProduct} />
            ) : (
              <ProductsTable
                products={products.items}
                deletingId={products.deletingId}
                onEdit={openEditProduct}
                onDelete={setDeletingProduct}
              />
            )}
          </>
        )}
      </div>

      {/* ── Modals ── */}
      <PlanFormModal
        open={planModal}
        plan={editingPlan}
        saving={plans.saving}
        onSave={handleSavePlan}
        onClose={closePlanModal}
      />

      <ProductFormModal
        open={productModal}
        product={editingProduct}
        saving={products.saving}
        onSave={handleSaveProduct}
        onClose={closeProductModal}
      />

      <ConfirmDeleteModal
        open={Boolean(deletingPlan)}
        itemName={deletingPlan?.name ?? ''}
        deleting={plans.deletingId === deletingPlan?.id}
        onConfirm={handleDeletePlan}
        onClose={() => setDeletingPlan(null)}
      />

      <ConfirmDeleteModal
        open={Boolean(deletingProduct)}
        itemName={deletingProduct?.name ?? ''}
        deleting={products.deletingId === deletingProduct?.id}
        onConfirm={handleDeleteProduct}
        onClose={() => setDeletingProduct(null)}
      />
    </div>
  );
}
