'use client';

import * as React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

const FAQS = [
    {
        q: "Is the shipping insured?",
        a: "Yes, every vehicle is fully insured during maritime transit. We provide a full photo report at every stage: auction, warehouse, and loading."
    },
    {
        q: "What if the car has hidden damage?",
        a: "We provide access to Carfax and AutoCheck. Our experts inspect the listing photos and seller rating to minimize risks before you bid."
    },
    {
        q: "How long does delivery take?",
        a: "Typically 45-60 days from the US East Coast to Poti/Batumi. Times may vary depending on the auction location and shipping lines."
    },
    {
        q: "Can I participate in auctions myself?",
        a: "Yes! We give you direct access to Copart and IAAI. You select, we advise and place the bid for you to ensure safety."
    }
];

export function MinimalFAQ() {
    return (
        <section className="bg-muted/30 py-24 border-t border-border">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-12">
                    <h3 className="text-3xl font-black text-foreground tracking-tight mb-4">
                        Common Questions
                    </h3>
                    <p className="text-muted-foreground font-medium">
                        Everything you need to know before bidding.
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-4">
                    {FAQS.map((faq, i) => (
                        <AccordionItem key={i} value={`item-${i}`} className="bg-background border border-border rounded-xl px-4 overflow-hidden shadow-sm">
                            <AccordionTrigger className="hover:text-primary text-left font-bold text-foreground py-4">
                                {faq.q}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                                {faq.a}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
