'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Search, FileSearch, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { HeroTheme } from '@/providers/hero-theme-provider';

export function CarfaxReport({ theme = 'original' }: { theme?: HeroTheme }) {
    const [vinCode, setVinCode] = React.useState('');
    const [isFocused, setIsFocused] = React.useState(false);

    const handleCheck = () => {
        if (!vinCode.trim()) return;
        // TODO: Implement Carfax check functionality
        console.log('Checking VIN:', vinCode);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && vinCode.trim()) {
            handleCheck();
        }
    };

    const isValidLength = vinCode.length === 17;
    const hasInput = vinCode.length > 0;
    const isWhite = theme === 'white';
    const isDark = theme === 'dark' || theme === 'blue' || theme === 'original';

    // Wrapper classes per theme
    const wrapperCls = cn(
        "relative overflow-hidden rounded-2xl flex-1 transition-colors duration-500",
        theme === 'white' && "bg-white shadow-lg border border-black/5",
        theme === 'original' && "dark liquid-glass",
        theme === 'blue' && "dark rounded-2xl",
        theme === 'dark' && "dark rounded-2xl",
    );
    const wrapperStyle = theme === 'blue'
        ? { background: 'linear-gradient(135deg, oklch(0.42 0.12 250), oklch(0.35 0.15 260))' }
        : theme === 'dark'
            ? { background: 'linear-gradient(135deg, oklch(0.2 0.01 250), oklch(0.15 0.015 260))' }
            : undefined;

    const phoneCls = cn(
        "relative overflow-hidden rounded-2xl shrink-0 flex items-center gap-2 px-4 md:px-5 group transition-all duration-500 hover:scale-[1.02]",
        theme === 'white' && "bg-white shadow-lg border border-black/5",
        theme === 'original' && "dark liquid-glass",
        theme === 'blue' && "dark rounded-2xl",
        theme === 'dark' && "dark rounded-2xl",
    );
    const phoneStyle = theme === 'blue'
        ? { background: 'linear-gradient(135deg, oklch(0.42 0.12 250), oklch(0.35 0.15 260))' }
        : theme === 'dark'
            ? { background: 'linear-gradient(135deg, oklch(0.2 0.01 250), oklch(0.15 0.015 260))' }
            : undefined;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="w-full flex gap-2"
        >
            {/* Carfax VIN check */}
            <div className={wrapperCls} style={wrapperStyle}>
                {theme === 'original' && (
                    <div className="absolute inset-0 rounded-2xl bg-[oklch(0.13_0.01_240/0.4)] pointer-events-none" />
                )}
                <div
                    className={cn("relative px-3 py-2.5 md:px-4 md:py-3", isWhite ? "text-gray-900" : "")}
                    style={isWhite ? undefined : { color: '#fff' }}
                >
                    <div className="flex items-center gap-2.5 md:gap-3">
                        <div className="flex items-center gap-2 shrink-0">
                            <div className={cn(
                                "p-1.5 md:p-2 rounded-lg",
                                isWhite ? "bg-primary/10 text-primary" : "bg-primary/10 text-primary"
                            )}>
                                <FileSearch className="w-4 h-4" />
                            </div>
                            <span className={cn(
                                "text-xs md:text-sm font-bold hidden sm:block",
                                isWhite ? "text-gray-900" : "text-white!"
                            )}>
                                Carfax
                            </span>
                        </div>

                        <div className="relative flex-1">
                            <Input
                                placeholder="VIN კოდი"
                                value={vinCode}
                                onChange={(e) => setVinCode(e.target.value.toUpperCase())}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                onKeyDown={handleKeyDown}
                                maxLength={17}
                                className={cn(
                                    "h-9 md:h-10 text-sm font-mono tracking-wide backdrop-blur-none!",
                                    isWhite
                                        ? "bg-gray-50! border-gray-200! text-gray-900! placeholder:text-gray-400!"
                                        : "text-white! [background:rgba(255,255,255,0.03)]! border-[rgba(255,255,255,0.08)]! placeholder:text-white/40!",
                                    "placeholder:font-sans placeholder:tracking-normal",
                                    "focus:border-primary/30",
                                    "transition-all duration-200",
                                    hasInput && "pr-12"
                                )}
                            />
                            {hasInput && (
                                <div className={cn(
                                    "absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium",
                                    isValidLength ? "text-emerald-500!" : (isWhite ? "text-gray-400!" : "text-white/40!")
                                )}>
                                    {vinCode.length}/17
                                </div>
                            )}
                        </div>

                        <Button
                            onClick={handleCheck}
                            size="sm"
                            className={cn(
                                "h-9 md:h-10 px-3 md:px-4 text-xs md:text-sm font-bold rounded-lg shrink-0",
                                isWhite ? "text-white!" : ""
                            )}
                            style={isWhite ? undefined : { color: '#fff' }}
                        >
                            <Search className="w-3.5 h-3.5 md:mr-1.5" />
                            <span className="hidden md:inline">შემოწმება</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Phone pill */}
            <a
                href="tel:0322054244"
                className={phoneCls}
                style={phoneStyle}
            >
                {theme === 'original' && (
                    <div className="absolute inset-0 rounded-2xl bg-[oklch(0.13_0.01_240/0.4)] pointer-events-none" />
                )}
                <div className="relative flex items-center gap-2.5">
                    <div className={cn(
                        "p-1.5 md:p-2 rounded-lg transition-colors",
                        isWhite
                            ? "bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500/20"
                            : "bg-emerald-500/15 text-emerald-400 group-hover:bg-emerald-500/25"
                    )}>
                        <Phone className="w-4 h-4" />
                    </div>
                    <span
                        className={cn(
                            "hidden md:block text-sm font-bold whitespace-nowrap",
                            isWhite ? "text-gray-900" : "text-white"
                        )}
                        style={isWhite ? undefined : { textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
                    >
                        032 2 054 244
                    </span>
                </div>
            </a>
        </motion.div>
    );
}
