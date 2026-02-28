import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import type { Product, ProductCategory } from '../../domain/models/types';

export interface CreateProductInput {
  name: string;
  category: ProductCategory;
  isSerialized: boolean;
}

export interface UpdateProductInput {
  name?: string;
  category?: ProductCategory;
  isSerialized?: boolean;
}

interface SeedData {
  products: Product[];
}

const seedPath = path.resolve(__dirname, '../../../../../scripts/seed-data.json');

const loadSeedProducts = (): Product[] => {
  const raw = fs.readFileSync(seedPath, 'utf-8');
  const data = JSON.parse(raw) as SeedData;
  return data.products;
};

const products: Product[] = loadSeedProducts();

export const productsRepository = {
  listAll(): Product[] {
    return products;
  },

  findById(id: string): Product | null {
    return products.find((product) => product.id === id) ?? null;
  },

  create(input: CreateProductInput): Product {
    const created: Product = {
      id: `prod_${randomUUID().slice(0, 8)}`,
      name: input.name,
      category: input.category,
      isSerialized: input.isSerialized,
    };

    products.push(created);
    return created;
  },

  update(id: string, input: UpdateProductInput): Product | null {
    const index = products.findIndex((product) => product.id === id);
    if (index === -1) {
      return null;
    }

    const updated: Product = {
      ...products[index],
      ...input,
    };

    products[index] = updated;
    return updated;
  },

  delete(id: string): boolean {
    const index = products.findIndex((product) => product.id === id);
    if (index === -1) {
      return false;
    }

    products.splice(index, 1);
    return true;
  },
};
