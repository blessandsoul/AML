'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Flame, Zap, Clock, Trophy, Truck, Car } from 'lucide-react';

const CATEGORIES = [
    { id: 'hot', label: 'ტოპ აუქციონები', icon: Flame, color: 'text-orange-500' },
    { id: 'ending', label: 'სრულდება მალე', icon: Clock, color: 'text-red-500' },
    { id: 'buy_now', label: 'Buy Now', icon: Zap, color: 'text-yellow-500' },
    { id: 'run_drive', label: 'Run & Drive', icon: Car, color: 'text-emerald-500' },
    { id: 'clean', label: 'სუფთა ისტორია', icon: Trophy, color: 'text-blue-500' },
    { id: 'suv', label: 'SUVs & Trucks', icon: Truck, color: 'text-zinc-500' },
];

export function AuctionCategories() {
    const [active, setActive] = React.useState('hot');

    return (
        <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:overflow-visible">
            {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = active === cat.id;

                return (
                    <button
                        key={cat.id}
                        onClick={() => setActive(cat.id)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold whitespace-nowrap transition-all duration-300",
                            isActive
                                ? "bg-primary/10 border-primary/20 text-primary shadow-sm scale-105"
                                : "bg-card border-border hover:border-primary/20 hover:bg-muted text-muted-foreground"
                        )}
                    >
                        <Icon className={cn("w-4 h-4", isActive ? "text-primary" : cat.color)} />
                        {cat.label}
                    </button>
                );
            })}
        </div>
    );
}
