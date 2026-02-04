'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Globe, Zap, BadgeDollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Benefits() {
    const benefits = [
        {
            icon: ShieldCheck,
            title: "სანდო დილერები",
            description: "წვდომა მხოლოდ ლიცენზირებულ და დაზღვეულ ინვენტარზე.",
        },
        {
            icon: Globe,
            title: "გლობალური ლოჯისტიკა",
            description: "სწრაფი ტრანსპორტირება ამერიკიდან და ევროპიდან ფოთამდე და ბათუმამდე.",
        },
        {
            icon: BadgeDollarSign,
            title: "საბითუმო ფასები",
            description: "შუამავლების გარეშე. იხდით რეალურ აუქციონის ფასს + ფიქსირებული საკომისიო.",
        },
        {
            icon: Zap,
            title: "მომენტალური კალკულატორი",
            description: "ზუსტი ტრანსპორტირების და განბაჟების ხარჯები თითოეული ლოტისთვის.",
        }
    ];

    return (
        <section className="bg-background py-14 md:py-32 border-t border-border">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-10 md:mb-20 space-y-4">
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-primary">რატომ ჩვენ</h2>
                    <h3 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
                        თანამედროვე სტანდარტი <br className="md:hidden" />
                        ლოჯისტიკაში
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {benefits.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="group p-8 rounded-3xl bg-card border border-border hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className={cn("mb-6 inline-flex p-4 rounded-2xl bg-primary/10 text-primary")}>
                                <item.icon className="w-8 h-8" />
                            </div>

                            <h4 className="text-xl font-bold text-foreground mb-3 font-sans">{item.title}</h4>
                            <p className="text-muted-foreground leading-relaxed text-base font-medium">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
