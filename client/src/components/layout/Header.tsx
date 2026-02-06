'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useColorPalette } from '@/providers/color-palette-provider';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { FloatingGlassPill } from './headers/FloatingGlassPill';
import type { SharedHeaderProps } from './headers/header-types';

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);
    const [viewMode, setViewMode] = React.useState<'user' | 'dealer'>('user');
    const [language, setLanguage] = React.useState('GE');

    const pathname = usePathname();
    const { user, isAuthenticated, logout } = useAuth();
    const { palette, setPalette, palettes, mounted: paletteMounted } = useColorPalette();
    const { scrolled, scrollDirection, scrollYValue, isAtTop } = useScrollDirection();

    React.useEffect(() => {
        setMounted(true);
    }, []);

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

    React.useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    const isHomePage = pathname === '/';

    const sharedProps: SharedHeaderProps = {
        pathname,
        isHomePage,
        scrolled,
        scrollDirection,
        scrollYValue,
        isAtTop,
        user,
        isAuthenticated,
        mounted,
        userInitials,
        handleLogout,
        language,
        setLanguage,
        viewMode,
        setViewMode,
        mobileMenuOpen,
        setMobileMenuOpen,
        palette,
        setPalette,
        palettes,
        paletteMounted,
    };

    return <FloatingGlassPill {...sharedProps} />;
}
