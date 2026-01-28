import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserPlus } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ROUTES } from '@/lib/constants/routes';
import { CreateAgentForm } from '../components/CreateAgentForm';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export const CreateAgentPage = () => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate(ROUTES.LOGIN);
        } else if (!user?.roles?.includes('COMPANY')) {
            navigate(ROUTES.HOME);
        }
    }, [isAuthenticated, user, navigate]);

    if (!isAuthenticated || !user?.roles?.includes('COMPANY')) {
        return null;
    }

    return (
        <div className="max-w-4xl space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight">{t('auth.create_agent')}</h2>
                <p className="text-muted-foreground">
                    {t('auth.create_agent_desc')}
                </p>
            </div>

            {/* Main Content */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <UserPlus className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle>{t('auth.create_agent')}</CardTitle>
                            <CardDescription>
                                {t('auth.create_agent_form_desc')}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <CreateAgentForm />
                </CardContent>
            </Card>
        </div>
    );
};
