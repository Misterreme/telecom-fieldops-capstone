/**
 * services/catalogService.ts
 * CRUD completo para Planes y Productos.
 * Usa apiClient.ts y sanitizer.ts del proyecto.
 */

import { apiClient }      from './apiClient';
import { sanitizeObject } from './sanitizer';
import {
  Plan, Product,
  CreatePlanDto, UpdatePlanDto,
  CreateProductDto, UpdateProductDto,
} from '../types/catalog';

// ─── Sanitización ─────────────────────────────────────────────────────────────
const sanitizePlan    = (p: Plan):    Plan    => sanitizeObject(p, ['name']);
const sanitizeProduct = (p: Product): Product => sanitizeObject(p, ['name']);

// ─── Plans CRUD ───────────────────────────────────────────────────────────────

export async function getPlans(): Promise<Plan[]> {
  const data = await apiClient.get<Plan[]>('/api/v1/plans');
  return data.map(sanitizePlan);
}

export async function getPlan(id: string): Promise<Plan> {
  const data = await apiClient.get<Plan>(`/api/v1/plans/${id}`);
  return sanitizePlan(data);
}

export async function createPlan(dto: CreatePlanDto): Promise<Plan> {
  const data = await apiClient.post<Plan>('/api/v1/plans', dto);
  return sanitizePlan(data);
}

export async function updatePlan(id: string, dto: UpdatePlanDto): Promise<Plan> {
  const data = await apiClient.patch<Plan>(`/api/v1/plans/${id}`, dto);
  return sanitizePlan(data);
}

export async function deletePlan(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/plans/${id}`);
}

// ─── Products CRUD ────────────────────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  const data = await apiClient.get<Product[]>('/api/v1/products');
  return data.map(sanitizeProduct);
}

export async function getProduct(id: string): Promise<Product> {
  const data = await apiClient.get<Product>(`/api/v1/products/${id}`);
  return sanitizeProduct(data);
}

export async function createProduct(dto: CreateProductDto): Promise<Product> {
  const data = await apiClient.post<Product>('/api/v1/products', dto);
  return sanitizeProduct(data);
}

export async function updateProduct(id: string, dto: UpdateProductDto): Promise<Product> {
  const data = await apiClient.patch<Product>(`/api/v1/products/${id}`, dto);
  return sanitizeProduct(data);
}

export async function deleteProduct(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/products/${id}`);
}
