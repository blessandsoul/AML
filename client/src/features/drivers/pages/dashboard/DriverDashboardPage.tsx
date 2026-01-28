import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DriverProfileTab } from './DriverProfileTab';
import { DriverLocationsTab } from './DriverLocationsTab';

export const DriverDashboardPage = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <div className="space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold tracking-tight">{t('driver.dashboard.title', 'Driver Dashboard')}</h1>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="profile">{t('driver.dashboard.profile', 'Profile')}</TabsTrigger>
                    <TabsTrigger value="locations">{t('driver.dashboard.locations', 'Locations')}</TabsTrigger>
                </TabsList>
                <TabsContent value="profile" className="mt-6">
                    <DriverProfileTab />
                </TabsContent>
                <TabsContent value="locations" className="mt-6">
                    <DriverLocationsTab />
                </TabsContent>
            </Tabs>
        </div>
    );
};
