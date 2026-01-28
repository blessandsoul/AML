import { useAuth } from '@/features/auth/hooks/useAuth';
import { useTranslation } from 'react-i18next';

export const DashboardPage = () => {
    const { user } = useAuth();
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
                <p className="text-muted-foreground">
                    {t('dashboard.welcome_user', { name: user?.firstName })}
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="flex flex-col space-y-1.5 ">
                        <h3 className="font-semibold leading-none tracking-tight">{t('dashboard.overview')}</h3>
                        <p className="text-sm text-muted-foreground">{t('dashboard.activity_summary')}</p>
                    </div>
                    <div className="p-6 pt-0">
                        {/* Content placeholder */}
                        <div className="h-[100px] flex items-center justify-center text-muted-foreground text-sm border-2 border-dashed rounded-lg mt-4">
                            {t('dashboard.content_soon')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
