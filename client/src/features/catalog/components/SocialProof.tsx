'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, MapPin } from 'lucide-react';
import Image from 'next/image';

import { REAL_CAR_PHOTOS } from '../data/real-car-photos';

const DELIVERIES = [
    { model: "BMW X5 M Comp", city: "თბილისი", savings: "$12,400", img: REAL_CAR_PHOTOS["5744497592"][0] },
    { model: "Mercedes-AMG GT", city: "ბათუმი", savings: "$8,200", img: REAL_CAR_PHOTOS["5751385850"][0] },
    { model: "Porsche 911 Turbo", city: "ქუთაისი", savings: "$15,100", img: REAL_CAR_PHOTOS["5748691586"][0] },
    { model: "Audi RS Q8", city: "ფოთი", savings: "$9,500", img: REAL_CAR_PHOTOS["57388033352123"][0] },
];

export function SocialProof() {
    return (
        <section className="bg-background py-20 border-t border-border overflow-hidden">
            <div className="container mx-auto px-4 mb-10 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-4">
                    <CheckCircle2 className="w-3 h-3" />
                    2,500+ კმაყოფილი კლიენტი
                </div>
                <h3 className="text-3xl font-black text-foreground">
                    ახლახანს ჩამოყვანილი
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
                                    დაზოგე {item.savings}
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
