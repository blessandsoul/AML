'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
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
    // Two-layer crossfade: layer A and layer B alternate
    const [layerA, setLayerA] = useState(0);
    const [layerB, setLayerB] = useState(0);
    const [showA, setShowA] = useState(true); // true = A is visible (front)
    const [activeIndex, setActiveIndex] = useState(0);
    const videoARef = useRef<HTMLVideoElement>(null);
    const videoBRef = useRef<HTMLVideoElement>(null);
    const isTransitioning = useRef(false);

    const switchTo = useCallback((index: number) => {
        if (index === activeIndex || isTransitioning.current) return;
        isTransitioning.current = true;
        setActiveIndex(index);

        if (showA) {
            // A is visible → load new video into B, then fade B in
            setLayerB(index);
        } else {
            // B is visible → load new video into A, then fade A in
            setLayerA(index);
        }
    }, [activeIndex, showA]);

    // When the hidden layer's src changes, wait for it to be ready, then crossfade
    useEffect(() => {
        const hiddenRef = showA ? videoBRef : videoARef;
        const hiddenVideo = hiddenRef.current;
        if (!hiddenVideo) return;

        const onCanPlay = () => {
            hiddenVideo.play().catch(() => {});
            // Small delay to ensure frame is rendered before fading
            requestAnimationFrame(() => {
                setShowA(prev => !prev);
                setTimeout(() => {
                    isTransitioning.current = false;
                }, 700);
            });
        };

        // If video is already ready (cached), fire immediately
        if (hiddenVideo.readyState >= 3) {
            onCanPlay();
        } else {
            hiddenVideo.addEventListener('canplay', onCanPlay, { once: true });
            return () => hiddenVideo.removeEventListener('canplay', onCanPlay);
        }
    }, [layerA, layerB]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <section className="relative w-full flex-1 overflow-hidden flex flex-col items-center mt-0 md:-mt-20 pt-0 md:pt-20">
            {/* Background Videos — two layers for crossfade */}
            <div className="absolute inset-0 z-0">
                {/* Layer A */}
                <video
                    ref={videoARef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    poster="/hero-bg/aml.jpeg"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    style={{
                        opacity: showA ? 1 : 0,
                        transition: 'opacity 0.7s ease-in-out',
                    }}
                    src={HERO_VIDEOS[layerA].src}
                />
                {/* Layer B */}
                <video
                    ref={videoBRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    poster="/hero-bg/aml.jpeg"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    style={{
                        opacity: showA ? 0 : 1,
                        transition: 'opacity 0.7s ease-in-out',
                    }}
                    src={HERO_VIDEOS[layerB].src}
                />
                {/* Brand-tinted overlay — always on top of both videos */}
                <div className="absolute inset-0 z-10" style={{ background: OVERLAY_GRADIENT }} />
            </div>

            {/* TEMP: Video Selector — remove after review */}
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
