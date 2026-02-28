/**
 * ConfirmDeleteModal.tsx
 * Modal de confirmación de eliminación — reutilizable para planes y productos.
 */

import React from 'react';

interface ConfirmDeleteModalProps {
  open:      boolean;
  itemName:  string;
  deleting:  boolean;
  onConfirm: () => void;
  onClose:   () => void;
}

export function ConfirmDeleteModal({
  open, itemName, deleting, onConfirm, onClose,
}: ConfirmDeleteModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 flex flex-col gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-rose-500/15 border border-rose-500/30 mx-auto">
          <span className="text-rose-400 text-xl">⚠</span>
        </div>

        <div className="text-center">
          <h3 className="text-base font-bold text-slate-100">¿Eliminar registro?</h3>
          <p className="mt-1 text-sm text-slate-400">
            Se eliminará <span className="text-slate-200 font-medium">"{itemName}"</span> permanentemente.
            Esta acción no se puede deshacer.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-slate-700 text-slate-400 text-sm font-medium hover:border-slate-500 hover:text-slate-200 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {deleting && (
              <span className="w-3.5 h-3.5 border-2 border-white border-r-transparent rounded-full animate-spin" />
            )}
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
