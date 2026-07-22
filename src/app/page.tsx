'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MotionPathPlugin from 'gsap/MotionPathPlugin';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

export default function Home() {
  const contentRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const roadPathRef = useRef<SVGPathElement>(null);
  const carGroupRef = useRef<SVGSVGElement>(null);
  const roadSectionRef = useRef<HTMLElement>(null);
  const roadPinRef = useRef<HTMLDivElement>(null);
  const roadSvgRef = useRef<SVGSVGElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const row3Ref = useRef<HTMLDivElement>(null);
  const m1Ref = useRef<HTMLDivElement>(null);
  const m2Ref = useRef<HTMLDivElement>(null);
  const m3Ref = useRef<HTMLDivElement>(null);
  const m4Ref = useRef<HTMLDivElement>(null);
  const m5Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = contentRef.current!;
    const spacer = spacerRef.current!;

    let currentY = 0;
    let targetY = 0;
    const LERP = 0.095;

    function setSpacerHeight() {
      spacer.style.height = content.scrollHeight + 'px';
    }
    setSpacerHeight();
    window.addEventListener('resize', setSpacerHeight);
    window.addEventListener('load', () => setTimeout(setSpacerHeight, 300));

    function raf() {
      targetY = window.scrollY;
      currentY += (targetY - currentY) * LERP;
      if (Math.abs(targetY - currentY) < 0.05) currentY = targetY;
      content.style.top = `${-currentY}px`;
      ScrollTrigger.update();
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length) {
          window.scrollTo(0, value as number);
        }
        return currentY;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: document.body.style.transform ? 'transform' : 'fixed',
    });
    ScrollTrigger.defaults({ scroller: document.body });
    ScrollTrigger.addEventListener('refresh', setSpacerHeight);

    // nav smooth scroll
    document.querySelectorAll('[data-nav]').forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const href = (a as HTMLAnchorElement).getAttribute('href');
        if (!href) return;
        const target = document.querySelector(href);
        if (target) {
          const rect = target.getBoundingClientRect();
          const destY = rect.top + currentY;
          const start = window.scrollY;
          const dur = 1100;
          const t0 = performance.now();
          function step(t: number) {
            const p = Math.min(1, (t - t0) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            window.scrollTo(0, start + (destY - start) * eased);
            if (p < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        }
      });
    });

    // cursor glow
    const glow = glowRef.current;
    if (glow) {
      const onMove = (e: MouseEvent) => {
        gsap.to(glow, {
          left: e.clientX,
          top: e.clientY,
          duration: 0.6,
          ease: 'power3.out',
        });
      };
      window.addEventListener('mousemove', onMove);
    }

    // hero text reveal
    gsap.set('.hero h1 .line span', { yPercent: 110 });
    gsap
      .timeline({ delay: 0.2 })
      .to('.hero h1 .line span', {
        yPercent: 0,
        duration: 1.1,
        stagger: 0.12,
        ease: 'power4.out',
      })
      .from(
        '.hero-sub',
        { autoAlpha: 0, y: 16, duration: 0.8, ease: 'power2.out' },
        '-=0.6'
      )
      .from(
        '.hero-ctas .btn',
        {
          autoAlpha: 0,
          y: 14,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
        },
        '-=0.5'
      )
      .from('.hero-scrollcue', { autoAlpha: 0, duration: 0.6 }, '-=0.4');

    // skill badges
    const skillSets = [
      ['React', 'TypeScript', 'Next.js', 'GSAP', 'Framer Motion', 'Tailwind', 'Node.js'],
      ['Three.js', 'WebGL', 'Figma', 'PostgreSQL', 'GraphQL', 'Docker', 'AWS'],
      ['Python', 'Redux', 'Vite', 'Sass', 'MongoDB', 'Git', 'Jest'],
    ];
    const rowColors = ['#4ff3c9', '#ffb454', '#ff6f91'];
    [row1Ref, row2Ref, row3Ref].forEach((ref, i) => {
      const row = ref.current;
      if (!row) return;
      const color = rowColors[i];
      const items = skillSets[i];
      const html = items
        .map(
          (s) =>
            `<div class="badge" style="--glow-color:${color}"><span class="dot"></span>${s}</div>`
        )
        .join('');
      row.innerHTML = html + html;
    });

    // marquee
    const marqueeTweens: { tween: gsap.core.Tween; dir: number }[] = [];
    document.querySelectorAll('.marquee-row').forEach((row) => {
      const dir = parseFloat((row as HTMLElement).dataset.dir || '1');
      const tween = gsap.to(row, {
        xPercent: dir > 0 ? -50 : 50,
        ease: 'none',
        duration: 26,
        repeat: -1,
      });
      marqueeTweens.push({ tween, dir });
    });

    ScrollTrigger.create({
      trigger: '#skills',
      start: 'top bottom',
      end: 'bottom top',
      onUpdate(self) {
        const vel = self.getVelocity() / 250;
        marqueeTweens.forEach(({ tween, dir }) => {
          const targetScale = gsap.utils.clamp(-4.5, 4.5, dir + vel * dir);
          gsap.to(tween, {
            timeScale: targetScale,
            duration: 0.3,
            overwrite: true,
          });
        });
        const glowStrength = Math.min(1, Math.abs(vel) / 3);
        document.querySelectorAll('.badge').forEach((b) => {
          const el = b as HTMLElement;
          el.style.boxShadow = `0 0 ${18 + glowStrength * 40}px -4px ${el.style.getPropertyValue('--glow-color') || '#4ff3c9'}`;
        });
      },
    });

    // stars
    const starsWrap = starsRef.current;
    if (starsWrap) {
      for (let i = 0; i < 70; i++) {
        const s = document.createElement('div');
        s.className = 'star';
        s.style.left = Math.random() * 100 + '%';
        s.style.top = Math.random() * 70 + '%';
        s.style.opacity = (0.2 + Math.random() * 0.7).toFixed(2);
        starsWrap.appendChild(s);
      }
    }

    // road / car experience
    const milestoneMeta = [
      { id: '#m1', el: m1Ref.current, pct: 0.06, side: 'left' as const },
      { id: '#m2', el: m2Ref.current, pct: 0.28, side: 'right' as const },
      { id: '#m3', el: m3Ref.current, pct: 0.50, side: 'left' as const },
      { id: '#m4', el: m4Ref.current, pct: 0.72, side: 'right' as const },
      { id: '#m5', el: m5Ref.current, pct: 0.94, side: 'left' as const },
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

      milestoneMeta.forEach((m) => {
        if (!m.el) return;
        const pt = path.getPointAtLength(len * m.pct);
        const xRatio = pt.x / svgW;
        const yRatio = pt.y / svgH;
        const left = (svgRect.left - pinRect.left) + xRatio * svgRect.width;
        const top = (svgRect.top - pinRect.top) + yRatio * svgRect.height;
        let finalLeft: number;
        const hw = 40;
        if (m.side === 'left') {
          finalLeft = left - hw - 16;
          if (finalLeft < 10) finalLeft = left + 16;
        } else {
          finalLeft = left + 16;
        }
        m.el.style.left = finalLeft + 'px';
        m.el.style.top = top - 48 + 'px';
      });
    }

    let roadTl: gsap.core.Timeline | null = null;

    function buildRoadTimeline() {
      const path = roadPathRef.current;
      const car = carGroupRef.current;
      const svg = roadSvgRef.current;
      const pin = roadPinRef.current;
      if (!path || !car || !svg || !pin) return;

      if (roadTl) {
        roadTl.scrollTrigger && roadTl.scrollTrigger.kill();
        roadTl.kill();
      }

      const svgRect = svg.getBoundingClientRect();
      const pinRect = pin.getBoundingClientRect();
      const vb = svg.viewBox.baseVal;
      const sx = (svgRect.width || 1) / (vb.width || 1440);
      const sy = (svgRect.height || 1) / (vb.height || 500);
      const len = path.getTotalLength();
      const steps = 100;
      const pts: { x: number; y: number }[] = [];
      for (let i = 0; i <= steps; i++) {
        const pt = path.getPointAtLength(len * (i / steps));
        pts.push({
          x: svgRect.left - pinRect.left + pt.x * sx,
          y: svgRect.top - pinRect.top + pt.y * sy,
        });
      }

      roadTl = gsap.timeline({
        scrollTrigger: {
          trigger: roadSectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          pin: pin,
          anticipatePin: 1,
        },
      });

      roadTl.to(car, {
        motionPath: {
          path: pts,
          align: pts as unknown as SVGPathElement,
          alignOrigin: [0.5, 0.6],
          autoRotate: true,
        },
        ease: 'none',
        duration: 5,
      }, 0);

      roadTl.to(
        '.road-sky',
        { backgroundPosition: '0 -40px', duration: 5, ease: 'none' },
        0
      );

      milestoneMeta.forEach((m, i) => {
        if (!m.el) return;
        const windows = m.el.querySelectorAll<SVGRectElement>('.house-window');
        roadTl!.fromTo(
          m.el,
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          i - 0.15
        );
        if (windows.length) {
          roadTl!.to(windows, { opacity: 1, duration: 0.4, ease: 'power2.out' }, i - 0.1);
          roadTl!.to(windows, { opacity: 0.4, duration: 0.4, ease: 'power2.in' }, i + 0.6);
        }
        roadTl!.to(
          m.el,
          { autoAlpha: 0, y: -16, duration: 0.5, ease: 'power2.in' },
          i + 0.65
        );
      });
    }

    const initRoad = () => {
      positionMilestones();
      buildRoadTimeline();
      ScrollTrigger.refresh();
    };

    window.addEventListener('load', initRoad);
    window.addEventListener('resize', () => {
      positionMilestones();
      buildRoadTimeline();
      ScrollTrigger.refresh();
    });

    // project cards reveal
    gsap.utils.toArray<HTMLElement>('.project-card').forEach((card) => {
      gsap.from(card, {
        autoAlpha: 0,
        y: 50,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          scroller: document.body,
        },
      });
    });

    // section heads reveal
    gsap.utils.toArray<HTMLElement>('.section-head').forEach((head) => {
      gsap.from(head, {
        autoAlpha: 0,
        y: 30,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: head,
          start: 'top 85%',
          scroller: document.body,
        },
      });
    });

    // contact reveal
    gsap.from('.contact > *', {
      autoAlpha: 0,
      y: 24,
      duration: 0.8,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.contact',
        start: 'top 80%',
        scroller: document.body,
      },
    });

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      window.removeEventListener('resize', setSpacerHeight);
      if (roadTl) {
        roadTl.scrollTrigger && roadTl.scrollTrigger.kill();
        roadTl.kill();
      }
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      <div ref={glowRef} id="cursor-glow" />
      <nav>
        <div className="logo">
          NEERAJ<span>.</span>M
        </div>
        <div className="nav-links">
          <a href="#skills" data-nav>
            Skills
          </a>
          <a href="#experience" data-nav>
            Journey
          </a>
          <a href="#projects" data-nav>
            Work
          </a>
          <a href="#contact" data-nav>
            Contact
          </a>
        </div>
      </nav>
      <div ref={spacerRef} id="smooth-spacer" />
      <div ref={contentRef} id="smooth-content">
        {/* HERO */}
        <section className="hero" id="hero">
          <div className="hero-bg-grid" />
          <div className="hero-figure">01</div>
          <div className="hero-eyebrow">Portfolio · Mumbai, India</div>
          <h1>
            <div className="line">
              <span>Hi, I&apos;m NEERAJ —</span>
            </div>
            <div className="line">
              <span>
                I build <span className="accent">interfaces</span>
              </span>
            </div>
            <div className="line">
              <span>that move &amp; mean it.</span>
            </div>
          </h1>
          <p className="hero-sub">
            Creative developer crafting fast, motion-rich web products — where
            clean engineering meets storytelling, scroll, and a little bit of
            showing off.
          </p>
          <div className="hero-ctas">
            <a href="#projects" className="btn btn-primary" data-nav>
              See the work →
            </a>
            <a href="#contact" className="btn btn-ghost" data-nav>
              Say hello
            </a>
          </div>
          <div className="hero-scrollcue">
            <div className="scroll-line" />
            Scroll to begin the journey
          </div>
        </section>

        {/* SKILLS */}
        <section className="skills" id="skills">
          <div className="section-head">
            <span className="eyebrow">02 · Toolbox</span>
            <h2>Tools of the trade.</h2>
            <p>What I reach for on a Tuesday, and what I reach for at 2am.</p>
          </div>
          <div className="skills-rows">
            <div className="marquee-viewport">
              <div className="marquee-row" data-dir="1" ref={row1Ref} />
            </div>
            <div className="marquee-viewport">
              <div className="marquee-row" data-dir="-1" ref={row2Ref} />
            </div>
            <div className="marquee-viewport">
              <div className="marquee-row" data-dir="1" ref={row3Ref} />
            </div>
          </div>
        </section>

        {/* EXPERIENCE */}
        <section className="road-section" id="experience" ref={roadSectionRef}>
          <div className="road-pin" ref={roadPinRef}>
            <div className="road-progress-label">
              03 · The Journey — scroll to drive
            </div>
            <div className="road-sky" />
            <div className="road-stars" ref={starsRef} />
            <div className="road-sun" />

            <svg
              className="hill hill-back"
              viewBox="0 0 1440 700"
              preserveAspectRatio="none"
              style={{ height: '62%' }}
            >
              <path d="M0,420 C200,340 340,460 520,380 C700,300 820,420 1000,360 C1200,290 1300,380 1440,330 L1440,700 L0,700 Z" />
            </svg>
            <svg
              className="hill hill-mid"
              viewBox="0 0 1440 700"
              preserveAspectRatio="none"
              style={{ height: '48%' }}
            >
              <path d="M0,460 C160,400 320,500 480,440 C660,370 780,470 960,410 C1140,350 1280,440 1440,400 L1440,700 L0,700 Z" />
            </svg>
            <svg
              className="hill hill-front"
              viewBox="0 0 1440 500"
              preserveAspectRatio="none"
              style={{ height: '36%' }}
            >
              <path d="M0,300 C180,240 300,320 460,270 C640,215 760,300 940,250 C1120,200 1260,280 1440,240 L1440,500 L0,500 Z" />
            </svg>

            <svg
              ref={roadSvgRef}
              id="roadSvg"
              viewBox="0 0 1440 500"
              preserveAspectRatio="none"
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '34%',
                overflow: 'visible',
              }}
            >
              <path
                ref={roadPathRef}
                id="roadPath"
                d="M -40,340 C 140,300 220,180 380,180 C 560,180 600,300 780,300 C 960,300 1000,150 1180,150 C 1340,150 1400,220 1500,210"
                fill="none"
                stroke="#3a3244"
                strokeWidth="26"
                strokeLinecap="round"
              />
              <path
                d="M -40,340 C 140,300 220,180 380,180 C 560,180 600,300 780,300 C 960,300 1000,150 1180,150 C 1340,150 1400,220 1500,210"
                fill="none"
                stroke="#efe6d2"
                strokeWidth="3"
                strokeDasharray="16 18"
                strokeLinecap="round"
                opacity="0.55"
              />
            </svg>

            <svg
              ref={carGroupRef}
              className="car-group"
              id="carGroup"
              viewBox="0 0 100 60"
            >
              <ellipse
                cx="50"
                cy="54"
                rx="34"
                ry="5"
                fill="rgba(0,0,0,0.35)"
              />
              <path
                d="M10,40 Q14,20 34,18 L64,18 Q80,18 86,34 L92,40 Q92,46 86,46 L14,46 Q8,46 8,40 Z"
                fill="#ffb454"
              />
              <path
                d="M32,19 Q40,6 56,6 Q70,6 76,19 Z"
                fill="#1a1526"
                opacity="0.9"
              />
              <circle cx="28" cy="46" r="9" fill="#0e1016" stroke="#4ff3c9" strokeWidth="2" />
              <circle cx="74" cy="46" r="9" fill="#0e1016" stroke="#4ff3c9" strokeWidth="2" />
              <circle cx="90" cy="36" r="4" fill="#fff6d8" />
            </svg>

            <div className="road-house" id="m1" ref={m1Ref}>
              <div className="house-label">
                <span className="yr">2019 · Frontend Intern</span>
                <h3>PixelCraft Studio</h3>
                <p>Landing pages, first impressions, hover states that hit.</p>
              </div>
              <svg className="house-svg" viewBox="0 0 60 55">
                <polygon points="2,22 30,4 58,22" fill="#2a1e38" stroke="#3a3244" strokeWidth="1.5"/>
                <rect x="6" y="21" width="48" height="30" fill="#141a28" stroke="#3a3244" strokeWidth="1.5" rx="2"/>
                <rect x="14" y="28" width="10" height="10" fill="#ffb454" opacity="0.4" rx="1" className="house-window"/>
                <rect x="36" y="28" width="10" height="10" fill="#ffb454" opacity="0.4" rx="1" className="house-window"/>
                <rect x="24" y="38" width="12" height="13" fill="#0a0d15" rx="1"/>
              </svg>
            </div>
            <div className="road-house" id="m2" ref={m2Ref}>
              <div className="house-label">
                <span className="yr">2020 · Frontend Developer</span>
                <h3>NimbusTech</h3>
                <p>Design system across six product teams, one component at a time.</p>
              </div>
              <svg className="house-svg" viewBox="0 0 60 55">
                <polygon points="2,22 30,4 58,22" fill="#2a1e38" stroke="#3a3244" strokeWidth="1.5"/>
                <rect x="6" y="21" width="48" height="30" fill="#141a28" stroke="#3a3244" strokeWidth="1.5" rx="2"/>
                <rect x="14" y="28" width="10" height="10" fill="#ffb454" opacity="0.4" rx="1" className="house-window"/>
                <rect x="36" y="28" width="10" height="10" fill="#ffb454" opacity="0.4" rx="1" className="house-window"/>
                <rect x="24" y="38" width="12" height="13" fill="#0a0d15" rx="1"/>
              </svg>
            </div>
            <div className="road-house" id="m3" ref={m3Ref}>
              <div className="house-label">
                <span className="yr">2022 · Full-Stack Developer</span>
                <h3>Skyline Labs</h3>
                <p>Ground-up rebuild, 60% faster load, one very caffeinated lead.</p>
              </div>
              <svg className="house-svg" viewBox="0 0 60 55">
                <polygon points="2,22 30,4 58,22" fill="#2a1e38" stroke="#3a3244" strokeWidth="1.5"/>
                <rect x="6" y="21" width="48" height="30" fill="#141a28" stroke="#3a3244" strokeWidth="1.5" rx="2"/>
                <rect x="14" y="28" width="10" height="10" fill="#ffb454" opacity="0.4" rx="1" className="house-window"/>
                <rect x="36" y="28" width="10" height="10" fill="#ffb454" opacity="0.4" rx="1" className="house-window"/>
                <rect x="24" y="38" width="12" height="13" fill="#0a0d15" rx="1"/>
              </svg>
            </div>
            <div className="road-house" id="m4" ref={m4Ref}>
              <div className="house-label">
                <span className="yr">2024 · Senior Creative Engineer</span>
                <h3>Wanderframe</h3>
                <p>Motion-first marketing sites, award-shortlisted, shipped with style.</p>
              </div>
              <svg className="house-svg" viewBox="0 0 60 55">
                <polygon points="2,22 30,4 58,22" fill="#2a1e38" stroke="#3a3244" strokeWidth="1.5"/>
                <rect x="6" y="21" width="48" height="30" fill="#141a28" stroke="#3a3244" strokeWidth="1.5" rx="2"/>
                <rect x="14" y="28" width="10" height="10" fill="#ffb454" opacity="0.4" rx="1" className="house-window"/>
                <rect x="36" y="28" width="10" height="10" fill="#ffb454" opacity="0.4" rx="1" className="house-window"/>
                <rect x="24" y="38" width="12" height="13" fill="#0a0d15" rx="1"/>
              </svg>
            </div>
            <div className="road-house" id="m5" ref={m5Ref}>
              <div className="house-label">
                <span className="yr">2026 · Present</span>
                <h3>Open to the next chapter</h3>
                <p>Freelancing, side projects, and a team that scrolls as far as I do.</p>
              </div>
              <svg className="house-svg" viewBox="0 0 60 55">
                <polygon points="2,22 30,4 58,22" fill="#2a1e38" stroke="#3a3244" strokeWidth="1.5"/>
                <rect x="6" y="21" width="48" height="30" fill="#141a28" stroke="#3a3244" strokeWidth="1.5" rx="2"/>
                <rect x="14" y="28" width="10" height="10" fill="#ffb454" opacity="0.4" rx="1" className="house-window"/>
                <rect x="36" y="28" width="10" height="10" fill="#ffb454" opacity="0.4" rx="1" className="house-window"/>
                <rect x="24" y="38" width="12" height="13" fill="#0a0d15" rx="1"/>
              </svg>
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section className="projects" id="projects">
          <div className="section-head">
            <span className="eyebrow">04 · Selected Work</span>
            <h2>Things I&apos;ve shipped and am proud of.</h2>
            <p>
              A mix of product engineering and pure creative-code indulgence.
            </p>
          </div>
          <div className="project-grid">
            <div className="project-card" style={{ '--pc': 'rgba(79,243,201,0.28)' } as React.CSSProperties}>
              <span className="num">01</span>
              <div className="glow-orb" />
              <div className="project-tags">
                <span>React</span>
                <span>Three.js</span>
                <span>Stripe</span>
              </div>
              <h3>Aurora Commerce</h3>
              <p>
                An e-commerce platform with a real-time 3D product configurator
                and sub-second checkout.
              </p>
              <span className="project-link">
                View case study{' '}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M7 17L17 7M7 7h10v10" />
                </svg>
              </span>
            </div>
            <div className="project-card" style={{ '--pc': 'rgba(255,180,84,0.28)' } as React.CSSProperties}>
              <span className="num">02</span>
              <div className="glow-orb" />
              <div className="project-tags">
                <span>Next.js</span>
                <span>WebSockets</span>
                <span>D3</span>
              </div>
              <h3>Nimbus Dashboard</h3>
              <p>
                A realtime analytics dashboard streaming live infrastructure
                metrics to 40k+ users.
              </p>
              <span className="project-link">
                View case study{' '}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M7 17L17 7M7 7h10v10" />
                </svg>
              </span>
            </div>
            <div className="project-card" style={{ '--pc': 'rgba(255,111,145,0.28)' } as React.CSSProperties}>
              <span className="num">03</span>
              <div className="glow-orb" />
              <div className="project-tags">
                <span>GSAP</span>
                <span>Lenis</span>
                <span>Framer Motion</span>
              </div>
              <h3>Wanderframe Studio</h3>
              <p>
                An agency site built around scroll storytelling — the project
                that led to this one.
              </p>
              <span className="project-link">
                View case study{' '}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M7 17L17 7M7 7h10v10" />
                </svg>
              </span>
            </div>
            <div className="project-card" style={{ '--pc': 'rgba(88,101,242,0.3)' } as React.CSSProperties}>
              <span className="num">04</span>
              <div className="glow-orb" />
              <div className="project-tags">
                <span>CRDTs</span>
                <span>Node.js</span>
                <span>Postgres</span>
              </div>
              <h3>EchoNotes</h3>
              <p>
                A collaborative note-taking app with live multiplayer cursors
                and offline-first sync.
              </p>
              <span className="project-link">
                View case study{' '}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M7 17L17 7M7 7h10v10" />
                </svg>
              </span>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="contact" id="contact">
          <span className="eyebrow">05 · Contact</span>
          <h2>
            Let&apos;s build something{' '}
            <span className="accent">worth scrolling for.</span>
          </h2>
          <a href="mailto:hello@aaravmehta.dev" className="contact-btn">
            hello@aaravmehta.dev
          </a>
          <div className="socials">
            <a href="#">GitHub</a>
            <a href="#">LinkedIn</a>
            <a href="#">X / Twitter</a>
            <a href="#">Dribbble</a>
          </div>
          <footer>
            <span>© 2026 NEERAJ Mehta</span>
            <span>
              Built with React · GSAP · Framer Motion · a custom Lenis-style
              scroller
            </span>
          </footer>
        </section>
      </div>
    </>
  );
}
