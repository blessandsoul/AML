import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { store } from '@/store';
import { queryClient } from '@/lib/api/query-client';

import { LoadingProvider } from '@/context/LoadingContext';
import { WebSocketProvider } from '@/context/WebSocketContext';
import { PageLoader } from '@/components/common/PageLoader';
import { AuthInitializer } from '@/features/auth/components/AuthInitializer';
import { NotificationInitializer } from '@/features/notifications/components/NotificationInitializer';

interface ProvidersProps {
    children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => (
    <Provider store={store}>
        <QueryClientProvider client={queryClient}>
            <WebSocketProvider>
                <LoadingProvider>
                    <AuthInitializer />
                    <NotificationInitializer />
                    {children}
                    <PageLoader />
                    <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
                </LoadingProvider>
            </WebSocketProvider>
        </QueryClientProvider>
    </Provider>
);

