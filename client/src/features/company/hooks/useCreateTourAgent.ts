import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { companyService } from '../services/company.service';
import { getErrorMessage } from '@/lib/utils/error';
import type { CreateAgentFormData } from '../schemas/agent.schema';

export const useCreateTourAgent = () => {

    return useMutation({
        mutationFn: (data: CreateAgentFormData) => companyService.createTourAgent(data),
        onSuccess: (response) => {
            toast.success('Tour agent created successfully!', {
                description: `Temporary password: ${response.temporaryPassword}`,
                duration: 10000, // Show for 10 seconds so user can copy
            });
            // Optionally navigate somewhere or refresh list
            // navigate(ROUTES.PROFILE);
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });
};
