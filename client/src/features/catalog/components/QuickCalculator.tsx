'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight,
    Calculator,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

import {
    AUCTION_TYPES,
    VEHICLE_TYPES_AUCTION,
    LOGISTICS_AUCTION_TYPES,
    USA_CITIES,
    DESTINATION_PORTS,
    VEHICLE_CATEGORIES,
    FUEL_TYPES,
    INSURANCE_OPTIONS
} from '../constants/calculator-data';
import { compute, fmt, type CalcResult } from '../utils/calculator';

type Currency = 'USD' | 'GEL';
const USD_TO_GEL_RATE = 2.7;
const GEL_TO_USD_RATE = 1 / USD_TO_GEL_RATE;

function ResultItem({ label, value, currency, highlight = false }: {
    label: string;
    value: number;
    currency: Currency;
    highlight?: boolean;
}) {
    const displayValue = currency === 'GEL' ? Math.round(value * USD_TO_GEL_RATE) : value;
    const symbol = currency === 'GEL' ? '₾' : '$';

    return (
        <div className={cn(
            "rounded-xl p-2 md:p-2.5 text-center",
            highlight
                ? "border border-emerald-500/25"
                : "border border-white/[0.06]"
        )} style={{
            background: highlight ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.03)',
        }}>
            <p className="text-[9px] md:text-[10px] font-bold uppercase text-white/60! truncate">
                {label}
            </p>
            <p className={cn(
                "text-sm md:text-base font-bold font-mono mt-0.5",
                highlight ? "text-emerald-500!" : "text-white!"
            )}>
                {symbol}{fmt(displayValue)}
            </p>
        </div>
    );
}


