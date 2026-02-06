import { Header } from './Header';
import { Footer } from './Footer';
import { ChatAssistant } from '@/features/chat-assistant';

interface MainLayoutProps {
    children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col relative">
            <Header />
            <main className="flex-1 pt-0 md:pt-20">
                {children}
            </main>
            <Footer />
            <ChatAssistant />
        </div>
    );
}
