'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHeroTheme, type HeroTheme, HERO_THEME_OPTIONS } from '@/providers/hero-theme-provider';
import { QuickCalculator } from './QuickCalculator';
import { CarfaxReport } from './CarfaxReport';

const VIDEO_SRC = '/hero-bg/2.mp4';
const FADE_SEC = 1.5;

/**
 * Seamless video loop: two identical <video> elements crossfade.
 * The "standby" video is rewound to 0 and paused, then started + faded in
 * 1.5 s before the active one ends. No React state — pure imperative DOM
 * to avoid any re-render flicker.
 */
export function Hero() {
    const aRef = useRef<HTMLVideoElement>(null);
    const bRef = useRef<HTMLVideoElement>(null);
    const swapping = useRef(false);
    const { theme, setTheme } = useHeroTheme();
    const [pickerOpen, setPickerOpen] = useState(false);

    useEffect(() => {
        const a = aRef.current;
        const b = bRef.current;
        if (!a || !b) return;

        // B stays paused at 0, ready to jump in
        b.pause();
        b.currentTime = 0;

        let activeEl = a;
        let standbyEl = b;

        const onTimeUpdate = () => {
            const v = activeEl;
            if (!v.duration || swapping.current) return;
            const timeLeft = v.duration - v.currentTime;

            if (timeLeft <= FADE_SEC) {
                swapping.current = true;

                // Prepare standby: rewind & play from start
                standbyEl.currentTime = 0;
                standbyEl.play().catch(() => {});

                // Crossfade: hide active, show standby
                activeEl.style.opacity = '0';
                standbyEl.style.opacity = '1';

                // After fade completes, swap roles
                setTimeout(() => {
                    // Pause the now-hidden video and rewind it
                    activeEl.pause();
                    activeEl.currentTime = 0;

                    // Swap references
                    const tmp = activeEl;
                    activeEl = standbyEl;
                    standbyEl = tmp;

                    swapping.current = false;
                }, FADE_SEC * 1000 + 200);
            }
        };

        // Use a single interval instead of onTimeUpdate to avoid re-render
        const timer = setInterval(() => {
            onTimeUpdate();
        }, 200);

        return () => clearInterval(timer);
    }, []);

    const currentTheme = HERO_THEME_OPTIONS.find(t => t.value === theme)!;

    return (
        <section className="relative w-full flex-1 overflow-hidden flex flex-col items-center mt-0 md:-mt-20 pt-0 md:pt-20">
            {/* Background Videos — two layers for seamless loop crossfade */}
            <div className="absolute inset-0 z-0">
                <video
                    ref={aRef}
                    autoPlay muted playsInline preload="auto"
                    poster="/hero-bg/aml.jpeg"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    style={{ opacity: 1, transition: `opacity ${FADE_SEC}s ease-in-out` }}
                    src={VIDEO_SRC}
                />
                <video
                    ref={bRef}
                    muted playsInline preload="auto"
                    poster="/hero-bg/aml.jpeg"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    style={{ opacity: 0, transition: `opacity ${FADE_SEC}s ease-in-out` }}
                    src={VIDEO_SRC}
                />
            </div>

            {/* Main Content */}
            <div className="container relative z-10 px-4 flex flex-col items-center justify-center max-w-5xl mx-auto flex-1 gap-2 pt-4 md:pt-6 pb-2 md:pb-3 h-full">
                <QuickCalculator theme={theme} />
                <CarfaxReport theme={theme} />
            </div>

            {/* Floating theme picker — bottom-left */}
            <div className="fixed bottom-5 left-5 z-50">
                <div className="relative">
                    {/* Picker popup */}
                    <AnimatePresence>
                        {pickerOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                className="absolute bottom-full left-0 mb-2 p-2 rounded-xl liquid-glass dark overflow-hidden"
                            >
                                <div className="absolute inset-0 rounded-xl bg-[oklch(0.13_0.01_240/0.55)] pointer-events-none" />
                                <div className="relative flex flex-col gap-1 min-w-[140px]">
                                    {HERO_THEME_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => { setTheme(opt.value); setPickerOpen(false); }}
                                            className={cn(
                                                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all text-left",
                                                theme === opt.value
                                                    ? "bg-white/15 text-white"
                                                    : "text-white/70 hover:bg-white/8 hover:text-white"
                                            )}
                                        >
                                            <div className={cn("w-4 h-4 rounded-full shrink-0", opt.color)} />
                                            <span>{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Toggle button */}
                    <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setPickerOpen(prev => !prev)}
                        className={cn(
                            "flex items-center gap-2 h-10 px-3.5 rounded-full liquid-glass dark overflow-hidden relative",
                            "shadow-lg shadow-black/20 transition-colors"
                        )}
                    >
                        <div className="absolute inset-0 rounded-full bg-[oklch(0.13_0.01_240/0.55)] pointer-events-none" />
                        <Palette className="w-4 h-4 text-white/80 relative z-10" />
                        <div className={cn("w-3.5 h-3.5 rounded-full shrink-0 relative z-10", currentTheme.color)} />
                    </motion.button>
                </div>
            </div>
        </section>
    );
}
