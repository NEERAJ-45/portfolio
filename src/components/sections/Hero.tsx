'use client';

import { useEffect, useRef, forwardRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '@/components/SplitText';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  onReady: (fn: () => void) => void;
}

const Hero = forwardRef<HTMLDivElement, HeroProps>(({ onReady }, ref) => {
  const scrollDripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.set('.hero h1 .line span', { yPercent: 110 });
    const heroTimeline = gsap.timeline({ paused: true })
      .to('.hero h1 .line span', { yPercent: 0, duration: 1.2, stagger: 0.08, ease: 'power4.out' })
      .from('.hero-eyebrow', { x: -20, duration: 0.8, ease: 'power3.out' }, '-=0.8')
      .from('.hero-sub', { y: 15, duration: 0.8, ease: 'power2.out' }, '-=0.6')
      .from('.hero-ctas .btn', { y: 12, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, '-=0.5')
      .from('.hero-scrollcue', { y: 8, duration: 0.6 }, '-=0.4');

    onReady(() => heroTimeline.play());

    const initHeroLetterHover = () => {
      document.querySelectorAll('.hero h1 .line span').forEach((header) => {
        const text = header.textContent || '';
        if (header.classList.contains('accent-lime') || header.classList.contains('accent-amber') || text.includes('Hi,')) return;
        const letters = text.split('').map((char) => {
          if (char === ' ') return '&nbsp;';
          return `<span class="letter-char" style="display:inline-block; transition:transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);">${char}</span>`;
        }).join('');
        header.innerHTML = letters;
      });
      document.querySelectorAll('.letter-char').forEach((char) => {
        char.addEventListener('mouseenter', () => {
          gsap.to(char, { scale: 1.35, y: -8, rotation: Math.random() * 20 - 10, color: '#c5ff7c', duration: 0.3 });
        });
        char.addEventListener('mouseleave', () => {
          gsap.to(char, { scale: 1, y: 0, rotation: 0, color: '#f3f4f6', duration: 0.5 });
        });
      });
    };
    initHeroLetterHover();
  }, [onReady]);

  useEffect(() => {
    const drip = scrollDripRef.current;
    if (!drip) return;
    gsap.fromTo(drip,
      { yPercent: -100, opacity: 1 },
      { yPercent: 100, opacity: 0.3, duration: 1.8, ease: 'power2.inOut', repeat: -1, repeatDelay: 0.1 }
    );
  }, []);

  return (
    <section className="hero" id="hero" ref={ref}>
      <div className="hero-figure-bg">01</div>
      <div className="hero-eyebrow">Distributed Systems &amp; Payments</div>
      <h1>
        <div className="line">
          <SplitText text="Hi, I'm NEERAJ —" className="hero-split-name" delay={45} duration={0.75}
            ease="power3.out" splitType="chars" from={{ opacity: 0, y: 40 }} to={{ opacity: 1, y: 0 }}
            threshold={0.1} textAlign="left" tag="span" />
        </div>
        <div className="line"><span>I build <span className="accent-lime">architectures</span></span></div>
        <div className="line"><span>that <span className="accent-amber">scale</span> &amp; secure data.</span></div>
      </h1>
      <p className="hero-sub">
        Backend Software Engineer specializing in payments, event-driven microservices,
        and high-volume transaction processing (Spring Boot, Java, Kafka, Redis, AWS).
        Proficient across the full-stack.
      </p>
      <div className="hero-ctas">
        <a href="#projects" className="btn btn-primary" data-nav>Explore work →</a>
        <a href="#contact" className="btn btn-ghost" data-nav>Get in touch</a>
      </div>
      <div className="hero-scrollcue">
        <div className="scroll-line"><div ref={scrollDripRef} className="scroll-drip" /></div>
        Scroll to voyage
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';
export default Hero;
