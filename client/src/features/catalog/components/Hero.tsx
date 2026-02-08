'use client';

import { HeroTitle } from './HeroTitle';
import { QuickCalculator } from './QuickCalculator';
import { CarfaxReport } from './CarfaxReport';

export function Hero() {
    return (
        <section className="relative w-full flex-1 overflow-hidden flex flex-col items-center mt-0 md:-mt-20 pt-0 md:pt-20">
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    poster="/hero-bg/aml.jpeg"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    src="/hero-bg/long.mp4"
                />
                {/* Brand-tinted overlay */}
                <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(145deg, rgba(45,136,196,0.22) 0%, rgba(85,168,185,0.15) 35%, rgba(45,136,196,0.10) 65%, rgba(12,24,48,0.18) 100%)' }} />
            </div>

            {/* Main Content */}
            <div className="container relative z-10 px-4 flex flex-col items-center justify-center max-w-5xl mx-auto flex-1 gap-1 md:gap-2 pt-4 md:pt-6 pb-2 md:pb-3 h-full">
                <HeroTitle />
                <div className="w-full flex flex-col gap-2">
                    <QuickCalculator />
                    <CarfaxReport />
                </div>
            </div>
        </section>
    );
}
