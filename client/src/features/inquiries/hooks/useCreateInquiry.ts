import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { inquiryService } from '../services/inquiry.service';
import { ROUTES } from '@/lib/constants/routes';
import type { CreateInquiryInput } from '../types/inquiry.types';

export const useCreateInquiry = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateInquiryInput) => inquiryService.createInquiry(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
      toast.success(response.message || 'Inquiry sent successfully');
      navigate(ROUTES.INQUIRIES.SENT);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to send inquiry');
    },
  });
};
