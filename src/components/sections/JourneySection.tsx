'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MotionPathPlugin from 'gsap/MotionPathPlugin';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

export default function JourneySection() {
  const roadSectionRef = useRef<HTMLElement>(null);
  const roadPinRef = useRef<HTMLDivElement>(null);
  const roadPathRef = useRef<SVGPathElement>(null);
  const roadSvgRef = useRef<SVGSVGElement>(null);
  const carGroupRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const m1Ref = useRef<HTMLDivElement>(null);
  const m2Ref = useRef<HTMLDivElement>(null);
  const m3Ref = useRef<HTMLDivElement>(null);
  const m4Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const starsWrap = starsRef.current;
    if (starsWrap) {
      starsWrap.innerHTML = '';
      for (let i = 0; i < 90; i++) {
        const s = document.createElement('div');
        s.className = 'star';
        s.style.left = Math.random() * 100 + '%';
        s.style.top = Math.random() * 70 + '%';
        s.style.width = (Math.random() * 2 + 1) + 'px';
        s.style.height = s.style.width;
        s.style.opacity = (0.2 + Math.random() * 0.8).toFixed(2);
        starsWrap.appendChild(s);
      }
    }

    const milestoneMeta = [
      { id: '#m1', el: m1Ref.current, pct: 0.10, side: 'right' as const },
      { id: '#m2', el: m2Ref.current, pct: 0.35, side: 'right' as const },
      { id: '#m3', el: m3Ref.current, pct: 0.60, side: 'left' as const },
      { id: '#m4', el: m4Ref.current, pct: 0.85, side: 'right' as const },
    ];

    function positionMilestones() {
      const path = roadPathRef.current;
      const pinRect = roadPinRef.current?.getBoundingClientRect();
      const svgRect = roadSvgRef.current?.getBoundingClientRect();
      const svgEl = roadSvgRef.current;
      if (!path || !pinRect || !svgRect || !svgEl) return;

      const len = path.getTotalLength();
      const svgH = svgEl.viewBox.baseVal.height;
      const svgW = svgEl.viewBox.baseVal.width;
      const labelHalfWidth = 140;
      const minAllowedLeft = labelHalfWidth + 20;
      const maxAllowedLeft = (pinRect.width || window.innerWidth) - labelHalfWidth - 20;

      milestoneMeta.forEach((m) => {
        if (!m.el) return;
        const pt = path.getPointAtLength(len * m.pct);
        const xRatio = pt.x / svgW;
        const yRatio = pt.y / svgH;
        const left = (svgRect.left - pinRect.left) + xRatio * svgRect.width;
        const top = (svgRect.top - pinRect.top) + yRatio * svgRect.height;
        let finalLeft = m.side === 'left' ? left - 50 : left + 10;
        finalLeft = Math.max(minAllowedLeft, Math.min(maxAllowedLeft, finalLeft));
        m.el.style.left = finalLeft + 'px';
        m.el.style.top = top - 50 + 'px';
      });
    }

    let roadTl: gsap.core.Timeline | null = null;

    function buildRoadTimeline() {
      const path = roadPathRef.current;
      const car = carGroupRef.current;
      const svg = roadSvgRef.current;
      const pin = roadPinRef.current;
      if (!path || !car || !svg || !pin) return;

      if (roadTl) { roadTl.scrollTrigger?.kill(); roadTl.kill(); }

      roadTl = gsap.timeline({
        scrollTrigger: { trigger: roadSectionRef.current, start: 'top top', end: 'bottom bottom', scrub: 0.8, pin, anticipatePin: 1, scroller: document.body },
      });

      const state = { p: 0 };
      roadTl.to(state, {
        p: 1, duration: 2, ease: 'none',
        onUpdate() {
          const p = roadPathRef.current; const se = roadSvgRef.current; const pe = roadPinRef.current;
          if (!p || !se || !pe) return;
          const len = p.getTotalLength(); const pr = pe.getBoundingClientRect(); const sr = se.getBoundingClientRect();
          const vb = se.viewBox.baseVal; const sx = (sr.width || 1) / (vb.width || 1440); const sy = (sr.height || 1) / (vb.height || 500);
          const pt = p.getPointAtLength(len * state.p);
          const x = sr.left - pr.left + pt.x * sx - 40; const y = sr.top - pr.top + pt.y * sy - 30;
          const d = Math.max(0.5, len * 0.002);
          const pa = p.getPointAtLength(Math.max(0, len * state.p - d)); const pb = p.getPointAtLength(Math.min(len, len * state.p + d));
          const a = Math.atan2(pb.y - pa.y, pb.x - pa.x) * (180 / Math.PI);
          gsap.set(car, { x, y, rotation: a, transformOrigin: '40px 25px' });
        },
      });

      roadTl.to('.road-sky', { opacity: 0.25, duration: 2, ease: 'none' }, 0);
      roadTl.to('.road-sky-night', { opacity: 1, duration: 2, ease: 'none' }, 0);
      roadTl.to('.hill-back path', { fill: '#0a0812', duration: 2, ease: 'none' }, 0);
      roadTl.to('.hill-mid path', { fill: '#050309', duration: 2, ease: 'none' }, 0);
      roadTl.to('.hill-front path', { fill: '#010103', duration: 2, ease: 'none' }, 0);
      roadTl.to('#roadPath', { attr: { stroke: 'rgba(197, 255, 124, 0.4)' }, duration: 2, ease: 'none' }, 0);
      roadTl.to('.star', { opacity: 1, scale: 1.3, duration: 2, ease: 'none' }, 0);
      roadTl.to('.road-sun', { opacity: 0, scale: 0.7, duration: 0.9, ease: 'none' }, 0);
      roadTl.to('.road-moon', { opacity: 1, duration: 1, ease: 'none' }, 0.6);

      milestoneMeta.forEach((m, i) => {
        if (!m.el) return;
        const windows = m.el.querySelectorAll<SVGRectElement>('.house-window');
        roadTl!.to(m.el, { scale: 1.15, duration: 0.5, ease: 'power2.out' }, i - 0.1);
        if (windows.length) roadTl!.to(windows, { fill: '#c5ff7c', duration: 0.4 }, i - 0.05);
        roadTl!.to(m.el, { scale: 1, duration: 0.5, ease: 'power2.in' }, i + 0.65);
      });

      const sp = path.getPointAtLength(0);
      const pr = pin.getBoundingClientRect(); const sr = svg.getBoundingClientRect();
      const vbb = svg.viewBox.baseVal;
      gsap.set(car, {
        x: sr.left - pr.left + sp.x * ((sr.width || 1) / (vbb.width || 1440)) - 40,
        y: sr.top - pr.top + sp.y * ((sr.height || 1) / (vbb.height || 500)) - 30,
        rotation: 0, transformOrigin: '40px 25px', autoAlpha: 1,
      });
    }

    const mm = gsap.matchMedia();
    mm.add("(min-width: 769px)", () => {
      positionMilestones();
      buildRoadTimeline();
      const handleResize = () => { positionMilestones(); buildRoadTimeline(); ScrollTrigger.refresh(); };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    });

    mm.add("(max-width: 768px)", () => {
      const svgEl = roadSvgRef.current; const pathEl = roadPathRef.current;
      if (!svgEl || !pathEl) return;
      const allPaths = svgEl.querySelectorAll<SVGPathElement>('path');
      const origD = pathEl.getAttribute('d') || '';
      const vertD = 'M 720,-20 C 1060,80 380,180 720,280 C 1060,380 380,450 720,520';
      allPaths.forEach(p => p.setAttribute('d', vertD));
      svgEl.style.pointerEvents = 'none';

      const st = ScrollTrigger.create({
        trigger: roadSectionRef.current, start: 'top top', end: 'bottom bottom', scrub: 0.8, scroller: document.body,
        onUpdate(self) {
          const p = roadPathRef.current; const svg = roadSvgRef.current; const pin = roadPinRef.current; const car = carGroupRef.current;
          if (!p || !svg || !pin || !car) return;
          const len = p.getTotalLength(); const pr = pin.getBoundingClientRect(); const sr = svg.getBoundingClientRect();
          const vb = svg.viewBox.baseVal; const sx = (sr.width || 1) / (vb.width || 1440); const sy = (sr.height || 1) / (vb.height || 500);
          const pt = p.getPointAtLength(len * self.progress);
          const x = sr.left - pr.left + pt.x * sx - 40; const y = sr.top - pr.top + pt.y * sy - 30;
          const d = Math.max(0.5, len * 0.002);
          const pa = p.getPointAtLength(Math.max(0, len * self.progress - d));
          const pb = p.getPointAtLength(Math.min(len, len * self.progress + d));
          const a = Math.atan2(pb.y - pa.y, pb.x - pa.x) * (180 / Math.PI);
          gsap.set(car, { x, y, rotation: a, transformOrigin: '40px 25px', autoAlpha: 1 });
        },
      });

      return () => { st.kill(); allPaths.forEach(p => p.setAttribute('d', origD)); svgEl.style.pointerEvents = ''; };
    });

    const initRoad = () => ScrollTrigger.refresh();
    if (document.readyState === 'complete') initRoad();
    else window.addEventListener('load', initRoad);
    window.addEventListener('resize', () => ScrollTrigger.refresh());

    return () => {
      if (roadTl) { roadTl.scrollTrigger?.kill(); roadTl.kill(); }
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section className="road-section" id="experience" ref={roadSectionRef}>
      <div className="road-pin" ref={roadPinRef}>
        <div className="road-progress-label">03 · Voyage Timeline — scroll to navigate journey</div>
        <div className="road-sky" /><div className="road-sky-night" />
        <div className="road-stars" ref={starsRef} /><div className="road-nebula" /><div className="road-sun" />
        <svg className="road-moon" viewBox="0 0 100 100">
          <defs><mask id="moonMask"><rect width="100" height="100" fill="black" /><circle cx="50" cy="50" r="42" fill="white" /><circle cx="68" cy="42" r="42" fill="black" /></mask></defs>
          <circle cx="50" cy="50" r="42" fill="#e2e8f0" mask="url(#moonMask)" />
        </svg>
        <svg className="hill hill-back" viewBox="0 0 1440 700" preserveAspectRatio="none" style={{ height: '62%' }}>
          <path d="M0,420 C200,340 340,460 520,380 C700,300 820,420 1000,360 C1200,290 1300,380 1440,330 L1440,700 L0,700 Z" />
        </svg>
        <svg className="hill hill-mid" viewBox="0 0 1440 700" preserveAspectRatio="none" style={{ height: '48%' }}>
          <path d="M0,460 C160,400 320,500 480,440 C660,370 780,470 960,410 C1140,350 1280,440 1440,400 L1440,700 L0,700 Z" />
        </svg>
        <svg className="hill hill-front" viewBox="0 0 1440 500" preserveAspectRatio="none" style={{ height: '36%' }}>
          <path d="M0,300 C180,240 300,320 460,270 C640,215 760,300 940,250 C1120,200 1260,280 1440,240 L1440,500 L0,500 Z" />
        </svg>
        <svg ref={roadSvgRef} id="roadSvg" viewBox="0 0 1440 500" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '34%', overflow: 'visible' }}>
          <path ref={roadPathRef} id="roadPath" d="M -40,340 C 140,300 220,180 380,180 C 560,180 600,300 780,300 C 960,300 1000,150 1180,150 C 1340,150 1400,220 1500,210" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="20" strokeLinecap="round" />
          <path d="M -40,340 C 140,300 220,180 380,180 C 560,180 600,300 780,300 C 960,300 1000,150 1180,150 C 1340,150 1400,220 1500,210" fill="none" stroke="#c5ff7c" strokeWidth="2.5" strokeDasharray="12 14" strokeLinecap="round" opacity="0.85" />
        </svg>
        <div ref={carGroupRef} className="car-group" id="carGroup">
          <svg className="car-svg" viewBox="0 0 80 50">
            <path d="M5,25 L18,16 L18,34 Z" fill="var(--lime)" opacity="0.8" />
            <path d="M0,25 L12,20 L12,30 Z" fill="var(--amber)" opacity="0.6" />
            <path d="M18,20 L48,10 L68,25 L48,40 L18,30 Z" fill="#141a28" stroke="#3a3244" strokeWidth="1.5" />
            <path d="M42,20 L58,20 L62,25 L58,30 L42,30 Z" fill="rgba(197, 255, 124, 0.25)" stroke="var(--lime)" strokeWidth="1" />
            <rect x="22" y="5" width="8" height="15" fill="#3a3244" rx="2" transform="rotate(-15 22 5)" />
            <rect x="22" y="30" width="8" height="15" fill="#3a3244" rx="2" transform="rotate(15 22 30)" />
            <circle cx="34" cy="25" r="2.5" fill="var(--lime)" />
            <circle cx="48" cy="25" r="2.5" fill="var(--amber)" />
          </svg>
        </div>
        <div className="road-house" id="m1" ref={m1Ref}>
          <div className="house-label">
            <span className="yr">May 2024 – Aug 2024</span>
            <h3>Tiyara Innovations LLP</h3>
            <p>Full Stack Intern · Secured data flows, JWT user sessions, booking validation logics, and REST API pathways.</p>
          </div>
          <svg className="house-svg" viewBox="0 0 50 50">
            <circle cx="25" cy="25" r="8" fill="#141a28" stroke="#c5ff7c" strokeWidth="2" />
            <line x1="25" y1="5" x2="25" y2="45" stroke="#3a3244" strokeWidth="2" />
            <line x1="5" y1="25" x2="45" y2="25" stroke="#3a3244" strokeWidth="2" />
            <rect x="23" y="10" width="4" height="4" fill="#ffb454" className="house-window" />
            <rect x="23" y="36" width="4" height="4" fill="#ffb454" className="house-window" />
          </svg>
        </div>
        <div className="road-house" id="m2" ref={m2Ref}>
          <div className="house-label">
            <span className="yr">Nov 2024 – Feb 2025</span>
            <h3>Sainisoft Infotech</h3>
            <p>Software Developer Intern · Integrated course workflows supporting 5K+ users. Speeded state loads by 40%.</p>
          </div>
          <svg className="house-svg" viewBox="0 0 50 50">
            <circle cx="25" cy="25" r="10" fill="#141a28" stroke="#ffb454" strokeWidth="2" />
            <path d="M10,25 C10,15 40,15 40,25" fill="none" stroke="#3a3244" strokeWidth="1.5" />
            <path d="M10,25 C10,35 40,35 40,25" fill="none" stroke="#3a3244" strokeWidth="1.5" />
            <circle cx="25" cy="25" r="4" fill="#c5ff7c" className="house-window" />
          </svg>
        </div>
        <div className="road-house" id="m3" ref={m3Ref}>
          <div className="house-label">
            <span className="yr">Dec 2025 – Present</span>
            <h3>Maximus Infoware</h3>
            <p>Software Engineer · Event-driven Spring Boot backends, Kafka validation pipelines, RBAC securing 10K+ transactions, and Oracle PL/SQL tuning by 40%.</p>
          </div>
          <svg className="house-svg" viewBox="0 0 50 50">
            <polygon points="25,5 45,40 5,40" fill="#141a28" stroke="#ff6f91" strokeWidth="2" />
            <circle cx="25" cy="28" r="6" fill="#ffb454" className="house-window" />
          </svg>
        </div>
        <div className="road-house" id="m4" ref={m4Ref}>
          <div className="house-label">
            <span className="yr">Ongoing</span>
            <h3>Freelance Projects</h3>
            <p>Software Consultant · Developing custom server microservices, third-party payment integrations, and deploying via Docker on AWS.</p>
          </div>
          <svg className="house-svg" viewBox="0 0 50 50">
            <rect x="10" y="10" width="30" height="30" fill="#141a28" stroke="#c5ff7c" strokeWidth="2" rx="4" />
            <line x1="10" y1="10" x2="40" y2="40" stroke="#3a3244" strokeWidth="1.5" />
            <circle cx="25" cy="25" r="5" fill="#ff6f91" className="house-window" />
          </svg>
        </div>
      </div>
    </section>
  );
}
