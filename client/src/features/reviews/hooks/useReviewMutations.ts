'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../services/review.service';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api/api.types';
import { reviewKeys } from '../utils/review.keys';
import type { Review, CreateReviewData, UpdateReviewData } from '../types';

// ===== Hooks =====

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewData) => {
      // Transform flat CreateReviewData to Review structure
      const reviewData: Partial<Review> = {
        customerName: data.customerName,
        customerCity: data.customerCity || null,
        customerAvatar: null,
        rating: data.rating,
        text: data.text,
        car: data.carMake && data.carModel && data.carYear
          ? { make: data.carMake, model: data.carModel, year: data.carYear }
          : null,
        isVerified: false,
        isPublished: false,
        photos: [],
      };
      return reviewService.createReview(reviewData);
    },
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
    mutationFn: ({ id, data }: { id: string; data: UpdateReviewData }) => {
      // Transform flat UpdateReviewData to Review structure
      const reviewData: Partial<Review> = {};

      if (data.customerName !== undefined) reviewData.customerName = data.customerName;
      if (data.customerCity !== undefined) reviewData.customerCity = data.customerCity;
      if (data.rating !== undefined) reviewData.rating = data.rating;
      if (data.text !== undefined) reviewData.text = data.text;
      if (data.isPublished !== undefined) reviewData.isPublished = data.isPublished;

      return reviewService.updateReview(id, reviewData);
    },
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
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      reviewService.updateReview(id, { isPublished }),
    onSuccess: (updatedReview: Review) => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.detail(updatedReview.id) });
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
      const message = updatedReview.isPublished
        ? 'მიმოხილვა გამოქვეყნდა'
        : 'მიმოხილვა დაიმალა';
      toast.success(message);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
