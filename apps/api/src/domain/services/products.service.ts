import { ApiError } from '../errors/apiError';
import type { Product } from '../models/types';
import {
  productsRepository,
  type CreateProductInput,
  type UpdateProductInput,
} from '../../infra/repositories/products.repo';

const notFoundError = (id: string) =>
  new ApiError(404, 'Not Found', `No existe producto con id ${id}`, 'urn:telecom:error:product-not-found');

export const productsService = {
  listProducts(): Product[] {
    return productsRepository.listAll();
  },

  getProductById(id: string): Product {
    const product = productsRepository.findById(id);
    if (!product) {
      throw notFoundError(id);
    }

    return product;
  },

  createProduct(input: CreateProductInput): Product {
    return productsRepository.create(input);
  },

  updateProduct(id: string, input: UpdateProductInput): Product {
    const updated = productsRepository.update(id, input);
    if (!updated) {
      throw notFoundError(id);
    }

    return updated;
  },

  deleteProduct(id: string): void {
    const deleted = productsRepository.delete(id);
    if (!deleted) {
      throw notFoundError(id);
    }
  },
};
