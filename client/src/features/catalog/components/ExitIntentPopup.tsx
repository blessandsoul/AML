'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LeadCaptureModal } from './LeadCaptureModal';

export function ExitIntentPopup() {
    const [isVisible, setIsVisible] = React.useState(false);
    const [hasTriggered, setHasTriggered] = React.useState(false);
    const [showLeadModal, setShowLeadModal] = React.useState(false);

    React.useEffect(() => {
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 && !hasTriggered) {
                // User moving mouse towards top (tab bar/back button)
                setIsVisible(true);
                setHasTriggered(true);
            }
        };

        // For mobile: logic is harder, often scroll speed or back button. 
        // We'll stick to desktop mouse leave for this "Zombie" version MVP.

        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, [hasTriggered]);

    const handleClaim = () => {
        setIsVisible(false);
        setShowLeadModal(true);
    };

    return (
        <>
            <AnimatePresence>
                {isVisible && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsVisible(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-lg p-4"
                        >
                            <div className="bg-card border-2 border-red-500 rounded-3xl overflow-hidden shadow-2xl shadow-red-500/20 relative">
                                <button
                                    onClick={() => setIsVisible(false)}
                                    className="absolute top-4 right-4 p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors z-20"
                                >
                                    <X className="w-4 h-4" />
                                </button>

                                <div className="grid md:grid-cols-5 h-full">
                                    <div className="hidden md:flex md:col-span-2 bg-red-500 items-center justify-center p-6 text-white text-center flex-col gap-4">
                                        <AlertTriangle className="w-12 h-12 animate-bounce" />
                                        <p className="font-black text-2xl uppercase leading-none">
                                            მოიცადეთ!
                                        </p>
                                    </div>
                                    <div className="col-span-3 p-8 flex flex-col justify-center space-y-4 bg-background">
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-black uppercase text-foreground">
                                                არ მოტყუვდეთ!
                                            </h3>
                                            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                                სანამ გახვალთ, მიიღეთ ჩვენი უფასო გზამკვლევი: <br />
                                                <span className="text-foreground font-bold">"7 შეცდომა იმპორტის დროს"</span>.
                                                ამან შეიძლება ათასობით დოლარი დაგიზოგოთ.
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-background rounded-lg shadow-sm">
                                                    <FileText className="w-5 h-5 text-primary" />
                                                </div>
                                                <div className="text-xs">
                                                    <div className="font-bold">უფასო PDF გზამკვლევი</div>
                                                    <div className="text-muted-foreground">მომენტალური გადმოწერა</div>
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            onClick={handleClaim}
                                            className="w-full text-base font-bold uppercase h-12 shadow-lg hover:shadow-xl transition-all"
                                        >
                                            გზამკვლევის მიღება
                                        </Button>

                                        <button
                                            onClick={() => setIsVisible(false)}
                                            className="text-[10px] text-center text-muted-foreground underline hover:text-foreground"
                                        >
                                            არა, მადლობა. გავრისკავ.
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <LeadCaptureModal
                isOpen={showLeadModal}
                onClose={() => setShowLeadModal(false)}
                context="exit_intent"
            />
        </>
    );
}
