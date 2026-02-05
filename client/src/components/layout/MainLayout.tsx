'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { ChatAssistant } from '@/features/chat-assistant';

interface MainLayoutProps {
    children: React.ReactNode;
}

const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'];

export function MainLayout({ children }: MainLayoutProps) {
    const pathname = usePathname();
    const isAuthPage = AUTH_ROUTES.some(route => pathname.startsWith(route));

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen flex-col relative">
            <Header />
            <main className="flex-1 pt-13 md:pt-20">
                {children}
            </main>
            <Footer />
            <ChatAssistant />
        </div>
    );
}
