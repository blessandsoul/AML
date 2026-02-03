'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function StickyCTA() {
    const [isScrolled, setIsScrolled] = React.useState(false);

    React.useEffect(() => {
        const toggleVisibility = () => {
            setIsScrolled(window.scrollY > 500);
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const buttons = (
        <>
            <Button
                size="icon"
                className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-emerald-500 hover:bg-emerald-600 shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300"
                title="WhatsApp"
                asChild
            >
                <a href="https://wa.me/995599000000" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </a>
            </Button>

            <Button
                size="icon"
                className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-primary hover:bg-primary/90 shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300"
                title="დაგვირეკეთ"
                asChild
            >
                <a href="tel:+995599000000">
                    <Phone className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
                </a>
            </Button>
        </>
    );

    return (
        <>
            {/* Mobile - always visible */}
            <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2 md:hidden">
                {buttons}
            </div>

            {/* Desktop - show after scroll */}
            <AnimatePresence>
                {isScrolled && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.8 }}
                        className="fixed bottom-6 right-6 z-40 hidden md:flex flex-col gap-3"
                    >
                        {buttons}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
