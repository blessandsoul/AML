import { notFound } from 'next/navigation';
import { MOCK_CARS } from '@/features/catalog/data/mock-cars';
import { CarGallery } from '@/features/catalog/components/CarGallery';
import { CarInfo } from '@/features/catalog/components/CarInfo';
import { SimilarCars } from '@/features/catalog/components/SimilarCars';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
    return MOCK_CARS.map((car) => ({
        id: car.id,
    }));
}

export default async function CarDetailsPage({ params }: PageProps) {
    const { id } = await params;
    const car = MOCK_CARS.find((c) => c.id === id);

    if (!car) {
        notFound();
    }

    // Use real images if available, otherwise fallback or mock
    const images = car.images && car.images.length > 0
        ? car.images
        : [car.image];

    return (
        <div className="min-h-screen bg-background text-foreground pt-24 md:pt-28 pb-12">
            <div className="container mx-auto px-4">
                {/* Breadcrumb / Back Navigation */}
                <div className="mb-6 flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild className="pl-0 hover:pl-2 transition-all text-muted-foreground hover:text-foreground">
                        <Link href="/catalog">
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            უკან კატალოგში
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column - Gallery */}
                    <div className="lg:col-span-8 space-y-8">
                        <CarGallery images={images} title={car.title} />

                        {/* Mobile Info (visible only on small screens if needed, otherwise stick to standard flow) */}
                        {/* For now, keeping main info on right for desktop, below gallery for mobile via grid order naturally */}
                    </div>

                    {/* Right Column - Info & Action */}
                    <div className="lg:col-span-4 space-y-6">
                        <CarInfo car={car} />
                    </div>
                </div>

                {/* Similar Cars Section */}
                <div className="mt-20">
                    <SimilarCars currentCarId={car.id} price={car.price} />
                </div>
            </div>
        </div>
    );
}
