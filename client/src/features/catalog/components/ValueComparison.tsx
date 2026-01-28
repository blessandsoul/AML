'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

export function ValueComparison() {
    return (
        <section className="bg-muted/30 py-24 border-y border-border">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

                    {/* Text Side */}
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                            Smart Choice
                        </div>
                        <h3 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
                            Stop Overpaying. <br />
                            <span className="text-primary">Save up to 40%</span>
                        </h3>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Buying directly from US auctions eliminates middleman markups. See the difference for a typical 2021 BMW X5.
                        </p>
                    </div>

                    {/* Visual Side (Graph) */}
                    <div className="bg-card rounded-3xl border border-border p-8 shadow-xl relative overflow-hidden">
                        <div className="space-y-8 relative z-10">

                            {/* Bar 1: Market */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-bold text-muted-foreground uppercase tracking-wider">
                                    <span>Local Market Price</span>
                                    <span>$65,000</span>
                                </div>
                                <div className="h-12 w-full bg-muted rounded-xl relative overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: "100%" }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1, delay: 0.2 }}
                                        className="absolute inset-y-0 left-0 bg-zinc-300"
                                    />
                                </div>
                            </div>

                            {/* Bar 2: Auction */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-bold text-foreground uppercase tracking-wider">
                                    <span className="text-primary">With AML (Auction)</span>
                                    <span className="text-primary text-xl">$42,500</span>
                                </div>
                                <div className="h-12 w-full bg-muted rounded-xl relative overflow-hidden">
                                    <div className="absolute inset-0 bg-primary/10" />
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: "65%" }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1, delay: 0.4 }}
                                        className="absolute inset-y-0 left-0 bg-primary flex items-center justify-end px-4"
                                    >
                                        <span className="text-white font-bold text-xs whitespace-nowrap">You Save $22,500</span>
                                    </motion.div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
