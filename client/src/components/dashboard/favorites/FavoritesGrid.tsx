'use client';

import { CarCard } from '@/features/catalog/components/CarCard';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

// Mock Data matching CarCard requirements
const FAVORITES = [
    {
        id: "fav-1",
        title: "2021 BMW M4 Competition",
        image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1200",
        price: 58000,
        mileage: 12500,
        year: 2021,
        engine: "3.0L I6 Twin-Turbo",
        location: "CA - LOS ANGELES",
        auction: "COPART"
    },
    {
        id: "fav-2",
        title: "2020 Porsche 911 Carrera S",
        image: "https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=1200",
        price: 115000,
        mileage: 8900,
        year: 2020,
        engine: "3.0L H6 Twin-Turbo",
        location: "FL - MIAMI",
        auction: "IAAI"
    },
    {
        id: "fav-3",
        title: "2022 Mercedes-AMG GT 63",
        image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200",
        price: 135000,
        mileage: 5400,
        year: 2022,
        engine: "4.0L V8 Biturbo",
        location: "TX - HOUSTON",
        auction: "COPART"
    }
];

export function FavoritesGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {FAVORITES.map((car, index) => (
                <div key={car.id} className="relative group/fav">
                    <CarCard car={car} index={index} />
                    <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 z-10 opacity-0 group-hover/fav:opacity-100 transition-opacity duration-200 shadow-xl rounded-full w-8 h-8"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ))}
        </div>
    );
}
