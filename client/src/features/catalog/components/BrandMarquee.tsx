'use client';

import { motion } from 'framer-motion';

const BRANDS = [
    "COPART", "IAAI", "MANHEIM", "ADESA"
];

const MARQUEE_ITEMS = [...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS];

export function BrandMarquee() {
    return (
        <section className="relative overflow-hidden py-10 border-y border-border z-20">
            {/* Light noise background */}
            <div
                className="absolute inset-0 -z-10"
                style={{
                    background: '#F8F9FA',
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.05\'/%3E%3C/svg%3E")'
                }}
            />

            {/* Side Fades */}
            <div
                className="absolute top-0 left-0 w-32 h-full z-10 pointer-events-none"
                style={{
                    background: 'linear-gradient(to right, #F8F9FA, transparent)'
                }}
            />
            <div
                className="absolute top-0 right-0 w-32 h-full z-10 pointer-events-none"
                style={{
                    background: 'linear-gradient(to left, #F8F9FA, transparent)'
                }}
            />

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
