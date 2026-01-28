import { apiClient } from '@/lib/api/axios.config';
import { API_ENDPOINTS } from '@/lib/constants/api-endpoints';
import type { ApiResponse } from '@/lib/api/api.types';
import type { CreateAgentFormData } from '../schemas/agent.schema';
import type {
    IGetTourAgentsResponse,
    IGetMyCompanyResponse,
    ICompany,
    IUpdateCompanyRequest,
    ICompanyMedia,
} from '../types/company.types';

interface CreateTourAgentResponse {
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        roles: string[];
    };
    temporaryPassword: string;
}

class CompanyService {
    async createTourAgent(data: CreateAgentFormData): Promise<CreateTourAgentResponse> {
        const response = await apiClient.post(API_ENDPOINTS.AUTH.CREATE_TOUR_AGENT, data);
        return response.data.data;
    }

    async getTourAgents(): Promise<IGetTourAgentsResponse> {
        const response = await apiClient.get<ApiResponse<IGetTourAgentsResponse>>('/auth/tour-agents');
        return response.data.data;
    }

    async getMyCompany(): Promise<IGetMyCompanyResponse> {
        const response = await apiClient.get<ApiResponse<IGetMyCompanyResponse>>(
            API_ENDPOINTS.COMPANIES.MY_COMPANY
        );
        return response.data.data;
    }

    async updateCompany(id: string, data: IUpdateCompanyRequest): Promise<ICompany> {
        const response = await apiClient.patch<ApiResponse<ICompany>>(
            API_ENDPOINTS.COMPANIES.UPDATE(id),
            data
        );
        return response.data.data;
    }

    async deleteCompany(id: string): Promise<void> {
        await apiClient.delete(API_ENDPOINTS.COMPANIES.DELETE(id));
    }

    // Photo management
    async getPhotos(id: string): Promise<ICompanyMedia[]> {
        const response = await apiClient.get<ApiResponse<ICompanyMedia[]>>(
            API_ENDPOINTS.COMPANIES.PHOTOS(id)
        );
        return response.data.data;
    }

    async uploadPhotos(id: string, files: File | File[]): Promise<ICompanyMedia[]> {
        const formData = new FormData();
        const fileList = Array.isArray(files) ? files : [files];

        fileList.forEach((file) => {
            formData.append('file', file);
        });

        const response = await apiClient.post<ApiResponse<ICompanyMedia[]>>(
            API_ENDPOINTS.COMPANIES.PHOTOS(id),
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data.data;
    }

    async deletePhoto(id: string, photoId: string): Promise<void> {
        await apiClient.delete(API_ENDPOINTS.COMPANIES.DELETE_PHOTO(id, photoId));
    }
}

export const companyService = new CompanyService();
