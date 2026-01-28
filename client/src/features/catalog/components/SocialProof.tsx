'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, MapPin } from 'lucide-react';
import Image from 'next/image';

const DELIVERIES = [
    { model: "BMW X5 2023", city: "Tbilisi", savings: "$12,400", img: "https://images.unsplash.com/photo-1555215695-3004980adade?w=800&q=80" },
    { model: "Toyota Camry", city: "Batumi", savings: "$4,200", img: "https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?w=800&q=80" },
    { model: "Ford Mustang", city: "Kutaisi", savings: "$8,100", img: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80" },
    { model: "Lexus RX350", city: "Poti", savings: "$6,500", img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80" },
];

export function SocialProof() {
    return (
        <section className="bg-background py-20 border-t border-border overflow-hidden">
            <div className="container mx-auto px-4 mb-10 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-4">
                    <CheckCircle2 className="w-3 h-3" />
                    Trusted by 2,500+ Clients
                </div>
                <h3 className="text-3xl font-black text-foreground">
                    Just Delivered
                </h3>
            </div>

            <div className="flex gap-6 overflow-hidden select-none mask-linear-fade">
                <motion.div
                    className="flex gap-6 pl-4"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                >
                    {[...DELIVERIES, ...DELIVERIES, ...DELIVERIES].map((item, i) => (
                        <div key={i} className="min-w-[300px] h-[100px] bg-card rounded-2xl border border-border p-3 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                                <Image src={item.img} alt={item.model} fill className="object-cover" />
                            </div>
                            <div className="flex flex-col">
                                <h4 className="font-bold text-sm text-foreground">{item.model}</h4>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                                    <MapPin className="w-3 h-3" /> {item.city}
                                </div>
                                <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full w-fit">
                                    Saved {item.savings}
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
