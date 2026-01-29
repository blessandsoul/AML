'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell } from 'lucide-react';

const MESSAGES = [
    '2021 BMW M5 გაიყიდა $45,000-ად (IAAI)',
    'ახალი ლოტი დაემატა: 2023 Porsche 911',
    'გიორგი მ. მოიგო აუქციონი - Toyota Camry',
    'Copart Live: რეკორდული აქტივობა!',
    '2022 RAM 1500 TRX გაიყიდა $52,500-ად'
];

export function LiveTicker() {
    const [index, setIndex] = React.useState(0);
    const [visible, setVisible] = React.useState(true);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setVisible(false);
            setTimeout(() => {
                setIndex((prev) => (prev + 1) % MESSAGES.length);
                setVisible(true);
            }, 500);
        }, 8000); // Change every 8s

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="fixed bottom-6 left-6 z-50 pointer-events-none">
            <AnimatePresence mode="wait">
                {visible && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="bg-zinc-900/90 text-white backdrop-blur-md px-4 py-3 rounded-lg shadow-2xl border border-white/10 flex items-center gap-3 max-w-xs md:max-w-sm"
                    >
                        <div className="bg-green-500 rounded-full w-2 h-2 animate-pulse shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate">{MESSAGES[index]}</p>
                        </div>
                        <Bell className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
