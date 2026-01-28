import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';
import { CompanyCard } from '../components/CompanyCard';
import { useCompanies } from '../hooks/useCompanies';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Pagination } from '@/components/common/Pagination';
import { AlertCircle } from 'lucide-react';

export const ExploreCompaniesPage = () => {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();

    // Get params from URL
    const page = parseInt(searchParams.get('page') || '1', 10);
    const search = searchParams.get('search') || undefined;
    const locationId = searchParams.get('locationId') || undefined;
    const sortBy = searchParams.get('sortBy') as any || undefined;
    const minRating = searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined;
    const hasActiveTours = searchParams.get('hasActiveTours') === 'true' ? true : undefined;

    const { data, isLoading, error } = useCompanies({
        page,
        limit: 12,
        search,
        locationId,
        sortBy,
        minRating,
        hasActiveTours
    });

    const companies = data?.items ?? [];


    // Handler to update page in URL
    const handlePageChange = useCallback((newPage: number) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set('page', newPage.toString());
            // Ensure type is preserved if it exists, though typically managed by tabs
            return newParams;
        });
    }, [setSearchParams]);

    if (isLoading) {
        return (
            <div className="lg:col-span-3 w-full flex items-center justify-center min-h-[400px]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="lg:col-span-3 w-full flex flex-col items-center justify-center min-h-[400px] text-center">
                <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                <p className="text-muted-foreground">{t('common.error_loading')}</p>
            </div>
        );
    }

    return (
        <div className="lg:col-span-3 w-full animate-fade-in">


            {companies.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                    <p className="text-muted-foreground">{t('explore_page.no_companies')}</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {companies.map((company) => (
                            <CompanyCard key={company.id} company={company} />
                        ))}
                    </div>

                    {data?.pagination && data.pagination.totalPages > 1 && (
                        <div className="mt-8">
                            <Pagination
                                page={data.pagination.page}
                                totalPages={data.pagination.totalPages}
                                hasNextPage={data.pagination.hasNextPage}
                                hasPreviousPage={data.pagination.hasPreviousPage}
                                onChange={handlePageChange}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
