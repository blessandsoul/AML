'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LeadCaptureModal } from './LeadCaptureModal';

interface HunterCardProps {
    index?: number;
}

export function HunterCard({ index = 0 }: HunterCardProps) {
    const [showModal, setShowModal] = React.useState(false);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative h-full min-h-[380px] rounded-2xl overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-primary/5 flex flex-col items-center justify-center p-6 text-center shadow-lg hover:shadow-primary/20 transition-all duration-500"
            >
                {/* Background Decor */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse" />

                <div className="relative z-10 space-y-6 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center ring-1 ring-primary/30 group-hover:scale-110 transition-transform duration-500">
                        <Search className="w-8 h-8 text-primary" />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-2xl font-black text-foreground leading-tight">
                            ვერ პოულობთ <br />
                            <span className="text-primary">სასურველ მანქანას?</span>
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-[200px] mx-auto leading-relaxed">
                            დაზოგეთ დრო და ენერგია. მოგვწერეთ სასურველი მოდელი და ბიუჯეტი — საუკეთესო ვარიანტს ჩვენ შეგირჩევთ.
                        </p>
                    </div>

                    <Button
                        onClick={() => setShowModal(true)}
                        size="lg"
                        className="w-full h-12 rounded-xl font-bold uppercase tracking-wider shadow-lg shadow-primary/20 hover:shadow-primary/40 text-xs md:text-sm"
                    >
                        მანქანის მოძებნა
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>

                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest flex items-center gap-2 opacity-70">
                        <Target className="w-3 h-3" />
                        დახურულ აუქციონზე წვდომა
                    </div>
                </div>
            </motion.div>

            <LeadCaptureModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                context="hunter"
            />
        </>
    );
}
