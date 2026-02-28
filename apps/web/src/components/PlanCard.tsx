/**
 * RF-04: Tarjeta individual de plan — TypeScript + Tailwind
 * RNF-SEC-02: Campos ya sanitizados desde plansService.
 */

import React from 'react';
import { Plan, PlanCategory } from '../types/plans';

// ─── Tipos internos ──────────────────────────────────────────────────────────
interface CategoryMeta {
  label: string;
  color: string;
}

interface PlanCardProps {
  plan:       Plan;
  onToggle:   (plan: Plan) => void;
  isToggling: boolean;
}

// ─── Mapas de estilos por categoría ─────────────────────────────────────────
const CATEGORY_META: Record<PlanCategory, CategoryMeta> = {
  RESIDENCIAL: { label: 'Residencial', color: 'text-sky-400 bg-sky-400/10 border-sky-400/20' },
  MOVIL:       { label: 'Móvil',       color: 'text-violet-400 bg-violet-400/10 border-violet-400/20' },
  EMPRESARIAL: { label: 'Empresarial', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  TV:          { label: 'TV',          color: 'text-rose-400 bg-rose-400/10 border-rose-400/20' },
};

const CATEGORY_BAR: Record<PlanCategory, string> = {
  RESIDENCIAL: 'bg-sky-400',
  MOVIL:       'bg-violet-400',
  EMPRESARIAL: 'bg-amber-400',
  TV:          'bg-rose-400',
};

const FALLBACK_META: CategoryMeta = {
  label: '',
  color: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatPrice(amount: number, currency = 'DOP'): string {
  return new Intl.NumberFormat('es-DO', { style: 'currency', currency }).format(amount);
}

function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

// ─── Componente ──────────────────────────────────────────────────────────────
export function PlanCard({ plan, onToggle, isToggling }: PlanCardProps) {
  const isActive = plan.status === 'ACTIVE';
  const meta     = CATEGORY_META[plan.category] ?? { ...FALLBACK_META, label: plan.category };
  const bar      = CATEGORY_BAR[plan.category]  ?? 'bg-slate-400';

  const hasSpecs = plan.downloadSpeedMbps || plan.uploadSpeedMbps || plan.dataLimitGB;

  return (
    <article
      className={cx(
        'relative flex flex-col gap-4 rounded-xl border p-5 overflow-hidden',
        'bg-slate-800 shadow-xl transition-all duration-200',
        'hover:-translate-y-0.5 hover:shadow-2xl',
        isActive
          ? 'border-slate-600 hover:border-slate-500'
          : 'border-slate-700 opacity-60 hover:opacity-80',
        isToggling && 'opacity-70'
      )}
    >
      {/* Accent bar izquierda */}
      <div className={`absolute top-0 left-0 w-1 h-full rounded-l-xl ${bar}`} />

      {/* Header: categoría + badge de estado */}
      <div className="flex items-center justify-between gap-2 pl-2">
        <span className={cx(
          'text-[0.65rem] font-semibold tracking-widest uppercase',
          'px-2.5 py-1 rounded-full border',
          meta.color
        )}>
          {meta.label}
        </span>

        <span className={cx(
          'text-[0.6rem] tracking-widest uppercase px-2 py-0.5 rounded font-medium',
          isActive
            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
            : 'bg-slate-700/50 text-slate-500 border border-slate-700'
        )}>
          {isActive ? 'Activo' : 'Inactivo'}
        </span>
      </div>

      {/* Nombre y descripción */}
      <div className="pl-2">
        <h3 className="font-bold text-[1.05rem] text-slate-100 leading-tight tracking-tight">
          {plan.name}
        </h3>
        <p className="mt-1 text-[0.78rem] text-slate-400 leading-relaxed line-clamp-2">
          {plan.description}
        </p>
      </div>

      {/* Specs técnicas */}
      {hasSpecs && (
        <div className="flex flex-wrap gap-3 border-t border-b border-slate-800 py-3 pl-2">
          {plan.downloadSpeedMbps !== null && (
            <div className="flex items-center gap-1.5 text-[0.72rem] text-slate-300">
              <span className="text-slate-500">↓</span>
              <span className="font-medium">{plan.downloadSpeedMbps} Mbps</span>
            </div>
          )}
          {plan.uploadSpeedMbps !== null && (
            <div className="flex items-center gap-1.5 text-[0.72rem] text-slate-300">
              <span className="text-slate-500">↑</span>
              <span className="font-medium">{plan.uploadSpeedMbps} Mbps</span>
            </div>
          )}
          {plan.dataLimitGB !== null && (
            <div className="flex items-center gap-1.5 text-[0.72rem] text-slate-300">
              <span className="text-slate-500">◉</span>
              <span className="font-medium">{plan.dataLimitGB} GB</span>
            </div>
          )}
        </div>
      )}

      {/* Footer: precio + botón toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-auto pl-2">
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-slate-100 tracking-tight">
            {formatPrice(plan.monthlyPrice, plan.currency)}
          </span>
          <span className="text-[0.7rem] text-slate-500">/mes</span>
        </div>

        <button
          onClick={() => onToggle(plan)}
          disabled={isToggling}
          aria-label={`${isActive ? 'Desactivar' : 'Activar'} plan ${plan.name}`}
          aria-pressed={isActive}
          className={cx(
            'min-w-24 w-full sm:w-auto flex items-center justify-center gap-2',
            'px-4 py-2 rounded-lg text-[0.72rem] font-semibold tracking-wide border',
            'transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50',
            isActive
              ? 'bg-rose-500/10 text-rose-300 border-rose-500/25 hover:bg-rose-500/20 hover:border-rose-500/50'
              : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25 hover:bg-emerald-500/20 hover:border-emerald-500/50'
          )}
        >
          {isToggling ? (
            <span
              className="w-3.5 h-3.5 border-2 border-current border-r-transparent rounded-full animate-spin"
              aria-hidden="true"
            />
          ) : isActive ? 'Desactivar' : 'Activar'}
        </button>
      </div>
    </article>
  );
}
