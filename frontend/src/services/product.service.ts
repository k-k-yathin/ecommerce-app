import api from './api';
import { Product, ProductsResponse } from '../types';

export interface ProductFilters {
  search?: string;
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
}

export const productApi = {
  getAll: (filters: ProductFilters = {}) =>
    api.get<ProductsResponse>('/products', {
      params: {
        ...filters,
        page: filters.page?.toString(),
        limit: filters.limit?.toString(),
        minPrice: filters.minPrice?.toString(),
        maxPrice: filters.maxPrice?.toString(),
      },
    }),

  getById: (id: string) => api.get<Product>(`/products/${id}`),

  create: (data: Omit<Product, 'id'>) => api.post<Product>('/products', data),

  update: (id: string, data: Partial<Product>) =>
    api.put<Product>(`/products/${id}`, data),

  delete: (id: string) => api.delete(`/products/${id}`),
};
