import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ROUTES } from '@/lib/constants/routes';

export const AdminLayout = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    // Determine default tab based on current path
    const currentTab = location.pathname.includes(ROUTES.ADMIN.USERS)
        ? 'users'
        : location.pathname.includes(ROUTES.ADMIN.LOCATIONS)
            ? 'locations'
            : 'locations';

    const handleTabChange = (value: string) => {
        if (value === 'locations') {
            navigate(ROUTES.ADMIN.LOCATIONS);
        } else if (value === 'users') {
            navigate(ROUTES.ADMIN.USERS);
        }
    };

    return (
        <div className="container mx-auto px-4 space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    {t('admin.title', 'Admin Panel')}
                </h1>
                <p className="text-muted-foreground">
                    {t('admin.subtitle', 'Manage system settings and data.')}
                </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full sm:w-auto">
                    <TabsList>
                        <TabsTrigger value="locations">
                            {t('admin.tabs.locations', 'Locations')}
                        </TabsTrigger>
                        <TabsTrigger value="users">
                            {t('admin.tabs.users', 'Users')}
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="mt-6">
                <Outlet />
            </div>
        </div>
    );
};
