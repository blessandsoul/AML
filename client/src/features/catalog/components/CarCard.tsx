'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Heart, Timer, Fuel, Gauge, Calendar, Gavel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface CarCardProps {
    car: any;
    index: number;
    priority?: boolean;
}

export function CarCard({ car, index, priority = false }: CarCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="group relative bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full"
        >
            {/* Image Container */}
            <Link href={`/catalog/${car.id}`} className="block relative aspect-[4/3] overflow-hidden bg-muted">
                <Image
                    src={car.image}
                    alt={car.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                    priority={priority}
                />

                {/* FOMO Timer (Neuro-Minimalism: Urgency) */}
                <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                    {car.isHot && (
                        <Badge variant="destructive" className="bg-red-500 hover:bg-red-600 border-none shadow-sm uppercase text-[10px] tracking-wider font-bold animate-pulse">
                            Hot
                        </Badge>
                    )}
                    <div className="bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded-md flex items-center gap-1.5 border border-white/10 shadow-lg">
                        <Timer className="w-3 h-3 text-red-400" />
                        <span className="text-[10px] font-mono font-bold tracking-wider">02:14:05</span>
                    </div>
                </div>

                {/* Like Button (Neuro-Minimalism: Dopamine Hit) */}
                <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/90 hover:text-red-500 text-white border border-white/20 transition-all opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0 active:scale-125 z-10"
                >
                    <Heart className="w-4 h-4 fill-current transition-transform active:scale-150" />
                </Button>

                {/* Bottom Gradient overlay for text readability only at very bottom */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1 gap-4">
                <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                        <Link href={`/catalog/${car.id}`} className="font-bold text-lg leading-tight text-foreground hover:text-primary transition-colors line-clamp-1">
                            {car.title}
                        </Link>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium uppercase tracking-wide">
                        <span>{car.year}</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span>{car.mileage} km</span>
                    </div>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 py-3 border-t border-border/50">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Fuel className="w-3.5 h-3.5 opacity-70" />
                        <span className="truncate">{car.fuel}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Gauge className="w-3.5 h-3.5 opacity-70" />
                        <span className="truncate">{car.engine}L</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Timer className="w-3.5 h-3.5 opacity-70" />
                        <span className="truncate">Auto</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5 opacity-70" />
                        <span className="truncate">Stock</span>
                    </div>
                </div>

                {/* Price / Action */}
                <div className="mt-auto pt-3 flex items-center justify-between gap-3 border-t border-border">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Current Bid</span>
                        <span className="text-xl font-black text-primary font-mono tracking-tight">
                            ${car.price.toLocaleString()}
                        </span>
                    </div>
                    <Button size="sm" className="rounded-lg px-4 h-9 font-semibold shadow-sm hover:shadow-md transition-all">
                        Bid Now
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
