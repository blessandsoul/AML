import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MOCK_CARS } from '@/features/catalog/data/mock-cars';
import { CarGallery } from '@/features/catalog/components/CarGallery';
import { CarInfo } from '@/features/catalog/components/CarInfo';
import { SimilarCars } from '@/features/catalog/components/SimilarCars';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
    return MOCK_CARS.map((car) => ({
        id: car.id,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const car = MOCK_CARS.find((c) => c.id === id);

    if (!car) {
        return { title: 'ავტომობილი ვერ მოიძებნა' };
    }

    return {
        title: `${car.title} - შეიძინეთ Auto Market LGC-ში`,
        description: `${car.title} - ${car.year} წელი, ${car.mileage.toLocaleString()} კმ, ${car.engine}. ფასი $${car.price.toLocaleString()}. შეიძინეთ Auto Market LGC-ში.`,
        openGraph: {
            title: car.title,
            description: `${car.year} ${car.title} - $${car.price.toLocaleString()}`,
            images: car.images?.length ? [{ url: car.images[0] }] : car.image ? [{ url: car.image }] : [],
        },
    };
}

export default async function CarDetailsPage({ params }: PageProps) {
    const { id } = await params;
    const car = MOCK_CARS.find((c) => c.id === id);

    if (!car) {
        notFound();
    }

    const images = car.images && car.images.length > 0
        ? car.images
        : [car.image];

    const vehicleJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Vehicle',
        name: car.title,
        modelDate: car.year.toString(),
        mileageFromOdometer: {
            '@type': 'QuantitativeValue',
            value: car.mileage,
            unitCode: 'KMT',
        },
        fuelType: car.fuel,
        vehicleEngine: {
            '@type': 'EngineSpecification',
            name: car.engine,
        },
        image: images,
        offers: {
            '@type': 'Offer',
            price: car.price,
            priceCurrency: car.currency,
            availability: 'https://schema.org/InStock',
            seller: {
                '@type': 'Organization',
                name: 'Auto Market LGC',
            },
        },
    };

    return (
        <div className="min-h-screen bg-background text-foreground pt-10 md:pt-8 pb-12">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(vehicleJsonLd) }}
            />
            <div className="container mx-auto px-4">
                <Breadcrumbs
                    items={[
                        { label: 'მთავარი', href: '/' },
                        { label: 'კატალოგი', href: '/catalog' },
                        { label: car.title },
                    ]}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-8">
                        <CarGallery images={images} title={car.title} />
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <CarInfo car={car} />
                    </div>
                </div>

                <div className="mt-20">
                    <SimilarCars currentCarId={car.id} price={car.price} />
                </div>
            </div>
        </div>
    );
}
