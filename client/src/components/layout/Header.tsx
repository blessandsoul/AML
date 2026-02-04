'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
    Menu,
    Phone,
    User,
    Check,
    LogOut,
    Settings,
    LayoutDashboard,
    ShoppingBag,
    Heart,
    Gavel,
    FileText,
    Car,
    Wallet,
    PlusCircle,
    MessageSquare,
    ChevronRight,
    ChevronDown,
    Package,
    Star,
    Truck,
    Info,
    Mail,
    LogIn,
} from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FlagGE, FlagUS, FlagRU, FlagUA, FlagSA } from "@/components/ui/flags";

const NAV_ITEMS = [
    { label: 'მთავარი', href: '/' },
    { label: 'ლოჯისტიკა', href: '/calculator' },
    { label: 'ავტომობილები', href: '/catalog' },
    { label: 'ჩვენს შესახებ', href: '/about' },
    { label: 'კონტაქტი', href: '/contact' },
];

const MORE_ITEMS = [
    { label: 'აუქციონები', href: '/auctions', icon: Gavel },
    { label: 'თრექინგი', href: '/track', icon: Package },
    { label: 'ტრანსპორტირება', href: '/delivery', icon: Truck },
];

const LANGUAGES = [
    { code: 'GE', label: 'ქართული', icon: FlagGE },
    { code: 'EN', label: 'English', icon: FlagUS },
    { code: 'UA', label: 'Українська', icon: FlagUA },
    { code: 'RU', label: 'Русский', icon: FlagRU },
    { code: 'AR', label: 'العربية', icon: FlagSA },
];

