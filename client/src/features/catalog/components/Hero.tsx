'use client';

import { useState, useRef } from 'react';
import { HeroTitle } from './HeroTitle';
import { QuickCalculator } from './QuickCalculator';
import { CarfaxReport } from './CarfaxReport';

const HERO_VIDEOS = [
    { src: '/hero-bg/1.mp4', label: '1' },
    { src: '/hero-bg/2.mp4', label: '2' },
    { src: '/hero-bg/3.mp4', label: '3' },
    { src: '/hero-bg/4.mp4', label: '4' },
];

const OVERLAY_GRADIENT = 'linear-gradient(145deg, rgba(45,136,196,0.45) 0%, rgba(85,168,185,0.32) 35%, rgba(45,136,196,0.25) 65%, rgba(12,24,48,0.40) 100%)';

export function Hero() {
    const [overlayOn, setOverlayOn] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [frontIndex, setFrontIndex] = useState(0);
    const [backIndex, setBackIndex] = useState(0);
    const [frontVisible, setFrontVisible] = useState(true);
    const frontRef = useRef<HTMLVideoElement>(null);
    const backRef = useRef<HTMLVideoElement>(null);
    const busy = useRef(false);

    const switchTo = (index: number) => {
        if (index === activeIndex || busy.current) return;
        busy.current = true;
        setActiveIndex(index);

        // Load new video into the hidden layer
        const hiddenRef = frontVisible ? backRef : frontRef;
        const setHidden = frontVisible ? setBackIndex : setFrontIndex;
        setHidden(index);

        const video = hiddenRef.current;
        if (!video) { busy.current = false; return; }

        // Wait for the new src to be ready, then crossfade
        const go = () => {
            video.play().catch(() => {});
            setFrontVisible(v => !v);
            setTimeout(() => { busy.current = false; }, 800);
        };

        // Need a small delay for React to update the src
        requestAnimationFrame(() => {
            video.load();
            if (video.readyState >= 3) {
                go();
            } else {
                video.addEventListener('canplay', go, { once: true });
            }
        });
    };

    return (
        <section className="relative w-full flex-1 overflow-hidden flex flex-col items-center mt-0 md:-mt-20 pt-0 md:pt-20">
            {/* Background Videos — two layers for crossfade */}
            <div className="absolute inset-0 z-0">
                <video
                    ref={frontRef}
                    autoPlay muted loop playsInline preload="auto"
                    poster="/hero-bg/aml.jpeg"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    style={{ opacity: frontVisible ? 1 : 0, transition: 'opacity 0.7s ease-in-out' }}
                    src={HERO_VIDEOS[frontIndex].src}
                />
                <video
                    ref={backRef}
                    muted loop playsInline preload="auto"
                    poster="/hero-bg/aml.jpeg"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    style={{ opacity: frontVisible ? 0 : 1, transition: 'opacity 0.7s ease-in-out' }}
                    src={HERO_VIDEOS[backIndex].src}
                />
                <div
                    className="absolute inset-0 z-10 transition-opacity duration-500"
                    style={{
                        background: OVERLAY_GRADIENT,
                        opacity: overlayOn ? 1 : 0,
                    }}
                />
            </div>

            {/* TEMP: Overlay toggle — left */}
            <button
                onClick={() => setOverlayOn(v => !v)}
                className="fixed bottom-6 left-6 z-[9999] px-4 py-2 rounded-xl text-xs font-bold bg-black/80 backdrop-blur-sm text-white border border-white/20 shadow-2xl hover:bg-black/90 transition-colors"
            >
                {overlayOn ? 'Overlay: ON' : 'Overlay: OFF'}
            </button>

            {/* TEMP: Video Selector — right */}
            <div className="fixed bottom-6 right-6 z-[9999] flex gap-2 bg-black/80 backdrop-blur-sm rounded-xl p-3 shadow-2xl border border-white/20">
                {HERO_VIDEOS.map((video, i) => (
                    <button
                        key={video.src}
                        onClick={() => switchTo(i)}
                        className="relative px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200"
                        style={{
                            background: i === activeIndex ? 'rgba(45,136,196,0.9)' : 'rgba(255,255,255,0.1)',
                            color: i === activeIndex ? '#fff' : 'rgba(255,255,255,0.7)',
                            transform: i === activeIndex ? 'scale(1.1)' : 'scale(1)',
                            boxShadow: i === activeIndex ? '0 0 20px rgba(45,136,196,0.5)' : 'none',
                        }}
                    >
                        {video.label}.mp4
                    </button>
                ))}
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
