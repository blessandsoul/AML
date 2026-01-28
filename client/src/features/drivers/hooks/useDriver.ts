import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { driversService } from '../services/drivers.service';
import { getErrorMessage } from '@/lib/utils/error';
import { ROUTES } from '@/lib/constants/routes';
import type { Driver } from '../types/driver.types';

export const useMyDriver = () => {
    return useQuery({
        queryKey: ['my-driver'],
        queryFn: () => driversService.getMyDriver(),
        staleTime: 5 * 60 * 1000,
    });
};

export const useUpdateDriver = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Driver> }) =>
            driversService.updateDriver(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-driver'] });
            toast.success(t('common.saved_successfully', 'Saved successfully'));
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });
};

export const useDeleteDriver = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: (id: string) => driversService.deleteDriver(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-driver'] });
            toast.success(t('common.deleted_successfully', 'Deleted successfully'));
            navigate(ROUTES.DASHBOARD);
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });
};

// Photo management hooks
export const useDriverPhotos = (id: string) => {
    return useQuery({
        queryKey: ['driver-photos', id],
        queryFn: () => driversService.getPhotos(id),
        enabled: !!id,
    });
};

export const useUploadDriverPhotos = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: ({ id, files }: { id: string; files: File | File[] }) =>
            driversService.uploadPhotos(id, files),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['my-driver'] });
            queryClient.invalidateQueries({ queryKey: ['driver-photos', id] });
            toast.success(t('common.photo_uploaded', 'Photo uploaded successfully'));
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });
};

export const useDeleteDriverPhoto = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: ({ id, photoId }: { id: string; photoId: string }) =>
            driversService.deletePhoto(id, photoId),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['my-driver'] });
            queryClient.invalidateQueries({ queryKey: ['driver-photos', id] });
            toast.success(t('common.photo_deleted', 'Photo deleted successfully'));
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });
};
