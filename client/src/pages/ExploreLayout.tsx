import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ExploreHero } from '../features/tours/components/ExploreHero';
import { EntityTypeTabs, type EntityType } from '../features/tours/components/EntityTypeTabs';
import { ExploreFilters } from '../features/tours/components/ExploreFilters';

/**
 * ExploreLayout - Shared layout for /explore/* routes
 * Contains the hero section, tabs, and persistant sidebar filters
 */
export const ExploreLayout = () => {
    const location = useLocation();

    // Scroll to top on route change (including pagination/filters)
    useEffect(() => {
        window.scrollTo({ top: 400, behavior: 'smooth' });
    }, [location.pathname, location.search]);

    // Determine current type from URL path for the filters
    const pathParts = location.pathname.split('/');
    // e.g. /explore/tours -> parts=["", "explore", "tours"]
    const currentType: EntityType = (pathParts[2] as EntityType) || 'tours';

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
            <ExploreHero />

            <div className="container mx-auto px-4 pt-6">
                <EntityTypeTabs />
            </div>

            <div className="container mx-auto py-8 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                    {/* Sidebar Filters - Persistent across sub-routes */}
                    <div className="lg:col-span-1 hidden lg:block">
                        <ExploreFilters type={currentType} />
                    </div>

                    {/* Main Content Area */}
                    <Outlet />
                </div>
            </div>
        </div>
    );
};
