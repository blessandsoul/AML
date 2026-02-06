'use client';

import * as React from 'react';
import { Car } from '../data/mock-cars';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
    Calendar,
    Gauge,
    Fuel,
    Settings2,
    MapPin,
    Building2,
    CheckCircle2,
    Lock,
    Calculator,
    Phone,
    MessageCircle,
    Copy,
    Share2
} from 'lucide-react';
import { toast } from 'sonner';
import { LeadCaptureModal } from './LeadCaptureModal';

interface CarInfoProps {
    car: Car;
}

export function CarInfo({ car }: CarInfoProps) {
    const [showLeadModal, setShowLeadModal] = React.useState(false);
    const [modalContext, setModalContext] = React.useState<'general' | 'price_unlock'>('general');

    // Calculator State
    const [auctionFee] = React.useState(500);
    const [transportCost] = React.useState(1550); // Combined generic shipping
    const total = car.price + auctionFee + transportCost;

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard`);
    };

    const handleUnlockPrice = () => {
        setModalContext('price_unlock');
        setShowLeadModal(true);
    };

    const specs = [
        { icon: Calendar, label: 'წელი', value: car.year },
        { icon: Gauge, label: 'გარბენი', value: `${car.mileage.toLocaleString('en-US')} mi` },
        { icon: Settings2, label: 'ძრავა', value: car.engine },
        { icon: Fuel, label: 'საწვავი', value: car.fuel },
        { icon: MapPin, label: 'ლოკაცია', value: car.location.split(',')[0] },
        { icon: Building2, label: 'აუქციონი', value: car.auction },
    ];

    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm sticky top-24">
            {/* Header Section */}
            <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold leading-tight">{car.title}</h1>
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                            <span className="font-mono bg-muted px-1.5 py-0.5 rounded">Lot: {car.lotNumber}</span>
                            <button
                                onClick={() => handleCopy(car.lotNumber || '', 'Lot number')}
                                className="hover:text-primary transition-colors"
                            >
                                <Copy className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <span className="flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                {car.status === 'active' ? 'აქტიური' : 'დაჯავშნილი'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Price Block */}
                <div className="bg-muted/30 rounded-xl p-4 border border-border dark:border-white/5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-muted-foreground">სრული ფასი ფოთამდე</span>
                        <Badge variant="outline" className="bg-background text-[10px] uppercase">
                            სავარაუდო
                        </Badge>
                    </div>

                    <div className="relative group cursor-pointer" onClick={handleUnlockPrice}>
                        <div className="flex items-baseline gap-2 blur-[6px] group-hover:blur-[4px] transition-all duration-300 opacity-50">
                            <span className="text-3xl font-black text-foreground">
                                ${(total).toLocaleString('en-US')}
                            </span>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center gap-2">
                            <Button size="sm" className="font-bold gap-2 shadow-lg shadow-primary/20">
                                <Lock className="w-4 h-4" />
                                ფასის ნახვა
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                    {specs.map((spec, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="p-2 rounded-md bg-primary/10 text-primary">
                                <spec.icon className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{spec.label}</span>
                                <span className="text-sm font-medium truncate max-w-[120px]">{spec.value}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Profit Calculator Section (Dealer Focus) */}
            <div className="p-6 bg-muted/10 border-b border-border">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2 text-primary">
                        <Calculator className="w-4 h-4" />
                        <h3 className="font-bold text-sm uppercase tracking-wide">მოგების ანალიზი</h3>
                    </div>
                    {/* Profit Tag */}
                    <div className="bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20">
                        პოტენციური მოგება: ${(car.price * 1.35 - (car.price + 500 + 1550)).toLocaleString('en-US')}
                    </div>
                </div>

                {/* Progress Bar Visualization */}
                <div className="relative h-12 bg-background rounded-lg border border-border overflow-hidden mb-6 flex items-center">
                    {/* Cost Segment */}
                    <div className="h-full bg-blue-500/10 flex flex-col justify-center px-4 relative group" style={{ width: '70%' }}>
                        <span className="text-[10px] uppercase font-bold text-blue-600 mb-0.5">თვითღირებულება</span>
                        <span className="text-sm font-black text-foreground">${(car.price + 2050).toLocaleString('en-US')}</span>
                        <div className="absolute right-0 top-0 bottom-0 w-px bg-blue-500/20 border-r border-dashed border-blue-500" />
                    </div>

                    {/* Profit Segment */}
                    <div className="h-full bg-emerald-500/10 flex flex-col justify-center px-4 relative flex-1">
                        <span className="text-[10px] uppercase font-bold text-emerald-600 mb-0.5">მარჟა (~35%)</span>
                        <span className="text-sm font-black text-foreground">${(car.price * 1.35).toLocaleString('en-US')}</span>
                    </div>
                </div>

                <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center bg-background p-2 rounded border border-border/50">
                        <span className="text-muted-foreground flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            ლოტის ღირებულება
                        </span>
                        <span className="font-mono font-medium">${car.price.toLocaleString('en-US')}</span>
                    </div>
                    <div className="flex justify-between items-center bg-background p-2 rounded border border-border/50">
                        <span className="text-muted-foreground flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                            აუქციონი + ტრანსპორტირება
                        </span>
                        <span className="font-mono font-medium">${(500 + 1550).toLocaleString('en-US')}</span>
                    </div>

                    <Separator className="my-2" />

                    <div className="flex justify-between font-bold text-base pt-1">
                        <span>სულ (ფოთამდე)</span>
                        <div className="flex items-center gap-2 text-primary cursor-pointer hover:underline" onClick={handleUnlockPrice}>
                            <Lock className="w-3.5 h-3.5" />
                            <span>დეტალების ნახვა</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 bg-background border-t grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full gap-2" asChild>
                    <a href="tel:+995555123456">
                        <Phone className="w-4 h-4" />
                        დარეკვა
                    </a>
                </Button>
                <Button className="w-full gap-2" onClick={() => {
                    setModalContext('general');
                    setShowLeadModal(true);
                }}>
                    <MessageCircle className="w-4 h-4" />
                    მოწერა
                </Button>
            </div>

            <LeadCaptureModal
                isOpen={showLeadModal}
                onClose={() => setShowLeadModal(false)}
                context={modalContext}
                metadata={car}
            />
        </div>
    );
}
