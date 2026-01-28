'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Search, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export function Hero() {
    const [activeTab, setActiveTab] = React.useState('cars');
    const [isSearchFocused, setIsSearchFocused] = React.useState(false);

    return (
        <section className="relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-center bg-background">

            {/* Main Content */}
            <div className="container relative z-10 px-4 flex flex-col items-center max-w-5xl mx-auto">

                {/* Minimalist Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/50 border border-accent mb-8"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span className="text-xs font-bold text-accent-foreground uppercase tracking-widest font-sans">
                        Live Auction
                    </span>
                </motion.div>

                {/* Hero Title - Clean & High Contrast */}
                <motion.h1
                    className="text-6xl md:text-8xl font-black text-center tracking-tighter leading-none mb-6 text-foreground"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    AUTO MARKET
                    <br />
                    <span className="text-muted-foreground font-bold tracking-tight text-5xl md:text-7xl block mt-2">
                        LOGISTICS
                    </span>
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col items-center gap-6 mb-12"
                >
                    <p className="text-xl text-muted-foreground text-center max-w-2xl font-medium">
                        Professional car auction access and logistics services.
                    </p>

                    {/* Video Trigger (Neuro-Minimalism: Rich Media) */}
                    <button className="group flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-border shadow-sm hover:shadow-md transition-all hover:scale-105 active:scale-95">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-0.5">
                                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span className="text-sm font-bold text-foreground tracking-wide">Watch How It Works</span>
                    </button>
                </motion.div>

                {/* Search Island - Clean Card, No 3D Tile */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8, type: "spring", bounce: 0.2 }}
                    className="w-full shadow-2xl rounded-3xl bg-card border border-border p-2 overflow-visible"
                >
                    <div className="bg-background rounded-2xl p-6 md:p-8">
                        <Tabs defaultValue="cars" value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <div className="flex justify-center mb-8">
                                <TabsList className="bg-muted/50 p-1 rounded-full gap-1">
                                    {['cars', 'moto', 'heavy'].map((tab) => (
                                        <TabsTrigger
                                            key={tab}
                                            value={tab}
                                            className="rounded-full px-6 py-2 text-sm font-bold uppercase tracking-wide data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                                        >
                                            {tab === 'cars' ? 'Cars' : tab === 'moto' ? 'Moto' : 'Heavy'}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </div>

                            <TabsContent value="cars" className="mt-0">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                    <div className="md:col-span-3">
                                        <Select>
                                            <SelectTrigger className="h-14 bg-muted/30 border-border rounded-xl text-foreground font-medium text-base hover:bg-muted/50 transition-colors focus:ring-primary/20">
                                                <SelectValue placeholder="Make" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="bmw">BMW</SelectItem>
                                                <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="md:col-span-3">
                                        <Select>
                                            <SelectTrigger className="h-14 bg-muted/30 border-border rounded-xl text-foreground font-medium text-base hover:bg-muted/50 transition-colors focus:ring-primary/20">
                                                <SelectValue placeholder="Model" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="x5">X5</SelectItem>
                                                <SelectItem value="m5">M5</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <Select>
                                            <SelectTrigger className="h-14 bg-muted/30 border-border rounded-xl text-foreground font-medium text-base hover:bg-muted/50 transition-colors focus:ring-primary/20">
                                                <SelectValue placeholder="Year" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="2024">2024</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="md:col-span-4 flex gap-2">
                                        <div className={cn(
                                            "relative flex-1 transition-all duration-300 rounded-xl bg-muted/30 border border-transparent has-[:focus]:bg-background has-[:focus]:ring-2 has-[:focus]:ring-primary/10 has-[:focus]:border-primary/20",
                                            isSearchFocused && "shadow-lg scale-[1.02]"
                                        )}>
                                            <Input
                                                placeholder="Enter VIN or Lot #"
                                                className="h-14 bg-transparent border-0 rounded-xl text-foreground text-base px-5 placeholder:text-muted-foreground/50 focus-visible:ring-0"
                                                onFocus={() => setIsSearchFocused(true)}
                                                onBlur={() => setIsSearchFocused(false)}
                                            />
                                        </div>
                                        <Button
                                            className="h-14 w-14 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-primary/25 hover:scale-105 transition-all"
                                            size="icon"
                                        >
                                            <Search className="w-6 h-6" />
                                        </Button>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="moto" className="h-24 flex items-center justify-center text-muted-foreground font-mono text-xs uppercase tracking-widest bg-muted/20 rounded-xl">
                                Coming Soon
                            </TabsContent>
                            <TabsContent value="heavy" className="h-24 flex items-center justify-center text-muted-foreground font-mono text-xs uppercase tracking-widest bg-muted/20 rounded-xl">
                                Coming Soon
                            </TabsContent>
                        </Tabs>
                    </div>
                </motion.div>

                {/* Bottom Status Bar - Clean & Icon-focused */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-16 flex flex-wrap gap-12 items-center justify-center border-t border-border pt-8 w-full"
                >
                    {[
                        { icon: ShieldCheck, text: "Trusted Dealer" },
                        { icon: Zap, text: "Fast Calculation" },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 group opacity-70 hover:opacity-100 transition-opacity">
                            <item.icon className="w-5 h-5 text-primary" />
                            <span className="text-sm font-bold uppercase tracking-widest text-foreground font-sans">{item.text}</span>
                        </div>
                    ))}
                </motion.div>

                {/* Scroll Indicator (Neuro-Minimalism: Wayfinding) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                >
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold animate-pulse">Scroll to explore</span>
                    <div className="w-5 h-8 rounded-full border-2 border-muted-foreground/30 flex justify-center p-1">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                            className="w-1 h-1.5 rounded-full bg-primary"
                        />
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
