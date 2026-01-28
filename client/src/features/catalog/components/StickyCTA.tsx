'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function StickyCTA() {
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 500) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.8 }}
                    className="fixed bottom-6 right-6 z-40 flex flex-col gap-3"
                >
                    <Button
                        size="icon"
                        className="h-14 w-14 rounded-full bg-emerald-500 hover:bg-emerald-600 shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300"
                        title="Chat on WhatsApp"
                    >
                        <MessageCircle className="w-7 h-7 text-white" />
                    </Button>

                    <Button
                        size="icon"
                        className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300"
                        title="Call Us"
                    >
                        <Phone className="w-6 h-6 text-primary-foreground" />
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
