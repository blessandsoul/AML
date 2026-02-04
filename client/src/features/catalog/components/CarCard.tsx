'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import * as React from 'react';
import { LeadCaptureModal } from './LeadCaptureModal';
import { Heart, Timer, Fuel, Gauge, Calendar, Lock, Settings2, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';

interface CarCardProps {
    car: any;
    index: number;
    priority?: boolean;
}

export function CarCard({ car, index, priority = false }: CarCardProps) {
    const [showLeadModal, setShowLeadModal] = React.useState(false);
    const [modalContext, setModalContext] = React.useState<'general' | 'price_unlock'>('general');

    // MOCK CALCULATION FOR DEMO:
    // Assume Market Value is ~35% higher than Auction Price
    const estimatedMarketPrice = Math.round(car.price * 1.35);
    const landedCost = car.price + 2050; // Auction + Shipping (approx)
    const potentialProfit = estimatedMarketPrice - landedCost;

    const handleUnlockPrice = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setModalContext('price_unlock');
        setShowLeadModal(true);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group relative bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full"
                suppressHydrationWarning
            >
                {/* Image Container */}
                <Link href={`/catalog/${car.id}`} className="block relative aspect-[4/3] overflow-hidden bg-muted" suppressHydrationWarning>
                    <Image
                        src={car.image}
                        alt={car.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                        priority={priority}
                        suppressHydrationWarning
                    />

                    {/* PROFIT BADGE - The "Perekup" Hook */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                        <div className="bg-emerald-500 text-white px-2 py-1 rounded-md flex items-center gap-1.5 shadow-lg animate-in fade-in zoom-in duration-300">
                            <span className="text-[10px] uppercase font-bold tracking-wide">მოგება:</span>
                            <span className="text-xs font-black font-mono tracking-wider">
                                ${potentialProfit.toLocaleString('en-US')}
                            </span>
                        </div>
                    </div>

                    {/* Bottom Gradient */}
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                    {/* Specs Overlay on Image (Space Saving) */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white/90 text-[11px] font-medium">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                                <span className="bg-white/20 p-1 rounded-sm"><Gauge className="w-3 h-3" /></span>
                                <span>{car.mileage.toLocaleString('en-US')} mi</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="bg-white/20 p-1 rounded-sm"><Settings2 className="w-3 h-3" /></span>
                                <span>{car.engine}</span>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1 gap-3">
                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-base leading-tight text-foreground line-clamp-1">{car.title}</h3>
                            <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-mono text-muted-foreground">
                                {car.year}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate max-w-[200px]">{car.location}</span>
                        </div>
                    </div>

                    <div className="mt-1 pt-3 border-t border-border border-dashed space-y-2">
                        {/* Dealer Value Prop Row */}
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">საბაზრო ფასი:</span>
                            <span className="font-medium decoration-red-500/50 line-through decoration-1">
                                ${estimatedMarketPrice.toLocaleString('en-US')}
                            </span>
                        </div>

                        {/* Validated/Checked Status */}
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>შემოწმებული ისტორია</span>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-1">
                            <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 rounded-[4px] text-[9px] font-bold uppercase tracking-wide">
                                Run & Drive
                            </span>
                            <span className="bg-muted text-muted-foreground border border-border px-2 py-0.5 rounded-[4px] text-[9px] font-bold uppercase tracking-wide">
                                გასაღები: კი
                            </span>
                            <span className="bg-muted text-muted-foreground border border-border px-2 py-0.5 rounded-[4px] text-[9px] font-bold uppercase tracking-wide">
                                {car.auction || 'IAAI'}
                            </span>
                        </div>
                    </div>

                    {/* Main Call To Action */}
                    <div className="mt-auto pt-2 grid grid-cols-[1fr_auto] gap-3 items-end">
                        <div
                            className="flex flex-col cursor-pointer group/price"
                            onClick={handleUnlockPrice}
                        >
                            <span className="text-[10px] text-muted-foreground font-bold tracking-tight uppercase mb-0.5">
                                ფასი ფოთამდე
                            </span>
                            <div className="flex items-center gap-2 bg-primary/5 px-2 py-1 rounded-lg border border-primary/10 group-hover/price:bg-primary/10 transition-colors">
                                <Lock className="w-3.5 h-3.5 text-primary" />
                                <span className="text-sm font-black text-primary tracking-tight">
                                    გაიგე ფასი
                                </span>
                            </div>
                        </div>

                        <Button
                            size="icon"
                            variant="outline"
                            className="rounded-xl h-10 w-10 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
                            asChild
                        >
                            <Link href={`/catalog/${car.id}`}>
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </motion.div>

            <LeadCaptureModal
                isOpen={showLeadModal}
                onClose={() => setShowLeadModal(false)}
                context={modalContext}
                metadata={car}
            />
        </>
    );
}
