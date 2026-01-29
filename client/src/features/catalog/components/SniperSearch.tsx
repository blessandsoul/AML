'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Crosshair, Zap, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LeadCaptureModal } from './LeadCaptureModal';

export function SniperSearch() {
    const [showModal, setShowModal] = React.useState(false);

    return (
        <>
            <section className="py-8 md:py-12 bg-black text-white relative overflow-hidden border-y border-white/10">
                {/* Tech background grid */}
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

                <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
                    <div className="flex items-start gap-4 md:gap-6">
                        <div className="p-3 bg-primary/20 rounded-xl animate-pulse-slow shrink-0 hidden md:block">
                            <Bot className="w-8 h-8 text-primary" />
                        </div>
                        <div className="space-y-2 text-center md:text-left">
                            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight flex items-center justify-center md:justify-start gap-2">
                                <Crosshair className="w-6 h-6 text-primary md:hidden" />
                                დაიღალეთ ძებნით?
                            </h3>
                            <p className="text-muted-foreground max-w-md mx-auto md:mx-0 font-medium">
                                გაააქტიურეთ ჩვენი <span className="text-primary font-bold">სნაიპერ ბოტი</span>. მიუთითეთ ბიუჯეტი და მოდელი, და ის იპოვის 24/7.
                            </p>
                        </div>
                    </div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            onClick={() => setShowModal(true)}
                            size="lg"
                            className="h-16 px-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-lg shadow-[0_0_30px_-5px_hsl(var(--primary))]"
                        >
                            <Zap className="w-5 h-5 mr-3 fill-current" />
                            ბოტის გააქტიურება
                        </Button>
                    </motion.div>
                </div>
            </section>

            <LeadCaptureModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                context="sniper"
            />
        </>
    );
}
