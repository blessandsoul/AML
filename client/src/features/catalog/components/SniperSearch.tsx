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
            <section className="py-8 md:py-12 text-white relative overflow-hidden border-y border-white/10">
                {/* AML Brand Gradient Background */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: `
                            linear-gradient(135deg,
                                #1C2331 0%,
                                #2D88C4 50%,
                                #1C2331 100%
                            )
                        `,
                    }}
                />

                {/* Turquoise glow accent - top right */}
                <div
                    className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20 blur-3xl"
                    style={{ background: '#55A8B9' }}
                />

                {/* Navy Blue glow accent - bottom left */}
                <div
                    className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full opacity-15 blur-3xl"
                    style={{ background: '#3498DB' }}
                />

                {/* Tech grid overlay */}
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#55A8B915_1px,transparent_1px),linear-gradient(to_bottom,#55A8B915_1px,transparent_1px)] bg-[size:32px_32px]" />

                {/* Subtle shimmer line */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />

                <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
                    <div className="flex items-start gap-4 md:gap-6">
                        <div className="p-3 rounded-xl shrink-0 hidden md:block" style={{ background: 'rgba(85, 168, 185, 0.2)' }}>
                            <Bot className="w-8 h-8" style={{ color: '#55A8B9' }} />
                        </div>
                        <div className="space-y-2 text-center md:text-left">
                            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight flex items-center justify-center md:justify-start gap-2">
                                <Crosshair className="w-6 h-6 md:hidden" style={{ color: '#55A8B9' }} />
                                ვერ პოულობ? ჩვენ მოვძებნით!
                            </h3>
                            <p className="text-white/70 max-w-md mx-auto md:mx-0 font-medium">
                                მიუთითე მოდელი და ბიუჯეტი — ჩვენი გუნდი <span className="font-bold" style={{ color: '#55A8B9' }}>ამერიკულ აუქციონებზე</span> 24/7 ეძებენ და საუკეთესო ვარიანტს შემოგთავაზებენ.
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
                            className="h-16 px-8 rounded-full font-black uppercase tracking-widest text-lg transition-all duration-300 hover:scale-105"
                            style={{
                                background: 'linear-gradient(135deg, #2D88C4 0%, #3498DB 50%, #55A8B9 100%)',
                                color: '#FFFFFF',
                                boxShadow: '0 0 40px -5px rgba(85, 168, 185, 0.5), 0 0 80px -10px rgba(45, 136, 196, 0.3)',
                            }}
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
