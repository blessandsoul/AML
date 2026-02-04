'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../services/review.service';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api/api.types';
import { reviewKeys } from '../utils/review.keys';
import type { CompletedDeal, CreateDealData, UpdateDealData } from '../types';

// ===== Hooks =====

export const useCreateDeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDealData) => {
      // Transform flat CreateDealData to CompletedDeal structure
      const dealData: Partial<CompletedDeal> = {
        car: {
          make: data.carMake,
          model: data.carModel,
          year: data.carYear,
        },
        pricing: {
          auctionPrice: data.auctionPrice,
          marketPrice: data.marketPrice,
          savings: data.marketPrice - data.auctionPrice,
        },
        deliveryCity: data.deliveryCity || null,
        description: data.description || null,
        isPublished: false,
        photos: [],
      };
      return reviewService.createDeal(dealData);
    },
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
    mutationFn: ({ id, data }: { id: string; data: UpdateDealData }) => {
      // Transform flat UpdateDealData to CompletedDeal structure
      const dealData: Partial<CompletedDeal> = {};

      if (data.carMake || data.carModel || data.carYear) {
        dealData.car = {
          make: data.carMake || '',
          model: data.carModel || '',
          year: data.carYear || 0,
        };
      }

      if (data.auctionPrice !== undefined || data.marketPrice !== undefined) {
        dealData.pricing = {
          auctionPrice: data.auctionPrice || 0,
          marketPrice: data.marketPrice || 0,
          savings: (data.marketPrice || 0) - (data.auctionPrice || 0),
        };
      }

      if (data.deliveryCity !== undefined) dealData.deliveryCity = data.deliveryCity;
      if (data.description !== undefined) dealData.description = data.description;
      if (data.isPublished !== undefined) dealData.isPublished = data.isPublished;

      return reviewService.updateDeal(id, dealData);
    },
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
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      reviewService.updateDeal(id, { isPublished }),
    onSuccess: (updatedDeal: CompletedDeal) => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.dealDetail(updatedDeal.id) });
      queryClient.invalidateQueries({ queryKey: reviewKeys.deals() });
      const message = updatedDeal.isPublished
        ? 'გარიგება გამოქვეყნდა'
        : 'გარიგება დაიმალა';
      toast.success(message);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
