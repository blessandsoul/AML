import { Header } from './Header';
import { Footer } from './Footer';
import { ExitIntentPopup } from '@/features/catalog/components/ExitIntentPopup';

interface MainLayoutProps {
    children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col relative">
            <Header />
            <main className="flex-1">
                {children}
            </main>
            <Footer />

            {/* Global Lead Gen Strategies */}
            <ExitIntentPopup />
        </div>
    );
}
