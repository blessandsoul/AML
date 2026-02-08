'use client';

import * as React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { PROCESS_STEPS, PROCESS_STEPS_HEADING } from '@/features/catalog/constants/copywriting';

export function ProcessSteps() {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

    return (
        <section ref={containerRef} className="bg-white/3 dark:bg-white/2 backdrop-blur-sm py-8 md:py-14 relative overflow-hidden">

            <div className="container mx-auto px-4 relative z-10 w-full max-w-7xl">
                <motion.div style={{ y }} className="text-center mb-6 md:mb-10">
                    <h3 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
                        {PROCESS_STEPS_HEADING.main} <br className="md:hidden" />
                        <span className="text-primary">
                            {PROCESS_STEPS_HEADING.highlight}
                        </span>
                    </h3>
                </motion.div>

                <div className="relative w-full">
                    {/* Connecting Line (Desktop) */}


                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                        {PROCESS_STEPS.map((step, i) => (
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
                                        {step.description}
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
