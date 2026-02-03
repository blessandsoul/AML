import { apiClient } from '@/lib/api/axios.config';
import type { ApiResponse, PaginatedResponse } from '@/lib/api/api.types';
import type {
  Review,
  CompletedDeal,
  AggregateRating,
  ReviewFilters,
  DealFilters,
} from '../types';

const BASE_URL = '/api/v1/reviews';

class ReviewService {
  // ===== PUBLIC =====

  async getReviews(params: ReviewFilters = {}) {
    const response = await apiClient.get<PaginatedResponse<Review>>(BASE_URL, { params });
    return response.data.data;
  }

  async getAggregateRating() {
    const response = await apiClient.get<ApiResponse<AggregateRating>>(`${BASE_URL}/aggregate`);
    return response.data.data;
  }

  async getDeals(params: DealFilters = {}) {
    const response = await apiClient.get<PaginatedResponse<CompletedDeal>>(`${BASE_URL}/deals`, { params });
    return response.data.data;
  }

  // ===== ADMIN =====

  async getAdminReviews(params: ReviewFilters = {}) {
    const response = await apiClient.get<PaginatedResponse<Review>>(`${BASE_URL}/admin/reviews`, { params });
    return response.data.data;
  }

  async getReviewById(id: string) {
    const response = await apiClient.get<ApiResponse<Review>>(`${BASE_URL}/admin/reviews/${id}`);
    return response.data.data;
  }

  async createReview(data: Partial<Review>) {
    const response = await apiClient.post<ApiResponse<Review>>(`${BASE_URL}/admin/reviews`, data);
    return response.data.data;
  }

  async updateReview(id: string, data: Partial<Review>) {
    const response = await apiClient.patch<ApiResponse<Review>>(`${BASE_URL}/admin/reviews/${id}`, data);
    return response.data.data;
  }

  async deleteReview(id: string) {
    const response = await apiClient.delete<ApiResponse<null>>(`${BASE_URL}/admin/reviews/${id}`);
    return response.data.data;
  }

  async getAdminDeals(params: DealFilters = {}) {
    const response = await apiClient.get<PaginatedResponse<CompletedDeal>>(`${BASE_URL}/admin/deals`, { params });
    return response.data.data;
  }

  async getDealById(id: string) {
    const response = await apiClient.get<ApiResponse<CompletedDeal>>(`${BASE_URL}/admin/deals/${id}`);
    return response.data.data;
  }

  async createDeal(data: Partial<CompletedDeal>) {
    const response = await apiClient.post<ApiResponse<CompletedDeal>>(`${BASE_URL}/admin/deals`, data);
    return response.data.data;
  }

  async updateDeal(id: string, data: Partial<CompletedDeal>) {
    const response = await apiClient.patch<ApiResponse<CompletedDeal>>(`${BASE_URL}/admin/deals/${id}`, data);
    return response.data.data;
  }

  async deleteDeal(id: string) {
    const response = await apiClient.delete<ApiResponse<null>>(`${BASE_URL}/admin/deals/${id}`);
    return response.data.data;
  }
}

export const reviewService = new ReviewService();
