'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../services/review.service';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api/api.types';
import { reviewKeys } from '../utils/review.keys';
import type { CompletedDeal, CompletedDealPhoto, DealPhotoType } from '../types';

// ===== Types =====

export interface CreateDealData {
  car_make: string;
  car_model: string;
  car_year: number;
  car_vin?: string | null;
  auction_price: number;
  market_price: number;
  savings: number;
  delivery_city?: string | null;
  description?: string | null;
  is_published?: boolean;
  photos?: Omit<CompletedDealPhoto, 'id'>[];
}

export interface UpdateDealData {
  car_make?: string;
  car_model?: string;
  car_year?: number;
  car_vin?: string | null;
  auction_price?: number;
  market_price?: number;
  savings?: number;
  delivery_city?: string | null;
  description?: string | null;
  is_published?: boolean;
}

export interface AddDealPhotoData {
  url: string;
  alt_text?: string | null;
  photo_type: DealPhotoType;
  sort_order?: number;
}

// ===== Hooks =====

export const useCreateDeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDealData) => reviewService.createDeal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.deals() });
      toast.success('გარიგება წარმატებით დაემატა');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useUpdateDeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDealData }) =>
      reviewService.updateDeal(id, data),
    onSuccess: (updatedDeal: CompletedDeal) => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.dealDetail(updatedDeal.id) });
      queryClient.invalidateQueries({ queryKey: reviewKeys.deals() });
      toast.success('გარიგება წარმატებით განახლდა');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useDeleteDeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reviewService.deleteDeal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.deals() });
      toast.success('გარიგება წარმატებით წაიშალა');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useToggleDealPublished = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, is_published }: { id: string; is_published: boolean }) =>
      reviewService.updateDeal(id, { is_published }),
    onSuccess: (updatedDeal: CompletedDeal) => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.dealDetail(updatedDeal.id) });
      queryClient.invalidateQueries({ queryKey: reviewKeys.deals() });
      const message = updatedDeal.is_published
        ? 'გარიგება გამოქვეყნდა'
        : 'გარიგება დაიმალა';
      toast.success(message);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
