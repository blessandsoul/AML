import { useParams, useNavigate } from 'react-router-dom';
import { useTour } from '@/features/tours/hooks/useTours';
import { TourHeader } from '../components/TourHeader';
import { TourGallery } from '../components/TourGallery';
import { TourSidebar } from '../components/TourSidebar';
import { TourInfo } from '../components/TourInfo';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

const TourDetailsContent = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: tour, isLoading, error } = useTour(id!);

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error || !tour) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
                <h2 className="text-2xl font-bold">Tour not found</h2>
                <p className="text-muted-foreground">The tour you are looking for does not exist or has been removed.</p>
                <Button variant="outline" onClick={() => navigate('/explore/tours')}>
                    Back to Tours
                </Button>
            </div>
        );
    }

    const handleBook = () => {
        // Placeholder for booking logic
        console.log('Book clicked', tour.id);
        // Could navigate to a booking page or open modal
    };

    return (
        <div className="container mx-auto py-8 mt-24 px-4 md:px-6 animation-fade-in">
            {/* Back Button */}
            <Button
                variant="ghost"
                size="sm"
                className="mb-6 hover:bg-transparent hover:text-primary pl-0"
                onClick={() => navigate(-1)}
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
            </Button>

            {/* Header */}
            <TourHeader tour={tour} />

            {/* Gallery */}
            <TourGallery images={tour.images} className="mt-6 md:mt-8" />

            {/* Main Content Grid */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                {/* Left Column: Info, Desc, etc. */}
                <div className="lg:col-span-2">
                    <TourInfo tour={tour} />
                </div>

                {/* Right Column: Sidebar */}
                <div className="lg:col-span-1">
                    <TourSidebar tour={tour} onBook={handleBook} />
                </div>
            </div>
        </div>
    );
};

export const TourDetailsPage = () => {
    // Wrap in ErrorBoundary to catch layout errors
    return (
        <ErrorBoundary>
            <TourDetailsContent />
        </ErrorBoundary>
    );
};
