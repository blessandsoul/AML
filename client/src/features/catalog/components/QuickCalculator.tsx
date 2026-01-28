'use client';

import * as React from 'react';
import { Calculator, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function QuickCalculator() {
    const [price, setPrice] = React.useState('');
    const [total, setTotal] = React.useState<number | null>(null);

    const calculate = () => {
        const val = parseFloat(price);
        if (!isNaN(val)) {
            // Dummy logic: Price + 1500 shipping + 18% VAT approximation (simplified)
            setTotal(val + 1500 + (val * 0.18));
        }
    };

    return (
        <section className="bg-background py-24 border-t border-border">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-primary/5 rounded-3xl p-8 md:p-12 border border-primary/10 relative overflow-hidden">
                    {/* Background Decor */}
                    <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs">
                                <Calculator className="w-4 h-4" />
                                Quick Estimate
                            </div>
                            <h3 className="text-3xl font-black text-foreground tracking-tight">
                                How much will <br />
                                it really cost?
                            </h3>
                            <p className="text-muted-foreground font-medium">
                                Enter the auction bid amount to get an approximate landed cost in Poti (including shipping & fees).
                            </p>
                        </div>

                        <div className="space-y-6 bg-background/50 backdrop-blur-sm p-6 rounded-2xl border border-border">
                            <div className="space-y-2">
                                <Label htmlFor="bid" className="text-xs uppercase font-bold text-muted-foreground">Auction Bid ($)</Label>
                                <div className="flex gap-4">
                                    <Input
                                        id="bid"
                                        placeholder="e.g. 5000"
                                        className="h-12 text-lg font-mono"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && calculate()}
                                    />
                                    <Button onClick={calculate} className="h-12 px-6 font-bold bg-primary text-primary-foreground hover:bg-primary/90">
                                        Calc
                                    </Button>
                                </div>
                            </div>

                            {total !== null && (
                                <div className="pt-4 border-t border-border animate-in fade-in slide-in-from-top-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-muted-foreground">Est. Total in Poti</span>
                                        <span className="text-2xl font-black text-foreground font-mono">
                                            ${total.toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground mt-2 text-right">
                                        *Approximation only. Contact us for precise calculation.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
