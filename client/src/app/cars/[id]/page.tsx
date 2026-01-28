import { notFound } from 'next/navigation';
import { MOCK_CARS } from '@/features/catalog/data/mock-cars';
import { CarGallery } from '@/features/catalog/components/CarGallery';
import { CarSpecs } from '@/features/catalog/components/CarSpecs';
import { CarCalculator } from '@/features/catalog/components/CarCalculator';
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
    // Await params correctly in Next.js 15+
    const { id } = await params;
    const car = MOCK_CARS.find((c) => c.id === id);

    if (!car) {
        notFound();
    }

    // Generate placeholder images since we only have one in mock
    const images = [
        car.image,
        'https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1000',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000',
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000',
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Button variant="ghost" asChild className="pl-0 hover:pl-2 transition-all">
                    <Link href="/catalog">
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Назад в каталог
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Gallery & Specs */}
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">{car.title}</h1>
                        <p className="text-muted-foreground text-lg mb-6">
                            Лот #{car.lotNumber} • {car.location}
                        </p>
                        <CarGallery images={images} title={car.title} />
                    </div>

                    <CarSpecs car={car} />
                </div>

                {/* Right Column - Calculator & CTA */}
                <div className="lg:col-span-1">
                    <CarCalculator car={car} />

                    {/* Manager Contact (Mock) */}
                    <div className="mt-6 p-4 border rounded-xl bg-muted/40 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                            AM
                        </div>
                        <div>
                            <p className="font-semibold">Менеджер AutoMarket</p>
                            <p className="text-sm text-muted-foreground">+995 32 205 42 44</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