export function Header() {
    const [scrolled, setScrolled] = React.useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const { scrollY } = useScroll();
    const pathname = usePathname();
    const [viewMode, setViewMode] = React.useState<'user' | 'dealer'>('user');
    const [language, setLanguage] = React.useState('GE');
    const { user, isAuthenticated, logout } = useAuth();

    // Get user initials for avatar fallback
    const userInitials = React.useMemo(() => {
        if (!user) return 'U';
        const first = user.firstName?.[0] || '';
        const last = user.lastName?.[0] || '';
        return (first + last).toUpperCase() || user.email[0].toUpperCase();
    }, [user]);

    const handleLogout = React.useCallback(async () => {
        await logout();
        setMobileMenuOpen(false);
    }, [logout]);

    // Close mobile menu on route change
    React.useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 20);
    });

    const SelectedFlag = LANGUAGES.find(l => l.code === language)?.icon || FlagGE;

    return (
        <motion.header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                scrolled ? "py-2" : "py-2 md:py-4"
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
                            Auto Market Logistic
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

                        {/* More Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    className={cn(
                                        "relative px-5 py-2 text-sm font-bold transition-colors duration-300 flex items-center gap-1 outline-none",
                                        MORE_ITEMS.some(i => pathname === i.href)
                                            ? "text-primary"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {MORE_ITEMS.some(i => pathname === i.href) && (
                                        <motion.div
                                            layoutId="nav-pill"
                                            className="absolute inset-0 bg-primary/5 rounded-full"
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

                    {/* Actions */}
                    <div className="flex items-center gap-2 z-20">
                        {/* Language Switcher */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full hidden sm:flex">
                                    <SelectedFlag className="w-5 h-5 rounded-full object-cover" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[180px]">
                                {LANGUAGES.map((lang) => (
                                    <DropdownMenuItem
                                        key={lang.code}
                                        onClick={() => setLanguage(lang.code)}
                                        className="flex items-center justify-between cursor-pointer"
                                    >
                                        <span className="flex items-center gap-3">
                                            <lang.icon className="w-5 h-5 rounded-sm object-cover shadow-sm" />
                                            <span className="text-sm font-medium">{lang.label}</span>
                                        </span>
                                        {language === lang.code && <Check className="w-4 h-4 text-primary" />}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* User Profile Menu */}
                        {isAuthenticated && user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full hidden sm:flex">
                                        <Avatar className="w-8 h-8">
                                            <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-96 p-0 overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-xl">
                                    <div className="p-6 bg-gradient-to-b from-muted/50 to-background border-b border-border relative">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="w-12 h-12 border-2 border-background shadow-sm">
                                                <AvatarFallback>{userInitials}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-lg leading-none">
                                                    {user.firstName && user.lastName
                                                        ? `${user.firstName} ${user.lastName}`
                                                        : user.email.split('@')[0]}
                                                </span>
                                                <span className="text-xs text-muted-foreground mt-1">{user.email}</span>
                                            </div>
                                        </div>

                                        {/* View Mode Toggle */}
                                        <div className="mt-4 p-1 bg-muted/80 rounded-lg flex relative">
                                            <motion.div
                                                className="absolute top-1 bottom-1 bg-background rounded-md shadow-sm z-0"
                                                animate={{
                                                    left: viewMode === 'user' ? '4px' : '50%',
                                                    width: 'calc(50% - 6px)',
                                                    x: viewMode === 'dealer' ? 2 : 0
                                                }}
                                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                            />
                                            <button
                                                onClick={() => setViewMode('user')}
                                                className={cn(
                                                    "flex-1 relative z-10 flex items-center justify-center gap-2 py-2 text-sm font-bold transition-colors duration-200",
                                                    viewMode === 'user' ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"
                                                )}
                                            >
                                                <User className="w-4 h-4" />
                                                მომხმარებელი
                                            </button>
                                            <button
                                                onClick={() => setViewMode('dealer')}
                                                className={cn(
                                                    "flex-1 relative z-10 flex items-center justify-center gap-2 py-2 text-sm font-bold transition-colors duration-200",
                                                    viewMode === 'dealer' ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"
                                                )}
                                            >
                                                <LayoutDashboard className="w-4 h-4" />
                                                დილერი
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-2">
                                        {viewMode === 'user' ? (
                                            <>
                                                <Link href="/profile">
                                                    <DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted">
                                                        <User className="w-4 h-4 mr-3 text-muted-foreground" />
                                                        ჩემი პროფილი
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link href="/profile/orders">
                                                    <DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted">
                                                        <ShoppingBag className="w-4 h-4 mr-3 text-muted-foreground" />
                                                        ჩემი შეკვეთები
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link href="/track">
                                                    <DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted">
                                                        <Package className="w-4 h-4 mr-3 text-muted-foreground" />
                                                        თრექინგი
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link href="/profile/favorites">
                                                    <DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted">
                                                        <Heart className="w-4 h-4 mr-3 text-muted-foreground" />
                                                        ფავორიტები
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link href="/messages">
                                                    <DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted">
                                                        <MessageSquare className="w-4 h-4 mr-3 text-muted-foreground" />
                                                        შეტყობინებები
                                                    </DropdownMenuItem>
                                                </Link>
                                            </>
                                        ) : (
                                            <>
                                                <Link href="/dealer/dashboard">
                                                    <DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted">
                                                        <LayoutDashboard className="w-4 h-4 mr-3 text-muted-foreground" />
                                                        მართვის პანელი
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link href="/dealer/add-listing">
                                                    <DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted">
                                                        <PlusCircle className="w-4 h-4 mr-3 text-muted-foreground" />
                                                        განცხადების დამატება
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link href="/dealer/bids">
                                                    <DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted">
                                                        <Gavel className="w-4 h-4 mr-3 text-muted-foreground" />
                                                        ჩემი ბიდები
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link href="/dealer/listings">
                                                    <DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted">
                                                        <Car className="w-4 h-4 mr-3 text-muted-foreground" />
                                                        ჩემი განცხადებები
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link href="/dealer/invoices">
                                                    <DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted">
                                                        <FileText className="w-4 h-4 mr-3 text-muted-foreground" />
                                                        ინვოისები
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link href="/messages">
                                                    <DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted">
                                                        <MessageSquare className="w-4 h-4 mr-3 text-muted-foreground" />
                                                        შეტყობინებები
                                                    </DropdownMenuItem>
                                                </Link>
                                            </>
                                        )}
                                        <DropdownMenuSeparator />
                                        <Link href="/settings">
                                            <DropdownMenuItem className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted">
                                                <Settings className="w-4 h-4 mr-3 text-muted-foreground" />
                                                პარამეტრები
                                            </DropdownMenuItem>
                                        </Link>
                                        <DropdownMenuItem
                                            onClick={handleLogout}
                                            className="p-3 font-medium cursor-pointer rounded-lg hover:bg-muted text-destructive hover:text-destructive focus:text-destructive focus:bg-destructive/10"
                                        >
                                            <LogOut className="w-4 h-4 mr-3" />
                                            გასვლა
                                        </DropdownMenuItem>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="hidden sm:flex items-center gap-2">
                                <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                                    <Link href="/login">
                                        <LogIn className="w-4 h-4 mr-2" />
                                        შესვლა
                                    </Link>
                                </Button>
                                <Button size="sm" asChild>
                                    <Link href="/register">
                                        რეგისტრაცია
                                    </Link>
                                </Button>
                            </div>
                        )}

                        <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 font-bold px-3 sm:px-6 shadow-lg shadow-primary/20">
                            <Phone className="w-4 h-4 sm:mr-2" />
                            <span className="text-xs sm:text-sm font-bold ml-2 sm:ml-0">599 00 00 00</span>
                        </Button>

                        {/* Mobile Menu */}
                        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden text-foreground">
                                    <Menu className="w-6 h-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="bg-background border-border p-0 w-[300px] overflow-y-auto">
                                <SheetHeader className="sr-only">
                                    <SheetTitle>Mobile Menu</SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col min-h-full bg-background p-3">
                                    {/* Logo removed to save space */}

                                    {/* User Info (Mobile) */}
                                    {isAuthenticated && user ? (
                                        <div className="mb-3 bg-muted/50 p-3 rounded-xl flex items-center gap-2">
                                            <Avatar className="w-8 h-8">
                                                <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-bold text-sm">
                                                    {user.firstName && user.lastName
                                                        ? `${user.firstName} ${user.lastName}`
                                                        : user.email.split('@')[0]}
                                                </div>
                                                <div className="text-xs text-muted-foreground">{user.email}</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mb-3 flex gap-2">
                                            <Button variant="outline" size="sm" className="flex-1" asChild>
                                                <Link href="/login">შესვლა</Link>
                                            </Button>
                                            <Button size="sm" className="flex-1" asChild>
                                                <Link href="/register">რეგისტრაცია</Link>
                                            </Button>
                                        </div>
                                    )}

                                    <nav className="flex flex-col gap-1">
                                        {NAV_ITEMS.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className="text-sm font-bold text-muted-foreground hover:text-foreground hover:pl-2 transition-all duration-300 py-1.5 border-b border-border/50 uppercase tracking-wide"
                                            >
                                                {item.label}
                                            </Link>
                                        ))}

                                        {/* More */}
                                        <div className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-2 mb-1">მეტი</div>
                                        {MORE_ITEMS.map((item) => {
                                            const Icon = item.icon;
                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className="flex items-center gap-2.5 text-sm font-bold text-muted-foreground hover:text-foreground hover:pl-2 transition-all duration-300 py-1.5 border-b border-border/50"
                                                >
                                                    <Icon className="w-4 h-4" />
                                                    {item.label}
                                                </Link>
                                            );
                                        })}
                                    </nav>

                                    {/* Dashboard Links + Logout (Mobile) - pushed to bottom */}
                                    {isAuthenticated && user ? (
                                        <div className="mt-auto pt-3 space-y-3">
                                            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">კაბინეტი</div>
                                            <div className="grid grid-cols-3 gap-1.5">
                                                <Link href="/profile" className="flex flex-col items-center justify-center gap-1 bg-muted/30 hover:bg-muted p-2 rounded-lg transition-colors">
                                                    <User className="w-4 h-4 text-primary" />
                                                    <span className="text-xs font-bold text-center">პროფილი</span>
                                                </Link>
                                                <Link href="/profile/orders" className="flex flex-col items-center justify-center gap-1 bg-muted/30 hover:bg-muted p-2 rounded-lg transition-colors">
                                                    <ShoppingBag className="w-4 h-4 text-primary" />
                                                    <span className="text-xs font-bold text-center">შეკვეთები</span>
                                                </Link>
                                                <Link href="/track" className="flex flex-col items-center justify-center gap-1 bg-muted/30 hover:bg-muted p-2 rounded-lg transition-colors">
                                                    <Package className="w-4 h-4 text-primary" />
                                                    <span className="text-xs font-bold text-center">თრექინგი</span>
                                                </Link>
                                                <Link href="/dealer/dashboard" className="flex flex-col items-center justify-center gap-1 bg-muted/30 hover:bg-muted p-2 rounded-lg transition-colors">
                                                    <LayoutDashboard className="w-4 h-4 text-primary" />
                                                    <span className="text-xs font-bold text-center">დაფა</span>
                                                </Link>
                                                <Link href="/profile/favorites" className="flex flex-col items-center justify-center gap-1 bg-muted/30 hover:bg-muted p-2 rounded-lg transition-colors">
                                                    <Heart className="w-4 h-4 text-primary" />
                                                    <span className="text-xs font-bold text-center">ფავორიტები</span>
                                                </Link>
                                                <Link href="/messages" className="flex flex-col items-center justify-center gap-1 bg-muted/30 hover:bg-muted p-2 rounded-lg transition-colors">
                                                    <MessageSquare className="w-4 h-4 text-primary" />
                                                    <span className="text-xs font-bold text-center">ჩატი</span>
                                                </Link>
                                            </div>
                                            <Button variant="outline" size="sm" className="w-full justify-between" asChild>
                                                <Link href="/dealer/add-listing">
                                                    <span className="flex items-center gap-2">
                                                        <PlusCircle className="w-4 h-4" />
                                                        განცხადების დამატება
                                                    </span>
                                                    <ChevronRight className="w-4 h-4 opacity-50" />
                                                </Link>
                                            </Button>
                                            <Button
                                                onClick={handleLogout}
                                                className="w-full rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground h-10 text-base font-bold"
                                            >
                                                <LogOut className="w-4 h-4 mr-2" /> გასვლა
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="mt-auto pt-3">
                                            <Link href="/track" className="flex items-center gap-2.5 text-sm font-bold text-muted-foreground hover:text-foreground py-2 border-b border-border/50 mb-3">
                                                <Package className="w-4 h-4" />
                                                თრექინგი
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </motion.header>
    );
}
