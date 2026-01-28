import { NavLink, Outlet } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { ROUTES } from '@/lib/constants/routes';
import { useAuth } from '@/features/auth/hooks/useAuth';

export const InquiriesLayout = () => {
  const { user } = useAuth();

  // Check if user is a service provider (can receive inquiries)
  const isServiceProvider =
    user?.roles.includes('GUIDE') ||
    user?.roles.includes('DRIVER') ||
    user?.roles.includes('COMPANY');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Inquiries</h1>
        <p className="text-muted-foreground">Manage your inquiries and communications</p>
      </div>

      <div className="border-b">
        <nav className="flex gap-4">
          <NavLink
            to={ROUTES.INQUIRIES.SENT}
            className={({ isActive }) =>
              cn(
                'pb-2 px-1 text-sm font-medium border-b-2 transition-colors',
                isActive
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )
            }
          >
            Sent
          </NavLink>
          {isServiceProvider && (
            <NavLink
              to={ROUTES.INQUIRIES.RECEIVED}
              className={({ isActive }) =>
                cn(
                  'pb-2 px-1 text-sm font-medium border-b-2 transition-colors',
                  isActive
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )
              }
            >
              Received
            </NavLink>
          )}
        </nav>
      </div>

      <Outlet />
    </div>
  );
};
