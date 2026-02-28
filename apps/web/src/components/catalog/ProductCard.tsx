import React from "react";
import type { Product } from "../../types/product";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  ROUTER:  { bg: 'bg-sky-500/15',     text: 'text-sky-400' },
  MODEM:   { bg: 'bg-indigo-500/15',  text: 'text-indigo-400' },
  ONT:     { bg: 'bg-violet-500/15',  text: 'text-violet-400' },
  STB:     { bg: 'bg-pink-500/15',    text: 'text-pink-400' },
  CABLE:   { bg: 'bg-amber-500/15',   text: 'text-amber-400' },
  SIM:     { bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
  ANTENNA: { bg: 'bg-rose-500/15',    text: 'text-rose-400' },
};

const CATEGORY_ACCENT: Record<string, string> = {
  ROUTER: 'bg-sky-500',
  MODEM: 'bg-indigo-500',
  ONT: 'bg-violet-500',
  STB: 'bg-pink-500',
  CABLE: 'bg-amber-500',
  SIM: 'bg-emerald-500',
  ANTENNA: 'bg-rose-500',
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const colors = CATEGORY_COLORS[product.category] ?? { bg: 'bg-slate-500/15', text: 'text-slate-400' };
  const accent = CATEGORY_ACCENT[product.category] ?? 'bg-slate-500';

  return (
    <div className="group relative bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden flex flex-col hover:border-slate-500 transition-all duration-200 hover:shadow-lg hover:shadow-slate-900/50">
      {/* Category accent bar */}
      <div className={`h-1 ${accent}`} />

      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Category badge */}
        <span className={`self-start px-2.5 py-1 rounded-md text-[0.65rem] font-bold uppercase tracking-wider ${colors.bg} ${colors.text}`}>
          {product.category}
        </span>

        {/* Name */}
        <h3 className="text-base font-bold text-slate-200 group-hover:text-slate-50 transition-colors leading-snug">
          {product.name}
        </h3>

        {/* Details */}
        <div className="mt-auto pt-3 border-t border-slate-700 space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-500">
            <span>ID</span>
            <span className="text-slate-400 font-mono text-[0.65rem]">{product.id}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Inventario</span>
            <span className={product.isSerialized ? 'text-amber-400' : 'text-emerald-400'}>
              {product.isSerialized ? 'Serializado' : 'No Serializado'}
            </span>
          </div>
        </div>

        {/* Action */}
        <button
          onClick={() => onSelect(product)}
          className="mt-2 w-full py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition-colors active:scale-[0.98]"
        >
          Ver Detalle
        </button>
      </div>
    </div>
  );
};