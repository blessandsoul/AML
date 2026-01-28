'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { CarCard } from './CarCard';
import { MOCK_CARS } from '../data/mock-cars';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function FeaturedCars() {
    return (
        <section className="bg-background py-24 relative overflow-hidden">

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs">
                            <span className="w-2 h-2 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            </span>
                            <span>Premium Selections</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
                            Featured Lots
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-lg font-medium">
                            Curated vehicles from top auctions. Verified condition and exclusive pricing.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Button
                            variant="outline"
                            className="hidden md:flex rounded-full px-8 h-12 border-border text-foreground hover:bg-muted hover:text-foreground transition-all font-semibold"
                            asChild
                        >
                            <Link href="/catalog">
                                View All Cars
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>

                {/* Clean Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                    {MOCK_CARS.slice(0, 10).map((car, index) => (
                        <CarCard key={car.id} car={car} index={index} priority={index < 5} />
                    ))}
                </div>

                <div className="mt-16 text-center md:hidden">
                    <Button variant="outline" className="w-full rounded-full h-12 border-border text-foreground" asChild>
                        <Link href="/catalog">
                            View All Cars
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
