import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const LoadingSpinner = ({ size = 'md', className }: LoadingSpinnerProps) => {
    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12'
    };

    return <Loader2 className={cn('animate-spin', sizes[size], className)} />;
};

export const LoadingPage = () => (
    <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
    </div>
);
