'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Check, ChevronDown, LogIn, User as UserIcon, LayoutDashboard,
    ShoppingBag, Heart, Gavel, Car, PlusCircle, MessageSquare,
    FileText, Settings, LogOut, Package as PackageIcon,
} from 'lucide-react';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ColorPaletteSelector } from "@/components/common/ColorPaletteSelector";
import { NAV_ITEMS, MORE_ITEMS, LANGUAGES } from './header-constants';
import { HeaderMobileMenu } from './HeaderMobileMenu';
import type { SharedHeaderProps } from './header-types';

// ================================================================
// Shared: User Profile Dropdown Content
// ================================================================
function UserMenuContent({ props }: { props: SharedHeaderProps }) {
    return (
        <DropdownMenuContent align="end" className="w-96 p-0 overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-xl">
            <div className="p-6 bg-linear-to-b from-muted/50 to-background border-b border-border">
                <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12 border-2 border-background shadow-sm">
                        <AvatarFallback>{props.userInitials}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-bold text-lg leading-none">
                            {props.user!.firstName && props.user!.lastName
                                ? `${props.user!.firstName} ${props.user!.lastName}`
                                : props.user!.email.split('@')[0]}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">{props.user!.email}</span>
                    </div>
                </div>
                <div className="mt-4 p-1 bg-muted/80 rounded-lg flex relative">
                    <motion.div
                        className="absolute top-1 bottom-1 bg-background rounded-md shadow-sm z-0"
                        animate={{ left: props.viewMode === 'user' ? '4px' : '50%', width: 'calc(50% - 6px)', x: props.viewMode === 'dealer' ? 2 : 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                    <button onClick={() => props.setViewMode('user')} className={cn("flex-1 relative z-10 flex items-center justify-center gap-2 py-2 text-sm font-bold transition-colors", props.viewMode === 'user' ? "text-foreground" : "text-muted-foreground")}>
                        <UserIcon className="w-4 h-4" /> მომხმარებელი
                    </button>
                    <button onClick={() => props.setViewMode('dealer')} className={cn("flex-1 relative z-10 flex items-center justify-center gap-2 py-2 text-sm font-bold transition-colors", props.viewMode === 'dealer' ? "text-foreground" : "text-muted-foreground")}>
                        <LayoutDashboard className="w-4 h-4" /> დილერი
                    </button>
                </div>
            </div>
            <div className="p-2">
                {props.viewMode === 'user' ? (
                    <>
                        <Link href="/profile"><DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted"><UserIcon className="w-4 h-4 mr-3 text-muted-foreground" />ჩემი პროფილი</DropdownMenuItem></Link>
                        <Link href="/profile/orders"><DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted"><ShoppingBag className="w-4 h-4 mr-3 text-muted-foreground" />ჩემი შეკვეთები</DropdownMenuItem></Link>
                        <Link href="/track"><DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted"><PackageIcon className="w-4 h-4 mr-3 text-muted-foreground" />თრექინგი</DropdownMenuItem></Link>
                        <Link href="/profile/favorites"><DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted"><Heart className="w-4 h-4 mr-3 text-muted-foreground" />ფავორიტები</DropdownMenuItem></Link>
                        <Link href="/messages"><DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted"><MessageSquare className="w-4 h-4 mr-3 text-muted-foreground" />შეტყობინებები</DropdownMenuItem></Link>
                    </>
                ) : (
                    <>
                        <Link href="/dealer/dashboard"><DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted"><LayoutDashboard className="w-4 h-4 mr-3 text-muted-foreground" />მართვის პანელი</DropdownMenuItem></Link>
                        <Link href="/dealer/add-listing"><DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted"><PlusCircle className="w-4 h-4 mr-3 text-muted-foreground" />განცხადების დამატება</DropdownMenuItem></Link>
                        <Link href="/dealer/bids"><DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted"><Gavel className="w-4 h-4 mr-3 text-muted-foreground" />ჩემი ბიდები</DropdownMenuItem></Link>
                        <Link href="/dealer/listings"><DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted"><Car className="w-4 h-4 mr-3 text-muted-foreground" />ჩემი განცხადებები</DropdownMenuItem></Link>
                        <Link href="/dealer/invoices"><DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted"><FileText className="w-4 h-4 mr-3 text-muted-foreground" />ინვოისები</DropdownMenuItem></Link>
                        <Link href="/messages"><DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted"><MessageSquare className="w-4 h-4 mr-3 text-muted-foreground" />შეტყობინებები</DropdownMenuItem></Link>
                    </>
                )}
                <DropdownMenuSeparator />
                <Link href="/settings"><DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted"><Settings className="w-4 h-4 mr-3 text-muted-foreground" />პარამეტრები</DropdownMenuItem></Link>
                <DropdownMenuItem onClick={props.handleLogout} className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted text-destructive hover:text-destructive focus:text-destructive focus:bg-destructive/10">
                    <LogOut className="w-4 h-4 mr-3" />გასვლა
                </DropdownMenuItem>
            </div>
        </DropdownMenuContent>
    );
}

// Shared: Language Switcher
function LangSwitcher({ props, className }: { props: SharedHeaderProps; className?: string }) {
    const Flag = LANGUAGES.find(l => l.code === props.language)?.icon || LANGUAGES[0].icon;
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className={cn("rounded-full", className)}>
                    <Flag className="w-5 h-5 rounded-full object-cover" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-45">
                {LANGUAGES.map((lang) => (
                    <DropdownMenuItem key={lang.code} onClick={() => props.setLanguage(lang.code)} className="flex items-center justify-between cursor-pointer">
                        <span className="flex items-center gap-3">
                            <lang.icon className="w-5 h-5 rounded-sm object-cover shadow-sm" />
                            <span className="text-sm font-medium">{lang.label}</span>
                        </span>
                        {props.language === lang.code && <Check className="w-4 h-4 text-primary" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// Shared: Auth buttons or User avatar
function AuthSection({ props, btnClass, loginClass }: { props: SharedHeaderProps; btnClass?: string; loginClass?: string }) {
    if (props.mounted && props.isAuthenticated && props.user) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className={cn("rounded-full", btnClass)}>
                        <Avatar className="w-8 h-8"><AvatarFallback className="text-xs">{props.userInitials}</AvatarFallback></Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <UserMenuContent props={props} />
            </DropdownMenu>
        );
    }
    return (
        <div className="hidden sm:flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className={loginClass}>
                <Link href="/login"><LogIn className="w-4 h-4 mr-2" />შესვლა</Link>
            </Button>
            <Button size="sm" asChild>
                <Link href="/register">რეგისტრაცია</Link>
            </Button>
        </div>
    );
}

// Shared: More dropdown
function MoreNav({ props, layoutId, triggerClass, activeClass }: { props: SharedHeaderProps; layoutId: string; triggerClass: string; activeClass: string }) {
    const isMoreActive = MORE_ITEMS.some(i => props.pathname === i.href);
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className={cn("relative flex items-center gap-1 outline-none", triggerClass, isMoreActive && activeClass)}>
                    {isMoreActive && (
                        <motion.div layoutId={layoutId} className="absolute inset-0 rounded-full bg-white/15" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                    )}
                    <span className="relative z-10 uppercase tracking-wide text-xs font-bold">მეტი</span>
                    <ChevronDown className="relative z-10 w-3 h-3" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-55">
                {MORE_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link key={item.href} href={item.href}>
                            <DropdownMenuItem className="cursor-pointer font-medium">
                                <Icon className="w-4 h-4 mr-2.5 text-muted-foreground" />{item.label}
                            </DropdownMenuItem>
                        </Link>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// Shared: Mobile bar — clean, no glassmorphism
function MobileBar({ props }: { props: SharedHeaderProps }) {
    const mobileProps = {
        useWhiteText: true, mobileMenuOpen: props.mobileMenuOpen, setMobileMenuOpen: props.setMobileMenuOpen,
        mounted: props.mounted, isAuthenticated: props.isAuthenticated, user: props.user, userInitials: props.userInitials,
        handleLogout: props.handleLogout, palette: props.palette, setPalette: props.setPalette, palettes: props.palettes, paletteMounted: props.paletteMounted,
    };
    return (
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 px-4 pt-3">
            <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2 ring-white/20 shadow-lg">
                        <img src="/logo.png" alt="AML" className="w-full h-full object-cover" />
                    </div>
                </Link>
                <HeaderMobileMenu {...mobileProps} />
            </div>
        </div>
    );
}

// ================================================================
// VARIANT A: Floating Dock
// ================================================================
function FloatingDock({ props }: { props: SharedHeaderProps }) {
    const glass = "bg-black/40 backdrop-blur-2xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.2)]";
    return (
        <div className="hidden md:block fixed top-0 left-0 right-0 z-50 py-3 px-6">
            <div className="relative flex items-center justify-center">
                {/* Logo pill — absolute left */}
                <Link href="/" className={cn("absolute left-0 flex items-center gap-2.5 rounded-full pl-1.5 pr-5 py-1.5 group", glass)}>
                    <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
                        <img src="/logo.png" alt="AML" className="w-full h-full object-cover" />
                    </div>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900 }} className="text-xs tracking-[0.15em] text-white/90 group-hover:text-white whitespace-nowrap uppercase">Auto Market Logistic</span>
                </Link>

                {/* Center nav dock — truly centered */}
                <motion.nav
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("relative flex items-center gap-0.5 rounded-2xl px-2 py-1.5", glass)}
                >
                    {NAV_ITEMS.map((item) => {
                        const isActive = props.pathname === item.href;
                        return (
                            <motion.div key={item.href} whileHover={{ scale: 1.08, y: -1 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "relative block px-2.5 py-2 text-[11px] font-bold uppercase tracking-wide transition-colors duration-200",
                                        isActive ? "text-white" : "text-white/55 hover:text-white/90"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div layoutId="dock-active" className="absolute inset-0 rounded-xl bg-white/15" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />
                                    )}
                                    <span className="relative z-10">{item.label}</span>
                                </Link>
                            </motion.div>
                        );
                    })}
                    <MoreNav props={props} layoutId="dock-active" triggerClass="px-2.5 py-2 text-white/55 hover:text-white/90" activeClass="text-white" />

                </motion.nav>

                {/* Actions pill — absolute right */}
                <div className={cn("absolute right-0 flex items-center gap-0.5 rounded-full px-1.5 py-1", glass)}>
                    <div className="hidden lg:flex"><ColorPaletteSelector /></div>
                    <LangSwitcher props={props} className="text-white/70 hover:text-white hover:bg-white/10" />
                    <AuthSection props={props} btnClass="text-white/70 hover:text-white hover:bg-white/10" loginClass="text-white/70 hover:text-white hover:bg-white/10" />
                </div>
            </div>
        </div>
    );
}

// ================================================================
// Main Export
// ================================================================
export function FloatingGlassPill(props: SharedHeaderProps) {
    return (
        <>
            <MobileBar props={props} />
            <FloatingDock props={props} />
        </>
    );
}
