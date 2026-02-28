/**
 * ProductFormModal.tsx
 * Modal de creación y edición de productos/equipos.
 * Tailwind + TypeScript.
 */

import React, { useEffect, useState } from 'react';
import {
  Product, CreateProductDto,
  ProductCategory,
  PRODUCT_CATEGORY_LABELS,
} from '../types/catalog';

interface ProductFormModalProps {
  open:    boolean;
  product?: Product | null;
  saving:  boolean;
  onSave:  (dto: CreateProductDto) => void;
  onClose: () => void;
}

const EMPTY_FORM: CreateProductDto = {
  name:         '',
  category:     'ROUTER',
  isSerialized: true,
};

const CATEGORIES: ProductCategory[] = [
  'ROUTER', 'MODEM', 'ONT', 'STB', 'CABLE', 'SIM', 'ANTENNA',
];

export function ProductFormModal({ open, product, saving, onSave, onClose }: ProductFormModalProps) {
  const [form,   setForm]   = useState<CreateProductDto>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof CreateProductDto, string>>>({});

  const isEditing = Boolean(product);

  useEffect(() => {
    if (open) {
      setForm(product ? {
        name:         product.name,
        category:     product.category,
        isSerialized: product.isSerialized,
      } : EMPTY_FORM);
      setErrors({});
    }
  }, [open, product]);

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = 'El nombre es requerido.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) onSave(form);
  }

  function field<K extends keyof CreateProductDto>(key: K, value: CreateProductDto[K]) {
    setForm((f: CreateProductDto) => ({ ...f, [key]: value }));
    setErrors((e: Record<string, string | undefined>) => ({ ...e, [key]: undefined }));
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <p className="text-[0.6rem] uppercase tracking-widest text-violet-400 font-medium">
              {isEditing ? 'Editar producto' : 'Nuevo producto'}
            </p>
            <h2 className="text-lg font-bold text-slate-100 tracking-tight">
              {isEditing ? product!.name : 'Registrar equipo o producto'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-200 text-xl leading-none transition-colors"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">

          {/* Nombre */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              Nombre <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={e => field('name', e.target.value)}
              placeholder="ej. Router WiFi 6 AX3000"
              className={`bg-slate-800 border rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition-colors ${
                errors.name ? 'border-rose-500' : 'border-slate-700 focus:border-violet-500'
              }`}
            />
            {errors.name && <p className="text-xs text-rose-400">{errors.name}</p>}
          </div>

          {/* Categoría */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              Categoría
            </label>
            <select
              value={form.category}
              onChange={e => field('category', e.target.value as ProductCategory)}
              className="bg-slate-800 border border-slate-700 focus:border-violet-500 rounded-lg px-3 py-2.5 text-sm text-slate-100 outline-none transition-colors"
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{PRODUCT_CATEGORY_LABELS[c]}</option>
              ))}
            </select>
          </div>

          {/* Serializado */}
          <div className="flex items-center justify-between bg-slate-800 rounded-lg px-4 py-3">
            <div>
              <p className="text-sm text-slate-200 font-medium">Equipo serializado</p>
              <p className="text-xs text-slate-500">Tiene número de serie individual (IMEI, S/N)</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={form.isSerialized}
              onClick={() => field('isSerialized', !form.isSerialized)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                form.isSerialized ? 'bg-violet-500' : 'bg-slate-600'
              }`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                form.isSerialized ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-slate-700 text-slate-400 text-sm font-medium hover:border-slate-500 hover:text-slate-200 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-lg bg-violet-500 hover:bg-violet-400 text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving && (
                <span className="w-3.5 h-3.5 border-2 border-white border-r-transparent rounded-full animate-spin" />
              )}
              {isEditing ? 'Guardar cambios' : 'Crear producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
