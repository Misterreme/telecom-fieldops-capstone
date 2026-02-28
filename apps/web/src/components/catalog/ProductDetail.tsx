import React from "react";
import type { Product } from "../../types/product";

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 text-xl transition-colors"
        >
          ✕
        </button>

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-700">
          <p className="text-[0.65rem] tracking-[0.25em] uppercase text-violet-400 font-medium mb-1">
            Detalle del Producto
          </p>
          <h2 className="text-xl font-bold text-slate-100">{product.name}</h2>
          <span className="text-xs text-slate-500 font-mono">{product.id}</span>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-[0.65rem] uppercase tracking-widest text-slate-500 font-medium mb-1">
              Categoría
            </label>
            <span className="text-sm text-slate-200">{product.category.replace('_', ' ')}</span>
          </div>

          {product.description && (
            <div>
              <label className="block text-[0.65rem] uppercase tracking-widest text-slate-500 font-medium mb-1">
                Descripción
              </label>
              <p className="text-sm text-slate-300 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Traceability info */}
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
              Control de Trazabilidad
            </h4>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Gestión de Inventario</span>
              <span
                className={`font-semibold ${product.isSerialized ? 'text-amber-400' : 'text-emerald-400'}`}
              >
                {product.isSerialized ? 'Serializado (Requiere SN)' : 'No Serializado (Stock Genérico)'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};