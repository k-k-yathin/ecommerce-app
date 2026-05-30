import api from './api';
import { Cart, CartItem } from '../types';

export const cartApi = {
  getCart: () => api.get<Cart>('/cart'),

  addItem: (productId: string, quantity: number) =>
    api.post<CartItem>('/cart', { productId, quantity }),

  updateQuantity: (itemId: string, quantity: number) =>
    api.put<CartItem>(`/cart/${itemId}`, { quantity }),

  removeItem: (itemId: string) => api.delete(`/cart/${itemId}`),
};
