'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
    Container, Waves, Search,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AuctionCalculator from '@/features/catalog/components/AuctionCalculator';
import LogisticsCalculator from '@/features/catalog/components/LogisticsCalculator';

/* ─── Shipping lines ─────────────────────────────────────── */

const SHIPPING_LINES = [
    { name: 'Hapag-Lloyd', url: 'https://www.hapag-lloyd.com/en/online-business/track/track-by-container-solution.html?container=' },
    { name: 'MAERSK', url: 'https://www.maersk.com/tracking/' },
    { name: 'ZIM', url: 'https://www.zim.com/tools/track-a-shipment?consnumber=' },
    { name: 'TURKON', url: 'https://www.turkon.com/en/container-tracking?cno=' },
    { name: 'COSCO', url: 'https://elines.coscoshipping.com/ebusiness/cargotracking?trackingType=CONTAINER&number=' },
    { name: 'MSC', url: 'https://www.msc.com/track-a-shipment?agencyPath=msc&trackingNumber=' },
];

/* ─── Page ─────────────────────────────────────────────────── */

export default function CalculatorPage() {
    // Container tracking
    const [containerNumbers, setContainerNumbers] = React.useState<Record<string, string>>({});

    const handleContainerSearch = (line: typeof SHIPPING_LINES[0]) => {
        const num = containerNumbers[line.name]?.trim();
        if (!num) return;
        window.open(line.url + num, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="bg-background bg-mesh">
            {/* ═══════════════ Calculator Hero ═══════════════ */}
            <section className="relative overflow-hidden border-b border-border py-16 md:py-24">
                <div className="container mx-auto px-4 max-w-7xl">
                    {/* Tabbed Calculators */}
                    <Tabs defaultValue="logistics" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-8 max-w-md mx-auto h-auto p-1">
                            <TabsTrigger value="auction" className="text-sm md:text-base py-3">
                                აუქციონის მთვლელი
                            </TabsTrigger>
                            <TabsTrigger value="logistics" className="text-sm md:text-base py-3">
                                ლოგისტიკის მთვლელი
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="auction">
                            <AuctionCalculator />
                        </TabsContent>

                        <TabsContent value="logistics">
                            <LogisticsCalculator />
                        </TabsContent>
                    </Tabs>
                </div>
            </section>

            {/* ═══════════════ Map ═══════════════ */}
            <section className="py-12 md:py-20">
                <div className="container mx-auto px-4 max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-10 space-y-3"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card border border-border text-xs font-bold uppercase tracking-widest text-muted-foreground shadow-sm">
                            <Waves className="w-3.5 h-3.5 text-primary" />
                            მარშრუტი
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
                            საზღვაო მარშრუტი
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="w-full h-100 md:h-125 rounded-3xl overflow-hidden border border-border shadow-lg shadow-primary/5"
                    >
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d30000000!2d-40!3d35!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v1700000000000"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Shipping Routes Map"
                        />
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════ Container Tracking ═══════════════ */}
            <section className="bg-muted/30 border-t border-border py-12 md:py-20">
                <div className="container mx-auto px-4 max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-10 space-y-3"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card border border-border text-xs font-bold uppercase tracking-widest text-muted-foreground shadow-sm">
                            <Container className="w-3.5 h-3.5 text-primary" />
                            თრექინგი
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
                            კონტეინერის{' '}
                            <span className="text-primary">ძებნა</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {SHIPPING_LINES.map((line, i) => (
                            <motion.div
                                key={line.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="group p-5 rounded-2xl bg-card border border-border hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-300"
                            >
                                <span className="block text-sm font-black tracking-wide text-foreground uppercase mb-3">
                                    {line.name}
                                </span>

                                <div className="flex">
                                    <div className="relative flex-1">
                                        <Container className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                                        <Input
                                            type="text"
                                            placeholder="კონტეინერ №"
                                            value={containerNumbers[line.name] || ''}
                                            onChange={e => setContainerNumbers(prev => ({
                                                ...prev,
                                                [line.name]: e.target.value,
                                            }))}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') handleContainerSearch(line);
                                            }}
                                            className="h-12 pl-10 pr-3 rounded-l-xl rounded-r-none border-2 border-r-0 border-border bg-background text-sm focus:border-primary group-hover:border-primary/30 transition-colors"
                                        />
                                    </div>
                                    <Button
                                        size="icon"
                                        onClick={() => handleContainerSearch(line)}
                                        className="h-12 w-12 rounded-l-none rounded-r-xl shrink-0"
                                    >
                                        <Search className="w-4 h-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
