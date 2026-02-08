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
        q: "არის თუ არა ტრანსპორტირება დაზღვეული?",
        a: "დიახ, ყველა ავტომობილი სრულად დაზღვეულია საზღვაო გადაზიდვისას. ჩვენ გთავაზობთ სრულ ფოტო რეპორტს ყველა ეტაპზე: აუქციონი, საწყობი და ჩატვირთვა."
    },
    {
        q: "რა ხდება თუ მანქანას აქვს ფარული დაზიანება?",
        a: "ჩვენ გთავაზობთ წვდომას Carfax-ზე და AutoCheck-ზე. ჩვენი ექსპერტები ამოწმებენ ფოტოებს და გამყიდველის რეიტინგს რისკების მინიმიზაციისთვის."
    },
    {
        q: "რამდენი ხანი სჭირდება ჩამოყვანას?",
        a: "ჩვეულებრივ 45-60 დღე ამერიკის აღმოსავლეთ სანაპიროდან ფოთამდე/ბათუმამდე."
    },
    {
        q: "შემიძლია თავად მივიღო მონაწილეობა აუქციონში?",
        a: "დიახ! ჩვენ გაძლევთ პირდაპირ წვდომას Copart-ზე და IAAI-ზე. თქვენ ირჩევთ, ჩვენ გირჩევთ და ვდებთ ფსონს თქვენთვის უსაფრთხოების გარანტიით."
    }
];

export function MinimalFAQ() {
    return (
        <section className="bg-white/3 dark:bg-white/2 backdrop-blur-sm py-12 md:py-24 border-t border-white/8 dark:border-white/5">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-12">
                    <h3 className="text-3xl font-black text-foreground tracking-tight mb-4">
                        ხშირად დასმული კითხვები
                    </h3>
                    <p className="text-muted-foreground font-medium">
                        ყველაფერი რაც უნდა იცოდეთ აუქციონამდე.
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-4">
                    {FAQS.map((faq, i) => (
                        <AccordionItem key={i} value={`item-${i}`} className="bg-background/90 dark:bg-background/80 border border-white/8 dark:border-white/5 rounded-xl px-4 overflow-hidden shadow-sm">
                            <AccordionTrigger className="hover:text-primary text-left font-bold text-foreground py-4">
                                {faq.q}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                                {faq.a}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            "mainEntity": FAQS.map(faq => ({
                                "@type": "Question",
                                "name": faq.q,
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": faq.a
                                }
                            }))
                        })
                    }}
                />
            </div>
        </section>
    );
}
