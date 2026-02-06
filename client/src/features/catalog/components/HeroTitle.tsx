'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck } from 'lucide-react';
import { HERO_COPY } from '@/features/catalog/constants/copywriting';

export function HeroTitle() {
    return (
        <div className="flex flex-col items-center max-w-4xl mx-auto text-center z-10 relative">
            {/* Official Broker Badge */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4"
                suppressHydrationWarning
                style={{ opacity: 0 }}
            >
                <BadgeCheck className="w-4 h-4 text-[#55A8B9]" />
                <div className="flex flex-col items-start gap-0">
                    <span className="text-white font-bold text-xs md:text-sm">
                        {HERO_COPY.partnershipBadge.text}
                    </span>
                    <span className="text-white/70 text-[10px] md:text-xs font-medium">
                        {HERO_COPY.partnershipBadge.subtext}
                    </span>
                </div>
            </motion.div>

            {/* Hero Title */}
            <motion.h1
                className="text-2xl md:text-4xl lg:text-6xl font-black tracking-tighter leading-tight mb-2 flex flex-col items-center justify-center gap-1 md:gap-2 text-center pb-1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                suppressHydrationWarning
                style={{ opacity: 0 }}
            >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#55A8B9] via-[#3498DB] to-[#55A8B9]">
                    {HERO_COPY.mainTitle}
                </span>
                <span className="text-white/90 font-bold tracking-tight text-sm md:text-lg lg:text-xl mt-2 max-w-2xl mx-auto drop-shadow-sm">
                    {HERO_COPY.description}
                </span>
            </motion.h1>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center gap-3 mb-4"
                suppressHydrationWarning
                style={{ opacity: 0 }}
            >
                {/* Phone Number Display */}
                <div className="flex items-center gap-2 px-6 py-2 rounded-full bg-white/90 backdrop-blur-md border border-white/20 shadow-xl">
                    <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary animate-pulse">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 4.5Z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <a href={`tel:${HERO_COPY.phone.tel}`} className="text-lg md:text-2xl font-black text-[#1C2331] tracking-wide hover:text-primary transition-colors">
                        {HERO_COPY.phone.display}
                    </a>
                </div>
            </motion.div>
        </div>
    );
}
