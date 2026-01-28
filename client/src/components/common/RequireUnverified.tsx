import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { ROUTES } from '@/lib/constants/routes';

interface RequireUnverifiedProps {
    children: React.ReactNode;
}

/**
 * Wrapper component that ensures only unverified users can access a route
 * Redirects verified users to home page
 * Redirects unauthenticated users to login page
 */
export const RequireUnverified = ({ children }: RequireUnverifiedProps) => {
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    // If email is already verified, redirect to home
    if (user?.emailVerified) {
        return <Navigate to={ROUTES.HOME} replace />;
    }

    // User is authenticated but not verified - allow access
    return <>{children}</>;
};
