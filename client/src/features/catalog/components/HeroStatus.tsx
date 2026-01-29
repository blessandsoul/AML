'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap } from 'lucide-react';

export function HeroStatus() {
    return (
        <React.Fragment>
            {/* Bottom Status Bar - Clean & Icon-focused */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap gap-8 items-center justify-center w-full"
            >
                {[
                    { icon: ShieldCheck, text: "სანდო დილერი" },
                    { icon: Zap, text: "სწრაფი კალკულაცია" },
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 group opacity-70 hover:opacity-100 transition-opacity cursor-default">
                        <item.icon className="w-5 h-5 text-primary" />
                        <span className="text-sm font-bold uppercase tracking-widest text-foreground font-sans">{item.text}</span>
                    </div>
                ))}
            </motion.div>
        </React.Fragment>
    );
}
