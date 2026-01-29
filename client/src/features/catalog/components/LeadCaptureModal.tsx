'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, CheckCircle, ArrowRight, Zap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'; // Removed Dialog dependency
// To be safe and minimal:

// Define the contexts for the modal
export type LeadContextType = 'price_unlock' | 'calculation' | 'general' | 'hunter' | 'sniper' | 'exit_intent';

interface LeadCaptureModalProps {
    isOpen: boolean;
    onClose: () => void;
    context?: LeadContextType;
    metadata?: any; // Extra data like car ID, calculated price, etc.
}

export function LeadCaptureModal({ isOpen, onClose, context = 'general', metadata }: LeadCaptureModalProps) {
    const [step, setStep] = React.useState<'form' | 'success'>('form');
    const [phone, setPhone] = React.useState('');
    const [name, setName] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    // Reset state when opening
    React.useEffect(() => {
        if (isOpen) {
            setStep('form');
            setIsSubmitting(false);
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        console.log('Lead Captured:', { context, metadata, phone, name });
        setStep('success');
        setIsSubmitting(false);
    };

    // Dynamic Copy based on Context
    const getContent = () => {
        switch (context) {
            case 'price_unlock':
                return {
                    title: "დაფარული ფასის გახსნა",
                    desc: "ამ მანქანას აქვს სპეციალური დილერის ფასი. შეიყვანეთ ნომერი რომ მომენტალურად ნახოთ.",
                    cta: "ფასის ნახვა",
                    icon: <Lock className="w-6 h-6 text-yellow-500" />
                };
            case 'calculation':
                return {
                    title: "კალკულაცია მზადაა!",
                    desc: "ჩვენ დავითვალეთ სრული ხარჯი ფოთამდე. სად გამოგიგზავნოთ დეტალური გათვლა?",
                    cta: "გამომიგზავნეთ ხარჯთაღრიცხვა",
                    icon: <CheckCircle className="w-6 h-6 text-green-500" />
                };
            case 'sniper':
                return {
                    title: "სნაიპერ ბოტის გააქტიურება",
                    desc: "არ დაკარგოთ დრო ძებნაში. ჩვენი ბოტი იპოვის იდეალურ ვარიანტს თქვენთვის.",
                    cta: "ბოტის გააქტიურება",
                    icon: <Target className="w-6 h-6 text-blue-500" />
                };
            case 'hunter':
                return {
                    title: "ვერ პოულობთ?",
                    desc: "გვითხარით რა გსურთ. ჩვენ მოვძებნით დახურულ აუქციონებზე.",
                    cta: "მანქანის მოძებნა",
                    icon: <ArrowRight className="w-6 h-6 text-purple-500" />
                };
            default:
                return {
                    title: "არ გამოტოვოთ",
                    desc: "დაგვიტოვეთ საკონტაქტო და ჩვენ დაგიჭერთ ამ დილს.",
                    cta: "დილის დაჯავშნა",
                    icon: <Zap className="w-6 h-6 text-primary" />
                };
        }
    };

    const content = getContent();

    // Lock body scroll
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-all"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                            className="bg-card w-full max-w-md rounded-2xl border border-primary/20 shadow-2xl overflow-hidden pointer-events-auto relative"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted/50 text-muted-foreground transition-colors z-20"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {/* Header Gradient */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

                            <div className="p-0">
                                <AnimatePresence mode="wait">
                                    {step === 'form' ? (
                                        <motion.div
                                            key="form"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="p-6 space-y-6"
                                        >
                                            <div className="flex items-center gap-4 mt-2">
                                                <div className="p-3 bg-primary/10 rounded-full ring-1 ring-primary/20 shrink-0">
                                                    {content.icon}
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-black uppercase tracking-tight text-foreground">
                                                        {content.title}
                                                    </h2>
                                                    <p className="text-sm text-muted-foreground mt-1 leading-snug">
                                                        {content.desc}
                                                    </p>
                                                </div>
                                            </div>

                                            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-bold uppercase text-muted-foreground">თქვენი სახელი</Label>
                                                    <Input
                                                        placeholder="გიორგი..."
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        className="bg-background/50 border-border/50 focus:border-primary transition-all h-11"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-bold uppercase text-muted-foreground">ტელეფონის ნომერი</Label>
                                                    <Input
                                                        type="tel"
                                                        placeholder="+995 555 ..."
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        className="bg-background/50 border-border/50 focus:border-primary transition-all h-11 font-mono"
                                                        required
                                                    />
                                                </div>

                                                <Button
                                                    type="submit"
                                                    className="w-full h-12 text-base font-bold uppercase tracking-wider shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? (
                                                        <span className="flex items-center gap-2">
                                                            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                                            მუშავდება...
                                                        </span>
                                                    ) : (
                                                        content.cta
                                                    )}
                                                </Button>

                                                <p className="text-[10px] text-center text-muted-foreground/60">
                                                    ჩვენ ვიცავთ თქვენს კონფიდენციალურობას.
                                                </p>
                                            </form>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[350px]"
                                        >
                                            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-2 animate-pulse">
                                                <CheckCircle className="w-8 h-8 text-green-500" />
                                            </div>
                                            <h3 className="text-2xl font-black text-foreground">მოთხოვნა გაგზავნილია!</h3>
                                            <p className="text-muted-foreground max-w-[250px] text-sm">
                                                ჩვენი მენეჯერი მალე დაგიკავშირდებათ WhatsApp-ზე დეტალების განსახილველად.
                                            </p>
                                            <Button variant="outline" onClick={onClose} className="mt-4 w-full">
                                                დახურვა
                                            </Button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div >
                        </motion.div >
                    </div >
                </>
            )
            }
        </AnimatePresence >
    );
}
