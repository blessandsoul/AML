'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gavel, Car, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
    AUCTION_TYPES,
    VEHICLE_TYPES_AUCTION,
} from '@/features/catalog/constants/calculator-data';
import { compute, fmt, type CalcResult } from '@/features/catalog/utils/calculator';

export default function AuctionCalculator() {
    const USD_TO_GEL_RATE = 2.7;

    // Form state
    const [auctionType, setAuctionType] = React.useState('');
    const [vehicleType, setVehicleType] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [currency, setCurrency] = React.useState<'USD' | 'GEL'>('USD');

    // Calculation state
    const [isCalculating, setIsCalculating] = React.useState(false);
    const [result, setResult] = React.useState<CalcResult | null>(null);
    const [showResults, setShowResults] = React.useState(false);

    const handleCalculate = () => {
        const priceNum = parseFloat(price) || 0;
        if (priceNum <= 0) return;

        setIsCalculating(true);
        const priceInUsd = currency === 'GEL'
            ? Math.round(priceNum / USD_TO_GEL_RATE)
            : priceNum;

        setTimeout(() => {
            // Use compute function with minimal params for auction calculation
            const computed = compute(
                priceInUsd,
                'POTI', // default port (not used in auction calc)
                'Sedan', // default category (not used in auction calc)
                'Gasoline', // default fuel (not used in auction calc)
                'No', // no insurance for auction-only calc
            );
            setResult(computed);
            setShowResults(true);
            setIsCalculating(false);
        }, 400);
    };

    const currencySymbol = currency === 'GEL' ? '₾' : '$';

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-1 rounded-3xl p-6 md:p-10 max-w-5xl mx-auto space-y-6 md:space-y-8"
        >
            {/* Info Text */}
            <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                    გამოთვალეთ აუქციონის საკომისიო და ლოტის ღირებულება
                </p>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Auction Type */}
                <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        აუქციონი
                    </Label>
                    <div className="relative flex items-center border-2 border-border rounded-xl px-5 h-14 bg-background">
                        <Gavel className="w-5 h-5 text-primary shrink-0" />
                        <Select value={auctionType} onValueChange={setAuctionType}>
                            <SelectTrigger className="h-full border-0 shadow-none rounded-none pl-2 pr-0 text-sm font-medium bg-transparent focus:ring-0 flex-1">
                                <SelectValue placeholder="აირჩიეთ აუქციონი" />
                            </SelectTrigger>
                            <SelectContent>
                                {AUCTION_TYPES.map(o => (
                                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Vehicle Type */}
                <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        ტრანსპორტის ტიპი
                    </Label>
                    <div className="relative flex items-center border-2 border-border rounded-xl px-5 h-14 bg-background">
                        <Car className="w-5 h-5 text-primary shrink-0" />
                        <Select value={vehicleType} onValueChange={setVehicleType}>
                            <SelectTrigger className="h-full border-0 shadow-none rounded-none pl-2 pr-0 text-sm font-medium bg-transparent focus:ring-0 flex-1">
                                <SelectValue placeholder="აირჩიეთ ტიპი" />
                            </SelectTrigger>
                            <SelectContent>
                                {VEHICLE_TYPES_AUCTION.map(o => (
                                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Price Input */}
            <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    ლოტის ფასი
                </Label>
                <div className="flex">
                    <button
                        type="button"
                        onClick={() => setCurrency(prev => prev === 'USD' ? 'GEL' : 'USD')}
                        className="flex items-center justify-center h-14 w-14 shrink-0 rounded-l-xl border-2 border-r-0 border-border bg-primary/10 hover:bg-primary/20 transition-colors text-lg font-bold text-primary"
                        title="ვალუტის შეცვლა"
                    >
                        {currencySymbol}
                    </button>
                    <Input
                        type="number"
                        placeholder="0"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="rounded-l-none rounded-r-xl h-14 border-2 border-border bg-background font-mono font-bold text-lg"
                    />
                </div>
            </div>

            {/* Calculate Button */}
            <Button
                onClick={handleCalculate}
                disabled={isCalculating || !price || !auctionType}
                className="w-full h-14 text-base font-bold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
                size="lg"
            >
                {isCalculating ? (
                    <div className="flex items-center gap-2">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                            <Calculator className="w-5 h-5" />
                        </motion.div>
                        <span>იანგარიშება...</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Calculator className="w-5 h-5" />
                        <span>გამოთვლა</span>
                    </div>
                )}
            </Button>

            {/* Results Panel */}
            <AnimatePresence>
                {showResults && result && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="glass-2 rounded-2xl border border-border/50 p-6 space-y-5">
                            {/* Total */}
                            <div className="text-center py-3">
                                <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-2">
                                    სულ აუქციონზე
                                </p>
                                <motion.p
                                    key={result.total}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-4xl md:text-5xl font-black text-primary font-mono"
                                >
                                    {currencySymbol}
                                    {fmt(currency === 'GEL'
                                        ? Math.round((result.lotPrice + result.auctionFee) * USD_TO_GEL_RATE)
                                        : (result.lotPrice + result.auctionFee)
                                    )}
                                </motion.p>
                            </div>

                            {/* Breakdown Grid */}
                            <div className="grid grid-cols-3 gap-3">
                                <ResultItem
                                    label="ლოტის ფასი"
                                    value={result.lotPrice}
                                    currency={currency}
                                    rate={USD_TO_GEL_RATE}
                                />
                                <ResultItem
                                    label="საკომისიო"
                                    value={result.auctionFee}
                                    currency={currency}
                                    rate={USD_TO_GEL_RATE}
                                />
                                <ResultItem
                                    label="სულ"
                                    value={result.lotPrice + result.auctionFee}
                                    currency={currency}
                                    rate={USD_TO_GEL_RATE}
                                    highlight
                                />
                            </div>

                            {/* Info Note */}
                            <div className="text-center pt-3 border-t border-border/30">
                                <p className="text-xs text-muted-foreground">
                                    * აუქციონის საკომისიო მოიცავს მხოლოდ აუქციონის ხარჯებს.
                                    <br />
                                    სრული ლოჯისტიკური ხარჯების გამოსათვლელად გამოიყენეთ <span className="text-primary font-semibold">ლოგისტიკის მთვლელი</span>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

/* ─── ResultItem Component ─────────────────────────────────── */

function ResultItem({ label, value, currency, rate, highlight = false }: {
    label: string;
    value: number;
    currency: 'USD' | 'GEL';
    rate: number;
    highlight?: boolean;
}) {
    const displayValue = currency === 'GEL' ? Math.round(value * rate) : value;
    const symbol = currency === 'GEL' ? '₾' : '$';

    return (
        <div className={cn(
            "rounded-xl p-3 text-center",
            highlight
                ? "bg-emerald-500/10 border border-emerald-500/20"
                : "glass-1 border border-border/50"
        )}>
            <p className="text-[10px] font-bold uppercase text-muted-foreground truncate">
                {label}
            </p>
            <p className={cn(
                "text-base font-bold font-mono mt-1",
                highlight ? "text-emerald-500" : "text-foreground"
            )}>
                {symbol}{fmt(displayValue)}
            </p>
        </div>
    );
}
