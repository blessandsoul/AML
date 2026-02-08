'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Ship, Truck, Gavel, Car,
    ShieldCheck, Calculator,
    CheckCircle2, MapPin, Flag, Landmark,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
    AUCTION_TYPES,
    USA_CITIES,
    DESTINATION_PORTS,
    VEHICLE_CATEGORIES,
    FUEL_TYPES,
    INSURANCE_OPTIONS,
} from '@/features/catalog/constants/calculator-data';
import { compute, fmt, type CalcResult } from '@/features/catalog/utils/calculator';

export default function LogisticsCalculator() {
    const USD_TO_GEL_RATE = 2.7;
    const GEL_TO_USD_RATE = 1 / USD_TO_GEL_RATE;

    // Form state
    const [auctionType, setAuctionType] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [currency, setCurrency] = React.useState<'USD' | 'GEL'>('USD');
    const [usaCity, setUsaCity] = React.useState('');
    const [usState, setUsState] = React.useState('');
    const [destinationPort, setDestinationPort] = React.useState('');
    const [vehicleCategory, setVehicleCategory] = React.useState('');
    const [fuelType, setFuelType] = React.useState('');
    const [insurance, setInsurance] = React.useState('');

    // Calculation state
    const [isCalculating, setIsCalculating] = React.useState(false);
    const [result, setResult] = React.useState<CalcResult | null>(null);
    const [showResults, setShowResults] = React.useState(false);

    // Derived: unique US states from city list
    const usStates = React.useMemo(() => {
        const set = new Set<string>();
        USA_CITIES.forEach(c => {
            const m = c.match(/^([A-Z]{2})\s*[-–]/);
            if (m) set.add(m[1]);
        });
        return Array.from(set).sort();
    }, []);

    // Derived: cities filtered by selected state
    const filteredCities = React.useMemo(() => {
        if (!usState) return USA_CITIES;
        return USA_CITIES.filter(c => {
            const m = c.match(/^([A-Z]{2})\s*[-–]/);
            return m && m[1] === usState;
        });
    }, [usState]);

    const handleCalculate = () => {
        const priceNum = parseFloat(price) || 0;
        if (priceNum <= 0) return;

        setIsCalculating(true);
        const priceInUsd = currency === 'GEL'
            ? Math.round(priceNum * GEL_TO_USD_RATE)
            : priceNum;

        setTimeout(() => {
            const computed = compute(
                priceInUsd,
                destinationPort || 'POTI',
                vehicleCategory || 'Sedan',
                fuelType || 'Gasoline',
                insurance || 'No',
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
                    გამოთვალეთ სრული ლოჯისტიკური ხარჯები აუქციონიდან საქართველომდე
                </p>
            </div>

            {/* ── 2-Column Layout ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                {/* Left: Input Dropdowns */}
                <div className="space-y-4">
                    {/* Auction */}
                    <div className="relative flex items-center border-2 border-border rounded-xl px-5 h-14 bg-background">
                        <Gavel className="w-5 h-5 text-primary shrink-0" />
                        <Select value={auctionType} onValueChange={setAuctionType}>
                            <SelectTrigger className="h-full border-0 shadow-none rounded-none pl-2 pr-0 text-sm font-medium bg-transparent focus:ring-0 flex-1">
                                <SelectValue placeholder="აუქციონი" />
                            </SelectTrigger>
                            <SelectContent>
                                {AUCTION_TYPES.map(o => (
                                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* City */}
                    <div className="relative flex items-center border-2 border-border rounded-xl px-5 h-14 bg-background">
                        <MapPin className="w-5 h-5 text-primary shrink-0" />
                        <Select value={usaCity} onValueChange={setUsaCity}>
                            <SelectTrigger className="h-full border-0 shadow-none rounded-none pl-2 pr-0 text-sm font-medium bg-transparent focus:ring-0 flex-1">
                                <SelectValue placeholder="ქალაქი" />
                            </SelectTrigger>
                            <SelectContent className="max-h-72">
                                {filteredCities.map(city => (
                                    <SelectItem key={city} value={city}>{city}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* State */}
                    <div className="relative flex items-center border-2 border-border rounded-xl px-5 h-14 bg-background">
                        <Flag className="w-5 h-5 text-primary shrink-0" />
                        <Select value={usState} onValueChange={setUsState}>
                            <SelectTrigger className="h-full border-0 shadow-none rounded-none pl-2 pr-0 text-sm font-medium bg-transparent focus:ring-0 flex-1">
                                <SelectValue placeholder="შტატი" />
                            </SelectTrigger>
                            <SelectContent className="max-h-72">
                                {usStates.map(s => (
                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Destination Port */}
                    <div className="relative flex items-center border-2 border-border rounded-xl px-5 h-14 bg-background">
                        <Landmark className="w-5 h-5 text-primary shrink-0" />
                        <Select value={destinationPort} onValueChange={setDestinationPort}>
                            <SelectTrigger className="h-full border-0 shadow-none rounded-none pl-2 pr-0 text-sm font-medium bg-transparent focus:ring-0 flex-1">
                                <SelectValue placeholder="დანიშნულების პორტი" />
                            </SelectTrigger>
                            <SelectContent>
                                {DESTINATION_PORTS.map(p => (
                                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Right: Included Services */}
                <div className="space-y-4">
                    {/* Insurance — included */}
                    <div className="flex items-center border-2 border-border rounded-xl px-5 h-14 gap-3 bg-background">
                        <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                        <span className="text-sm font-medium text-foreground flex-1">დაზღვევა</span>
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>

                    {/* Ground shipping — included */}
                    <div className="flex items-center border-2 border-border rounded-xl px-5 h-14 gap-3 bg-background">
                        <Truck className="w-5 h-5 text-primary shrink-0" />
                        <span className="text-sm font-medium text-foreground flex-1">სახმელეთო გადაზიდვა აშ-ში</span>
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>

                    {/* Container — priced */}
                    <div className="flex items-center border-2 border-border rounded-xl px-5 h-14 gap-3 bg-background">
                        <Ship className="w-5 h-5 text-primary shrink-0" />
                        <span className="text-sm font-medium text-foreground flex-1">კონტეინერი</span>
                        <span className="text-sm font-bold text-primary">
                            {result ? `${fmt(result.seaShipping)}$` : '0$'}
                        </span>
                    </div>

                    {/* Final cost — priced */}
                    <div className="flex items-center border-2 border-border rounded-xl px-5 h-14 gap-3 bg-background">
                        <Car className="w-5 h-5 text-primary shrink-0" />
                        <span className="text-sm font-medium text-foreground flex-1">საბოლოო ღირებულება</span>
                        <span className="text-sm font-bold text-primary">
                            {result ? `${fmt(result.total)}$` : '0$'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="border-t border-border/50" />

            {/* ── Additional Details ── */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">ფასი</Label>
                    <div className="flex">
                        <button
                            type="button"
                            onClick={() => setCurrency(prev => prev === 'USD' ? 'GEL' : 'USD')}
                            className="flex items-center justify-center h-12 w-12 shrink-0 rounded-l-xl border-2 border-r-0 border-border bg-primary/10 hover:bg-primary/20 transition-colors text-base font-bold text-primary"
                            title="ვალუტის შეცვლა"
                        >
                            {currencySymbol}
                        </button>
                        <Input
                            type="number"
                            placeholder="0"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="rounded-l-none rounded-r-xl h-12 border-2 border-border bg-background font-mono font-bold text-base"
                        />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">ტრანსპორტი</Label>
                    <Select value={vehicleCategory} onValueChange={setVehicleCategory}>
                        <SelectTrigger className="h-12 w-full rounded-xl bg-background border-2 border-border text-sm font-medium hover:border-primary/40 focus:border-primary focus:ring-primary/20 transition-colors">
                            <SelectValue placeholder="აირჩიეთ" />
                        </SelectTrigger>
                        <SelectContent>
                            {VEHICLE_CATEGORIES.map(o => (
                                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">ძრავა</Label>
                    <Select value={fuelType} onValueChange={setFuelType}>
                        <SelectTrigger className="h-12 w-full rounded-xl bg-background border-2 border-border text-sm font-medium hover:border-primary/40 focus:border-primary focus:ring-primary/20 transition-colors">
                            <SelectValue placeholder="აირჩიეთ" />
                        </SelectTrigger>
                        <SelectContent>
                            {FUEL_TYPES.map(o => (
                                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">დაზღვევა</Label>
                    <Select value={insurance} onValueChange={setInsurance}>
                        <SelectTrigger className="h-12 w-full rounded-xl bg-background border-2 border-border text-sm font-medium hover:border-primary/40 focus:border-primary focus:ring-primary/20 transition-colors">
                            <SelectValue placeholder="აირჩიეთ" />
                        </SelectTrigger>
                        <SelectContent>
                            {INSURANCE_OPTIONS.map(o => (
                                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Calculate Button */}
            <Button
                onClick={handleCalculate}
                disabled={isCalculating || !price}
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
                                    სულ საქართველოში
                                </p>
                                <motion.p
                                    key={result.total}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-4xl md:text-5xl font-black text-primary font-mono"
                                >
                                    {currencySymbol}
                                    {fmt(currency === 'GEL' ? Math.round(result.total * USD_TO_GEL_RATE) : result.total)}
                                </motion.p>
                            </div>

                            {/* Breakdown Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <ResultItem label="ლოტის ფასი" value={result.lotPrice} currency={currency} rate={USD_TO_GEL_RATE} />
                                <ResultItem label="საკომისიო" value={result.auctionFee} currency={currency} rate={USD_TO_GEL_RATE} />
                                <ResultItem label="სახმელეთო" value={result.usaDelivery} currency={currency} rate={USD_TO_GEL_RATE} />
                                <ResultItem label="საზღვაო" value={result.seaShipping} currency={currency} rate={USD_TO_GEL_RATE} />
                                <ResultItem label="დაზღვევა" value={result.insurance} currency={currency} rate={USD_TO_GEL_RATE} />
                                <ResultItem label="განბაჟება" value={result.customsDuty} currency={currency} rate={USD_TO_GEL_RATE} />
                                <ResultItem label="საბაზრო ფასი" value={result.localMarketPrice} currency={currency} rate={USD_TO_GEL_RATE} />
                                <ResultItem label="დაზოგავთ" value={result.savings} currency={currency} rate={USD_TO_GEL_RATE} highlight />
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
