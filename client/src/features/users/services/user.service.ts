import { apiClient } from '@/lib/api/axios.config';
import type { PaginatedApiResponse, PaginationParams, ApiResponse } from '@/lib/api/api.types';
import type { IUser } from '@/features/auth/types/auth.types';

class UserService {

    async getAllUsers(params: PaginationParams) {
        const response = await apiClient.get<PaginatedApiResponse<IUser>>('/users', { params });
        return response.data.data;
    }

    async getUser(id: string) {
        const response = await apiClient.get<ApiResponse<{ user: IUser }>>(`/users/${id}`);
        return response.data.data.user;
    }

    async updateUser(userId: string, data: Partial<IUser>) {
        const response = await apiClient.patch<{ success: boolean; data: IUser }>(`/users/${userId}`, data);
        return response.data.data;
    }

    async updateUserRole(userId: string, role: string) {
        const response = await apiClient.patch<{ success: boolean; data: IUser }>(`/users/${userId}/role`, { role });
        return response.data.data;
    }

    async removeUserRole(userId: string, role: string) {
        const response = await apiClient.delete<{ success: boolean; data: IUser }>(`/users/${userId}/roles/${role}`);
        return response.data.data;
    }

    async deleteUser(userId: string) {
        await apiClient.delete(`/users/${userId}`);
    }
}

export const userService = new UserService();
