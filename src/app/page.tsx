'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Preloader from '@/components/Preloader';
import CustomCursor from '@/components/ui/CustomCursor';
import Nav from '@/components/layout/Nav';
import FullscreenMenu from '@/components/layout/FullscreenMenu';
import Hero from '@/components/sections/Hero';
import SkillsSection from '@/components/sections/SkillsSection';
import JourneySection from '@/components/sections/JourneySection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ProjectModal from '@/components/sections/ProjectModal';
import ContactSection from '@/components/sections/ContactSection';
import { ProjectData } from '@/data/projects';
import { scrollState } from '@/lib/scroll-state';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

if (typeof document !== 'undefined') {
  ScrollTrigger.defaults({ scroller: document.body });
  ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) { if (arguments.length) window.scrollTo(0, value as number); return scrollState.currentY; },
    getBoundingClientRect() { return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }; },
    pinType: 'transform',
  });
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroPlayRef = useRef<(() => void) | null>(null);

  const handleHeroReady = useCallback((fn: () => void) => { heroPlayRef.current = fn; }, []);

  useEffect(() => {
    const content = contentRef.current!;
    const spacer = spacerRef.current!;

    let currentY = 0, targetY = 0, lastVelocity = 0, rafId: number;
    const isTouch = window.matchMedia('(max-width: 768px)').matches;
    const LERP = isTouch ? 0.18 : 0.08;
    let isResizing = false;

    function setSpacerHeight() { spacer.style.height = content.scrollHeight + 'px'; }
    setSpacerHeight();

    window.addEventListener('resize', () => { isResizing = true; setSpacerHeight(); setTimeout(() => { isResizing = false; }, 200); });
    if (document.readyState !== 'complete') window.addEventListener('load', () => setTimeout(setSpacerHeight, 300), { once: true });

    function raf() {
      if (!isResizing) {
        targetY = window.scrollY;
        currentY += (targetY - currentY) * LERP;
        if (Math.abs(targetY - currentY) < 0.05) currentY = targetY;
        content.style.transform = `translate3d(0, ${-currentY}px, 0)`;
        lastVelocity = targetY - currentY;
        scrollState.currentY = currentY;
        ScrollTrigger.update();
      }
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);


    ScrollTrigger.addEventListener('refresh', setSpacerHeight);

    const onNavClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('[data-nav]') as HTMLAnchorElement | null;
      if (!anchor) return;
      e.preventDefault();
      setMenuOpen(false);
      const href = anchor.getAttribute('href');
      if (!href) return;
      const target = document.querySelector(href);
      if (target) {
        // Use offsetTop relative to the content container to handle the CSS-transform scroll
        const destY = (target as HTMLElement).offsetTop;
        gsap.to(window, { scrollTo: destY, duration: 1.2, ease: 'power4.inOut', overwrite: 'auto' });
      }
    };
    document.addEventListener('click', onNavClick);

    // Canvas starfield
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d')!;
      let w = canvas.width = window.innerWidth;
      let h = canvas.height = window.innerHeight;
      window.addEventListener('resize', () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; });

      const isMob = window.matchMedia('(max-width: 768px)').matches;
      const count = isMob ? 55 : 120;
      const colors = ['#c5ff7c', '#ffb454', '#ffffff', '#6366f1'];
      const particles = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h, z: Math.random() * 2 + 0.5,
        baseRadius: Math.random() * 1.5 + 0.5, color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * Math.PI * 2,
        orbitSpeed: (Math.random() * 0.002 + 0.0005) * (Math.random() > 0.5 ? 1 : -1),
        orbitRadius: Math.random() * 40 + 10,
      }));

      let mouseX = -100, mouseY = -100;
      window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });

      function render() {
        ctx.clearRect(0, 0, w, h);
        const warp = Math.abs(lastVelocity) > (isMob ? 3 : 8);
        for (const p of particles) {
          p.angle += p.orbitSpeed;
          const ox = Math.cos(p.angle) * p.orbitRadius * 0.05;
          const oy = Math.sin(p.angle) * p.orbitRadius * 0.05;
          p.y += (0.15 * p.z) + (lastVelocity * 0.02 * p.z);
          if (p.y > h) { p.y = -10; p.x = Math.random() * w; }
          else if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
          const dx = p.x + (mouseX - w / 2) * 0.015 * p.z + ox;
          const dy = p.y + (mouseY - h / 2) * 0.015 * p.z + oy;
          ctx.beginPath();
          ctx.fillStyle = p.color;
          if (warp) {
            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.baseRadius * 0.8;
            ctx.moveTo(dx, dy);
            ctx.lineTo(dx, dy - lastVelocity * 1.8 * p.z);
            ctx.stroke();
          } else {
            const r = p.baseRadius * (1 + p.z * 0.25);
            ctx.arc(dx, dy, r, 0, Math.PI * 2);
            ctx.fill();
            if (p.color === '#c5ff7c' || p.color === '#ffb454') {
              ctx.shadowColor = p.color;
              ctx.shadowBlur = 12;
              ctx.arc(dx, dy, r, 0, Math.PI * 2);
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        }
        requestAnimationFrame(render);
      }
      render();
    }

    // Magnet buttons
    const magnet = document.querySelectorAll('.btn-primary, .btn-ghost, .contact-btn, .logo');
    const onMove = (e: Event) => {
      const ev = e as MouseEvent; const btn = e.currentTarget as HTMLElement;
      const rect = btn.getBoundingClientRect();
      gsap.to(btn, { x: (ev.clientX - rect.left - rect.width / 2) * 0.35, y: (ev.clientY - rect.top - rect.height / 2) * 0.35, duration: 0.3, ease: 'power2.out' });
    };
    const onLeave = (e: Event) => { gsap.to(e.currentTarget as HTMLElement, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1.2, 0.4)' }); };
    magnet.forEach((b) => { b.addEventListener('mousemove', onMove); b.addEventListener('mouseleave', onLeave); });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', setSpacerHeight);
      ScrollTrigger.getAll().forEach(t => t.kill());
      document.removeEventListener('click', onNavClick);
      magnet.forEach((b) => { b.removeEventListener('mousemove', onMove); b.removeEventListener('mouseleave', onLeave); });
    };
  }, []);

  useEffect(() => {
    if (!loading) { ScrollTrigger.refresh(); window.dispatchEvent(new Event('resize')); }
  }, [loading]);

  return (
    <>
      {loading && (
        <Preloader onComplete={() => { setLoading(false); heroPlayRef.current?.(); }} />
      )}
      <CustomCursor />
      <canvas ref={canvasRef} id="canvas-starfield" />
      <div className="cyber-grid-overlay" />
      <Nav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <FullscreenMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div ref={spacerRef} id="smooth-spacer" />
      <div ref={contentRef} id="smooth-content">
        <Hero onReady={handleHeroReady} />
        <SkillsSection />
        <JourneySection />
        <ProjectsSection onSelectProject={setSelectedProject} />
        <ContactSection />
      </div>
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </>
  );
}
