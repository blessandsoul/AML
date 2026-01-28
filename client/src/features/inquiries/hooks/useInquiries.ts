import { useQuery } from '@tanstack/react-query';
import { inquiryService } from '../services/inquiry.service';
import type { InquiryFilters } from '../types/inquiry.types';

export const useSentInquiries = (filters: InquiryFilters = {}) => {
  return useQuery({
    queryKey: ['inquiries', 'sent', filters],
    queryFn: () => inquiryService.getSentInquiries(filters),
  });
};

export const useReceivedInquiries = (filters: InquiryFilters = {}) => {
  return useQuery({
    queryKey: ['inquiries', 'received', filters],
    queryFn: () => inquiryService.getReceivedInquiries(filters),
  });
};

export const useInquiry = (id: string) => {
  return useQuery({
    queryKey: ['inquiry', id],
    queryFn: () => inquiryService.getInquiry(id),
    enabled: !!id,
  });
};
