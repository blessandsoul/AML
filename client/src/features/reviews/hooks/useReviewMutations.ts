'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../services/review.service';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api/api.types';
import { reviewKeys } from '../utils/review.keys';
import type { Review, ReviewPhoto } from '../types';

// ===== Types =====

export interface CreateReviewData {
  customer_name: string;
  customer_city?: string | null;
  customer_avatar?: string | null;
  rating: number;
  text: string;
  car_make?: string | null;
  car_model?: string | null;
  car_year?: number | null;
  is_verified?: boolean;
  is_published?: boolean;
  photos?: Omit<ReviewPhoto, 'id'>[];
}

export interface UpdateReviewData {
  customer_name?: string;
  customer_city?: string | null;
  customer_avatar?: string | null;
  rating?: number;
  text?: string;
  car_make?: string | null;
  car_model?: string | null;
  car_year?: number | null;
  is_verified?: boolean;
  is_published?: boolean;
}

// ===== Hooks =====

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewData) => reviewService.createReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      toast.success('მიმოხილვა წარმატებით დაემატა');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReviewData }) =>
      reviewService.updateReview(id, data),
    onSuccess: (updatedReview: Review) => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.detail(updatedReview.id) });
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
      queryClient.invalidateQueries({ queryKey: reviewKeys.aggregate() });
      toast.success('მიმოხილვა წარმატებით განახლდა');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reviewService.deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      toast.success('მიმოხილვა წარმატებით წაიშალა');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useToggleReviewPublished = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, is_published }: { id: string; is_published: boolean }) =>
      reviewService.updateReview(id, { is_published }),
    onSuccess: (updatedReview: Review) => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.detail(updatedReview.id) });
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
      const message = updatedReview.is_published
        ? 'მიმოხილვა გამოქვეყნდა'
        : 'მიმოხილვა დაიმალა';
      toast.success(message);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
