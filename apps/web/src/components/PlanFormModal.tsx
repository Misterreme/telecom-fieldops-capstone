/**
 * PlanFormModal.tsx
 * Modal de creación y edición de planes.
 * Tailwind + TypeScript.
 */

import React, { useEffect, useState } from 'react';
import {
  Plan, CreatePlanDto,
  PlanType, Currency,
  PLAN_TYPE_LABELS,
} from '../types/catalog';

interface PlanFormModalProps {
  open:     boolean;
  plan?:    Plan | null;        // null = crear, Plan = editar
  saving:   boolean;
  onSave:   (dto: CreatePlanDto) => void;
  onClose:  () => void;
}

const EMPTY_FORM: CreatePlanDto = {
  name:     '',
  type:     'HOME_INTERNET',
  price:    0,
  currency: 'DOP',
  isActive: true,
};

const PLAN_TYPES: PlanType[]   = ['HOME_INTERNET', 'MOBILE_DATA', 'VOICE', 'BUSINESS'];
const CURRENCIES: Currency[]   = ['DOP', 'USD'];

export function PlanFormModal({ open, plan, saving, onSave, onClose }: PlanFormModalProps) {
  const [form, setForm] = useState<CreatePlanDto>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof CreatePlanDto, string>>>({});

  const isEditing = Boolean(plan);

  useEffect(() => {
    if (open) {
      setForm(plan ? {
        name:     plan.name,
        type:     plan.type,
        price:    plan.price,
        currency: plan.currency,
        isActive: plan.isActive,
      } : EMPTY_FORM);
      setErrors({});
    }
  }, [open, plan]);

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.name.trim())       e.name  = 'El nombre es requerido.';
    if (form.price <= 0)         e.price = 'El precio debe ser mayor a 0.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) onSave(form);
  }

  function field<K extends keyof CreatePlanDto>(key: K, value: CreatePlanDto[K]) {
    setForm((f: CreatePlanDto) => ({ ...f, [key]: value }));
    setErrors((e: Record<string, string | undefined>) => ({ ...e, [key]: undefined }));
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <p className="text-[0.6rem] uppercase tracking-widest text-sky-400 font-medium">
              {isEditing ? 'Editar plan' : 'Nuevo plan'}
            </p>
            <h2 className="text-lg font-bold text-slate-100 tracking-tight">
              {isEditing ? plan!.name : 'Crear plan de servicio'}
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
              placeholder="ej. Internet Hogar 300Mbps"
              className={`bg-slate-800 border rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition-colors ${
                errors.name ? 'border-rose-500' : 'border-slate-700 focus:border-sky-500'
              }`}
            />
            {errors.name && <p className="text-xs text-rose-400">{errors.name}</p>}
          </div>

          {/* Tipo */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              Tipo de plan
            </label>
            <select
              value={form.type}
              onChange={e => field('type', e.target.value as PlanType)}
              className="bg-slate-800 border border-slate-700 focus:border-sky-500 rounded-lg px-3 py-2.5 text-sm text-slate-100 outline-none transition-colors"
            >
              {PLAN_TYPES.map(t => (
                <option key={t} value={t}>{PLAN_TYPE_LABELS[t]}</option>
              ))}
            </select>
          </div>

          {/* Precio + Moneda */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                Precio <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                min={0}
                step={0.01}
                value={form.price}
                onChange={e => field('price', parseFloat(e.target.value) || 0)}
                className={`bg-slate-800 border rounded-lg px-3 py-2.5 text-sm text-slate-100 outline-none transition-colors ${
                  errors.price ? 'border-rose-500' : 'border-slate-700 focus:border-sky-500'
                }`}
              />
              {errors.price && <p className="text-xs text-rose-400">{errors.price}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                Moneda
              </label>
              <select
                value={form.currency}
                onChange={e => field('currency', e.target.value as Currency)}
                className="bg-slate-800 border border-slate-700 focus:border-sky-500 rounded-lg px-3 py-2.5 text-sm text-slate-100 outline-none transition-colors"
              >
                {CURRENCIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Estado activo */}
          <div className="flex items-center justify-between bg-slate-800 rounded-lg px-4 py-3">
            <div>
              <p className="text-sm text-slate-200 font-medium">Plan activo</p>
              <p className="text-xs text-slate-500">Visible para ventas y solicitudes</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={form.isActive}
              onClick={() => field('isActive', !form.isActive)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                form.isActive ? 'bg-emerald-500' : 'bg-slate-600'
              }`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                form.isActive ? 'translate-x-5' : 'translate-x-0'
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
              className="flex-1 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving && (
                <span className="w-3.5 h-3.5 border-2 border-slate-950 border-r-transparent rounded-full animate-spin" />
              )}
              {isEditing ? 'Guardar cambios' : 'Crear plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
