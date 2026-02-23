'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface AnimatedContentProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    container?: Element | string | null;
    distance?: number;
    direction?: 'vertical' | 'horizontal';
    reverse?: boolean;
    duration?: number;
    ease?: string;
    initialOpacity?: number;
    animateOpacity?: boolean;
    scale?: number;
    threshold?: number;
    delay?: number;
    disappearAfter?: number;
    disappearDuration?: number;
    disappearEase?: string;
    onComplete?: () => void;
    onDisappearanceComplete?: () => void;
}

const AnimatedContent: React.FC<AnimatedContentProps> = ({
    children,
    container,
    distance = 100,
    direction = 'vertical',
    reverse = false,
    duration = 0.8,
    ease = 'power3.out',
    initialOpacity = 0,
    animateOpacity = true,
    scale = 1,
    threshold = 0.1,
    delay = 0,
    disappearAfter = 0,
    disappearDuration = 0.5,
    disappearEase = 'power3.in',
    onComplete,
    onDisappearanceComplete,
    className = '',
    ...props
}) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            let scrollerTarget: Element | null = null;
            if (container) {
                scrollerTarget = typeof container === 'string' ? document.querySelector(container) : container as Element;
            } else {
                scrollerTarget = document.getElementById('snap-main-container');
            }

            const axis = direction === 'horizontal' ? 'x' : 'y';
            const offset = reverse ? -distance : distance;
            const startPct = (1 - threshold) * 100;

            // Set initial state
            gsap.set(el, {
                [axis]: offset,
                scale,
                autoAlpha: animateOpacity ? initialOpacity : 1,
            });

            const tl = gsap.timeline({
                paused: true,
                delay,
                onComplete: () => {
                    onComplete?.();
                    if (disappearAfter > 0) {
                        ctx.add(() => {
                            gsap.to(el, {
                                [axis]: reverse ? distance : -distance,
                                scale: 0.8,
                                autoAlpha: animateOpacity ? initialOpacity : 0,
                                delay: disappearAfter,
                                duration: disappearDuration,
                                ease: disappearEase,
                                onComplete: () => onDisappearanceComplete?.()
                            });
                        });
                    }
                }
            });

            tl.to(el, {
                [axis]: 0,
                scale: 1,
                autoAlpha: 1,
                duration,
                ease
            });

            ScrollTrigger.create({
                trigger: el,
                scroller: scrollerTarget || window,
                start: `top ${startPct}%`,
                once: true,
                onEnter: () => tl.play()
            });
        }, ref);

        return () => ctx.revert();
    }, [
        container,
        distance,
        direction,
        reverse,
        duration,
        ease,
        initialOpacity,
        animateOpacity,
        scale,
        threshold,
        delay,
        disappearAfter,
        disappearDuration,
        disappearEase,
        onComplete,
        onDisappearanceComplete
    ]);

    return (
        <div ref={ref} className={`invisible ${className}`} {...props}>
            {children}
        </div>
    );
};

export default AnimatedContent;