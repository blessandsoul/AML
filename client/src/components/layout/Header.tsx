'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, Phone, User, Globe } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet';

const NAV_ITEMS = [
    { label: 'Home', href: '/' },
    { label: 'Catalog', href: '/catalog' },
    { label: 'Auctions', href: '/auctions' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
];

export function Header() {
    const [scrolled, setScrolled] = React.useState(false);
    const { scrollY } = useScroll();
    const pathname = usePathname();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 20);
    });

    return (
        <motion.header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                scrolled ? "py-3" : "py-6"
            )}
        >
            <div className="container mx-auto px-4">
                <div
                    className={cn(
                        "relative flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-500",
                        scrolled
                            ? "bg-background/80 backdrop-blur-xl border border-border shadow-sm"
                            : "bg-transparent border border-transparent"
                    )}
                >
                    {/* Logo - Minimalist */}
                    <Link href="/" className="flex items-center gap-2 z-20 group">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-xl shadow-lg group-hover:scale-105 transition-transform duration-300">
                            A
                        </div>
                        <span className="text-xl font-bold text-foreground tracking-tight hidden md:block group-hover:text-primary transition-colors">
                            AML
                        </span>
                    </Link>

                    {/* Desktop Nav - Clean Typography */}
                    <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "relative px-5 py-2 text-sm font-bold transition-colors duration-300",
                                        isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-pill"
                                            className="absolute inset-0 bg-primary/5 rounded-full"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10 uppercase tracking-wide text-xs">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-2 z-20">
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full hidden sm:flex">
                            <Globe className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full hidden sm:flex">
                            <User className="w-5 h-5" />
                        </Button>

                        <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 font-bold px-6 shadow-lg shadow-primary/20">
                            <Phone className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">599 00 00 00</span>
                        </Button>

                        {/* Mobile Menu */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden text-foreground">
                                    <Menu className="w-6 h-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="bg-background border-border p-0 w-[300px]">
                                <div className="flex flex-col h-full bg-background p-6">
                                    <div className="flex items-center gap-2 mb-10">
                                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-xl">A</div>
                                        <span className="text-xl font-bold text-foreground">AML</span>
                                    </div>

                                    <nav className="flex flex-col gap-2">
                                        {NAV_ITEMS.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className="text-lg font-bold text-muted-foreground hover:text-foreground hover:pl-2 transition-all duration-300 py-3 border-b border-border/50 uppercase tracking-wide"
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                    </nav>

                                    <div className="mt-auto space-y-4">
                                        <Button className="w-full rounded-xl bg-primary text-primary-foreground h-12 text-lg font-bold shadow-lg shadow-primary/20">
                                            <User className="w-5 h-5 mr-2" /> Cabinet
                                        </Button>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </motion.header>
    );
}
