'use client';

import * as React from 'react';
import { HeroTitle } from './HeroTitle';
import { QuickCalculator } from './QuickCalculator';

export function Hero() {
    return (
        <section className="relative w-full flex-1 overflow-hidden flex flex-col items-center bg-background">
            {/* Main Content */}
            <div className="container relative z-10 px-4 flex flex-col items-center justify-center max-w-5xl mx-auto flex-1 gap-1 md:gap-2 pt-4 md:pt-6 pb-2 md:pb-3 h-full">
                <HeroTitle />
                <QuickCalculator />
            </div>
        </section>
    );
}
