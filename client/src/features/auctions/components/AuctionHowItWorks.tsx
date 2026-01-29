'use client';

import { UserPlus, Wallet, Gavel } from 'lucide-react';

const STEPS = [
    {
        icon: UserPlus,
        title: 'რეგისტრაცია 1 წუთში',
        desc: 'უფასო რეგისტრაცია პირადი კაბინეტის შესაქმნელად'
    },
    {
        icon: Wallet,
        title: 'დეპოზიტი',
        desc: 'გაიარეთ ვერიფიკაცია და შეავსეთ ბალანსი ბიდის დასადებად'
    },
    {
        icon: Gavel,
        title: 'მონაწილეობა',
        desc: 'დადეთ ბიდი სასურველ ლოტზე და მოიგეთ აუქციონი'
    }
];

export function AuctionHowItWorks() {
    return (
        <div className="bg-gradient-to-r from-primary/5 via-background to-primary/5 border-y border-primary/10 py-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-4xl mx-auto px-4">
                {STEPS.map((step, i) => {
                    const Icon = step.icon;
                    return (
                        <div key={i} className="flex items-center gap-4 text-center md:text-left flex-1">
                            <div className="w-12 h-12 rounded-full bg-background border border-border shadow-sm flex items-center justify-center shrink-0">
                                <Icon className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm leading-tight text-foreground">{step.title}</h4>
                                <p className="text-[11px] text-muted-foreground font-medium">{step.desc}</p>
                            </div>
                            {i !== STEPS.length - 1 && (
                                <div className="hidden md:block w-8 h-[1px] bg-border mx-auto" />
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
