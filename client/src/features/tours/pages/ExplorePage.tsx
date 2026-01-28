import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ExploreHero } from '../components/ExploreHero';
import { ExploreFilters } from '../components/ExploreFilters';
import { EntityTypeTabs, type EntityType } from '../components/EntityTypeTabs';
import { TourCard } from '../components/TourCard';
import { Pagination } from '@/components/common/Pagination';
import { useTours } from '../hooks/useTours';
import type { TourFilters } from '../types/tour.types';

export const ExplorePage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Get entity type from URL (default to 'tours')
    const entityType = (searchParams.get('type') as EntityType) || 'tours';

    // Get page from URL (default to 1)
    const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);

    const [filters, setFilters] = useState<TourFilters>({});

    // Handler to update page in URL
    const handlePageChange = useCallback((newPage: number) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set('page', newPage.toString());
            newParams.set('type', entityType);
            return newParams;
        });
    }, [setSearchParams, entityType]);

    // Handler for filter changes
    const handleFiltersChange = useCallback((newFilters: TourFilters) => {
        setFilters(newFilters);
    }, []);

    // Fetch tours with current URL parameters
    const { data, isLoading, error } = useTours({
        page: pageFromUrl,
        limit: 12,
        ...filters
    });

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
            <ExploreHero />

            <div className="container mx-auto px-4 pt-6">
                <EntityTypeTabs />
            </div>

            <div className="container mx-auto py-8 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                    {/* Sidebar Filters */}
                    <div className="lg:col-span-1">
                        <ExploreFilters filters={filters} onFiltersChange={handleFiltersChange} />
                    </div>

                    {/* Main Content (Cards) */}
                    <div className="lg:col-span-3">
                        {entityType === 'tours' ? (
                            <>
                                {isLoading && (
                                    <div className="flex items-center justify-center min-h-[400px]">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                    </div>
                                )}

                                {error && (
                                    <div className="flex items-center justify-center min-h-[400px]">
                                        <div className="text-center">
                                            <p className="text-red-500 dark:text-red-400 mb-2">Failed to load tours</p>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                                {error instanceof Error ? error.message : 'Unknown error'}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {data && !isLoading && (
                                    <>
                                        {data.items.length === 0 ? (
                                            <div className="flex items-center justify-center min-h-[400px]">
                                                <div className="text-center">
                                                    <p className="text-gray-600 dark:text-gray-400 text-lg">No tours found</p>
                                                    <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                                                        Try adjusting your filters
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    {data.items.map((tour) => (
                                                        <TourCard
                                                            key={tour.id}
                                                            tour={tour}
                                                            onFavorite={(id) => console.log('Toggle favorite', id)}
                                                        />
                                                    ))}
                                                </div>

                                                {data.pagination.totalPages > 1 && (
                                                    <Pagination
                                                        page={data.pagination.page}
                                                        totalPages={data.pagination.totalPages}
                                                        hasNextPage={data.pagination.hasNextPage}
                                                        hasPreviousPage={data.pagination.hasPreviousPage}
                                                        onChange={handlePageChange}
                                                    />
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="flex items-center justify-center min-h-[400px]">
                                <div className="text-center">
                                    <p className="text-gray-600 dark:text-gray-400 text-lg">Coming Soon</p>
                                    <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                                        {entityType.charAt(0).toUpperCase() + entityType.slice(1)} are not available yet
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
