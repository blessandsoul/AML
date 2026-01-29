'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import {
    Timer,
    Gavel,
    MapPin,
    Gauge,
    Settings2,
    Fuel,
    ArrowRight,
    Flame,
    Clock,
    CircleDollarSign,
    Trophy,
    Heart
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { AuctionCar } from '../types';

interface AuctionCardProps {
    car: AuctionCar;
    index: number;
}

export function AuctionCard({ car, index }: AuctionCardProps) {
    const [timeLeft, setTimeLeft] = React.useState('');
    const [isUrgent, setIsUrgent] = React.useState(false);
    const [isFavorite, setIsFavorite] = React.useState(false);

    React.useEffect(() => {
        const updateTimer = () => {
            const end = new Date(car.endTime).getTime();
            const now = new Date().getTime();
            const diff = end - now;

            if (diff <= 0) {
                setTimeLeft('დასრულდა');
                setIsUrgent(false);
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            if (days < 1 && hours < 2) {
                setIsUrgent(true);
            }

            if (days > 0) {
                setTimeLeft(`${days}დღ ${hours}სთ`);
            } else {
                setTimeLeft(`${hours}სთ ${minutes}წთ ${seconds}წმ`);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [car.endTime]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="group relative bg-card rounded-2xl border border-border overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 flex flex-col h-full"
        >
            {/* Image Section */}
            <Link href={`/auctions/${car.id}`} className="block relative aspect-[4/3] overflow-hidden bg-muted">
                <Image
                    src={car.image}
                    alt={car.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />



                {/* Status Overlays */}
                <div className="absolute top-3 left-3 flex items-center gap-2 z-10 w-full pr-3">
                    {car.status === 'live' && (
                        <div className="flex items-center gap-1.5 bg-red-500/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-full shadow-lg animate-pulse">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider">LIVE</span>
                        </div>
                    )}

                    <div className={cn(
                        "ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-lg backdrop-blur-sm",
                        isUrgent
                            ? "bg-amber-500/90 text-white"
                            : "bg-black/60 text-white border border-white/20"
                    )}>
                        <Timer className="w-3.5 h-3.5" />
                        <span className="text-xs font-mono font-bold tracking-wide tabular-nums">
                            {timeLeft}
                        </span>
                    </div>
                </div>

                {/* Bottom Gradient Overlay */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                {/* Key Specs & Auction Badge Overlay */}
                <div className="absolute bottom-3 inset-x-3 flex justify-between items-end text-white/90">
                    <div className="flex gap-2 text-[10px] font-medium">
                        <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm border border-white/10">
                            <Gauge className="w-3 h-3 text-primary" />
                            <span>{car.mileage.toLocaleString()} mi</span>
                        </div>
                        <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm border border-white/10">
                            <Settings2 className="w-3 h-3 text-primary" />
                            <span>{car.engine}</span>
                        </div>
                    </div>

                    <Badge variant="secondary" className="backdrop-blur-md bg-white/90 text-black border-white/40 shadow-sm text-[10px] font-bold">
                        {car.auctionHouse}
                    </Badge>
                </div>
            </Link>

            {/* Content Section */}
            <div className="p-4 flex flex-col flex-1 gap-4">
                {/* Title & Location */}
                <div className="space-y-1">
                    <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-lg leading-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                            {car.title}
                        </h3>
                        <Badge variant="outline" className="font-mono text-xs px-1.5 shrink-0">
                            {car.year}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate">{car.location}</span>
                    </div>
                </div>

                {/* Bidding Info Grid */}
                <div className="grid grid-cols-2 gap-3 bg-muted/40 p-3 rounded-xl border border-border/50">
                    <div className="space-y-1">
                        <div className="text-[10px] uppercase text-muted-foreground font-semibold flex items-center gap-1">
                            <Gavel className="w-3 h-3" />
                            მიმდინარე ბიდი
                        </div>
                        <div className="text-xl font-black text-foreground tracking-tight flex items-baseline gap-0.5">
                            <span className="text-sm text-muted-foreground font-medium">$</span>
                            {car.currentBid.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                            <Flame className="w-3 h-3" />
                            {car.bids} ბიდი
                        </div>
                    </div>

                    <div className="space-y-1 pl-3 border-l border-border/50">
                        <div className="text-[10px] uppercase text-muted-foreground font-semibold flex items-center gap-1">
                            <Trophy className="w-3 h-3" />
                            მოგება (სავარაუდო)
                        </div>
                        <div className="text-xl font-black text-emerald-600 tracking-tight flex items-baseline gap-0.5">
                            <span className="text-sm font-medium">$</span>
                            {Math.round(car.currentBid * 0.4).toLocaleString()}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-medium">
                            მარჟა ~40%
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-auto grid grid-cols-[1fr_auto] gap-3 pt-2">
                    <Button className="w-full font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all" size="default">
                        ბიდის დადება
                    </Button>
                    <Button variant="outline" size="icon" className="border-primary/20 text-primary hover:bg-primary hover:text-white transition-colors" asChild>
                        <Link href={`/auctions/${car.id}`}>
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
