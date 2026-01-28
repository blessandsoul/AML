import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getErrorMessage } from '@/lib/utils/error';

interface ErrorMessageProps {
    error: unknown;
    title?: string;
    className?: string;
}

export const ErrorMessage = ({ error, title = 'Error', className }: ErrorMessageProps) => {
    return (
        <Alert variant="destructive" className={className}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{getErrorMessage(error)}</AlertDescription>
        </Alert>
    );
};
