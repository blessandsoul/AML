'use client';

import * as React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface AuctionFiltersProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AuctionFilters({ isOpen, onClose }: AuctionFiltersProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden">
            <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-background border-l p-6 shadow-xl animate-in slide-in-from-right">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-lg font-bold">ფილტრი</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label>ფასი ($0 - $100,000)</Label>
                        <Slider defaultValue={[0, 100000]} max={100000} step={1000} />
                    </div>

                    <div className="space-y-2">
                        <Label>წელი (2010 - 2025)</Label>
                        <Slider defaultValue={[2015, 2025]} min={2010} max={2025} step={1} />
                    </div>

                    <div className="space-y-2">
                        <Label>აუქციონი</Label>
                        <div className="flex flex-wrap gap-2">
                            {['Copart', 'IAAI', 'Manheim', 'Adesa'].map(a => (
                                <div key={a} className="border border-border rounded-md px-3 py-1 text-sm font-medium hover:bg-muted cursor-pointer transition-colors">
                                    {a}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                    <Button className="w-full font-bold" onClick={onClose}>
                        გაფილტვრა
                    </Button>
                </div>
            </div>
        </div>
    );
}
