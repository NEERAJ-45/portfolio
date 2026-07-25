'use client';

import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);
}

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: string;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify' | 'initial' | 'inherit';
  tag?: keyof React.JSX.IntrinsicElements;
  onLetterAnimationComplete?: () => void;
}

export default function SplitText({
  text,
  className = '',
  delay = 50,
  duration = 1.25,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'left',
  tag = 'span',
  onLetterAnimationComplete
}: SplitTextProps) {
  const ref = useRef<HTMLElement | null>(null);
  const animationCompletedRef = useRef(false);
  const onCompleteRef = useRef(onLetterAnimationComplete);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);
      if (document.fonts && document.fonts.status === 'loaded') {
        setFontsLoaded(true);
      } else if (document.fonts) {
        document.fonts.ready.then(() => setFontsLoaded(true));
      } else {
        setFontsLoaded(true);
      }
    }
  }, []);

  useGSAP(
    () => {
      if (!ref.current || !text || !fontsLoaded) return;
      if (animationCompletedRef.current) return;
      const el = ref.current as HTMLElement & { _rbsplitInstance?: any };

      if (el._rbsplitInstance) {
        try {
          el._rbsplitInstance.revert();
        } catch (_) {}
        el._rbsplitInstance = null;
      }

      let targets: any[] = [];

      const splitInstance = new GSAPSplitText(el, {
        type: splitType,
        smartWrap: true,
        linesClass: 'split-line',
        wordsClass: 'split-word',
        charsClass: 'split-char',
        reduceWhiteSpace: false
      });

      if (splitType.includes('chars') && splitInstance.chars?.length) {
        targets = splitInstance.chars;
      } else if (splitType.includes('words') && splitInstance.words?.length) {
        targets = splitInstance.words;
      } else if (splitType.includes('lines') && splitInstance.lines?.length) {
        targets = splitInstance.lines;
      } else {
        targets = splitInstance.chars || splitInstance.words || splitInstance.lines || [];
      }

      if (targets.length) {
        const isMobileDevice = typeof window !== 'undefined' &&
          (window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window);
        const mobileDuration = isMobileDevice ? Math.min(duration, 0.6) : duration;
        const mobileStagger = isMobileDevice ? Math.min(delay / 1000, 0.025) : delay / 1000;

        gsap.fromTo(
          targets,
          { ...from },
          {
            ...to,
            duration: mobileDuration,
            ease,
            stagger: mobileStagger,
            scrollTrigger: {
              trigger: el,
              start: 'top 95%',
              once: true,
              fastScrollEnd: true
            },
            onComplete: () => {
              animationCompletedRef.current = true;
              onCompleteRef.current?.();
            },
            willChange: 'transform, opacity',
            force3D: true
          }
        );
      }

      el._rbsplitInstance = splitInstance;

      return () => {
        ScrollTrigger.getAll().forEach(st => {
          if (st.trigger === el) st.kill();
        });
        try {
          splitInstance.revert();
        } catch (_) {}
        el._rbsplitInstance = null;
      };
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin,
        fontsLoaded
      ],
      scope: ref
    }
  );

  const Tag = (tag || 'span') as any;
  const style: React.CSSProperties = {
    textAlign,
    overflow: 'visible',
    display: 'inline-block',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    willChange: 'transform, opacity'
  };
  const classes = `split-parent ${className}`;

  return (
    <Tag ref={ref} style={style} className={classes}>
      {text}
    </Tag>
  );
}

