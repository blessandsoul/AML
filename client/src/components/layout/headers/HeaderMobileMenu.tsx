'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Menu,
    User,
    LogOut,
    LayoutDashboard,
    ShoppingBag,
    Heart,
    Gavel,
    Car,
    PlusCircle,
    MessageSquare,
    ChevronRight,
    Package,
    Wallet,
    Mail,
    FileText,
} from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { NAV_ITEMS, MORE_ITEMS } from './header-constants';
import type { SharedHeaderProps } from './header-types';

interface HeaderMobileMenuProps {
    useWhiteText: boolean;
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
    mounted: boolean;
    isAuthenticated: boolean;
    user: SharedHeaderProps['user'];
    userInitials: string;
    handleLogout: () => Promise<void>;
}

export function HeaderMobileMenu({
    useWhiteText,
    mobileMenuOpen,
    setMobileMenuOpen,
    mounted,
    isAuthenticated,
    user,
    userInitials,
    handleLogout,
}: HeaderMobileMenuProps) {
    return (
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={cn(
                    "md:hidden",
                    useWhiteText ? "text-white" : "text-foreground"
                )}>
                    <Menu className="w-6 h-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background border-border p-0 w-[300px] overflow-y-auto" showCloseButton={false}>
                <SheetHeader className="sr-only">
                    <SheetTitle>Mobile Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col min-h-full bg-background p-3">
                    {/* User Info (Mobile) */}
                    {mounted && isAuthenticated && user ? (
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

                    {/* Dashboard Links + Logout (Mobile) */}
                    {mounted && isAuthenticated && user ? (
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
                        <div className="pt-3 space-y-3">
                            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">სერვისები</div>
                            <div className="grid grid-cols-3 gap-1.5">
                                <Link href="/track" className="flex flex-col items-center justify-center gap-1 bg-muted/30 hover:bg-muted p-2 rounded-lg transition-colors">
                                    <Package className="w-4 h-4 text-primary" />
                                    <span className="text-xs font-bold text-center">თრექინგი</span>
                                </Link>
                                <Link href="/calculator" className="flex flex-col items-center justify-center gap-1 bg-muted/30 hover:bg-muted p-2 rounded-lg transition-colors">
                                    <Wallet className="w-4 h-4 text-primary" />
                                    <span className="text-xs font-bold text-center">კალკულატორი</span>
                                </Link>
                                <Link href="/contact" className="flex flex-col items-center justify-center gap-1 bg-muted/30 hover:bg-muted p-2 rounded-lg transition-colors">
                                    <Mail className="w-4 h-4 text-primary" />
                                    <span className="text-xs font-bold text-center">კონტაქტი</span>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
