'use client';

import * as React from 'react';
import { type HeaderVariant, HEADER_VARIANTS } from '@/components/layout/headers/header-types';

interface HeaderVariantContextType {
    variant: HeaderVariant;
    setVariant: (variant: HeaderVariant) => void;
    variants: typeof HEADER_VARIANTS;
    mounted: boolean;
}

const HeaderVariantContext = React.createContext<HeaderVariantContextType | undefined>(undefined);

const STORAGE_KEY = 'aml-header-variant';
const DEFAULT_VARIANT: HeaderVariant = 'floating-glass-pill';

interface HeaderVariantProviderProps {
    children: React.ReactNode;
}

export function HeaderVariantProvider({ children }: HeaderVariantProviderProps) {
    const [variant, setVariantState] = React.useState<HeaderVariant>(DEFAULT_VARIANT);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
        try {
            const stored = localStorage.getItem(STORAGE_KEY) as HeaderVariant | null;
            if (stored && HEADER_VARIANTS.some((v) => v.id === stored)) {
                setVariantState(stored);
            }
        } catch {
            // Ignore localStorage errors
        }
    }, []);

    React.useEffect(() => {
        if (!mounted) return;
        try {
            localStorage.setItem(STORAGE_KEY, variant);
        } catch {
            // Ignore localStorage errors
        }
    }, [variant, mounted]);

    const setVariant = React.useCallback((newVariant: HeaderVariant) => {
        setVariantState(newVariant);
    }, []);

    const value = React.useMemo(
        () => ({ variant, setVariant, variants: HEADER_VARIANTS, mounted }),
        [variant, setVariant, mounted]
    );

    return (
        <HeaderVariantContext.Provider value={value}>
            {children}
        </HeaderVariantContext.Provider>
    );
}

export function useHeaderVariant() {
    const context = React.useContext(HeaderVariantContext);
    if (context === undefined) {
        throw new Error('useHeaderVariant must be used within a HeaderVariantProvider');
    }
    return context;
}
