import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ROUTES } from '@/lib/constants/routes';

export const OperationsLayout = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    // Determine default tab based on current path
    const currentTab = location.pathname.includes(ROUTES.OPERATIONS.TOURS)
        ? 'tours'
        : 'agents';

    const handleTabChange = (value: string) => {
        if (value === 'agents') {
            navigate(ROUTES.OPERATIONS.AGENTS);
        } else if (value === 'tours') {
            navigate(ROUTES.OPERATIONS.TOURS);
        }
    };

    const actionButton = currentTab === 'agents' ? {
        label: t('company.agents.add_new'),
        href: ROUTES.CREATE_AGENT
    } : {
        label: t('auth.create_tour'),
        href: ROUTES.TOURS.CREATE
    };

    return (
        <div className="container mx-auto px-4 space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    {t('company.operations.title')}
                </h1>

            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full sm:w-auto">
                    <TabsList>
                        <TabsTrigger value="agents">
                            {t('company.operations.tabs.agents', 'Agents')}
                        </TabsTrigger>
                        <TabsTrigger value="tours">
                            {t('company.operations.tabs.tours', 'Tours')}
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                <Link to={actionButton.href}>
                    <Button className="gap-2 shadow-sm">
                        <Plus className="h-4 w-4" />
                        {actionButton.label}
                    </Button>
                </Link>
            </div>

            <div className="mt-6">
                <Outlet />
            </div>
        </div>
    );
};
