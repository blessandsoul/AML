import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import type { UserRole } from '@/features/auth/types/auth.types';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireVerified?: boolean;
    allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({
    children,
    requireVerified = false,
    allowedRoles
}: ProtectedRouteProps) => {
    const location = useLocation();
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Redirect unverified users to the pending verification page if required
    if (requireVerified && !user?.emailVerified) {
        return <Navigate to="/verify-email-pending" replace />;
    }

    if (allowedRoles && user && !user.roles.some(role => allowedRoles.includes(role))) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
};
