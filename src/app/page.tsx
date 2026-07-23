'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MotionPathPlugin from 'gsap/MotionPathPlugin';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorFollowerRef = useRef<HTMLDivElement>(null);
  
  // Journey refs
  const roadSectionRef = useRef<HTMLElement>(null);
  const roadPinRef = useRef<HTMLDivElement>(null);
  const roadPathRef = useRef<SVGPathElement>(null);
  const roadSvgRef = useRef<SVGSVGElement>(null);
  const carGroupRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  
  // Milestones refs
  const m1Ref = useRef<HTMLDivElement>(null);
  const m2Ref = useRef<HTMLDivElement>(null);
  const m3Ref = useRef<HTMLDivElement>(null);
  const m4Ref = useRef<HTMLDivElement>(null);
  const m5Ref = useRef<HTMLDivElement>(null);

  // Skills row refs
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const row3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // -------------------------------------------------------------
    // 1. HARDWARE-ACCELERATED LERP SMOOTH SCROLLER
    // -------------------------------------------------------------
    const content = contentRef.current!;
    const spacer = spacerRef.current!;

    let currentY = 0;
    let targetY = 0;
    const LERP = 0.08;
    let isResizing = false;

    function setSpacerHeight() {
      if (content && spacer) {
        spacer.style.height = content.scrollHeight + 'px';
      }
    }

    setSpacerHeight();
    window.addEventListener('resize', () => {
      isResizing = true;
      setSpacerHeight();
      setTimeout(() => { isResizing = false; }, 200);
    });

    // Delayed loader sync
    if (document.readyState !== 'complete') {
      window.addEventListener('load', () => setTimeout(setSpacerHeight, 300));
    }

    let rafId: number;
    let lastVelocity = 0;

    function raf() {
      if (!isResizing) {
        targetY = window.scrollY;
        currentY += (targetY - currentY) * LERP;
        if (Math.abs(targetY - currentY) < 0.05) currentY = targetY;
        
        // Hardware accelerated vertical translate
        content.style.transform = `translate3d(0, ${-currentY}px, 0)`;
        
        // Track scroll velocity for background warp & marquee speed
        lastVelocity = targetY - currentY;
        
        ScrollTrigger.update();
      }
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

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
      pinType: 'transform',
    });
    ScrollTrigger.defaults({ scroller: document.body });
    ScrollTrigger.addEventListener('refresh', setSpacerHeight);

    // -------------------------------------------------------------
    // 2. NAV & LINK INTERACTION
    // -------------------------------------------------------------
    const links = document.querySelectorAll('[data-nav]');
    links.forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        setMenuOpen(false);
        const href = (a as HTMLAnchorElement).getAttribute('href');
        if (!href) return;
        const target = document.querySelector(href);
        if (target) {
          const rect = target.getBoundingClientRect();
          const destY = rect.top + currentY;
          
          gsap.to(window, {
            scrollTo: destY,
            duration: 1.2,
            ease: 'power4.inOut',
            overwrite: 'auto'
          });
        }
      });
    });

    // -------------------------------------------------------------
    // 3. CUSTOM MOUSE CURSOR & MAGNETICS
    // -------------------------------------------------------------
    const cursorDot = cursorDotRef.current;
    const cursorFollower = cursorFollowerRef.current;
    let mouseX = -100;
    let mouseY = -100;
    let followerX = -100;
    let followerY = -100;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorDot) {
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
      }
    };
    window.addEventListener('mousemove', onMouseMove);

    // Animate cursor follower with separate lerp for organic lag
    const animateFollower = () => {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;
      if (cursorFollower) {
        cursorFollower.style.left = `${followerX}px`;
        cursorFollower.style.top = `${followerY}px`;
      }
      requestAnimationFrame(animateFollower);
    };
    requestAnimationFrame(animateFollower);

    // Dynamic hover bindings
    const handleMouseEnter = () => {
      document.body.classList.add('cursor-hovering');
    };
    const handleMouseLeave = () => {
      document.body.classList.remove('cursor-hovering');
    };

    const addHoverListeners = () => {
      const hoverables = document.querySelectorAll('a, button, .btn, .project-card, .badge, .menu-toggle');
      hoverables.forEach((el) => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });
    };
    addHoverListeners();

    // -------------------------------------------------------------
    // 4. INTERACTIVE CANVAS PARTICLE STARFIELD
    // -------------------------------------------------------------
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d')!;
      let width = (canvas.width = window.innerWidth);
      let height = (canvas.height = window.innerHeight);

      window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      });

      interface CosmicParticle {
        x: number;
        y: number;
        z: number;
        baseRadius: number;
        color: string;
        angle: number;
        orbitSpeed: number;
        orbitRadius: number;
      }

      const particles: CosmicParticle[] = [];
      const numParticles = 120;
      const colors = ['#c5ff7c', '#ffb454', '#ffffff', '#6366f1'];

      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: Math.random() * 2 + 0.5,
          baseRadius: Math.random() * 1.5 + 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          angle: Math.random() * Math.PI * 2,
          orbitSpeed: (Math.random() * 0.002 + 0.0005) * (Math.random() > 0.5 ? 1 : -1),
          orbitRadius: Math.random() * 40 + 10,
        });
      }

      const renderStarfield = () => {
        ctx.clearRect(0, 0, width, height);

        // Calculate visual feedback based on scroll velocity and pointer position
        const velMultiplier = Math.min(6, 1 + Math.abs(lastVelocity) * 0.15);
        const warpMode = Math.abs(lastVelocity) > 8;

        particles.forEach((p) => {
          // Parallax calculation using cursor coordinates
          const pointerOffsetX = (mouseX - width / 2) * 0.015 * p.z;
          const pointerOffsetY = (mouseY - height / 2) * 0.015 * p.z;

          // Update orbit angle
          p.angle += p.orbitSpeed;
          const orbitX = Math.cos(p.angle) * p.orbitRadius * 0.05;
          const orbitY = Math.sin(p.angle) * p.orbitRadius * 0.05;

          // Velocity responsive movement
          p.y += (0.15 * p.z) + (lastVelocity * 0.02 * p.z);
          
          // Re-wrap boundary checks
          if (p.y > height) {
            p.y = -10;
            p.x = Math.random() * width;
          } else if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }

          const drawX = p.x + pointerOffsetX + orbitX;
          const drawY = p.y + pointerOffsetY + orbitY;

          ctx.beginPath();
          ctx.fillStyle = p.color;

          if (warpMode) {
            // Warp speed stretch trail effect
            const trailLength = lastVelocity * 1.8 * p.z;
            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.baseRadius * 0.8;
            ctx.moveTo(drawX, drawY);
            ctx.lineTo(drawX, drawY - trailLength);
            ctx.stroke();
          } else {
            // Soft cosmic circular glow
            const radius = p.baseRadius * (1 + (p.z * 0.25));
            ctx.arc(drawX, drawY, radius, 0, Math.PI * 2);
            ctx.fill();

            // Accent light flare shadows
            if (p.color === '#c5ff7c' || p.color === '#ffb454') {
              ctx.shadowColor = p.color;
              ctx.shadowBlur = 12;
              ctx.arc(drawX, drawY, radius, 0, Math.PI * 2);
              ctx.fill();
              ctx.shadowBlur = 0; // reset
            }
          }
        });

        requestAnimationFrame(renderStarfield);
      };
      renderStarfield();
    }

    // -------------------------------------------------------------
    // 5. HERO TEXT REVEAL & LETTER HOVER DISTORTION
    // -------------------------------------------------------------
    gsap.set('.hero h1 .line span', { yPercent: 110 });
    gsap.timeline({ delay: 0.15 })
      .to('.hero h1 .line span', {
        yPercent: 0,
        duration: 1.2,
        stagger: 0.08,
        ease: 'power4.out',
      })
      .from('.hero-eyebrow', { x: -20, duration: 0.8, ease: 'power3.out' }, '-=0.8')
      .from('.hero-sub', { y: 15, duration: 0.8, ease: 'power2.out' }, '-=0.6')
      .from('.hero-ctas .btn', {
        y: 12,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
      }, '-=0.5')
      .from('.hero-scrollcue', { y: 8, duration: 0.6 }, '-=0.4');

    // Individual character hover micro-interactions
    const initHeroLetterHover = () => {
      const heroHeaders = document.querySelectorAll('.hero h1 .line span');
      heroHeaders.forEach((header) => {
        const text = header.textContent || '';
        if (header.classList.contains('accent-lime') || header.classList.contains('accent-amber') || text.includes('Hi,')) {
          // Keep accents or general text words intact or split them
          return;
        }
        
        // Wrap characters in elements
        const letters = text.split('').map((char) => {
          if (char === ' ') return '&nbsp;';
          return `<span class="letter-char" style="display:inline-block; transition:transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);">${char}</span>`;
        }).join('');
        header.innerHTML = letters;
      });

      // Bind mousemove skewing listener
      document.querySelectorAll('.letter-char').forEach((char) => {
        char.addEventListener('mouseenter', () => {
          gsap.to(char, {
            scale: 1.35,
            y: -8,
            rotation: Math.random() * 20 - 10,
            color: '#c5ff7c',
            duration: 0.3,
          });
        });
        char.addEventListener('mouseleave', () => {
          gsap.to(char, {
            scale: 1,
            y: 0,
            rotation: 0,
            color: '#f3f4f6',
            duration: 0.5,
          });
        });
      });
    };
    initHeroLetterHover();

    // -------------------------------------------------------------
    // 6. SKILLS MARQUEES WITH VELOCITY SENSITIVITY
    // -------------------------------------------------------------
    const skillSets = [
      ['React', 'TypeScript', 'Next.js', 'GSAP', 'WebGL', 'Three.js', 'Tailwind'],
      ['Node.js', 'Framer Motion', 'Figma', 'PostgreSQL', 'GraphQL', 'Docker', 'AWS'],
      ['Python', 'Redux Toolkit', 'Vite', 'Sass/SCSS', 'MongoDB', 'Git/GitHub', 'Jest'],
    ];
    const rowColors = ['#c5ff7c', '#ffb454', '#ff6f91'];

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
      // Duplicate items to ensure infinite looping
      row.innerHTML = html + html + html;
    });

    const marqueeTweens: { tween: gsap.core.Tween; dir: number }[] = [];
    document.querySelectorAll('.marquee-row').forEach((row) => {
      const dir = parseFloat((row as HTMLElement).dataset.dir || '1');
      const tween = gsap.to(row, {
        xPercent: dir > 0 ? -33.33 : 33.33,
        ease: 'none',
        duration: 32,
        repeat: -1,
      });
      // Start at centered offset
      gsap.set(row, { xPercent: -33.33 });
      marqueeTweens.push({ tween, dir });
    });

    ScrollTrigger.create({
      trigger: '#skills',
      start: 'top bottom',
      end: 'bottom top',
      onUpdate(self) {
        const vel = self.getVelocity() / 180;
        marqueeTweens.forEach(({ tween, dir }) => {
          // Accelerate marquee row speeds on scroll velocity
          const targetScale = gsap.utils.clamp(-5.5, 5.5, dir + vel * dir);
          gsap.to(tween, {
            timeScale: targetScale,
            duration: 0.35,
            overwrite: true,
          });
        });

        // Dynamic badge shadow glow responsive to scroll velocity
        const glowStrength = Math.min(1.2, Math.abs(vel) / 2.5);
        document.querySelectorAll('.badge').forEach((b) => {
          const el = b as HTMLElement;
          const badgeColor = el.style.getPropertyValue('--glow-color') || '#c5ff7c';
          el.style.boxShadow = `0 0 ${15 + glowStrength * 45}px -3px ${badgeColor}`;
          el.style.borderColor = glowStrength > 0.4 ? badgeColor : 'rgba(255, 255, 255, 0.05)';
        });
      },
    });

    // -------------------------------------------------------------
    // 7. JOURNEY - COSMIC SPACE SHIP ROUTE TRIGGER
    // -------------------------------------------------------------
    // Dynamic stars background in Journey
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
        const hw = 50; // badge width half-size context
        if (m.side === 'left') {
          finalLeft = left - hw - 24;
          if (finalLeft < 10) finalLeft = left + 24;
        } else {
          finalLeft = left + 24;
        }
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

      if (roadTl) {
        roadTl.scrollTrigger && roadTl.scrollTrigger.kill();
        roadTl.kill();
      }

      roadTl = gsap.timeline({
        scrollTrigger: {
          trigger: roadSectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          pin: pin,
          anticipatePin: 1,
        },
      });

      const state = { p: 0 };
      roadTl.to(state, {
        p: 1,
        duration: 5,
        ease: 'none',
        onUpdate() {
          const p = roadPathRef.current;
          const se = roadSvgRef.current;
          const pe = roadPinRef.current;
          if (!p || !se || !pe) return;
          const len = p.getTotalLength();
          const pr = pe.getBoundingClientRect();
          const sr = se.getBoundingClientRect();
          const vb = se.viewBox.baseVal;
          const sx = (sr.width || 1) / (vb.width || 1440);
          const sy = (sr.height || 1) / (vb.height || 500);
          
          // Current coordinates along path
          const pt = p.getPointAtLength(len * state.p);
          const x = sr.left - pr.left + pt.x * sx - 40;
          const y = sr.top - pr.top + pt.y * sy - 30;
          
          // Tangent calculation for rotation
          const d = Math.max(0.5, len * 0.002);
          const pa = p.getPointAtLength(Math.max(0, len * state.p - d));
          const pb = p.getPointAtLength(Math.min(len, len * state.p + d));
          const a = Math.atan2(pb.y - pa.y, pb.x - pa.x) * (180 / Math.PI);
          
          gsap.set(car, { x, y, rotation: a, transformOrigin: '40px 25px' });
        },
      });

      // Cosmic background transitions (Nebula evening sunset -> Deep space night)
      roadTl.to('.road-sky', { opacity: 0.25, duration: 5, ease: 'none' }, 0);
      roadTl.to('.road-sky-night', { opacity: 1, duration: 5, ease: 'none' }, 0);
      roadTl.to('.hill-back path', { fill: '#0a0812', duration: 5, ease: 'none' }, 0);
      roadTl.to('.hill-mid path', { fill: '#050309', duration: 5, ease: 'none' }, 0);
      roadTl.to('.hill-front path', { fill: '#010103', duration: 5, ease: 'none' }, 0);
      roadTl.to('#roadPath', { attr: { stroke: 'rgba(197, 255, 124, 0.4)' }, duration: 5, ease: 'none' }, 0);
      roadTl.to('.star', { opacity: 1, scale: 1.3, duration: 5, ease: 'none' }, 0);
      roadTl.to('.road-sun', { opacity: 0, scale: 0.7, duration: 2.2, ease: 'none' }, 0);
      roadTl.to('.road-moon', { opacity: 1, duration: 2.5, ease: 'none' }, 1.4);

      // Milestone card animations (Highlight/Scale when probe passes)
      milestoneMeta.forEach((m, i) => {
        if (!m.el) return;
        const windows = m.el.querySelectorAll<SVGRectElement>('.house-window');
        
        roadTl!.to(
          m.el,
          { scale: 1.15, duration: 0.5, ease: 'power2.out' },
          i - 0.1
        );
        
        if (windows.length) {
          // Highlight lights when passing milestone
          roadTl!.to(windows, { fill: '#c5ff7c', duration: 0.4 }, i - 0.05);
        }
        
        roadTl!.to(
          m.el,
          { scale: 1, duration: 0.5, ease: 'power2.in' },
          i + 0.65
        );
      });

      // Initialize spaceship position
      const sp = path.getPointAtLength(0);
      const pr = pin.getBoundingClientRect();
      const sr = svg.getBoundingClientRect();
      const vbb = svg.viewBox.baseVal;
      const sxs = (sr.width || 1) / (vbb.width || 1440);
      const sys = (sr.height || 1) / (vbb.height || 500);
      gsap.set(car, {
        x: sr.left - pr.left + sp.x * sxs - 40,
        y: sr.top - pr.top + sp.y * sys - 30,
        rotation: 0,
        transformOrigin: '40px 25px',
        autoAlpha: 1,
      });
    }

    // GSAP Responsive Media Query Setup
    const mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
      // Desktop: run absolute positioning and pinning timeline
      positionMilestones();
      buildRoadTimeline();
      
      const handleResize = () => {
        positionMilestones();
        buildRoadTimeline();
        ScrollTrigger.refresh();
      };
      
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    });

    mm.add("(max-width: 768px)", () => {
      // Mobile: remove absolute positions so CSS layout flows naturally
      milestoneMeta.forEach((m) => {
        if (m.el) {
          m.el.style.left = '';
          m.el.style.top = '';
        }
      });
      ScrollTrigger.refresh();
    });

    const initRoad = () => {
      ScrollTrigger.refresh();
    };

    if (document.readyState === 'complete') {
      initRoad();
    } else {
      window.addEventListener('load', initRoad);
    }
    
    window.addEventListener('resize', () => {
      ScrollTrigger.refresh();
    });

    // -------------------------------------------------------------
    // 8. SECTION HEADS & CARD REVEALS
    // -------------------------------------------------------------
    gsap.utils.toArray<HTMLElement>('.section-head').forEach((head) => {
      gsap.from(head, {
        y: 40,
        duration: 1.0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: head,
          start: 'top 85%',
        },
      });
    });

    gsap.utils.toArray<HTMLElement>('.project-card').forEach((card) => {
      gsap.from(card, {
        y: 60,
        duration: 1.1,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
        },
      });
    });

    // Contact form content staggering reveal
    gsap.from('.contact > *', {
      y: 30,
      duration: 0.9,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.contact',
        start: 'top 80%',
      },
    });

    // Magnet utility for buttons
    const magnetButtons = document.querySelectorAll('.btn-primary, .btn-ghost, .contact-btn, .logo');
    magnetButtons.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const ev = e as MouseEvent;
        const rect = btn.getBoundingClientRect();
        const x = ev.clientX - rect.left - rect.width / 2;
        const y = ev.clientY - rect.top - rect.height / 2;
        gsap.to(btn, {
          x: x * 0.35,
          y: y * 0.35,
          duration: 0.3,
          ease: 'power2.out',
        });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1.2, 0.4)',
        });
      });
    });

    setTimeout(() => {
      ScrollTrigger.refresh();
      addHoverListeners();
    }, 600);

    return () => {
      window.removeEventListener('resize', setSpacerHeight);
      window.removeEventListener('mousemove', onMouseMove);
      if (roadTl) {
        roadTl.scrollTrigger && roadTl.scrollTrigger.kill();
        roadTl.kill();
      }
      ScrollTrigger.getAll().forEach((t) => t.kill());
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Custom Pointer Elements */}
      <div ref={cursorDotRef} className="custom-cursor" />
      <div ref={cursorFollowerRef} className="custom-cursor-follower" />

      {/* Interactive Background Elements */}
      <canvas ref={canvasRef} id="canvas-starfield" />
      <div className="cyber-grid-overlay" />

      {/* NAV BAR */}
      <nav>
        <a href="#hero" className="logo" data-nav>
          NEERAJ<span className="logo-dot" />
        </a>
        <button 
          className={`menu-toggle ${menuOpen ? 'menu-active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          <div className="menu-line" />
          <div className="menu-line" />
        </button>
      </nav>

      {/* FULLSCREEN GLASSMORPHIC SLIDEOUT NAVIGATION MENU */}
      <div className={`fullscreen-menu ${menuOpen ? 'is-open' : ''}`}>
        <div className="menu-container">
          <a href="#skills" className="menu-item" data-nav onClick={() => setMenuOpen(false)}>
            <span>01 · Toolbox</span>
          </a>
          <a href="#experience" className="menu-item" data-nav onClick={() => setMenuOpen(false)}>
            <span>02 · Journey</span>
          </a>
          <a href="#projects" className="menu-item" data-nav onClick={() => setMenuOpen(false)}>
            <span>03 · Work</span>
          </a>
          <a href="#contact" className="menu-item" data-nav onClick={() => setMenuOpen(false)}>
            <span>04 · Contact</span>
          </a>
          <div className="menu-meta">
            NEERAJ SURNIS — MUMBAI, INDIA
          </div>
        </div>
      </div>

      <div ref={spacerRef} id="smooth-spacer" />
      <div ref={contentRef} id="smooth-content">
        
        {/* HERO */}
        <section className="hero" id="hero">
          <div className="hero-figure-bg">01</div>
          <div className="hero-eyebrow">Creative Dev &amp; Tech Specimen</div>
          <h1>
            <div className="line">
              <span>Hi, I&apos;m NEERAJ —</span>
            </div>
            <div className="line">
              <span>
                I craft <span className="accent-lime">interfaces</span>
              </span>
            </div>
            <div className="line">
              <span>
                that <span className="accent-amber">move</span> &amp; mean it.
              </span>
            </div>
          </h1>
          <p className="hero-sub">
            A creative engineering playground where high-contrast design, physics-responsive 
            micro-interactions, and storytelling scroll paths collide. Shipped from Mumbai, India.
          </p>
          <div className="hero-ctas">
            <a href="#projects" className="btn btn-primary" data-nav>
              Explore work →
            </a>
            <a href="#contact" className="btn btn-ghost" data-nav>
              Initiate contact
            </a>
          </div>
          <div className="hero-scrollcue">
            <div className="scroll-line" />
            Scroll to pilot
          </div>
        </section>

        {/* SKILLS / TOOLBOX */}
        <section className="skills" id="skills">
          <div className="section-head">
            <span className="eyebrow">02 · Toolbox</span>
            <h2>Modern Tech Stack.</h2>
            <p>
              An aggregate of frameworks, graphics layers, and languages leveraged to build high-performance 
              creative web environments.
            </p>
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

        {/* COSMIC JOURNEY / EXPERIENCE */}
        <section className="road-section" id="experience" ref={roadSectionRef}>
          <div className="road-pin" ref={roadPinRef}>
            <div className="road-progress-label">
              03 · Voyage Timeline — scroll to drive voyager
            </div>
            <div className="road-sky" />
            <div className="road-sky-night" />
            <div className="road-stars" ref={starsRef} />
            <div className="road-nebula" />
            <div className="road-sun" />
            
            <svg className="road-moon" viewBox="0 0 100 100">
              <defs>
                <mask id="moonMask">
                  <rect width="100" height="100" fill="black" />
                  <circle cx="50" cy="50" r="42" fill="white" />
                  <circle cx="68" cy="42" r="42" fill="black" />
                </mask>
              </defs>
              <circle cx="50" cy="50" r="42" fill="#e2e8f0" mask="url(#moonMask)" />
            </svg>

            {/* Stylized background terrain */}
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

            {/* Glow drawing SVG timeline road */}
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
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="20"
                strokeLinecap="round"
              />
              <path
                d="M -40,340 C 140,300 220,180 380,180 C 560,180 600,300 780,300 C 960,300 1000,150 1180,150 C 1340,150 1400,220 1500,210"
                fill="none"
                stroke="#c5ff7c"
                strokeWidth="2.5"
                strokeDasharray="12 14"
                strokeLinecap="round"
                opacity="0.85"
              />
            </svg>

            {/* SPACESHIP VOYAGER PROBE VEHICLE */}
            <div
              ref={carGroupRef}
              className="car-group"
              id="carGroup"
            >
              <svg className="car-svg" viewBox="0 0 80 50">
                {/* Engine fire/trail */}
                <path d="M5,25 L18,16 L18,34 Z" fill="var(--lime)" opacity="0.8" />
                <path d="M0,25 L12,20 L12,30 Z" fill="var(--amber)" opacity="0.6" />
                {/* Space Capsule Body */}
                <path d="M18,20 L48,10 L68,25 L48,40 L18,30 Z" fill="#141a28" stroke="#3a3244" strokeWidth="1.5" />
                {/* Cyber cockpit dome */}
                <path d="M42,20 L58,20 L62,25 L58,30 L42,30 Z" fill="rgba(197, 255, 124, 0.25)" stroke="var(--lime)" strokeWidth="1" />
                {/* Wings / Thrusters */}
                <rect x="22" y="5" width="8" height="15" fill="#3a3244" rx="2" transform="rotate(-15 22 5)" />
                <rect x="22" y="30" width="8" height="15" fill="#3a3244" rx="2" transform="rotate(15 22 30)" />
                {/* Decorative glowing dots */}
                <circle cx="34" cy="25" r="2.5" fill="var(--lime)" />
                <circle cx="48" cy="25" r="2.5" fill="var(--amber)" />
              </svg>
            </div>

            {/* MILESTONE CELESTIAL STATIONS */}
            <div className="road-house" id="m1" ref={m1Ref}>
              <div className="house-label">
                <span className="yr">2019 · Frontend Intern</span>
                <h3>PixelCraft Studio</h3>
                <p>Crafted immersive landing grids, first-rate visual states, and high-fidelity fluid scroll containers.</p>
              </div>
              <svg className="house-svg" viewBox="0 0 50 50">
                {/* Futuristic Satellite Station */}
                <circle cx="25" cy="25" r="8" fill="#141a28" stroke="#c5ff7c" strokeWidth="2" />
                <line x1="25" y1="5" x2="25" y2="45" stroke="#3a3244" strokeWidth="2" />
                <line x1="5" y1="25" x2="45" y2="25" stroke="#3a3244" strokeWidth="2" />
                <rect x="23" y="10" width="4" height="4" fill="#ffb454" className="house-window" />
                <rect x="23" y="36" width="4" height="4" fill="#ffb454" className="house-window" />
              </svg>
            </div>

            <div className="road-house" id="m2" ref={m2Ref}>
              <div className="house-label">
                <span className="yr">2020 · Frontend Developer</span>
                <h3>NimbusTech</h3>
                <p>Architected comprehensive React design systems and high-contrast motion components across six product squads.</p>
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
                <span className="yr">2022 · Full-Stack Developer</span>
                <h3>Skyline Labs</h3>
                <p>Spearheaded end-to-end framework rebuilds, implementing 60% faster runtime optimizations and robust APIs.</p>
              </div>
              <svg className="house-svg" viewBox="0 0 50 50">
                <polygon points="25,5 45,40 5,40" fill="#141a28" stroke="#ff6f91" strokeWidth="2" />
                <circle cx="25" cy="28" r="6" fill="#ffb454" className="house-window" />
              </svg>
            </div>

            <div className="road-house" id="m4" ref={m4Ref}>
              <div className="house-label">
                <span className="yr">2024 · Senior Creative Engineer</span>
                <h3>Wanderframe</h3>
                <p>Constructed motion-first storytelling sites using custom WebGL canvas layouts, winning multiple agency awards.</p>
              </div>
              <svg className="house-svg" viewBox="0 0 50 50">
                <rect x="10" y="10" width="30" height="30" fill="#141a28" stroke="#c5ff7c" strokeWidth="2" rx="4" />
                <line x1="10" y1="10" x2="40" y2="40" stroke="#3a3244" strokeWidth="1.5" />
                <circle cx="25" cy="25" r="5" fill="#ff6f91" className="house-window" />
              </svg>
            </div>

            <div className="road-house" id="m5" ref={m5Ref}>
              <div className="house-label">
                <span className="yr">2026 · Present</span>
                <h3>Open to Voyage</h3>
                <p>Architecting freelance WebGL modules, side tools, and looking to join another high-end engineering crew.</p>
              </div>
              <svg className="house-svg" viewBox="0 0 50 50">
                <polygon points="25,2 48,18 39,45 11,45 2,18" fill="#141a28" stroke="#6366f1" strokeWidth="2" />
                <circle cx="25" cy="25" r="7" fill="#c5ff7c" className="house-window" />
              </svg>
            </div>
          </div>
        </section>

        {/* WORK / PROJECTS */}
        <section className="projects" id="projects">
          <div className="section-head">
            <span className="eyebrow">04 · Selected Work</span>
            <h2>Shipped Deployments.</h2>
            <p>
              A selection of projects fusing clean, robust system architecture with custom interactive web elements.
            </p>
          </div>
          <div className="project-grid">
            
            <div className="project-card" style={{ '--pc': 'rgba(197, 255, 124, 0.18)' } as React.CSSProperties}>
              <span className="num">01</span>
              <div className="glow-orb" />
              <div className="project-tags">
                <span>React</span>
                <span>Three.js</span>
                <span>Stripe API</span>
              </div>
              <h3>Aurora Commerce</h3>
              <p>
                An e-commerce gateway containing custom 3D configurators, GLTF texture swaps, 
                and sub-second state checkouts.
              </p>
              <span className="project-link">
                View case study{' '}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M7 17L17 7M7 7h10v10" />
                </svg>
              </span>
            </div>

            <div className="project-card" style={{ '--pc': 'rgba(255, 180, 84, 0.18)' } as React.CSSProperties}>
              <span className="num">02</span>
              <div className="glow-orb" />
              <div className="project-tags">
                <span>Next.js</span>
                <span>WebSockets</span>
                <span>D3.js Charts</span>
              </div>
              <h3>Nimbus Dashboard</h3>
              <p>
                Real-time server metrics dashboard featuring custom canvas streams mapping 40k+ 
                live infrastructure nodes.
              </p>
              <span className="project-link">
                View case study{' '}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M7 17L17 7M7 7h10v10" />
                </svg>
              </span>
            </div>

            <div className="project-card" style={{ '--pc': 'rgba(255, 111, 145, 0.18)' } as React.CSSProperties}>
              <span className="num">03</span>
              <div className="glow-orb" />
              <div className="project-tags">
                <span>GSAP</span>
                <span>ScrollTrigger</span>
                <span>SVG Draw</span>
              </div>
              <h3>Wanderframe Studio</h3>
              <p>
                Award-shortlisted marketing website built entirely around fluid narrative scroll paths 
                and letter-split morphs.
              </p>
              <span className="project-link">
                View case study{' '}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M7 17L17 7M7 7h10v10" />
                </svg>
              </span>
            </div>

            <div className="project-card" style={{ '--pc': 'rgba(99, 102, 241, 0.18)' } as React.CSSProperties}>
              <span className="num">04</span>
              <div className="glow-orb" />
              <div className="project-tags">
                <span>CRDTs</span>
                <span>Node.js</span>
                <span>Postgres</span>
              </div>
              <h3>EchoNotes</h3>
              <p>
                A collaborative offline-first workspace tool featuring multi-user cursor synch, 
                Yjs documents, and vector embeds.
              </p>
              <span className="project-link">
                View case study{' '}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
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
            Let&apos;s build something <span className="accent-amber">worth driving through.</span>
          </h2>
          <a href="mailto:hello@neerajsurnis.dev" className="contact-btn">
            hello@neerajsurnis.dev
          </a>
          <div className="socials">
            <a href="#">GitHub</a>
            <a href="#">LinkedIn</a>
            <a href="#">X / Twitter</a>
            <a href="#">Dribbble</a>
          </div>
          <footer>
            <span>© 2026 NEERAJ Surnis</span>
            <span>
              Engineered with React · GSAP · Canvas Elements · Custom Scroller
            </span>
          </footer>
        </section>
      </div>
    </>
  );
}
