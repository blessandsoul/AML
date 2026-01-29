'use client';

import * as React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MousePointerClick, Gavel, Ship, Key } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
    {
        icon: MousePointerClick,
        title: "შერჩევა",
        desc: "უფასო წვდომა დახურულ აუქციონებზე (Manheim, Adesa).",
    },
    {
        icon: Gavel,
        title: "ვაჭრობა",
        desc: "პროფესიონალური სტრატეგია საუკეთესო ფასად მოსაგებად.",
    },
    {
        icon: Ship,
        title: "ლოჯისტიკა",
        desc: "დაზღვეული ტრანსპორტირება სრული ფოტო რეპორტით.",
    },
    {
        icon: Key,
        title: "ჩაბარება",
        desc: "განბაჟება და გასაღების გადმოცემა.",
    }
];

export function ProcessSteps() {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

    return (
        <section ref={containerRef} className="bg-muted/30 py-32 relative overflow-hidden">

            <div className="container mx-auto px-4 relative z-10 w-full max-w-7xl">
                <motion.div style={{ y }} className="text-center mb-24 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-border text-xs font-bold uppercase tracking-widest text-muted-foreground shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        როგორ მუშაობს
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
                        მარტივი გზა <br className="md:hidden" />
                        <span className="text-primary">
                            თქვენს საოცნებო მანქანამდე
                        </span>
                    </h3>
                </motion.div>

                <div className="relative w-full">
                    {/* Connecting Line (Desktop) */}


                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
                        {STEPS.map((step, i) => (
                            <div key={i} className="group relative flex flex-col items-center text-center">
                                <div className="relative z-10 flex flex-col items-center w-full">
                                    {/* Icon Bubble - Minimalist */}
                                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 bg-primary/5 text-primary transition-colors hover:bg-primary/10">
                                        <step.icon className="w-8 h-8" />
                                    </div>

                                    <h4 className="text-xl font-bold text-foreground mb-3 font-sans">
                                        {step.title}
                                    </h4>
                                    <p className="text-muted-foreground font-medium leading-relaxed text-base max-w-[240px]">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
