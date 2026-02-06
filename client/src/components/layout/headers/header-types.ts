import type { ColorPalette } from '@/providers/color-palette-provider';
import type { IUser } from '@/features/auth/types/auth.types';

export type HeaderVariant =
    | 'floating-glass-pill'
    | 'hide-and-seek'
    | 'dual-row-collapsed'
    | 'split-floating-nav'
    | 'gradient-underline';

export interface HeaderVariantInfo {
    id: HeaderVariant;
    label: string;
    description: string;
}

export const HEADER_VARIANTS: HeaderVariantInfo[] = [
    { id: 'floating-glass-pill', label: 'Glass Pill', description: 'Narrow rounded pill with glass morphism' },
    { id: 'hide-and-seek', label: 'Hide & Seek', description: 'Hides on scroll down, reveals on scroll up' },
    { id: 'dual-row-collapsed', label: 'Dual Row', description: 'Two-row header collapses to one' },
    { id: 'split-floating-nav', label: 'Split & Float', description: 'Detached nav capsule, Vercel-inspired' },
    { id: 'gradient-underline', label: 'Gradient Line', description: 'Minimal bar with animated gradient underline' },
];

export interface SharedHeaderProps {
    pathname: string;
    isHomePage: boolean;
    scrolled: boolean;
    scrollDirection: 'up' | 'down' | null;
    scrollYValue: number;
    isAtTop: boolean;
    // Auth
    user: IUser | null;
    isAuthenticated: boolean;
    mounted: boolean;
    userInitials: string;
    handleLogout: () => Promise<void>;
    // State
    language: string;
    setLanguage: (lang: string) => void;
    viewMode: 'user' | 'dealer';
    setViewMode: (mode: 'user' | 'dealer') => void;
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
    // Color palette
    palette: ColorPalette;
    setPalette: (p: ColorPalette) => void;
    palettes: { value: ColorPalette; label: string }[];
    paletteMounted: boolean;
}
