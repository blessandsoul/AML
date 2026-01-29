import * as React from 'react';
import { motion, useMotionTemplate, useMotionValue, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
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

export function SearchIsland() {
    const [activeTab, setActiveTab] = React.useState('cars');
    const [isSearchFocused, setIsSearchFocused] = React.useState(false);

    // Spotlight Effect logic
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring", bounce: 0.2 }}
            className="w-full relative group"
            onMouseMove={handleMouseMove}
        >
            {/* Spotlight Gradient Background */}
            <motion.div
                className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                          650px circle at ${mouseX}px ${mouseY}px,
                          var(--primary),
                          transparent 80%
                        )
                    `,
                }}
            />

            <div className="w-full bg-card border border-border shadow-2xl rounded-3xl p-1 overflow-visible relative z-10">
                <div className="bg-background rounded-2xl p-3 md:p-5 min-h-[180px] flex flex-col">
                    <Tabs defaultValue="cars" value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
                        <div className="flex justify-center mb-3">
                            <TabsList className="bg-muted/50 p-1 rounded-full gap-1 h-auto scale-90 origin-center">
                                {['cars', 'moto', 'heavy'].map((tab) => (
                                    <TabsTrigger
                                        key={tab}
                                        value={tab}
                                        className="rounded-full px-5 py-1.5 text-xs font-bold uppercase tracking-wide data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                                    >
                                        {tab === 'cars' ? 'ავტომობილები' : tab === 'moto' ? 'მოტო' : 'სპეცტექნიკა'}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>

                        <div className="relative flex-1">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                    exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="w-full"
                                >
                                    <TabsContent value="cars" className="mt-0 outline-none">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                            {/* Make Input */}
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground ml-1">
                                                    1. მარკა
                                                </label>
                                                <div className="w-full">
                                                    <Select>
                                                        <SelectTrigger className="h-10 bg-muted/30 border-border rounded-lg text-foreground font-bold text-sm hover:bg-muted/50 transition-colors focus:ring-primary/20">
                                                            <SelectValue placeholder="BMW" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="bmw">BMW</SelectItem>
                                                            <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            {/* Model Input */}
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground ml-1">
                                                    2. მოდელი
                                                </label>
                                                <div className="w-full">
                                                    <Select>
                                                        <SelectTrigger className="h-10 bg-muted/30 border-border rounded-lg text-foreground font-bold text-sm hover:bg-muted/50 transition-colors focus:ring-primary/20">
                                                            <SelectValue placeholder="X5" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="x5">X5</SelectItem>
                                                            <SelectItem value="m5">M5</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            {/* Year Input */}
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground ml-1">
                                                    3. წელი
                                                </label>
                                                <div className="w-full">
                                                    <Select>
                                                        <SelectTrigger className="h-10 bg-muted/30 border-border rounded-lg text-foreground font-bold text-sm hover:bg-muted/50 transition-colors focus:ring-primary/20">
                                                            <SelectValue placeholder="2024" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="2024">2024</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            {/* Search Input */}
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground ml-1">
                                                    4. ძებნა
                                                </label>
                                                <div className="w-full flex gap-2">
                                                    <div className={cn(
                                                        "relative flex-1 transition-all duration-300 rounded-lg bg-muted/30 border border-transparent has-[:focus]:bg-background has-[:focus]:ring-2 has-[:focus]:ring-primary/10 has-[:focus]:border-primary/20",
                                                        isSearchFocused && "shadow-lg scale-[1.02]"
                                                    )}>
                                                        <Input
                                                            placeholder="VIN / ლოტი #"
                                                            className="h-10 bg-transparent border-0 rounded-lg text-foreground font-bold text-sm px-4 placeholder:text-muted-foreground/50 focus-visible:ring-0"
                                                            onFocus={() => setIsSearchFocused(true)}
                                                            onBlur={() => setIsSearchFocused(false)}
                                                        />
                                                    </div>
                                                    <Button
                                                        className="h-10 w-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg hover:scale-105 transition-all"
                                                        size="icon"
                                                    >
                                                        <Search className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="moto" className="h-44 flex items-center justify-center text-muted-foreground font-mono text-xs uppercase tracking-widest bg-muted/20 rounded-xl mt-0">
                                        <div className="text-center">
                                            <p className="mb-2 font-bold">მოტო ძებნა</p>
                                            <p className="opacity-50">მიმდინარეობს ბაზის ინდექსაცია...</p>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="heavy" className="h-44 flex items-center justify-center text-muted-foreground font-mono text-xs uppercase tracking-widest bg-muted/20 rounded-xl mt-0">
                                        <div className="text-center">
                                            <p className="mb-2 font-bold">სპეცტექნიკა</p>
                                            <p className="opacity-50">მიმდინარეობს ბაზის ინდექსაცია...</p>
                                        </div>
                                    </TabsContent>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </Tabs>
                </div>
            </div>
        </motion.div>
    );
}