export function QuickCalculator() {
    const [isCalculating, setIsCalculating] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState<'auction' | 'logistics' | 'details'>('auction');

    // Form state
    const [auctionType, setAuctionType] = React.useState('Copart');
    const [vehicleType, setVehicleType] = React.useState('standard');
    const [price, setPrice] = React.useState('');
    const [currency, setCurrency] = React.useState<Currency>('USD');
    const [logisticsAuction, setLogisticsAuction] = React.useState('Copart');
    const [usaCity, setUsaCity] = React.useState('CA-LOS ANGELES');
    const [destinationPort, setDestinationPort] = React.useState('POTI');
    const [vehicleCategory, setVehicleCategory] = React.useState('Sedan');
    const [fuelType, setFuelType] = React.useState('Gasoline');
    const [insurance, setInsurance] = React.useState('No');

    // Results state
    const [result, setResult] = React.useState<CalcResult | null>(null);
    const [showResults, setShowResults] = React.useState(false);

    const handleCalculate = () => {
        const priceNum = parseFloat(price) || 0;
        if (priceNum <= 0) return;

        setIsCalculating(true);

        const priceInUsd = currency === 'GEL'
            ? Math.round(priceNum * GEL_TO_USD_RATE)
            : priceNum;

        // Small delay for UX feedback
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
        }, 300);
    };

    const currencySymbol = currency === 'GEL' ? '₾' : '$';

    // Components for columns to ensure reusability
    const AuctionColumn = ({ isMobile = false }: { isMobile?: boolean }) => (
        <div className="space-y-2 md:space-y-3">
            {/* Header - Hidden on Mobile if requested */}
            <div className={cn("flex items-center justify-center mb-1 md:mb-2 -mt-1 md:-mt-2", isMobile ? "hidden" : "flex")}>
                <h3 className="font-bold text-sm md:text-base text-white! text-center">აუქციონის საკომისიო</h3>
            </div>

            <div className={cn("grid gap-2 md:gap-2.5", "grid-cols-1")}>
                <div className="space-y-0.5 md:space-y-1 text-center md:text-left min-w-0">
                    <Label className="text-[10px] md:text-[11px] font-bold uppercase text-white/60! w-full block">აუქციონი</Label>
                    <Select value={auctionType} onValueChange={setAuctionType}>
                        <SelectTrigger className="w-full h-9 md:h-10 text-xs md:text-sm bg-white/[0.05] border-white/[0.08] focus:ring-primary/20 focus:border-primary/30 px-3 text-center md:text-left text-white!">
                            <SelectValue placeholder="-" />
                        </SelectTrigger>
                        <SelectContent>
                            {AUCTION_TYPES.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value} className="text-xs md:text-sm">{opt.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-0.5 md:space-y-1 text-center md:text-left min-w-0">
                    <Label className="text-[10px] md:text-[11px] font-bold uppercase text-white/60! w-full block">ტიპი</Label>
                    <Select value={vehicleType} onValueChange={setVehicleType}>
                        <SelectTrigger className="w-full h-9 md:h-10 text-xs md:text-sm bg-white/[0.05] border-white/[0.08] focus:ring-primary/20 focus:border-primary/30 px-3 text-center md:text-left text-white!">
                            <SelectValue placeholder="-" />
                        </SelectTrigger>
                        <SelectContent>
                            {VEHICLE_TYPES_AUCTION.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value} className="text-xs md:text-sm">{opt.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-0.5 md:space-y-1 text-center md:text-left min-w-0">
                    <Label className="text-[10px] md:text-[11px] font-bold uppercase text-white/60! w-full block">ფასი</Label>
                    <div className="relative w-full flex">
                        <button
                            type="button"
                            onClick={() => setCurrency(prev => prev === 'USD' ? 'GEL' : 'USD')}
                            className="flex items-center justify-center h-9 md:h-10 w-9 md:w-11 shrink-0 rounded-l-md border border-r-0 border-white/[0.08] bg-primary/15 hover:bg-primary/25 transition-colors text-sm md:text-base font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            title="ვალუტის შეცვლა"
                        >
                            {currencySymbol}
                        </button>
                        <Input
                            type="number"
                            placeholder="0"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full rounded-l-none h-9 md:h-10 text-xs md:text-sm bg-white/[0.05] border-white/[0.08] focus:border-primary/30 font-mono font-bold text-center md:text-left px-3 text-white! placeholder:text-white/40! [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const LogisticsColumn = ({ isMobile = false }: { isMobile?: boolean }) => (
        <div className="space-y-2 md:space-y-3">
            <div className={cn("flex items-center justify-center mb-1 md:mb-2 -mt-1 md:-mt-2", isMobile ? "hidden" : "flex")}>
                <h3 className="font-bold text-sm md:text-base text-white! text-center">ლოჯისტიკის საფასური</h3>
            </div>

            <div className={cn("grid gap-2 md:gap-2.5", "grid-cols-1")}>
                <div className="space-y-0.5 md:space-y-1 text-center md:text-left min-w-0">
                    <Label className="text-[10px] md:text-[11px] font-bold uppercase text-white/60! w-full block">აუქციონი</Label>
                    <Select value={logisticsAuction} onValueChange={setLogisticsAuction}>
                        <SelectTrigger className="w-full h-9 md:h-10 text-xs md:text-sm bg-white/[0.05] border-white/[0.08] focus:ring-primary/20 focus:border-primary/30 px-3 text-center md:text-left text-white!">
                            <SelectValue placeholder="-" />
                        </SelectTrigger>
                        <SelectContent>
                            {LOGISTICS_AUCTION_TYPES.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value} className="text-xs md:text-sm">{opt.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-0.5 md:space-y-1 text-center md:text-left min-w-0">
                    <Label className="text-[10px] md:text-[11px] font-bold uppercase text-white/60! w-full block">ქალაქი</Label>
                    <Select value={usaCity} onValueChange={setUsaCity}>
                        <SelectTrigger className="w-full h-9 md:h-10 text-xs md:text-sm bg-white/[0.05] border-white/[0.08] focus:ring-primary/20 focus:border-primary/30 px-3 text-center md:text-left text-white!">
                            <SelectValue placeholder="-" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                            {USA_CITIES.map((city) => (
                                <SelectItem key={city} value={city} className="text-xs md:text-sm">{city}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-0.5 md:space-y-1 text-center md:text-left min-w-0">
                    <Label className="text-[10px] md:text-[11px] font-bold uppercase text-white/60! w-full block">პორტი</Label>
                    <Select value={destinationPort} onValueChange={setDestinationPort}>
                        <SelectTrigger className="w-full h-9 md:h-10 text-xs md:text-sm bg-white/[0.05] border-white/[0.08] focus:ring-primary/20 focus:border-primary/30 px-3 text-center md:text-left text-white!">
                            <SelectValue placeholder="-" />
                        </SelectTrigger>
                        <SelectContent>
                            {DESTINATION_PORTS.map((port) => (
                                <SelectItem key={port.value} value={port.value} className="text-xs md:text-sm">{port.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );

    const DetailsColumn = ({ isMobile = false }: { isMobile?: boolean }) => (
        <div className="space-y-2 md:space-y-3">
            <div className={cn("flex items-center justify-center mb-1 md:mb-2 -mt-1 md:-mt-2", isMobile ? "hidden" : "flex")}>
                <h3 className="font-bold text-sm md:text-base text-white! text-center">დამატებითი დეტალები</h3>
            </div>

            <div className={cn("grid gap-2 md:gap-2.5", "grid-cols-1")}>
                <div className="space-y-0.5 md:space-y-1 text-center md:text-left min-w-0">
                    <Label className="text-[10px] md:text-[11px] font-bold uppercase text-white/60! w-full block">ტრანსპორტი</Label>
                    <Select value={vehicleCategory} onValueChange={setVehicleCategory}>
                        <SelectTrigger className="w-full h-9 md:h-10 text-xs md:text-sm bg-white/[0.05] border-white/[0.08] focus:ring-primary/20 focus:border-primary/30 px-3 text-center md:text-left text-white!">
                            <SelectValue placeholder="-" />
                        </SelectTrigger>
                        <SelectContent>
                            {VEHICLE_CATEGORIES.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value} className="text-xs md:text-sm">{cat.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-0.5 md:space-y-1 text-center md:text-left min-w-0">
                    <Label className="text-[10px] md:text-[11px] font-bold uppercase text-white/60! w-full block">ძრავა</Label>
                    <Select value={fuelType} onValueChange={setFuelType}>
                        <SelectTrigger className="w-full h-9 md:h-10 text-xs md:text-sm bg-white/[0.05] border-white/[0.08] focus:ring-primary/20 focus:border-primary/30 px-3 text-center md:text-left text-white!">
                            <SelectValue placeholder="-" />
                        </SelectTrigger>
                        <SelectContent>
                            {FUEL_TYPES.map((fuel) => (
                                <SelectItem key={fuel.value} value={fuel.value} className="text-xs md:text-sm">{fuel.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-0.5 md:space-y-1 text-center md:text-left min-w-0">
                    <Label className="text-[10px] md:text-[11px] font-bold uppercase text-white/60! w-full block">დაზღვევა</Label>
                    <Select value={insurance} onValueChange={setInsurance}>
                        <SelectTrigger className="w-full h-9 md:h-10 text-xs md:text-sm bg-white/[0.05] border-white/[0.08] focus:ring-primary/20 focus:border-primary/30 px-3 text-center md:text-left text-white!">
                            <SelectValue placeholder="-" />
                        </SelectTrigger>
                        <SelectContent>
                            {INSURANCE_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value} className="text-xs md:text-sm">{opt.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="w-full dark overflow-hidden relative liquid-glass rounded-2xl"
            suppressHydrationWarning
        >

            <div className="p-3 md:p-5" style={{ color: '#fff' }}>
                {/* Mobile Tabs */}
                <div className="flex md:hidden items-center justify-between rounded-xl p-1 mb-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {[
                        { id: 'auction', label: 'აუქციონი' },
                        { id: 'logistics', label: 'ლოჯისტიკა' },
                        { id: 'details', label: 'დეტალები' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-bold transition-all w-full justify-center relative",
                                activeTab === tab.id
                                    ? "text-white"
                                    : "text-white/60 hover:bg-white/5"
                            )}
                        >
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-primary rounded-lg shadow-sm"
                                    initial={false}
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-1.5">
                                <span>{tab.label}</span>
                            </span>
                        </button>
                    ))}
                </div>

                {/* Mobile View with Animation */}
                <div className="md:hidden relative min-h-[90px]">
                    <AnimatePresence mode="wait">
                        {activeTab === 'auction' && (
                            <motion.div
                                key="auction"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <AuctionColumn isMobile={true} />
                            </motion.div>
                        )}
                        {activeTab === 'logistics' && (
                            <motion.div
                                key="logistics"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <LogisticsColumn isMobile={true} />
                            </motion.div>
                        )}
                        {activeTab === 'details' && (
                            <motion.div
                                key="details"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <DetailsColumn isMobile={true} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Desktop View (Grid) */}
                <div className="hidden md:grid grid-cols-3 gap-4 md:gap-6 relative items-start">
                    {/* Vertical Dividers - subtle glass edge lines */}
                    <div className="absolute top-2 bottom-2 left-1/3 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                    <div className="absolute top-2 bottom-2 right-1/3 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

                    <AuctionColumn />
                    <LogisticsColumn />
                    <DetailsColumn />
                </div>

                {/* Calculate Button */}
                <div className="mt-3 md:mt-4">
                    <Button
                        onClick={handleCalculate}
                        disabled={isCalculating}
                        className="w-full h-10 md:h-12 text-sm md:text-base font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
                        style={{ color: '#fff' }}
                        size="lg"
                    >
                        {isCalculating ? (
                            <div className="flex items-center gap-2">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                    <Calculator className="w-4 h-4" />
                                </motion.div>
                                <span>იანგარიშება...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Calculator className="w-4 h-4" />
                                <span>გამოთვლა</span>
                            </div>
                        )}
                    </Button>
                </div>

                {/* Results Display */}
                <AnimatePresence>
                    {showResults && result && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4, ease: 'easeInOut' }}
                            className="mt-3 overflow-hidden"
                        >
                            <div className="rounded-xl p-3 md:p-4 space-y-3 border border-white/[0.06]" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                                {/* Total - Hero number */}
                                <div className="text-center py-2">
                                    <p className="text-[10px] md:text-xs font-bold uppercase text-white/60! tracking-wider mb-1">
                                        სულ საქართველოში
                                    </p>
                                    <motion.p
                                        key={result.total}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="text-2xl md:text-3xl font-black text-primary font-mono"
                                    >
                                        {currency === 'GEL' ? '₾' : '$'}
                                        {fmt(currency === 'GEL' ? Math.round(result.total * USD_TO_GEL_RATE) : result.total)}
                                    </motion.p>
                                </div>

                                {/* Breakdown grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    <ResultItem
                                        label="საკომისიო"
                                        value={result.auctionFee}
                                        currency={currency}
                                    />
                                    <ResultItem
                                        label="ტრანსპორტირება"
                                        value={result.usaDelivery + result.seaShipping}
                                        currency={currency}
                                    />
                                    <ResultItem
                                        label="განბაჟება"
                                        value={result.customsDuty}
                                        currency={currency}
                                    />
                                    <ResultItem
                                        label="დაზოგავთ"
                                        value={result.savings}
                                        currency={currency}
                                        highlight
                                    />
                                </div>

                                {/* Link to full calculator */}
                                <div className="text-center pt-1">
                                    <a
                                        href="/calculator"
                                        className="text-[10px] md:text-xs text-primary hover:underline font-medium inline-flex items-center gap-1"
                                    >
                                        სრული კალკულაცია
                                        <ArrowRight className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </motion.div>
    );
}
