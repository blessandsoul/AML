import { useQuery } from '@tanstack/react-query';
import { companiesService } from '../services/companies.service';
import type { CompaniesResponse, CompanyFilters } from '../types/company.types';

export interface UseCompaniesParams extends CompanyFilters {
    page?: number;
    limit?: number;
}

export const useCompanies = (params: UseCompaniesParams = {}) => {
    return useQuery<CompaniesResponse>({
        queryKey: ['companies', params],
        queryFn: () => companiesService.getCompanies(params),
        staleTime: 5 * 60 * 1000,
    });
};

export const useCompany = (id: string) => {
    return useQuery({
        queryKey: ['company', id],
        queryFn: () => companiesService.getCompany(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};
