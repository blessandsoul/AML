import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { locationService } from '../services/location.service';
import { getErrorMessage } from '@/lib/utils/error';
import type { LocationFilters, CreateLocationInput, UpdateLocationInput } from '../types/location.types';

interface UseLocationsParams extends LocationFilters {
  page?: number;
  limit?: number;
}

export const useLocations = (params: UseLocationsParams = {}) => {
  return useQuery({
    queryKey: ['locations', params],
    queryFn: () => locationService.getLocations(params),
    staleTime: 10 * 60 * 1000, // 10 minutes - locations don't change often
  });
};

export const useLocation = (id: string) => {
  return useQuery({
    queryKey: ['location', id],
    queryFn: () => locationService.getLocation(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreateLocation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: CreateLocationInput) => locationService.createLocation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success(t('admin.locations.create_success', 'Location created successfully!'));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLocationInput }) =>
      locationService.updateLocation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success(t('admin.locations.update_success', 'Location updated successfully!'));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: string) => locationService.deleteLocation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success(t('admin.locations.delete_success', 'Location deleted successfully!'));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
