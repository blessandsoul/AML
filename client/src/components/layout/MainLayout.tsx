import { Outlet, useLocation, matchPath } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { cn } from '@/lib/cn';

export const MainLayout = () => {
    const location = useLocation();

    // Define routes that have immersive hero sections (no top padding)
    const immersiveRoutes = [
        '/',
        '/guides/:id',
        '/tours/:id',
        '/companies/:id',
        '/explore/drivers/:id',
    ];

    const isImmersive = immersiveRoutes.some(route =>
        matchPath({ path: route, end: true }, location.pathname)
    );

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className={cn("flex-1", !isImmersive && "pt-28")}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};
