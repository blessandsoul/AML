import { apiClient } from '@/lib/api/axios.config';
import type { ApiResponse, PaginatedResponse } from '@/lib/api/api.types';
import type { Order, OrderFilters } from '../types';

const BASE_URL = '/api/v1/orders';

class OrderService {
  // ===== PUBLIC =====

  async trackOrder(code: string) {
    const response = await apiClient.get<ApiResponse<Order>>(`${BASE_URL}/track/${code}`);
    return response.data.data;
  }

  // ===== ADMIN =====

  async getOrders(params: OrderFilters = {}) {
    const response = await apiClient.get<PaginatedResponse<Order>>(`${BASE_URL}/admin/orders`, { params });
    return response.data.data;
  }

  async getOrderById(id: string) {
    const response = await apiClient.get<ApiResponse<Order>>(`${BASE_URL}/admin/orders/${id}`);
    return response.data.data;
  }

  async createOrder(data: Partial<Order>) {
    const response = await apiClient.post<ApiResponse<Order>>(`${BASE_URL}/admin/orders`, data);
    return response.data.data;
  }

  async updateOrder(id: string, data: Partial<Order>) {
    const response = await apiClient.patch<ApiResponse<Order>>(`${BASE_URL}/admin/orders/${id}`, data);
    return response.data.data;
  }

  async updateOrderStatus(id: string, data: { status: string; note?: string; location?: string; changed_by?: string }) {
    const response = await apiClient.patch<ApiResponse<Order>>(`${BASE_URL}/admin/orders/${id}/status`, data);
    return response.data.data;
  }

  async deleteOrder(id: string) {
    const response = await apiClient.delete<ApiResponse<null>>(`${BASE_URL}/admin/orders/${id}`);
    return response.data.data;
  }
}

export const orderService = new OrderService();
