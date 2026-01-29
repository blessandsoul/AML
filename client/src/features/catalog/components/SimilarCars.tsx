'use client';

import * as React from 'react';
import { MOCK_CARS } from '../data/mock-cars';
import { CarCard } from './CarCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface SimilarCarsProps {
    currentCarId: string;
    price: number;
}

export function SimilarCars({ currentCarId, price }: SimilarCarsProps) {
    // Simple similarity logic: within +/- 40% of price, excluding current car
    const similarCars = React.useMemo(() => {
        const minPrice = price * 0.6;
        const maxPrice = price * 1.4;

        return MOCK_CARS
            .filter(car =>
                car.id !== currentCarId &&
                car.price >= minPrice &&
                car.price <= maxPrice
            )
            .slice(0, 4); // Limit to 4 cars
    }, [currentCarId, price]);

    if (similarCars.length === 0) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">მსგავსი ავტომობილები</h2>
                <Button variant="ghost" asChild className="hidden md:flex">
                    <Link href="/catalog">
                        ყველას ნახვა
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarCars.map((car, index) => (
                    <CarCard
                        key={car.id}
                        car={car}
                        index={index}
                    />
                ))}
            </div>

            <Button variant="outline" asChild className="w-full md:hidden">
                <Link href="/catalog">
                    ყველას ნახვა
                </Link>
            </Button>
        </div>
    );
}
