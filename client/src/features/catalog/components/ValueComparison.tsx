'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

export function ValueComparison() {
    return (
        <section className="bg-muted/30 py-12 md:py-24 border-y border-border">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">

                    {/* Text Side */}
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                            ჭკვიანი არჩევანი
                        </div>
                        <h3 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
                            შეწყვიტეთ ზედმეტის გადახდა. <br />
                            <span className="text-primary">დაზოგეთ 40%-მდე</span>
                        </h3>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            ამერიკულ აუქციონებზე პირდაპირი წვდომა გამორიცხავს შუამავლებს. ნახეთ სხვაობა 2021 BMW X5-ის მაგალითზე.
                        </p>
                    </div>

                    {/* Visual Side (Graph) */}
                    <div className="bg-card rounded-3xl border border-border p-8 shadow-xl relative overflow-hidden">
                        <div className="space-y-8 relative z-10">

                            {/* Bar 1: Market */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-bold text-muted-foreground uppercase tracking-wider">
                                    <span>ადგილობრივი საბაზრო ფასი</span>
                                    <span>$65,000</span>
                                </div>
                                <div className="h-12 w-full bg-muted rounded-xl relative overflow-hidden">
                                    <motion.div
                                        initial={{ width: "0%" }}
                                        whileInView={{ width: "100%" }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ duration: 1.2, delay: 0.2, ease: "circOut" }}
                                        className="absolute inset-y-0 left-0 bg-zinc-300"
                                    />
                                </div>
                            </div>

                            {/* Bar 2: Auction */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-bold text-foreground uppercase tracking-wider">
                                    <span className="text-primary">AML-ით (აუქციონი)</span>
                                    <span className="text-primary text-xl">$42,500</span>
                                </div>
                                <div className="h-12 w-full bg-muted rounded-xl relative overflow-hidden">
                                    <div className="absolute inset-0 bg-primary/10" />
                                    <motion.div
                                        initial={{ width: "0%" }}
                                        whileInView={{ width: "65%" }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ duration: 1.2, delay: 0.4, ease: "circOut" }}
                                        className="absolute inset-y-0 left-0 bg-primary flex items-center justify-end px-4"
                                    >
                                        <span className="text-white font-bold text-xs whitespace-nowrap">თქვენ ზოგავთ $22,500</span>
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
