/**
 * RF-04: Página de catálogo de planes — TypeScript + Tailwind
 * RNF-PERF-01: Refresh manual invalida cache (TTL 30 min).
 * EC-08: cache expirado obliga refresh.
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plan, PlanStatus, PlanCategory } from '../types/plans';
import { usePlans } from './usePlans';
import { PlanCard } from './PlanCard';

// ─── Tipos de filtros ────────────────────────────────────────────────────────
type StatusFilter   = 'ALL' | PlanStatus;
type CategoryFilter = 'ALL' | PlanCategory;

interface FilterOption<T extends string> {
  label: string;
  value: T;
}

const STATUS_FILTERS: FilterOption<StatusFilter>[] = [
  { label: 'Todos',     value: 'ALL' },
  { label: 'Activos',   value: 'ACTIVE' },
  { label: 'Inactivos', value: 'INACTIVE' },
];

const CATEGORY_FILTERS: FilterOption<CategoryFilter>[] = [
  { label: 'Todas',       value: 'ALL' },
  { label: 'Residencial', value: 'RESIDENCIAL' },
  { label: 'Móvil',       value: 'MOVIL' },
  { label: 'Empresarial', value: 'EMPRESARIAL' },
  { label: 'TV',          value: 'TV' },
];

// ─── Sub-componentes ─────────────────────────────────────────────────────────
interface FilterChipProps {
  label:   string;
  active:  boolean;
  onClick: () => void;
}

function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={[
        'px-3 py-1 rounded-full text-[0.72rem] font-medium tracking-wide border transition-all duration-150',
        active
          ? 'bg-sky-500 border-sky-500 text-slate-950'
          : 'bg-transparent border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200',
      ].join(' ')}
    >
      {label}
    </button>
  );
}

interface StatCardProps {
  value:       number;
  label:       string;
  valueClass?: string;
}

function StatCard({ value, label, valueClass = 'text-slate-100' }: StatCardProps) {
  return (
    <div className="flex-1 min-w-0 bg-slate-800 border border-slate-700 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 flex flex-col gap-0.5">
      <span className={`text-xl sm:text-2xl font-bold leading-none ${valueClass}`}>{value}</span>
      <span className="text-[0.6rem] sm:text-[0.65rem] text-slate-500 uppercase tracking-widest">{label}</span>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-xl bg-slate-800 border border-slate-700 p-5 flex flex-col gap-4 animate-pulse">
      <div className="flex justify-between">
        <div className="h-5 w-24 rounded-full bg-slate-800" />
        <div className="h-5 w-14 rounded bg-slate-800" />
      </div>
      <div className="space-y-2 pl-2">
        <div className="h-4 w-3/4 rounded bg-slate-800" />
        <div className="h-3 w-full rounded bg-slate-800" />
        <div className="h-3 w-2/3 rounded bg-slate-800" />
      </div>
      <div className="flex gap-4 border-t border-b border-slate-800 py-3 pl-2">
        <div className="h-3 w-16 rounded bg-slate-800" />
        <div className="h-3 w-16 rounded bg-slate-800" />
      </div>
      <div className="flex justify-between items-center pl-2">
        <div className="h-6 w-24 rounded bg-slate-800" />
        <div className="h-8 w-24 rounded-lg bg-slate-800" />
      </div>
    </div>
  );
}

// ─── Página principal ────────────────────────────────────────────────────────
function BackButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/home')}
      className="text-xs text-slate-500 hover:text-slate-300 transition-colors mb-2 flex items-center gap-1"
    >
      ← Panel Principal
    </button>
  );
}

export function PlansPage() {
  const { plans, loading, error, togglingId, togglePlanStatus, refresh } = usePlans();

  const [search,         setSearch]         = useState<string>('');
  const [statusFilter,   setStatusFilter]   = useState<StatusFilter>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('ALL');

  const filtered = useMemo<Plan[]>(() => {
    const q = search.toLowerCase();
    return plans.filter((p) => {
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === 'ALL' || p.status === statusFilter;
      const matchesCategory =
        categoryFilter === 'ALL' || p.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [plans, search, statusFilter, categoryFilter]);

  const stats = useMemo(() => ({
    total:    plans.length,
    active:   plans.filter((p) => p.status === 'ACTIVE').length,
    inactive: plans.filter((p) => p.status === 'INACTIVE').length,
  }), [plans]);

  const clearFilters = (): void => {
    setSearch('');
    setStatusFilter('ALL');
    setCategoryFilter('ALL');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">

      {/* ── Header ── */}
      <header className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6 sm:mb-8 pb-6 border-b border-slate-700">
        <div>
          <BackButton />
          <p className="text-[0.65rem] tracking-[0.25em] uppercase text-sky-400 font-medium mb-1">
            FieldOps Telecom Suite
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-50 leading-tight">
            Catálogo de Planes
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Gestiona la disponibilidad de planes en el catálogo comercial.
          </p>
        </div>

        <button
          onClick={refresh}
          disabled={loading}
          title="Forzar recarga del catálogo (invalida cache)"
          aria-label="Actualizar catálogo"
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-600 text-slate-400 text-xs font-medium hover:border-sky-500 hover:text-sky-400 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap shrink-0 w-full sm:w-auto justify-center sm:justify-start"
        >
          <span className={loading ? 'animate-spin inline-block' : 'inline-block'}>↻</span>
          Actualizar
        </button>
      </header>

      {/* ── Stats ── */}
      <div className="flex gap-3 mb-6" role="status" aria-live="polite">
        <StatCard value={stats.total}    label="Total" />
        <StatCard value={stats.active}   label="Activos"   valueClass="text-emerald-400" />
        <StatCard value={stats.inactive} label="Inactivos" valueClass="text-slate-500" />
      </div>

      {/* ── Error ── */}
      {error && (
        <div
          role="alert"
          className="flex items-center gap-3 px-4 py-3 mb-5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm"
        >
          <span className="text-rose-400 shrink-0">⚠</span>
          <span><strong>Error:</strong> {error}</span>
          <button
            onClick={refresh}
            className="ml-auto text-xs border border-rose-500/35 px-3 py-1 rounded hover:bg-rose-500/15 transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* ── Filtros ── */}
      <div className="flex flex-col gap-3 mb-5">
        {/* Búsqueda */}
        <div className="relative w-full sm:max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg pointer-events-none select-none">
            ⌕
          </span>
          <input
            type="search"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            placeholder="Buscar plan por nombre o descripción…"
            aria-label="Buscar planes"
            className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-400 outline-none focus:border-sky-500 transition-colors"
          />
        </div>

        {/* Chips de filtro */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
          <fieldset className="flex flex-wrap items-center gap-2 border-0 p-0 m-0">
            <legend className="text-[0.65rem] uppercase tracking-widest text-slate-600 mr-1 float-left pt-1">
              Estado
            </legend>
            {STATUS_FILTERS.map((f) => (
              <FilterChip
                key={f.value}
                label={f.label}
                active={statusFilter === f.value}
                onClick={() => setStatusFilter(f.value)}
              />
            ))}
          </fieldset>

          <fieldset className="flex flex-wrap items-center gap-2 border-0 p-0 m-0">
            <legend className="text-[0.65rem] uppercase tracking-widest text-slate-600 mr-1 float-left pt-1">
              Categoría
            </legend>
            {CATEGORY_FILTERS.map((f) => (
              <FilterChip
                key={f.value}
                label={f.label}
                active={categoryFilter === f.value}
                onClick={() => setCategoryFilter(f.value)}
              />
            ))}
          </fieldset>
        </div>
      </div>

      {/* ── Contenido ── */}
      {loading && plans.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4" aria-label="Cargando planes…">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          role="status"
          className="flex flex-col items-center justify-center gap-3 py-20 text-slate-500 text-center"
        >
          <span className="text-5xl opacity-20">◎</span>
          <p className="text-sm">No se encontraron planes con los filtros aplicados.</p>
          <button
            onClick={clearFilters}
            className="text-xs border border-slate-700 px-4 py-2 rounded-lg hover:border-slate-500 hover:text-slate-300 transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <>
          <p className="text-xs text-slate-600 mb-3" aria-live="polite">
            Mostrando {filtered.length} de {plans.length} planes
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4" role="list">
            {filtered.map((plan) => (
              <div key={plan.id} role="listitem">
                <PlanCard
                  plan={plan}
                  onToggle={togglePlanStatus}
                  isToggling={togglingId === plan.id}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
