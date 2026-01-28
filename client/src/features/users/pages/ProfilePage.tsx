import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileGeneral } from '../components/ProfileGeneral';
import { ProfileSecurity } from '../components/ProfileSecurity';
import { Loader2 } from 'lucide-react';

export const ProfilePage = () => {
    const { t } = useTranslation();
    const { data: user, isLoading, error } = useCurrentUser();
    const [activeTab, setActiveTab] = useState('general');

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="flex h-[50vh] items-center justify-center flex-col gap-2">
                <h2 className="text-xl font-semibold">Failed to load profile</h2>
                <p className="text-muted-foreground text-sm">Please try again later</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl space-y-8 animate-fade-in">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">{t('profile.title')}</h2>
                <p className="text-muted-foreground">
                    {t('profile.subtitle')}
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList>
                    <TabsTrigger value="general">{t('profile.tabs.general')}</TabsTrigger>
                    <TabsTrigger value="security">{t('profile.tabs.security')}</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6">
                    <ProfileGeneral user={user} />
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                    <ProfileSecurity user={user} />
                </TabsContent>
            </Tabs>
        </div>
    );
};
