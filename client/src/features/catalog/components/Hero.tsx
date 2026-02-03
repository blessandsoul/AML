'use client';

import * as React from 'react';
import { HeroTitle } from './HeroTitle';
import { QuickCalculator } from './QuickCalculator';

export function Hero() {
    return (
        <section className="relative w-full min-h-[calc(100vh-6rem)] overflow-hidden flex flex-col items-center bg-background">
            {/* Main Content */}
            <div className="container relative z-10 px-4 flex flex-col items-center justify-center max-w-5xl mx-auto flex-1 gap-2 md:gap-4 pt-8 pb-4 h-full">
                <HeroTitle />
                <QuickCalculator />
            </div>
        </section>
    );
}
