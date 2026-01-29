'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    User,
    ShoppingBag,
    Heart,
    LayoutDashboard,
    PlusCircle,
    Gavel,
    FileText,
    Car,
    Settings,
    MessageSquare,
    LogOut
} from 'lucide-react';

const USER_LINKS = [
    { href: '/profile', label: 'ჩემი პროფილი', icon: User },
    { href: '/profile/orders', label: 'ჩემი შეკვეთები', icon: ShoppingBag },
    { href: '/profile/favorites', label: 'ფავორიტები', icon: Heart },
];

const DEALER_LINKS = [
    { href: '/dealer/dashboard', label: 'მართვის პანელი', icon: LayoutDashboard },
    { href: '/dealer/add-listing', label: 'განცხადების დამატება', icon: PlusCircle },
    { href: '/dealer/bids', label: 'ჩემი ბიდები', icon: Gavel },
    { href: '/dealer/listings', label: 'ჩემი განცხადებები', icon: Car },
    { href: '/dealer/invoices', label: 'ინვოისები', icon: FileText },
];

const SHARED_LINKS = [
    { href: '/messages', label: 'შეტყობინებები', icon: MessageSquare },
    { href: '/settings', label: 'პარამეტრები', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const isDealer = pathname.startsWith('/dealer');

    // Combine links based on context
    // If we are in dealer routes, show dealer links + shared
    // If we are in profile routes, show user links + shared
    // But what if we are in /messages or /settings? 
    // We should probably show the menu relevant to the user's "mode".
    // For now, let's just show the relevant primary section + shared.

    const primaryLinks = isDealer ? DEALER_LINKS : USER_LINKS;

    return (
        <aside className="hidden lg:flex flex-col w-64 border-r bg-background/50 backdrop-blur-xl h-[calc(100vh-120px)] sticky top-28 rounded-xl border my-1">
            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                {/* User/Dealer Context Indicator */}
                <div className="px-4 py-2 bg-muted/50 rounded-lg text-xs font-bold text-muted-foreground uppercase tracking-widest text-center">
                    {isDealer ? 'დილერის კაბინეტი' : 'მომხმარებელი'}
                </div>

                <div className="space-y-1">
                    {primaryLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                            >
                                <Icon className={cn("w-5 h-5", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                                <span className="relative z-10">{link.label}</span>
                                {isActive && <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />}
                            </Link>
                        );
                    })}
                </div>

                <div className="py-2">
                    <div className="h-px bg-border/50 mx-4" />
                </div>

                <div className="space-y-1">
                    {SHARED_LINKS.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                                    isActive
                                        ? "bg-muted text-foreground font-bold"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )}
                            >
                                <Icon className={cn("w-5 h-5", isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                                <span>{link.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            <div className="p-6 border-t bg-background/50">
                <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 w-full transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span>გასვლა</span>
                </button>
            </div>
        </aside>
    );
}
