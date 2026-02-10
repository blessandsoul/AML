'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

export type HeroTheme = 'original' | 'white' | 'blue' | 'dark';

export const HERO_THEME_OPTIONS: { value: HeroTheme; label: string; color: string }[] = [
    { value: 'original', label: 'ორიგინალი', color: 'bg-gradient-to-br from-cyan-400 to-blue-600' },
    { value: 'white', label: 'თეთრი', color: 'bg-white border border-gray-300' },
    { value: 'blue', label: 'ლურჯი', color: 'bg-blue-600' },
    { value: 'dark', label: 'მუქი', color: 'bg-gray-900' },
];

interface HeroThemeCtx {
    theme: HeroTheme;
    setTheme: (t: HeroTheme) => void;
}

const Ctx = createContext<HeroThemeCtx>({ theme: 'original', setTheme: () => {} });

export function HeroThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<HeroTheme>('white');
    return <Ctx.Provider value={{ theme, setTheme }}>{children}</Ctx.Provider>;
}

export function useHeroTheme() {
    return useContext(Ctx);
}
