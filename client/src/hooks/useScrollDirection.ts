'use client';

import { useScroll, useMotionValueEvent } from 'framer-motion';
import { useState, useRef } from 'react';

interface ScrollDirectionResult {
    scrolled: boolean;
    scrollDirection: 'up' | 'down' | null;
    scrollYValue: number;
    isAtTop: boolean;
}

export function useScrollDirection(threshold = 20): ScrollDirectionResult {
    const { scrollY } = useScroll();
    const [state, setState] = useState<ScrollDirectionResult>({
        scrolled: false,
        scrollDirection: null,
        scrollYValue: 0,
        isAtTop: true,
    });
    const previousScrollY = useRef(0);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const delta = latest - previousScrollY.current;
        // 10px dead-zone to prevent jitter
        let direction = state.scrollDirection;
        if (delta > 10) direction = 'down';
        else if (delta < -10) direction = 'up';

        setState({
            scrolled: latest > threshold,
            scrollDirection: direction,
            scrollYValue: latest,
            isAtTop: latest <= 5,
        });
        previousScrollY.current = latest;
    });

    return state;
}
