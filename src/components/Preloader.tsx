'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const GREETINGS = [
  "Hello",       // English
  "Bonjour",     // French
  "Ciao",        // Italian
  "Namaste",     // Hindi
  "Hola",        // Spanish
  "こんにちは",   // Japanese
  "Olà",         // Portuguese
  "Welcome"      // Final
];

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordGroupRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const percentRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    // 1. Lock screen scrolling
    document.documentElement.classList.add('no-scroll');
    document.body.classList.add('no-scroll');

    // 2. Timeline for word sequence
    const wordTimeline = gsap.timeline({
      onComplete: () => {
        // Unlock scrolling
        document.documentElement.classList.remove('no-scroll');
        document.body.classList.remove('no-scroll');

        const exitTimeline = gsap.timeline({
          onComplete: () => {
            onComplete();
          }
        });

        // Slide up container
        exitTimeline.to(
          containerRef.current,
          { yPercent: -100, duration: 0.95, ease: 'power4.inOut' },
          0
        );

        // Curve the SVG path (stretch down) as it slides up
        exitTimeline.to(
          pathRef.current,
          { attr: { d: 'M0,0 L100,0 Q50,100 0,0 Z' }, duration: 0.45, ease: 'power2.in' },
          0
        );

        // Flatten the SVG path back (snap release) near the end
        exitTimeline.to(
          pathRef.current,
          { attr: { d: 'M0,0 L100,0 Q50,0 0,0 Z' }, duration: 0.5, ease: 'power2.out' },
          0.45
        );
      }
    });

    GREETINGS.forEach((word, idx) => {
      // Set the text content before sliding in
      wordTimeline.call(() => {
        if (textRef.current) {
          textRef.current.innerText = word;
        }
      });

      // Animate the word group (slide up and fade in)
      wordTimeline.fromTo(
        wordGroupRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.25, ease: 'power3.out' }
      );

      // Hold the word
      wordTimeline.to({}, { duration: 0.18 });

      // If not the final word, slide out to top
      if (idx < GREETINGS.length - 1) {
        wordTimeline.to(
          wordGroupRef.current,
          { y: -60, opacity: 0, duration: 0.2, ease: 'power3.in' }
        );
      } else {
        // Hold the final "Welcome" word a bit longer
        wordTimeline.to({}, { duration: 0.35 });
      }
    });

    // 3. Percentage counter animation (runs concurrently)
    const counterObj = { value: 0 };
    const totalDuration = wordTimeline.duration();

    gsap.to(counterObj, {
      value: 100,
      duration: Math.max(0.1, totalDuration - 0.4), // reach 100% just before the exit animation
      ease: 'power1.out',
      onUpdate: () => {
        if (percentRef.current) {
          percentRef.current.innerText = 
            Math.round(counterObj.value).toString().padStart(3, '0') + '%';
        }
      }
    });

    return () => {
      // Clean up in case of unmount
      wordTimeline.kill();
      document.documentElement.classList.remove('no-scroll');
      document.body.classList.remove('no-scroll');
    };
  }, [onComplete]);

  return (
    <div ref={containerRef} className="preloader-container">
      {/* Top Header Logo */}
      <div className="preloader-header">
        <span className="preloader-logo">
          NEERAJ<span className="preloader-logo-dot" />
        </span>
      </div>

      {/* Centered Cycling Welcoming Greetings */}
      <div className="preloader-main">
        <div className="preloader-word-viewport">
          <div ref={wordGroupRef} className="preloader-word-group">
            <span ref={textRef} className="preloader-word">
              Hello
            </span>
            <span className="preloader-word-dot" />
          </div>
        </div>
      </div>

      {/* Bottom Percentage Counter */}
      <div className="preloader-footer">
        <div ref={percentRef} className="preloader-percent">
          000%
        </div>
      </div>

      {/* Curved slide-up SVG overlay */}
      <svg className="preloader-svg-curve" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path ref={pathRef} d="M0,0 L100,0 Q50,0 0,0 Z" />
      </svg>
    </div>
  );
}
