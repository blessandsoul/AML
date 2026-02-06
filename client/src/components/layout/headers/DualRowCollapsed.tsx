'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Check,
    ChevronDown,
    LogIn,
    User as UserIcon,
    LayoutDashboard,
    ShoppingBag,
    Heart,
    Gavel,
    Car,
    PlusCircle,
    MessageSquare,
    FileText,
    Settings,
    LogOut,
    Package as PackageIcon,
    Phone,
    Mail,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ColorPaletteSelector } from "@/components/common/ColorPaletteSelector";
import { NAV_ITEMS, MORE_ITEMS, LANGUAGES } from './header-constants';
import { HeaderMobileMenu } from './HeaderMobileMenu';
import type { SharedHeaderProps } from './header-types';

export function DualRowCollapsed(props: SharedHeaderProps) {
    const useWhiteText = props.isHomePage && !props.scrolled;
    const SelectedFlag = LANGUAGES.find(l => l.code === props.language)?.icon || LANGUAGES[0].icon;

    const mobileProps = {
        useWhiteText,
        mobileMenuOpen: props.mobileMenuOpen,
        setMobileMenuOpen: props.setMobileMenuOpen,
        mounted: props.mounted,
        isAuthenticated: props.isAuthenticated,
        user: props.user,
        userInitials: props.userInitials,
        handleLogout: props.handleLogout,
        palette: props.palette,
        setPalette: props.setPalette,
        palettes: props.palettes,
        paletteMounted: props.paletteMounted,
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50">
            {/* TOP ROW - Info bar (collapses on scroll) */}
            <motion.div
                animate={{
                    height: props.scrolled ? 0 : 'auto',
                    opacity: props.scrolled ? 0 : 1,
                }}
                transition={{ duration: 0.3 }}
                style={{ overflow: 'hidden' }}
            >
                <div className={cn(
                    "bg-muted/60 backdrop-blur-sm border-b border-border/30",
                    useWhiteText && "bg-white/5 border-white/10"
                )}>
                    <div className="container mx-auto px-6 flex items-center justify-between py-1.5 text-xs text-muted-foreground">
                        {/* Left - Contact info */}
                        <div className="flex items-center gap-4">
                            <span className={cn(
                                "flex items-center gap-1.5",
                                useWhiteText && "text-white/70"
                            )}>
                                <Phone className="w-3 h-3" />
                                +995 32 2054244
                            </span>
                            <span className={cn(
                                "w-1 h-1 rounded-full",
                                useWhiteText ? "bg-white/30" : "bg-muted-foreground/30"
                            )} />
                            <span className={cn(
                                "flex items-center gap-1.5",
                                useWhiteText && "text-white/70"
                            )}>
                                <Mail className="w-3 h-3" />
                                info@automarket.ge
                            </span>
                        </div>

                        {/* Right - Language flags (inline) + ColorPalette + Auth */}
                        <div className="hidden sm:flex items-center gap-3">
                            {/* Inline language flags */}
                            <div className="flex items-center gap-1">
                                {LANGUAGES.map((lang) => {
                                    const FlagIcon = lang.icon;
                                    return (
                                        <button
                                            key={lang.code}
                                            onClick={() => props.setLanguage(lang.code)}
                                            className={cn(
                                                "w-5 h-5 rounded-full overflow-hidden transition-all duration-200 border",
                                                props.language === lang.code
                                                    ? "border-primary scale-110 ring-1 ring-primary/30"
                                                    : (useWhiteText
                                                        ? "border-white/20 opacity-60 hover:opacity-100"
                                                        : "border-transparent opacity-50 hover:opacity-100")
                                            )}
                                        >
                                            <FlagIcon className="w-5 h-5 rounded-full object-cover" />
                                        </button>
                                    );
                                })}
                            </div>

                            <span className={cn(
                                "w-px h-4",
                                useWhiteText ? "bg-white/20" : "bg-border"
                            )} />

                            {/* Color palette */}
                            <ColorPaletteSelector />

                            <span className={cn(
                                "w-px h-4",
                                useWhiteText ? "bg-white/20" : "bg-border"
                            )} />

                            {/* Auth (top row) */}
                            {props.mounted && props.isAuthenticated && props.user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className={cn(
                                            "rounded-full w-7 h-7",
                                            useWhiteText
                                                ? "text-white/80 hover:text-white hover:bg-white/10"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                        )}>
                                            <Avatar className="w-6 h-6">
                                                <AvatarFallback className="text-[10px]">{props.userInitials}</AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-96 p-0 overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-xl">
                                        <div className="p-6 bg-gradient-to-b from-muted/50 to-background border-b border-border relative">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="w-12 h-12 border-2 border-background shadow-sm">
                                                    <AvatarFallback>{props.userInitials}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-lg leading-none">
                                                        {props.user.firstName && props.user.lastName
                                                            ? `${props.user.firstName} ${props.user.lastName}`
                                                            : props.user.email.split('@')[0]}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground mt-1">{props.user.email}</span>
                                                </div>
                                            </div>
                                            <div className="mt-4 p-1 bg-muted/80 rounded-lg flex relative">
                                                <motion.div className="absolute top-1 bottom-1 bg-background rounded-md shadow-sm z-0" animate={{ left: props.viewMode === 'user' ? '4px' : '50%', width: 'calc(50% - 6px)', x: props.viewMode === 'dealer' ? 2 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                                                <button onClick={() => props.setViewMode('user')} className={cn("flex-1 relative z-10 flex items-center justify-center gap-2 py-2 text-sm font-bold transition-colors duration-200", props.viewMode === 'user' ? "text-foreground" : "text-muted-foreground hover:text-foreground/80")}><UserIcon className="w-4 h-4" /> მომხმარებელი</button>
                                                <button onClick={() => props.setViewMode('dealer')} className={cn("flex-1 relative z-10 flex items-center justify-center gap-2 py-2 text-sm font-bold transition-colors duration-200", props.viewMode === 'dealer' ? "text-foreground" : "text-muted-foreground hover:text-foreground/80")}><LayoutDashboard className="w-4 h-4" /> დილერი</button>
                                            </div>
                                        </div>
                                        <div className="p-2">
                                            {props.viewMode === 'user' ? (<>
                                                <Link href="/profile"><DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted"><UserIcon className="w-4 h-4 mr-3 text-muted-foreground" />ჩემი პროფილი</DropdownMenuItem></Link>
                                                <Link href="/profile/orders"><DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted"><ShoppingBag className="w-4 h-4 mr-3 text-muted-foreground" />ჩემი შეკვეთები</DropdownMenuItem></Link>
                                                <Link href="/track"><DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted"><PackageIcon className="w-4 h-4 mr-3 text-muted-foreground" />თრექინგი</DropdownMenuItem></Link>
                                                <Link href="/profile/favorites"><DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted"><Heart className="w-4 h-4 mr-3 text-muted-foreground" />ფავორიტები</DropdownMenuItem></Link>
                                                <Link href="/messages"><DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted"><MessageSquare className="w-4 h-4 mr-3 text-muted-foreground" />შეტყობინებები</DropdownMenuItem></Link>
                                            </>) : (<>
                                                <Link href="/dealer/dashboard"><DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted"><LayoutDashboard className="w-4 h-4 mr-3 text-muted-foreground" />მართვის პანელი</DropdownMenuItem></Link>
                                                <Link href="/dealer/add-listing"><DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted"><PlusCircle className="w-4 h-4 mr-3 text-muted-foreground" />განცხადების დამატება</DropdownMenuItem></Link>
                                                <Link href="/dealer/bids"><DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted"><Gavel className="w-4 h-4 mr-3 text-muted-foreground" />ჩემი ბიდები</DropdownMenuItem></Link>
                                                <Link href="/dealer/listings"><DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted"><Car className="w-4 h-4 mr-3 text-muted-foreground" />ჩემი განცხადებები</DropdownMenuItem></Link>
                                                <Link href="/dealer/invoices"><DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted"><FileText className="w-4 h-4 mr-3 text-muted-foreground" />ინვოისები</DropdownMenuItem></Link>
                                                <Link href="/messages"><DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted"><MessageSquare className="w-4 h-4 mr-3 text-muted-foreground" />შეტყობინებები</DropdownMenuItem></Link>
                                            </>)}
                                            <DropdownMenuSeparator />
                                            <Link href="/settings"><DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted"><Settings className="w-4 h-4 mr-3 text-muted-foreground" />პარამეტრები</DropdownMenuItem></Link>
                                            <DropdownMenuItem onClick={props.handleLogout} className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted text-destructive hover:text-destructive focus:text-destructive focus:bg-destructive/10"><LogOut className="w-4 h-4 mr-3" />გასვლა</DropdownMenuItem>
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" asChild className={cn(
                                        "h-6 text-xs px-2",
                                        useWhiteText
                                            ? "text-white/80 hover:text-white hover:bg-white/10"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}>
                                        <Link href="/login">
                                            <LogIn className="w-3 h-3 mr-1" />
                                            შესვლა
                                        </Link>
                                    </Button>
                                    <Button size="sm" asChild className={cn(
                                        "h-6 text-xs px-2",
                                        useWhiteText && "bg-white text-[#1C2331] hover:bg-white/90 shadow-lg"
                                    )}>
                                        <Link href="/register">რეგისტრაცია</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* BOTTOM ROW - Main navigation */}
            <div className={cn(
                "transition-all duration-300",
                props.scrolled
                    ? "bg-background/90 backdrop-blur-xl shadow-md"
                    : "bg-transparent"
            )}>
                <div className="container mx-auto px-6 flex items-center justify-between py-3">
                    {/* Left - Logo */}
                    <Link href="/" className="flex items-center gap-3 z-20 group shrink-0">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/30 shadow-sm shrink-0">
                            <img src="/logo.png" alt="AML Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className={cn(
                            "text-lg font-bold tracking-tight transition-colors whitespace-nowrap",
                            useWhiteText
                                ? "text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] group-hover:text-white/90"
                                : "text-foreground group-hover:text-primary"
                        )}>
                            Auto Market Logistic
                        </span>
                    </Link>

                    {/* Center - Nav links */}
                    <nav className="hidden md:flex items-center gap-1 mx-auto">
                        {NAV_ITEMS.map((item) => {
                            const isActive = props.pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "relative px-4 py-2 text-sm font-bold transition-colors duration-300",
                                        isActive
                                            ? (useWhiteText
                                                ? "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
                                                : "text-primary")
                                            : (useWhiteText
                                                ? "text-white/70 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] hover:text-white"
                                                : "text-muted-foreground hover:text-foreground")
                                    )}
                                >
                                    <span className="relative z-10 uppercase tracking-wide text-xs">
                                        {item.label}
                                    </span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="v3-nav-pill"
                                            className={cn(
                                                "absolute bottom-0 left-2 right-2 h-0.5 rounded-full",
                                                useWhiteText ? "bg-white" : "bg-primary"
                                            )}
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}

                        {/* More Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    className={cn(
                                        "relative px-4 py-2 text-sm font-bold transition-colors duration-300 flex items-center gap-1 outline-none",
                                        MORE_ITEMS.some(i => props.pathname === i.href)
                                            ? (useWhiteText
                                                ? "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
                                                : "text-primary")
                                            : (useWhiteText
                                                ? "text-white/70 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] hover:text-white"
                                                : "text-muted-foreground hover:text-foreground")
                                    )}
                                >
                                    {MORE_ITEMS.some(i => props.pathname === i.href) && (
                                        <motion.div
                                            layoutId="v3-nav-pill"
                                            className={cn(
                                                "absolute bottom-0 left-2 right-2 h-0.5 rounded-full",
                                                useWhiteText ? "bg-white" : "bg-primary"
                                            )}
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10 uppercase tracking-wide text-xs">მეტი</span>
                                    <ChevronDown className="relative z-10 w-3 h-3" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="center" className="w-55">
                                {MORE_ITEMS.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link key={item.href} href={item.href}>
                                            <DropdownMenuItem className="cursor-pointer font-medium">
                                                <Icon className="w-4 h-4 mr-2.5 text-muted-foreground" />
                                                {item.label}
                                            </DropdownMenuItem>
                                        </Link>
                                    );
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </nav>

                    {/* Right - Actions that appear when scrolled (moved from top row) + mobile menu */}
                    <div className="flex items-center gap-2 z-20 shrink-0">
                        {/* Show language, palette, auth on scroll (they disappear from top row) */}
                        {props.scrolled && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className="hidden sm:flex items-center gap-2"
                            >
                                {/* Color palette */}
                                <ColorPaletteSelector />

                                {/* Language switcher dropdown (scrolled state) */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className={cn(
                                            "rounded-full",
                                            "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                        )}>
                                            <SelectedFlag className="w-5 h-5 rounded-full object-cover" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-[180px]">
                                        {LANGUAGES.map((lang) => (
                                            <DropdownMenuItem
                                                key={lang.code}
                                                onClick={() => props.setLanguage(lang.code)}
                                                className="flex items-center justify-between cursor-pointer"
                                            >
                                                <span className="flex items-center gap-3">
                                                    <lang.icon className="w-5 h-5 rounded-sm object-cover shadow-sm" />
                                                    <span className="text-sm font-medium">{lang.label}</span>
                                                </span>
                                                {props.language === lang.code && <Check className="w-4 h-4 text-primary" />}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* Auth (scrolled state) */}
                                {props.mounted && props.isAuthenticated && props.user ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className={cn(
                                                "rounded-full",
                                                "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                            )}>
                                                <Avatar className="w-8 h-8">
                                                    <AvatarFallback className="text-xs">{props.userInitials}</AvatarFallback>
                                                </Avatar>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-96 p-0 overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-xl">
                                            <div className="p-6 bg-gradient-to-b from-muted/50 to-background border-b border-border relative">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="w-12 h-12 border-2 border-background shadow-sm">
                                                        <AvatarFallback>{props.userInitials}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-lg leading-none">
                                                            {props.user.firstName && props.user.lastName
                                                                ? `${props.user.firstName} ${props.user.lastName}`
                                                                : props.user.email.split('@')[0]}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground mt-1">{props.user.email}</span>
                                                    </div>
                                                </div>
                                                <div className="mt-4 p-1 bg-muted/80 rounded-lg flex relative">
                                                    <motion.div className="absolute top-1 bottom-1 bg-background rounded-md shadow-sm z-0" animate={{ left: props.viewMode === 'user' ? '4px' : '50%', width: 'calc(50% - 6px)', x: props.viewMode === 'dealer' ? 2 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                                                    <button onClick={() => props.setViewMode('user')} className={cn("flex-1 relative z-10 flex items-center justify-center gap-2 py-2 text-sm font-bold transition-colors duration-200", props.viewMode === 'user' ? "text-foreground" : "text-muted-foreground hover:text-foreground/80")}><UserIcon className="w-4 h-4" /> მომხმარებელი</button>
                                                    <button onClick={() => props.setViewMode('dealer')} className={cn("flex-1 relative z-10 flex items-center justify-center gap-2 py-2 text-sm font-bold transition-colors duration-200", props.viewMode === 'dealer' ? "text-foreground" : "text-muted-foreground hover:text-foreground/80")}><LayoutDashboard className="w-4 h-4" /> დილერი</button>
                                                </div>
                                            </div>
                                            <div className="p-2">
                                                {props.viewMode === 'user' ? (<>
                                                    <Link href="/profile"><DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted"><UserIcon className="w-4 h-4 mr-3 text-muted-foreground" />ჩემი პროფილი</DropdownMenuItem></Link>
                                                    <Link href="/profile/orders"><DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted"><ShoppingBag className="w-4 h-4 mr-3 text-muted-foreground" />ჩემი შეკვეთები</DropdownMenuItem></Link>
                                                    <Link href="/track"><DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted"><PackageIcon className="w-4 h-4 mr-3 text-muted-foreground" />თრექინგი</DropdownMenuItem></Link>
                                                    <Link href="/profile/favorites"><DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted"><Heart className="w-4 h-4 mr-3 text-muted-foreground" />ფავორიტები</DropdownMenuItem></Link>
                                                    <Link href="/messages"><DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted"><MessageSquare className="w-4 h-4 mr-3 text-muted-foreground" />შეტყობინებები</DropdownMenuItem></Link>
                                                </>) : (<>
                                                    <Link href="/dealer/dashboard"><DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted"><LayoutDashboard className="w-4 h-4 mr-3 text-muted-foreground" />მართვის პანელი</DropdownMenuItem></Link>
                                                    <Link href="/dealer/add-listing"><DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted"><PlusCircle className="w-4 h-4 mr-3 text-muted-foreground" />განცხადების დამატება</DropdownMenuItem></Link>
                                                    <Link href="/dealer/bids"><DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted"><Gavel className="w-4 h-4 mr-3 text-muted-foreground" />ჩემი ბიდები</DropdownMenuItem></Link>
                                                    <Link href="/dealer/listings"><DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted"><Car className="w-4 h-4 mr-3 text-muted-foreground" />ჩემი განცხადებები</DropdownMenuItem></Link>
                                                    <Link href="/dealer/invoices"><DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted"><FileText className="w-4 h-4 mr-3 text-muted-foreground" />ინვოისები</DropdownMenuItem></Link>
                                                    <Link href="/messages"><DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted"><MessageSquare className="w-4 h-4 mr-3 text-muted-foreground" />შეტყობინებები</DropdownMenuItem></Link>
                                                </>)}
                                                <DropdownMenuSeparator />
                                                <Link href="/settings"><DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted"><Settings className="w-4 h-4 mr-3 text-muted-foreground" />პარამეტრები</DropdownMenuItem></Link>
                                                <DropdownMenuItem onClick={props.handleLogout} className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted text-destructive hover:text-destructive focus:text-destructive focus:bg-destructive/10"><LogOut className="w-4 h-4 mr-3" />გასვლა</DropdownMenuItem>
                                            </div>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                                            <Link href="/login">
                                                <LogIn className="w-4 h-4 mr-2" />
                                                შესვლა
                                            </Link>
                                        </Button>
                                        <Button size="sm" asChild>
                                            <Link href="/register">რეგისტრაცია</Link>
                                        </Button>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Mobile Menu */}
                        <HeaderMobileMenu {...mobileProps} />
                    </div>
                </div>
            </div>
        </header>
    );
}
