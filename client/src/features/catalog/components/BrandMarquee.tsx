'use client';

import { motion } from 'framer-motion';

const BRANDS = [
    "COPART", "IAAI", "MANHEIM", "ADESA"
];

const MARQUEE_ITEMS = [...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS];

export function BrandMarquee() {
    return (
        <section className="bg-background border-y border-border overflow-hidden py-10 relative z-20">
            {/* Side Fades - Light mode compatible */}
            <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

            <div className="flex select-none">
                {[0, 1].map((copy) => (
                    <motion.div
                        key={copy}
                        initial={{ x: 0 }}
                        animate={{ x: "-50%" }}
                        transition={{
                            duration: 30,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        style={{ willChange: 'transform' }}
                        className="flex gap-16 md:gap-32 whitespace-nowrap shrink-0 pr-16 md:pr-32"
                        aria-hidden={copy === 1}
                    >
                        {MARQUEE_ITEMS.map((brand, i) => {
                            const color = {
                                "COPART": "#1254FF",
                                "IAAI": "#D81E05",
                                "MANHEIM": "#003468",
                                "ADESA": "#46B8DA"
                            }[brand] || "currentColor";

                            return (
                                <div key={`${copy}-${i}`} className="flex items-center gap-16 md:gap-32 group cursor-default opacity-60 hover:opacity-100 transition-opacity duration-300">
                                    <span
                                        className="text-3xl md:text-4xl font-black tracking-tighter font-sans"
                                        style={{ color }}
                                    >
                                        {brand}
                                    </span>
                                </div>
                            );
                        })}
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
