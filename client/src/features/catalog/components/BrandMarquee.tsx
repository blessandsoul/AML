'use client';

import { motion } from 'framer-motion';

const BRANDS = [
    "COPART", "IAAI", "MANHEIM", "ADESA", "IMPACT", "PIPELINE",
    "COPART", "IAAI", "MANHEIM", "ADESA", "IMPACT", "PIPELINE"
];

export function BrandMarquee() {
    return (
        <section className="bg-background border-y border-border overflow-hidden py-10 relative z-20">
            {/* Side Fades - Light mode compatible */}
            <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

            <div className="flex select-none">
                <motion.div
                    initial={{ x: 0 }}
                    animate={{ x: "-50%" }}
                    transition={{
                        duration: 30, // Slower for less cognitive load
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="flex gap-16 md:gap-32 whitespace-nowrap"
                >
                    {[...BRANDS, ...BRANDS].map((brand, i) => (
                        <div key={i} className="flex items-center gap-4 group cursor-default opacity-40 hover:opacity-100 transition-opacity duration-300">
                            <span className="text-3xl md:text-4xl font-black tracking-tighter text-foreground font-sans">
                                {brand}
                            </span>
                            <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
