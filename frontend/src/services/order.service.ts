import api from './api';
import { Order, OrderStatus } from '../types';

export const orderApi = {
  create: () => api.post<Order>('/orders'),

  getUserOrders: () => api.get<Order[]>('/orders'),

  getById: (id: string) => api.get<Order>(`/orders/${id}`),

  getAllOrders: () => api.get<Order[]>('/orders/admin/all'),

  updateStatus: (id: string, status: OrderStatus) =>
    api.patch<Order>(`/orders/${id}/status`, { status }),
};
