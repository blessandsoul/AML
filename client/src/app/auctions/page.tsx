'use client';

import * as React from 'react';
import { AuctionCard } from '@/features/auctions/components/AuctionCard';
import { AuctionCategories } from '@/features/auctions/components/AuctionCategories';
import { AuctionHowItWorks } from '@/features/auctions/components/AuctionHowItWorks';
import { LiveTicker } from '@/features/auctions/components/LiveTicker';
import { AuctionFilters } from '@/features/auctions/components/AuctionFilters';
import { HunterCard } from '@/features/catalog/components/HunterCard';
import type { AuctionCar } from '@/features/auctions/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { MOCK_CARS } from '@/features/catalog/data/mock-cars';

// Transform MOCK_CARS into AuctionCar format and multiply
const GENERATED_AUCTIONS: AuctionCar[] = [
    ...MOCK_CARS,
    ...MOCK_CARS,
    ...MOCK_CARS,
    ...MOCK_CARS
].map((car, i) => {
    const isLive = i % 3 !== 0; // 2/3 are live
    const bidRatio = 0.3 + (Math.random() * 0.3); // Bid is 30-60% of "buy now" price
    const currentBid = Math.round(car.price * bidRatio / 100) * 100;

    // Random time between 10 mins and 48 hours
    const randomTimeOffset = Math.random() * 1000 * 60 * 60 * 48 + (1000 * 60 * 10);
    const endTime = new Date(Date.now() + randomTimeOffset).toISOString();

    return {
        id: `${car.id}-${i}`,
        title: car.title,
        year: car.year,
        image: car.image,
        currentBid: currentBid,
        buyNowPrice: car.price,
        currency: car.currency,
        endTime: endTime,
        bids: Math.floor(Math.random() * 45) + 2,
        location: car.location,
        engine: car.engine,
        mileage: car.mileage,
        transmission: 'Automatic', // Default
        driveType: 'AWD', // Default
        fuelType: car.fuel,
        color: 'N/A',
        vin: 'N/A',
        lotNumber: car.lotNumber || '000000',
        seller: 'Insurance Company',
        condition: 'Run & Drive',
        status: isLive ? 'live' : 'upcoming',
        auctionHouse: typeof car.auction === 'string' && ['IAAI', 'Copart', 'Manheim', 'Adesa'].includes(car.auction)
            ? (car.auction as 'IAAI' | 'Copart' | 'Manheim' | 'Adesa')
            : 'IAAI'
    };
});

export default function AuctionsPage() {
    const [showFilters, setShowFilters] = React.useState(false);

    return (
        <div className="min-h-screen bg-background bg-mesh pb-20 pt-10 md:pt-8">
            <LiveTicker />
            <AuctionFilters isOpen={showFilters} onClose={() => setShowFilters(false)} />

            {/* Header Section */}
            <div className="container mx-auto px-4 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-black tracking-tight">
                                ცოცხალი აუქციონები
                            </h1>
                            <span className="bg-red-500/10 text-red-500 text-xs font-bold px-2 py-0.5 rounded-full border border-red-500/20 animate-pulse">
                                LIVE
                            </span>
                        </div>

                        <p className="text-muted-foreground max-w-xl text-sm md:text-base">
                            შეარჩიეთ საუკეთესო ვარიანტები რეალურ დროში. ყველა ავტომობილი შემოწმებულია და მზადაა ტრანსპორტირებისთვის.
                        </p>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <Button size="lg" className="font-bold w-full md:w-auto shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
                            ყველა აუქციონი
                        </Button>
                    </div>
                </div>

                {/* How It Works Strip - Added! */}
                <AuctionHowItWorks />

                {/* Filters Bar & Categories */}
                <div className="space-y-4 mb-8">
                    <div className="bg-card border border-border rounded-xl p-4 flex flex-col md:flex-row gap-4 shadow-sm">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input placeholder="ძებნა (მაგ: BMW M4)..." className="pl-9 bg-background h-10" />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                className="gap-2 h-10"
                                onClick={() => setShowFilters(true)}
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                ფილტრი
                            </Button>
                            <Button variant="outline" className="gap-2 h-10">
                                <ArrowUpDown className="w-4 h-4" />
                                დალაგება
                            </Button>
                        </div>
                    </div>

                    {/* Quick Categories - Added! */}
                    <AuctionCategories />
                </div>

                {/* Grid with Hunter Card Injection */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {GENERATED_AUCTIONS.map((car, index) => {
                        // Inject Hunter Card at index 8
                        if (index === 8) {
                            return (
                                <React.Fragment key="hunter-wrapper">
                                    <div className="md:col-span-1 h-full">
                                        <HunterCard />
                                    </div>
                                    <AuctionCard key={car.id} car={car} index={index} />
                                </React.Fragment>
                            );
                        }
                        return <AuctionCard key={car.id} car={car} index={index} />;
                    })}
                </div>

                {/* Load More */}
                <div className="mt-12 text-center">
                    <Button variant="secondary" size="lg" className="min-w-[200px] font-bold h-12">
                        მეტის ჩატვირთვა
                    </Button>
                </div>
            </div>
        </div>
    );
}
