'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Search, FileSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function CarfaxReport() {
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

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="w-full"
        >
            <div className={cn(
                "relative bg-background/80 backdrop-blur-xl border shadow-lg rounded-2xl overflow-hidden transition-all duration-300",
                isFocused ? "border-primary/50 shadow-primary/10" : "border-border/50"
            )}>
                <div className="relative px-3 py-2.5 md:px-4 md:py-3">
                    <div className="flex items-center gap-2.5 md:gap-3">
                        {/* Icon & Label */}
                        <div className="flex items-center gap-2 shrink-0">
                            <div className="p-1.5 md:p-2 rounded-lg bg-primary/10 text-primary">
                                <FileSearch className="w-4 h-4" />
                            </div>
                            <span className="text-xs md:text-sm font-bold text-foreground hidden sm:block">
                                Carfax
                            </span>
                        </div>

                        {/* Input */}
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
                                    "h-9 md:h-10 text-sm font-mono tracking-wide",
                                    "bg-muted/50 border-transparent",
                                    "placeholder:text-muted-foreground/40 placeholder:font-sans placeholder:tracking-normal",
                                    "focus:bg-background focus:border-primary/30",
                                    "transition-all duration-200",
                                    hasInput && "pr-12"
                                )}
                            />
                            {hasInput && (
                                <div className={cn(
                                    "absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium",
                                    isValidLength ? "text-emerald-500" : "text-muted-foreground/60"
                                )}>
                                    {vinCode.length}/17
                                </div>
                            )}
                        </div>

                        {/* Button */}
                        <Button
                            onClick={handleCheck}
                            disabled={!vinCode.trim()}
                            size="sm"
                            className="h-9 md:h-10 px-3 md:px-4 text-xs md:text-sm font-bold rounded-lg shrink-0"
                        >
                            <Search className="w-3.5 h-3.5 md:mr-1.5" />
                            <span className="hidden md:inline">შემოწმება</span>
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
