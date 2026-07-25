'use client';

import { useEffect, useRef, forwardRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '@/components/SplitText';
import InteractiveCube from '@/components/ui/InteractiveCube';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  onReady: (fn: () => void) => void;
}

const Hero = forwardRef<HTMLDivElement, HeroProps>(({ onReady }, ref) => {
  const scrollDripRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      gsap.set('.hero h1 .line span', { yPercent: 110 });
      gsap.set('.hero-right', { scale: 0.8, opacity: 0 });
      
      const heroTimeline = gsap.timeline({ paused: true })
        .to('.hero h1 .line span', { yPercent: 0, duration: 1.2, stagger: 0.08, ease: 'power4.out' })
        .from('.hero-sub', { y: 15, duration: 0.8, ease: 'power2.out' }, '-=0.6')
        .from('.hero-ctas .btn', { y: 12, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, '-=0.5')
        .to('.hero-right', { scale: 1, opacity: 1, duration: 1.2, ease: 'power3.out' }, '-=0.8')
        .from('.hero-scrollcue', { y: 8, duration: 0.6 }, '-=0.4');

    onReady(() => heroTimeline.play());

    const initHeroLetterHover = () => {
      const container = document.querySelector('.hero h1');
      if (!container) return;

      function splitTextIntoSpans(node: Node) {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent || '';
          if (!text.trim()) return;
          const parent = node.parentNode;
          if (!parent) return;

          if (
            (parent as HTMLElement).classList?.contains('letter-char') ||
            (parent as HTMLElement).classList?.contains('hero-split-name') ||
            (parent as HTMLElement).closest?.('.hero-split-name')
          ) {
            return;
          }

          const fragment = document.createDocumentFragment();
          for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if (char === ' ') {
              fragment.appendChild(document.createTextNode(' '));
            } else {
              const span = document.createElement('span');
              span.className = 'letter-char';
              span.style.display = 'inline-block';
              span.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
              span.textContent = char;
              fragment.appendChild(span);
            }
          }
          parent.replaceChild(fragment, node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          if (el.classList?.contains('hero-split-name')) return;
          const children = Array.from(el.childNodes);
          children.forEach(splitTextIntoSpans);
        }
      }

      const lines = document.querySelectorAll('.hero h1 .line');
      lines.forEach((line, index) => {
        if (index === 0) return;
        splitTextIntoSpans(line);
      });

      document.querySelectorAll('.letter-char').forEach((char) => {
        const element = char as HTMLElement;
        const parent = element.parentNode as HTMLElement;
        let originalColor = '#f3f4f6';
        if (parent && (parent.classList?.contains('accent-lime') || parent.closest?.('.accent-lime'))) {
          originalColor = 'var(--lime)';
        } else if (parent && (parent.classList?.contains('accent-amber') || parent.closest?.('.accent-amber'))) {
          originalColor = 'var(--amber)';
        }
        element.style.color = originalColor;

        element.addEventListener('mouseenter', () => {
          gsap.to(element, { scale: 1.35, y: -8, rotation: Math.random() * 20 - 10, color: '#c5ff7c', duration: 0.3 });
        });
        element.addEventListener('mouseleave', () => {
          gsap.to(element, { scale: 1, y: 0, rotation: 0, color: originalColor, duration: 0.5 });
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
      <div className="hero-grid">
        <div className="hero-left">
          <h1>
            <div className="line">
              <SplitText text="Hi, I'm NEERAJ —" className="hero-split-name" delay={45} duration={0.75}
                ease="power3.out" splitType="chars" from={{ opacity: 0, y: 40 }} to={{ opacity: 1, y: 0 }}
                threshold={0.1} textAlign="left" tag="span" />
            </div>
            <div className="line"><span>I build <span className="accent-lime">distributed cloud <br></br> systems</span></span></div>
            <div className="line"><span>that scale to <span className="accent-amber">millions.</span></span></div>
          </h1>
          <p className="hero-sub">
            Full Stack Cloud Engineer building highly resilient distributed architectures, 
            event-driven microservices, and robust cloud infrastructures 
            (Spring Boot, Kafka, Redis, AWS).
          </p>
          <div className="hero-ctas">
            <a href="#projects" className="btn btn-primary" data-nav>Explore work →</a>
            <a href="#contact" className="btn btn-ghost" data-nav>Get in touch</a>
          </div>
        </div>
        <div className="hero-right">
          <InteractiveCube />
        </div>
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
