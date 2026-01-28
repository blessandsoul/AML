import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { companyService } from '../services/company.service';
import { getErrorMessage } from '@/lib/utils/error';
import { ROUTES } from '@/lib/constants/routes';
import type { IUpdateCompanyRequest } from '../types/company.types';

export const useMyCompany = () => {
    return useQuery({
        queryKey: ['my-company'],
        queryFn: () => companyService.getMyCompany(),
        staleTime: 5 * 60 * 1000,
    });
};

export const useUpdateCompany = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: IUpdateCompanyRequest }) =>
            companyService.updateCompany(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-company'] });
            toast.success(t('company.update_success', 'Company updated successfully!'));
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });
};

export const useDeleteCompany = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: (id: string) => companyService.deleteCompany(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-company'] });
            toast.success(t('company.delete_success', 'Company deleted successfully!'));
            navigate(ROUTES.DASHBOARD);
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });
};

// Photo management hooks
export const useCompanyPhotos = (id: string) => {
    return useQuery({
        queryKey: ['company-photos', id],
        queryFn: () => companyService.getPhotos(id),
        enabled: !!id,
    });
};

export const useUploadCompanyPhotos = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: ({ id, files }: { id: string; files: File | File[] }) =>
            companyService.uploadPhotos(id, files),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['my-company'] });
            queryClient.invalidateQueries({ queryKey: ['company-photos', id] });
            toast.success(t('common.photo_uploaded', 'Photo uploaded successfully'));
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });
};

export const useDeleteCompanyPhoto = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: ({ id, photoId }: { id: string; photoId: string }) =>
            companyService.deletePhoto(id, photoId),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['my-company'] });
            queryClient.invalidateQueries({ queryKey: ['company-photos', id] });
            toast.success(t('common.photo_deleted', 'Photo deleted successfully'));
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });
};
