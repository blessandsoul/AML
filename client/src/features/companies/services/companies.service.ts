import { apiClient } from '@/lib/api/axios.config';
import { API_ENDPOINTS } from '@/lib/constants/api-endpoints';
import type { Company, CompaniesResponse, CompanyFilters } from '../types/company.types';

class CompaniesService {
    async getCompanies(params: CompanyFilters = {}): Promise<CompaniesResponse> {
        const response = await apiClient.get<{
            success: boolean;
            message: string;
            data: CompaniesResponse;
        }>(API_ENDPOINTS.COMPANIES.LIST, { params });

        return response.data.data;
    }

    async getCompany(id: string): Promise<Company> {
        const response = await apiClient.get<{
            success: boolean;
            message: string;
            data: Company;
        }>(API_ENDPOINTS.COMPANIES.GET(id));

        return response.data.data;
    }
}

export const companiesService = new CompaniesService();
