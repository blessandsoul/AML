'use client';

import * as React from 'react';
import { motion, type Variants } from 'framer-motion';
import type { CarCharacterState } from '../types';

interface CarCharacterProps {
    state: CarCharacterState;
    size?: number;
    className?: string;
}

export function CarCharacter({ state, size = 48, className }: CarCharacterProps) {
    const [isBlinking, setIsBlinking] = React.useState(false);
    const [mouseOffset, setMouseOffset] = React.useState({ x: 0, y: 0 });
    const svgRef = React.useRef<SVGSVGElement>(null);

    // Blinking effect for idle state
    React.useEffect(() => {
        if (state === 'idle') {
            const blinkInterval = setInterval(() => {
                setIsBlinking(true);
                setTimeout(() => setIsBlinking(false), 150);
            }, 3000 + Math.random() * 2000);
            return () => clearInterval(blinkInterval);
        }
    }, [state]);

    // Eyes follow mouse
    React.useEffect(() => {
        if (state === 'sleeping') return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!svgRef.current) return;

            const rect = svgRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;

            // Limit the offset to a small range for subtle movement
            const maxOffset = 3;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const normalizedX = distance > 0 ? (deltaX / distance) * Math.min(distance / 50, 1) * maxOffset : 0;
            const normalizedY = distance > 0 ? (deltaY / distance) * Math.min(distance / 50, 1) * maxOffset : 0;

            setMouseOffset({ x: normalizedX, y: normalizedY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [state]);

    const getEyeScaleY = () => {
        if (state === 'sleeping') return 0.05;
        if (isBlinking && state === 'idle') return 0.1;
        switch (state) {
            case 'thinking': return 0.8;
            default: return 1;
        }
    };

    const getEyeScale = () => {
        return state === 'listening' ? 1.1 : 1;
    };

    // Eyebrow positions based on state
    const getEyebrowRotation = (isLeft: boolean) => {
        switch (state) {
            case 'thinking': return isLeft ? -15 : 15; // Furrowed
            case 'happy': return isLeft ? 10 : -10; // Raised happily
            case 'listening': return isLeft ? 5 : -5; // Slightly raised, attentive
            case 'sleeping': return 0;
            default: return 0;
        }
    };

    const getEyebrowY = () => {
        switch (state) {
            case 'happy': return -2;
            case 'listening': return -1;
            case 'thinking': return 1;
            default: return 0;
        }
    };

    const bodyVariants: Variants = {
        idle: {
            y: [0, -3, 0],
            transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' as const }
        },
        listening: {
            scale: 1.02,
            transition: { duration: 0.2 }
        },
        thinking: {
            rotate: [-2, 2, -2],
            transition: { repeat: Infinity, duration: 0.5 }
        },
        talking: {
            y: [0, -2, 0],
            transition: { repeat: Infinity, duration: 0.3 }
        },
        happy: {
            y: -5,
            scale: 1.1,
            transition: { type: 'spring', stiffness: 300 }
        },
        sleeping: {
            y: [0, 2, 0],
            transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' as const }
        }
    };

    const isSleeping = state === 'sleeping';

    return (
        <motion.svg
            ref={svgRef}
            viewBox="0 0 100 80"
            width={size}
            height={size * 0.8}
            className={className}
            animate={state}
            variants={bodyVariants}
        >
            {/* Shadow */}
            <ellipse
                cx="50"
                cy="72"
                rx="30"
                ry="5"
                fill="rgba(0,0,0,0.15)"
            />

            {/* Car Body - Main shape */}
            <motion.path
                d="M15 48 Q15 35 30 32 L70 32 Q85 35 85 48 L85 54 Q85 58 80 58 L20 58 Q15 58 15 54 Z"
                fill="#2D88C4"
                stroke="#2563EB"
                strokeWidth="1.5"
            />

            {/* Car Body - Roof */}
            <motion.path
                d="M28 32 Q32 18 50 18 Q68 18 72 32"
                fill="#2D88C4"
                stroke="#2563EB"
                strokeWidth="1.5"
            />

            {/* Windshield */}
            <path
                d="M32 32 Q36 22 50 22 Q64 22 68 32"
                fill="rgba(147,197,253,0.5)"
                stroke="#93C5FD"
                strokeWidth="0.5"
            />

            {/* Hood shine */}
            <path
                d="M25 42 Q35 38 45 42"
                fill="none"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="2"
                strokeLinecap="round"
            />

            {/* Headlights */}
            <motion.circle
                cx="22"
                cy="45"
                r="4"
                fill={isSleeping ? "#FEF08A" : "#FEF08A"}
                stroke="#EAB308"
                strokeWidth="0.5"
                animate={isSleeping ? { opacity: [0.3, 0.5, 0.3] } : { opacity: 1 }}
                transition={isSleeping ? { repeat: Infinity, duration: 2 } : {}}
            />
            <motion.circle
                cx="78"
                cy="45"
                r="4"
                fill="#FEF08A"
                stroke="#EAB308"
                strokeWidth="0.5"
                animate={isSleeping ? { opacity: [0.3, 0.5, 0.3] } : { opacity: 1 }}
                transition={isSleeping ? { repeat: Infinity, duration: 2 } : {}}
            />

            {/* Eyes Container */}
            <g transform="translate(0, -2)">
                {/* Left Eyebrow */}
                <motion.path
                    d="M31 26 Q40 24 49 26"
                    fill="none"
                    stroke="#1E3A5F"
                    strokeWidth="2"
                    strokeLinecap="round"
                    animate={{
                        rotate: getEyebrowRotation(true),
                        y: getEyebrowY()
                    }}
                    style={{ originX: '40px', originY: '26px' }}
                    transition={{ duration: 0.2 }}
                />

                {/* Right Eyebrow */}
                <motion.path
                    d="M51 26 Q60 24 69 26"
                    fill="none"
                    stroke="#1E3A5F"
                    strokeWidth="2"
                    strokeLinecap="round"
                    animate={{
                        rotate: getEyebrowRotation(false),
                        y: getEyebrowY()
                    }}
                    style={{ originX: '60px', originY: '26px' }}
                    transition={{ duration: 0.2 }}
                />

                {/* Left Eye White */}
                <ellipse
                    cx="40"
                    cy="38"
                    rx="9"
                    ry="11"
                    fill="white"
                    stroke="#1E3A5F"
                    strokeWidth="1"
                />
                {/* Left Eye Pupil - follows mouse */}
                <motion.ellipse
                    cx={42 + (isSleeping ? 0 : mouseOffset.x)}
                    cy={38 + (isSleeping ? 0 : mouseOffset.y)}
                    rx="4"
                    ry={5 * getEyeScaleY()}
                    fill="#1E3A5F"
                    animate={{
                        scaleY: getEyeScaleY(),
                        scale: getEyeScale()
                    }}
                    transition={{ duration: 0.1 }}
                />
                {/* Left Eye Highlight */}
                {!isSleeping && (
                    <circle cx={44 + mouseOffset.x * 0.5} cy="35" r="2" fill="white" opacity="0.8" />
                )}

                {/* Right Eye White */}
                <ellipse
                    cx="60"
                    cy="38"
                    rx="9"
                    ry="11"
                    fill="white"
                    stroke="#1E3A5F"
                    strokeWidth="1"
                />
                {/* Right Eye Pupil - follows mouse */}
                <motion.ellipse
                    cx={62 + (isSleeping ? 0 : mouseOffset.x)}
                    cy={38 + (isSleeping ? 0 : mouseOffset.y)}
                    rx="4"
                    ry={5 * getEyeScaleY()}
                    fill="#1E3A5F"
                    animate={{
                        scaleY: getEyeScaleY(),
                        scale: getEyeScale()
                    }}
                    transition={{ duration: 0.1 }}
                />
                {/* Right Eye Highlight */}
                {!isSleeping && (
                    <circle cx={64 + mouseOffset.x * 0.5} cy="35" r="2" fill="white" opacity="0.8" />
                )}
            </g>

            {/* Smile - visible in happy/talking state */}
            {(state === 'happy' || state === 'talking') && (
                <motion.path
                    d="M42 50 Q50 56 58 50"
                    fill="none"
                    stroke="#1E3A5F"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={{ opacity: 1, pathLength: 1 }}
                    transition={{ duration: 0.3 }}
                />
            )}

            {/* Thinking dots */}
            {state === 'thinking' && (
                <g>
                    <motion.circle
                        cx="75"
                        cy="15"
                        r="3"
                        fill="#93C5FD"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                    />
                    <motion.circle
                        cx="82"
                        cy="10"
                        r="2.5"
                        fill="#93C5FD"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                    />
                    <motion.circle
                        cx="88"
                        cy="6"
                        r="2"
                        fill="#93C5FD"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                    />
                </g>
            )}

            {/* Sleeping ZZZ */}
            {isSleeping && (
                <g>
                    <motion.text
                        x="70"
                        y="12"
                        fill="#93C5FD"
                        fontSize="10"
                        fontWeight="bold"
                        animate={{
                            opacity: [0, 1, 0],
                            y: [12, 8, 4],
                            x: [70, 73, 76]
                        }}
                        transition={{ repeat: Infinity, duration: 2, delay: 0 }}
                    >
                        z
                    </motion.text>
                    <motion.text
                        x="78"
                        y="8"
                        fill="#93C5FD"
                        fontSize="8"
                        fontWeight="bold"
                        animate={{
                            opacity: [0, 1, 0],
                            y: [8, 4, 0],
                            x: [78, 81, 84]
                        }}
                        transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
                    >
                        z
                    </motion.text>
                    <motion.text
                        x="85"
                        y="4"
                        fill="#93C5FD"
                        fontSize="6"
                        fontWeight="bold"
                        animate={{
                            opacity: [0, 1, 0],
                            y: [4, 0, -4],
                            x: [85, 88, 91]
                        }}
                        transition={{ repeat: Infinity, duration: 2, delay: 0.6 }}
                    >
                        z
                    </motion.text>
                </g>
            )}

            {/* Wheels */}
            <circle cx="30" cy="60" r="8" fill="#1F2937" />
            <circle cx="30" cy="60" r="4" fill="#6B7280" />
            <circle cx="30" cy="60" r="1.5" fill="#9CA3AF" />

            <circle cx="70" cy="60" r="8" fill="#1F2937" />
            <circle cx="70" cy="60" r="4" fill="#6B7280" />
            <circle cx="70" cy="60" r="1.5" fill="#9CA3AF" />

            {/* Bumper */}
            <rect x="18" y="54" width="64" height="3" rx="1" fill="#60A5FA" />
        </motion.svg>
    );
}
