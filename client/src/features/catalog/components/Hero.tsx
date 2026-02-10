'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { HeroTitle } from './HeroTitle';
import { QuickCalculator } from './QuickCalculator';
import { CarfaxReport } from './CarfaxReport';

const Prism = dynamic(() => import('@/components/ui/Prism'), { ssr: false });

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
    const [showA, setShowA] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const videoARef = useRef<HTMLVideoElement>(null);
    const videoBRef = useRef<HTMLVideoElement>(null);
    const isTransitioning = useRef(false);

    // TEMP: Prism tuning controls
    const [prismOpen, setPrismOpen] = useState(false);
    const [glow, setGlow] = useState(2.2);
    const [bloom, setBloom] = useState(1.4);
    const [opacity, setOpacity] = useState(70);
    const [tintR, setTintR] = useState(0.55);
    const [tintG, setTintG] = useState(0.85);
    const [tintB, setTintB] = useState(0.92);
    const [colorFreq, setColorFreq] = useState(0.4);
    const [timeScale, setTimeScale] = useState(0.4);
    const [prismScale, setPrismScale] = useState(3.6);
    const [noiseVal, setNoiseVal] = useState(0.15);

    const switchTo = useCallback((index: number) => {
        if (index === activeIndex || isTransitioning.current) return;
        isTransitioning.current = true;
        setActiveIndex(index);

        if (showA) {
            setLayerB(index);
        } else {
            setLayerA(index);
        }
    }, [activeIndex, showA]);

    useEffect(() => {
        const hiddenRef = showA ? videoBRef : videoARef;
        const hiddenVideo = hiddenRef.current;
        if (!hiddenVideo) return;

        const onCanPlay = () => {
            hiddenVideo.play().catch(() => {});
            requestAnimationFrame(() => {
                setShowA(prev => !prev);
                setTimeout(() => {
                    isTransitioning.current = false;
                }, 700);
            });
        };

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
                <video
                    ref={videoARef}
                    autoPlay muted loop playsInline preload="auto"
                    poster="/hero-bg/aml.jpeg"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    style={{ opacity: showA ? 1 : 0, transition: 'opacity 0.7s ease-in-out' }}
                    src={HERO_VIDEOS[layerA].src}
                />
                <video
                    ref={videoBRef}
                    autoPlay muted loop playsInline preload="auto"
                    poster="/hero-bg/aml.jpeg"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    style={{ opacity: showA ? 0 : 1, transition: 'opacity 0.7s ease-in-out' }}
                    src={HERO_VIDEOS[layerB].src}
                />
                <div className="absolute inset-0 z-10" style={{ background: OVERLAY_GRADIENT }} />
            </div>

            {/* Prism WebGL Background */}
            <div className="absolute inset-0 z-[5] pointer-events-none" style={{ opacity: opacity / 100 }}>
                <Prism
                    animationType="rotate"
                    glow={glow}
                    noise={noiseVal}
                    bloom={bloom}
                    scale={prismScale}
                    timeScale={timeScale}
                    transparent={true}
                    colorFrequency={colorFreq}
                    suspendWhenOffscreen={true}
                    tintColor={[tintR, tintG, tintB]}
                />
            </div>

            {/* TEMP: Video Selector */}
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

            {/* TEMP: Prism Tuning Panel */}
            <div className="fixed bottom-6 left-6 z-[9999]">
                <button
                    onClick={() => setPrismOpen(v => !v)}
                    className="bg-black/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-2 rounded-lg border border-white/20 shadow-2xl"
                >
                    {prismOpen ? '✕ Prism' : '◆ Prism'}
                </button>
                {prismOpen && (
                    <div className="mt-2 bg-black/85 backdrop-blur-sm rounded-xl p-4 shadow-2xl border border-white/20 w-72 max-h-[70vh] overflow-y-auto">
                        <div className="text-white/50 text-[10px] font-mono mb-3 uppercase tracking-wider">Prism Controls</div>
                        <PrismSlider label="Opacity" value={opacity} min={0} max={100} step={1} onChange={setOpacity} display={`${opacity}%`} />
                        <PrismSlider label="Glow" value={glow} min={0} max={5} step={0.1} onChange={setGlow} />
                        <PrismSlider label="Bloom" value={bloom} min={0} max={3} step={0.1} onChange={setBloom} />
                        <PrismSlider label="Scale" value={prismScale} min={0.5} max={10} step={0.1} onChange={setPrismScale} />
                        <PrismSlider label="Speed" value={timeScale} min={0} max={2} step={0.05} onChange={setTimeScale} />
                        <PrismSlider label="Color Freq" value={colorFreq} min={0.1} max={3} step={0.1} onChange={setColorFreq} />
                        <PrismSlider label="Noise" value={noiseVal} min={0} max={1} step={0.05} onChange={setNoiseVal} />
                        <div className="text-white/50 text-[10px] font-mono mt-3 mb-1 uppercase tracking-wider">Tint Color</div>
                        <PrismSlider label="R" value={tintR} min={0} max={1} step={0.01} onChange={setTintR} color="#f87171" />
                        <PrismSlider label="G" value={tintG} min={0} max={1} step={0.01} onChange={setTintG} color="#4ade80" />
                        <PrismSlider label="B" value={tintB} min={0} max={1} step={0.01} onChange={setTintB} color="#60a5fa" />
                        <div className="mt-2 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-md border border-white/20" style={{ background: `rgb(${Math.round(tintR*255)},${Math.round(tintG*255)},${Math.round(tintB*255)})` }} />
                            <span className="text-white/60 text-xs font-mono">
                                rgb({Math.round(tintR*255)},{Math.round(tintG*255)},{Math.round(tintB*255)})
                            </span>
                        </div>
                        <button
                            onClick={() => {
                                const cfg = `glow={${glow}}\nnoise={${noiseVal}}\nbloom={${bloom}}\nscale={${prismScale}}\ntimeScale={${timeScale}}\ncolorFrequency={${colorFreq}}\nopacity={${opacity}%}\ntintColor={[${tintR}, ${tintG}, ${tintB}]}`;
                                navigator.clipboard.writeText(cfg);
                            }}
                            className="mt-3 w-full text-xs bg-white/10 hover:bg-white/20 text-white/70 py-1.5 rounded-lg transition-colors"
                        >
                            Copy Config
                        </button>
                    </div>
                )}
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

function PrismSlider({ label, value, min, max, step, onChange, display, color }: {
    label: string; value: number; min: number; max: number; step: number;
    onChange: (v: number) => void; display?: string; color?: string;
}) {
    return (
        <div className="flex items-center gap-2 mb-1.5">
            <span className="text-white/60 text-[11px] font-mono w-16 shrink-0">{label}</span>
            <input
                type="range"
                min={min} max={max} step={step} value={value}
                onChange={e => onChange(parseFloat(e.target.value))}
                className="flex-1 h-1 appearance-none rounded-full cursor-pointer"
                style={{
                    accentColor: color || '#6BB8C4',
                    background: `linear-gradient(to right, ${color || '#6BB8C4'} ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.15) ${((value - min) / (max - min)) * 100}%)`
                }}
            />
            <span className="text-white/50 text-[10px] font-mono w-10 text-right">{display ?? value.toFixed(2)}</span>
        </div>
    );
}
