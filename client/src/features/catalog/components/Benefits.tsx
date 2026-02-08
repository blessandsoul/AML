'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Globe, Zap, BadgeDollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

const benefits = [
    {
        icon: ShieldCheck,
        title: 'სანდო დილერები',
        description: 'ვმუშაობთ ამერიკის ვერიფიცირებულ აუქციონებთან - Copart, IAAI და სხვა.',
    },
    {
        icon: Globe,
        title: 'გლობალური ლოჯისტიკა',
        description: 'სწრაფი ტრანსპორტირება ამერიკიდან ფოთამდე.',
    },
    {
        icon: BadgeDollarSign,
        title: 'საბითუმო ფასები',
        description: 'შუამავლების გარეშე. იხდით რეალურ აუქციონის ფასს + ფიქსირებული საკომისიო.',
    },
    {
        icon: Zap,
        title: 'მომენტალური კალკულატორი',
        description: 'ზუსტი ტრანსპორტირების და განბაჟების ხარჯები თითოეული ლოტისთვის.',
    },
];

export function Benefits() {
    const [active, setActive] = React.useState(0);
    const ActiveIcon = benefits[active].icon;

    return (
        <section className="bg-background/90 dark:bg-background/80 py-14 md:py-32 border-t border-white/8 dark:border-white/5 relative">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-10 md:mb-20 space-y-4">
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                        რატომ ჩვენ
                    </h2>
                    <h3 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
                        თანამედროვე სტანდარტი <br className="md:hidden" />
                        ლოჯისტიკაში
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-6 md:gap-10">
                    {/* Left — list */}
                    <div className="flex flex-col gap-2">
                        {benefits.map((item, i) => (
                            <motion.button
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08, duration: 0.4 }}
                                onClick={() => setActive(i)}
                                className={cn(
                                    'flex items-center gap-4 rounded-2xl px-5 py-4 text-left transition-all duration-300 cursor-pointer',
                                    active === i
                                        ? 'bg-primary/10 border border-primary/20 shadow-sm'
                                        : 'hover:bg-muted/60 border border-transparent'
                                )}
                            >
                                <div
                                    className={cn(
                                        'inline-flex p-2.5 rounded-xl shrink-0 transition-colors duration-300',
                                        active === i
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted text-muted-foreground'
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <span
                                    className={cn(
                                        'text-lg font-bold transition-colors duration-300',
                                        active === i ? 'text-foreground' : 'text-muted-foreground'
                                    )}
                                >
                                    {item.title}
                                </span>
                            </motion.button>
                        ))}
                    </div>

                    {/* Right — detail panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary/[0.07] via-card to-card border border-primary/10 p-8 md:p-12 flex flex-col justify-center min-h-80"
                    >
                        {/* Decorative blobs */}
                        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-primary/5 blur-2xl pointer-events-none" />

                        {/* Step indicator */}
                        <div className="absolute top-6 right-8 text-7xl font-black text-primary/6 select-none pointer-events-none">
                            {String(active + 1).padStart(2, '0')}
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={active}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -16 }}
                                transition={{ duration: 0.3 }}
                                className="relative z-10"
                            >
                                <div className="inline-flex p-4 rounded-2xl bg-primary text-primary-foreground mb-6 shadow-lg shadow-primary/20">
                                    <ActiveIcon className="w-8 h-8" />
                                </div>
                                <h4 className="text-2xl md:text-3xl font-black text-foreground mb-3">
                                    {benefits[active].title}
                                </h4>
                                <div className="w-12 h-1 rounded-full bg-primary/30 mb-4" />
                                <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                                    {benefits[active].description}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
