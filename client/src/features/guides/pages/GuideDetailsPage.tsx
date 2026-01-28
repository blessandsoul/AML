import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { useGuide } from '../hooks/useGuides';
import { GuideHeader } from '../components/GuideHeader';
import { GuideInfo } from '../components/GuideInfo';
import { GuideSidebar } from '../components/GuideSidebar';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

const GuideDetailsContent = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { data: guide, isLoading, error } = useGuide(id!);

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error || !guide) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center px-4">
                <h2 className="text-2xl font-bold text-foreground">
                    {t('guide_details.not_found_title', 'Guide not found')}
                </h2>
                <p className="text-muted-foreground max-w-md">
                    {t('guide_details.not_found_desc', 'The guide you are looking for does not exist or has been removed.')}
                </p>
                <Button variant="outline" onClick={() => navigate('/explore/guides')}>
                    {t('guide_details.back_to_guides', 'Back to Guides')}
                </Button>
            </div>
        );
    }

    const handleBook = () => {
        // TODO: Implement booking logic
        console.log('Book guide:', guide.id);
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Hero Background */}
            <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
                <div className="absolute inset-0 bg-gray-900">
                    <img
                        src="https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=1920&q=80"
                        alt="Background"
                        className="w-full h-full object-cover opacity-60"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-background" />
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 md:px-6 -mt-32 relative z-10">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="mb-6 bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm border border-white/10 rounded-full px-4"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t('common.back', 'Back')}
                </Button>

                {/* Header Card */}
                <GuideHeader guide={guide} />

                {/* Content Grid */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <GuideInfo guide={guide} />
                    </div>

                    {/* Desktop Sidebar */}
                    <div className="hidden lg:block lg:col-span-1">
                        <div className="sticky top-24">
                            <GuideSidebar guide={guide} onBook={handleBook} />
                        </div>
                    </div>
                </div>

                {/* Mobile Sticky Footer */}
                <div className="lg:hidden">
                    <GuideSidebar guide={guide} onBook={handleBook} />
                </div>
            </div>
        </div>
    );
};

export const GuideDetailsPage = () => {
    return (
        <ErrorBoundary>
            <GuideDetailsContent />
        </ErrorBoundary>
    );
};
