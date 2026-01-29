'use client';

import * as React from 'react';
import Image from 'next/image';

const TEAM = [
    { name: "გიორგი მ.", role: "უფროსი ბროკერი", img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&q=80" },
    { name: "ანა კ.", role: "ლოჯისტიკა", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80" },
    { name: "დავით ლ.", role: "ინსპექტირება", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
];

export function TeamTrust() {
    return (
        <section className="bg-background py-20 border-t border-border">
            <div className="container mx-auto px-4 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-8">
                    რეალური გუნდი, რეალური მხარდაჭერა
                </p>
                <div className="flex justify-center flex-wrap gap-8 md:gap-16">
                    {TEAM.map((member, i) => (
                        <div key={i} className="flex flex-col items-center gap-3">
                            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20 p-1">
                                <div className="relative w-full h-full rounded-full overflow-hidden bg-muted">
                                    <Image src={member.img} alt={member.name} fill className="object-cover grayscale" />
                                </div>
                            </div>
                            <div className="text-center">
                                <h4 className="font-bold text-foreground text-sm">{member.name}</h4>
                                <p className="text-xs text-muted-foreground font-medium">{member.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
