'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MotionPathPlugin from 'gsap/MotionPathPlugin';
import { AnimatePresence, motion } from 'framer-motion';
import Preloader from '@/components/Preloader';
import SplitText from '@/components/SplitText';
import LogoLoop from '@/components/LogoLoop';

import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiSpringboot,
  SiApachekafka,
  SiNodedotjs,
  SiReact,
  SiNextdotjs,
  SiPostgresql,
  SiMysql,
  SiMongodb,
  SiRedis,
  SiLinux,
  SiDocker,
  SiGit,
  SiGithubactions,
  SiPostman,
  SiJira
} from 'react-icons/si';
import { FaJava, FaDatabase, FaAws, FaRocket, FaEye, FaArrowUpRightFromSquare } from 'react-icons/fa6';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const logoBadge = (icon: React.ReactNode, title: string, color: string) => (
  <div
    className="glass-logo-badge"
    style={{ '--brand-color': color, color } as React.CSSProperties}
  >
    {icon}
    <div className="glass-tooltip">{title}</div>
  </div>
);

const skillRow1 = [
  { node: logoBadge(<FaJava />, 'Java', '#e76f51') },
  { node: logoBadge(<SiSpringboot />, 'Spring Boot', '#6db33f') },
  { node: logoBadge(<SiApachekafka />, 'Apache Kafka', '#c5ff7c') },
  { node: logoBadge(<SiNodedotjs />, 'Node.js', '#5fa04e') },
  { node: logoBadge(<SiPython />, 'Python', '#3776ab') },
  { node: logoBadge(<SiJavascript />, 'JavaScript', '#f7df1e') },
  { node: logoBadge(<SiTypescript />, 'TypeScript', '#3178c6') }
];

const skillRow2 = [
  { node: logoBadge(<SiReact />, 'React', '#61dafb') },
  { node: logoBadge(<SiNextdotjs />, 'Next.js', '#ffffff') },
  { node: logoBadge(<SiPostgresql />, 'PostgreSQL', '#4169e1') },
  { node: logoBadge(<SiMysql />, 'MySQL', '#00758f') },
  { node: logoBadge(<SiMongodb />, 'MongoDB', '#47a248') },
  { node: logoBadge(<SiRedis />, 'Redis', '#dc382d') },
  { node: logoBadge(<FaDatabase />, 'Oracle DB & SQL', '#ffb454') }
];

const skillRow3 = [
  { node: logoBadge(<SiLinux />, 'Linux', '#fcc624') },
  { node: logoBadge(<SiDocker />, 'Docker', '#2496ed') },
  { node: logoBadge(<FaAws />, 'AWS', '#ff9900') },
  { node: logoBadge(<SiGit />, 'Git', '#f05032') },
  { node: logoBadge(<SiGithubactions />, 'CI/CD & GitHub Actions', '#2088ff') },
  { node: logoBadge(<SiPostman />, 'Postman', '#ff6c37') },
  { node: logoBadge(<SiJira />, 'Jira', '#0052cc') }
];

interface ProjectData {
  id: string;
  num: string;
  title: string;
  motto?: string;
  repoUrl: string;
  color: string;
  tags: string[];
  shortDesc: string;
  fullDesc: string;
  features: string[];
  hustleDetails?: boolean;
}

const projectsData: ProjectData[] = [
  {
    id: 'revpay',
    num: '01',
    title: 'RevPay — Distributed Payment System',
    repoUrl: 'https://github.com/NEERAJ-45/RevPay-Distributed-Payment-System',
    color: 'rgba(197, 255, 124, 0.18)',
    tags: ['Java 21', 'Spring Boot', 'Kafka', 'Redis', 'Postgres', 'AWS'],
    shortDesc: 'Distributed event-driven payment processing platform built with Spring Boot microservices and Apache Kafka events.',
    fullDesc: 'RevPay is a resilient financial transaction processing platform built to handle concurrent payment dispatches with high throughput. Utilizes Spring Boot microservices communicating via Apache Kafka event channels. Features transactional Outbox pattern, Redis idempotency keys, and optimistic database locking to eliminate duplicate charges and lost updates.',
    features: [
      'Event-driven microservices architecture communicating over Apache Kafka streams',
      'Transactional Outbox Pattern guaranteeing atomic DB state and event dispatch',
      'Redis Idempotency Keys preventing duplicate charge submissions',
      'Optimistic locking & PostgreSQL/Oracle PL/SQL query tuning'
    ]
  },
  {
    id: 'docmanager',
    num: '02',
    title: 'Document Workflow Manager',
    repoUrl: 'https://github.com/NEERAJ-45/document-workflow-manager',
    color: 'rgba(255, 180, 84, 0.18)',
    tags: ['Node.js', 'Express', 'MongoDB', 'Firebase', 'Docker', 'RBAC'],
    shortDesc: 'Multi-stage document review and approval pipeline featuring granular Role-Based Access Control (RBAC).',
    fullDesc: 'Secure enterprise document lifecycle manager enforcing multi-stage review pipelines (Draft → Review → Approved). Implements client-side AES-256 document payload encryption, RSA-2048 key exchange for secure reviewer handshakes, and Firebase real-time push notifications.',
    features: [
      'Granular 3-Tier Role Based Access Control (Draft, Reviewer, Approver)',
      'AES-256 client-side payload encryption before persistence',
      'RSA-2048 key exchange for secure reviewer validation handshakes',
      'Firebase Cloud Messaging real-time push alerts'
    ]
  },
  {
    id: 'hustle',
    num: '03',
    title: 'Hustle.ai — AI Job Hunting Platform',
    repoUrl: 'https://github.com/NEERAJ-45/Hustle.ai/',
    color: 'rgba(255, 111, 145, 0.22)',
    tags: ['Next.js', 'FastAPI', 'Kafka', 'Redis', 'MongoDB', 'LLMs', 'Nodemailer'],
    shortDesc: 'Full-stack AI job hunting platform. One-click tailored ATS resume & cover letter generation, auto-apply via email & API.',
    fullDesc: 'A full-stack AI-powered job hunting platform enabling users to discover jobs, generate tailored ATS resumes and cover letters with one click, and auto-apply via email or API — backed by an async ML pipeline using Kafka, Redis caching, and a FastAPI model layer.',
    features: [
      'One-click LLM pipeline analyzing JDs & generating tailored ATS resumes & cover letters',
      'Automated PDF conversion & Nodemailer email dispatch with PDF attachments',
      'Kafka async pipelines for background ML scoring & LLM document generation',
      '5 Justified Redis Caching Layers (Search Cache, JD Hash, Status, Rate Limiting, JWT Blacklist)'
    ],
    hustleDetails: true
  },
  {
    id: 'lms',
    num: '04',
    title: 'LMS — Learning Management System',
    repoUrl: 'https://github.com/NEERAJ-45/lms',
    color: 'rgba(99, 102, 241, 0.18)',
    tags: ['Spring Boot', 'React', 'MySQL', 'REST APIs', 'Tailwind CSS'],
    shortDesc: 'Full-stack course management platform supporting role-based dashboards for students, instructors, and administrators.',
    fullDesc: 'Comprehensive educational platform supporting course enrollment, instructor uploads, student assignment submissions, and administrative grade tracking. Designed with optimized database queries and modular state management to ensure low latency and high availability.',
    features: [
      'Multi-Role User Dashboards (Student, Instructor, Admin)',
      'Optimized MySQL relational schema & JPA repository pipelines',
      'Interactive course player & progress tracker',
      '40% reduction in initial state loading times via state management'
    ]
  }
];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const playHeroAnimationRef = useRef<(() => void) | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
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

  // Hamburger line refs for GSAP morph
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  // Scroll cue line ref for GSAP drip
  const scrollDripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // -------------------------------------------------------------
    // 1. HARDWARE-ACCELERATED LERP SMOOTH SCROLLER
    // -------------------------------------------------------------
    const content = contentRef.current!;
    const spacer = spacerRef.current!;

    let currentY = 0;
    let targetY = 0;
    // Use a higher LERP on mobile/touch for snappier native-feeling scroll
    const isTouchDevice = window.matchMedia('(max-width: 768px)').matches;
    const LERP = isTouchDevice ? 0.18 : 0.08;
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
    // 3b. GSAP HAMBURGER MORPH (replaces CSS transitions)
    // -------------------------------------------------------------
    const line1 = line1Ref.current;
    const line2 = line2Ref.current;
    if (line1 && line2) {
      // Watch menuOpen via a MutationObserver on the button's class
      const menuBtn = line1.closest('button');
      if (menuBtn) {
        const morphObserver = new MutationObserver(() => {
          const isActive = menuBtn.classList.contains('menu-active');
          if (isActive) {
            gsap.to(line1, { rotate: 45, y: 8, backgroundColor: 'var(--lime)', duration: 0.4, ease: 'power3.out' });
            gsap.to(line2, { rotate: -45, y: -8, backgroundColor: 'var(--lime)', duration: 0.4, ease: 'power3.out' });
          } else {
            gsap.to(line1, { rotate: 0, y: 0, backgroundColor: 'var(--text)', duration: 0.4, ease: 'power3.out' });
            gsap.to(line2, { rotate: 0, y: 0, backgroundColor: 'var(--text)', duration: 0.4, ease: 'power3.out' });
          }
        });
        morphObserver.observe(menuBtn, { attributes: true, attributeFilter: ['class'] });
      }
    }

    // -------------------------------------------------------------
    // 3c. GSAP SCROLL CUE DRIP (replaces @keyframes scrollDrip)
    // -------------------------------------------------------------
    const scrollDrip = scrollDripRef.current;
    if (scrollDrip) {
      gsap.fromTo(
        scrollDrip,
        { yPercent: -100, opacity: 1 },
        { yPercent: 100, opacity: 0.3, duration: 1.8, ease: 'power2.inOut', repeat: -1, repeatDelay: 0.1 }
      );
    }

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
      const isMobileDevice = window.matchMedia('(max-width: 768px)').matches;
      const numParticles = isMobileDevice ? 55 : 120;
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
        // Lower warp threshold on mobile since LERP is higher (less velocity gap)
        const warpThreshold = isMobileDevice ? 3 : 8;
        const velMultiplier = Math.min(6, 1 + Math.abs(lastVelocity) * 0.15);
        const warpMode = Math.abs(lastVelocity) > warpThreshold;

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
    const heroTimeline = gsap.timeline({ paused: true })
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

    playHeroAnimationRef.current = () => {
      heroTimeline.play();
    };

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
    // 6. SKILLS SECTION (POWERED BY REAGT BITS LOGOLOOP)
    // -------------------------------------------------------------

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

      const labelHalfWidth = 140; // 250px card width / 2 + 15px safety padding
      const minAllowedLeft = labelHalfWidth + 20;
      const maxAllowedLeft = (pinRect.width || window.innerWidth) - labelHalfWidth - 20;

      milestoneMeta.forEach((m) => {
        if (!m.el) return;
        const pt = path.getPointAtLength(len * m.pct);
        const xRatio = pt.x / svgW;
        const yRatio = pt.y / svgH;
        
        const left = (svgRect.left - pinRect.left) + xRatio * svgRect.width;
        const top = (svgRect.top - pinRect.top) + yRatio * svgRect.height;
        
        let finalLeft: number;
        if (m.side === 'left') {
          finalLeft = left - 50;
        } else {
          finalLeft = left + 10;
        }

        // Clamp finalLeft so cards are NEVER cut off by viewport boundaries
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
      const svgEl = roadSvgRef.current;
      const pathEl = roadPathRef.current;
      if (!svgEl || !pathEl) return;

      const allPaths = svgEl.querySelectorAll<SVGPathElement>('path');
      const origD = pathEl.getAttribute('d') || '';
      const vertD = 'M 720,-20 C 1060,80 380,180 720,280 C 1060,380 380,450 720,520';
      allPaths.forEach(p => p.setAttribute('d', vertD));
      svgEl.style.pointerEvents = 'none';

      const st = ScrollTrigger.create({
        trigger: roadSectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.8,
        onUpdate(self) {
          const p = roadPathRef.current;
          const svg = roadSvgRef.current;
          const pin = roadPinRef.current;
          const car = carGroupRef.current;
          if (!p || !svg || !pin || !car) return;
          const len = p.getTotalLength();
          const pr = pin.getBoundingClientRect();
          const sr = svg.getBoundingClientRect();
          const vb = svg.viewBox.baseVal;
          const sx = (sr.width || 1) / (vb.width || 1440);
          const sy = (sr.height || 1) / (vb.height || 500);
          const pt = p.getPointAtLength(len * self.progress);
          const x = sr.left - pr.left + pt.x * sx - 40;
          const y = sr.top - pr.top + pt.y * sy - 30;
          const d = Math.max(0.5, len * 0.002);
          const pa = p.getPointAtLength(Math.max(0, len * self.progress - d));
          const pb = p.getPointAtLength(Math.min(len, len * self.progress + d));
          const a = Math.atan2(pb.y - pa.y, pb.x - pa.x) * (180 / Math.PI);
          gsap.set(car, { x, y, rotation: a, transformOrigin: '40px 25px', autoAlpha: 1 });
        }
      });

      return () => {
        st.kill();
        allPaths.forEach(p => p.setAttribute('d', origD));
        svgEl.style.pointerEvents = '';
      };
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

  useEffect(() => {
    if (!loading) {
      ScrollTrigger.refresh();
      window.dispatchEvent(new Event('resize'));
    }
  }, [loading]);

  useEffect(() => {
    if (!selectedProject) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedProject]);

  return (
    <>
      {loading && (
        <Preloader
          onComplete={() => {
            setLoading(false);
            if (playHeroAnimationRef.current) {
              playHeroAnimationRef.current();
            }
          }}
        />
      )}

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
          <div ref={line1Ref} className="menu-line" style={{ transformOrigin: 'center' }} />
          <div ref={line2Ref} className="menu-line" style={{ transformOrigin: 'center' }} />
        </button>
      </nav>

      {/* FULLSCREEN GLASSMORPHIC NAVIGATION MENU — Framer Motion */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fullscreen-menu is-open"
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              className="menu-container"
              onClick={(e) => e.stopPropagation()}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
                hidden:  { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
              }}
            >
              {[
                { href: '#skills',     label: '01 · Toolbox' },
                { href: '#experience', label: '02 · Journey' },
                { href: '#projects',   label: '03 · Work'    },
                { href: '#contact',    label: '04 · Contact'  },
              ].map(({ href, label }) => (
                <a key={href} href={href} className="menu-item" data-nav onClick={() => setMenuOpen(false)}>
                  <motion.span
                    variants={{
                      hidden:  { y: '110%', opacity: 0 },
                      visible: { y: '0%',   opacity: 1, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
                    }}
                  >
                    {label}
                  </motion.span>
                </a>
              ))}
              <motion.div
                className="menu-meta"
                variants={{
                  hidden:  { opacity: 0, y: 16 },
                  visible: { opacity: 0.6, y: 0, transition: { duration: 0.5, delay: 0.35, ease: 'easeOut' } },
                }}
              >
                NEERAJ SURNIS — MAHARASHTRA, INDIA
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={spacerRef} id="smooth-spacer" />
      <div ref={contentRef} id="smooth-content">
        
        {/* HERO */}
        <section className="hero" id="hero">
          <div className="hero-figure-bg">01</div>
          <div className="hero-eyebrow">Distributed Systems &amp; Payments</div>
          <h1>
            <div className="line">
              <SplitText
                text="Hi, I'm NEERAJ —"
                className="hero-split-name"
                delay={45}
                duration={0.75}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                textAlign="left"
                tag="span"
              />
            </div>
            <div className="line">
              <span>
                I build <span className="accent-lime">architectures</span>
              </span>
            </div>
            <div className="line">
              <span>
                that <span className="accent-amber">scale</span> &amp; secure data.
              </span>
            </div>
          </h1>
          <p className="hero-sub">
            Backend Software Engineer specializing in payments, event-driven microservices, 
            and high-volume transaction processing (Spring Boot, Java, Kafka, Redis, AWS). 
            Proficient across the full-stack.
          </p>
          <div className="hero-ctas">
            <a href="#projects" className="btn btn-primary" data-nav>
              Explore work →
            </a>
            <a href="#contact" className="btn btn-ghost" data-nav>
              Get in touch
            </a>
          </div>
          <div className="hero-scrollcue">
            <div className="scroll-line">
              <div ref={scrollDripRef} className="scroll-drip" />
            </div>
            Scroll to voyage
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
          <div className="skills-container">
            <div className="skills-rows">
              <LogoLoop
                logos={skillRow1}
                speed={55}
                direction="left"
                logoHeight={64}
                gap={36}
                hoverSpeed={0}
                scaleOnHover
                fadeOut
                fadeOutColor="#030408"
              />
              <LogoLoop
                logos={skillRow2}
                speed={55}
                direction="right"
                logoHeight={64}
                gap={36}
                hoverSpeed={0}
                scaleOnHover
                fadeOut
                fadeOutColor="#030408"
              />
              <LogoLoop
                logos={skillRow3}
                speed={55}
                direction="left"
                logoHeight={64}
                gap={36}
                hoverSpeed={0}
                scaleOnHover
                fadeOut
                fadeOutColor="#030408"
              />
            </div>
          </div>
        </section>

        {/* COSMIC JOURNEY / EXPERIENCE */}
        <section className="road-section" id="experience" ref={roadSectionRef}>
          <div className="road-pin" ref={roadPinRef}>
            <div className="road-progress-label">
              03 · Voyage Timeline — scroll to navigate journey
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
                <span className="yr">May 2024 – Aug 2024</span>
                <h3>Tiyara Innovations LLP</h3>
                <p>Full Stack Intern · Secured data flows, JWT user sessions, booking validation logics, and REST API pathways.</p>
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
            {projectsData.map((project) => (
              <div
                key={project.id}
                className="project-card"
                style={{ '--pc': project.color, cursor: 'pointer' } as React.CSSProperties}
                onClick={() => setSelectedProject(project)}
              >
                <span className="num">{project.num}</span>
                <div className="glow-orb" />
                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                {project.motto && (
                  <span className="hustle-motto-tag" style={{ alignSelf: 'flex-start', margin: '4px 0 12px 0' }}>
                    {project.motto}
                  </span>
                )}
                <h3>{project.title}</h3>
                <p>{project.shortDesc}</p>

                <div className="project-card-actions">
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="project-btn"
                  >
                    View{' '}
                    <FaArrowUpRightFromSquare size={14} />
                  </a>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProject(project);
                    }}
                    className="project-btn project-btn-secondary"
                  >
                    <FaEye style={{ marginRight: 6 }} /> Show
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section className="contact" id="contact">
          <span className="eyebrow">05 · Contact</span>
          <h2>
            Let&apos;s build secure, <span className="accent-amber">scale-ready engines.</span>
          </h2>
          <a href="mailto:neerajsurnis@gmail.com" className="contact-btn">
            neerajsurnis@gmail.com
          </a>
          <div className="socials">
            <a href="https://github.com/NEERAJ-45" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/neeraj-surnis-8739752b1/" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="tel:+919322696345">Call (+91 93226 96345)</a>
            <a href="mailto:neerajsurnis@gmail.com">Email</a>
          </div>
          <footer>
            <span>© 2026 Neeraj Surnis</span>
             
          </footer>
        </section>
      </div>
      {selectedProject && (
        <div className="fullscreen-project-modal">
          <div className="fullscreen-modal-header">
            <div>
              <span className="eyebrow" style={{ color: 'var(--lime)', marginBottom: '6px' }}>
                Project {selectedProject.num} · System Architecture &amp; Showcase
              </span>
              <h2 style={{ fontSize: '2.4rem', margin: 0, color: 'var(--text)' }}>
                {selectedProject.title}
              </h2>
            </div>
            <button
              type="button"
              className="fullscreen-modal-close"
              onClick={() => setSelectedProject(null)}
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          {selectedProject.motto && (
            <span className="hustle-motto-tag" style={{ fontSize: '0.9rem', padding: '8px 18px', marginBottom: '24px' }}>
              {selectedProject.motto}
            </span>
          )}

          <div className="project-tags" style={{ marginBottom: '28px' }}>
            {selectedProject.tags.map((t) => (
              <span key={t} style={{ fontSize: '0.85rem', padding: '8px 18px', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
                {t}
              </span>
            ))}
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '32px', marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--lime)' }}>
              System &amp; Overview
            </h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '1.05rem', lineHeight: '1.7', margin: 0 }}>
              {selectedProject.fullDesc}
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '32px', marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', color: '#ffb454' }}>
              Key Engineering Highlights
            </h3>
            <ul style={{ paddingLeft: '20px', margin: 0, color: 'var(--text)', fontSize: '1rem', lineHeight: '1.8' }}>
              {selectedProject.features.map((feat, idx) => (
                <li key={idx} style={{ marginBottom: '8px' }}>{feat}</li>
              ))}
            </ul>
          </div>

          {selectedProject.hustleDetails && (
            <>
              <div className="hustle-pitch-box" style={{ fontSize: '1.05rem', padding: '24px', marginBottom: '28px' }}>
                &ldquo;I built a job hunting platform with a built-in job portal, one-click AI-generated ATS-optimized resumes and cover letters, and auto-apply via email and API — backed by an async ML pipeline using Kafka, Redis caching, and a FastAPI model layer.&rdquo;
              </div>

              <div className="hustle-grid-two">
                <div className="hustle-box-card">
                  <h4 style={{ color: 'var(--lime)' }}>Phase 1 — MVP Edition</h4>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem', marginBottom: '12px' }}>
                    Proves zero to applied in under 2 minutes:
                  </p>
                  <ul>
                    <li>Auth (JWT) + User profile with resume upload</li>
                    <li>Job listings (seeded with apply emails)</li>
                    <li>LLM Pipeline (JD analysis + resume tailoring + cover letter)</li>
                    <li>PDF Generation for both tailored documents</li>
                    <li>Email Apply (Nodemailer attachment dispatch)</li>
                    <li>Application Tracker (auto-set status to Applied)</li>
                  </ul>
                </div>

                <div className="hustle-box-card">
                  <h4 style={{ color: '#ffb454' }}><FaRocket style={{ marginRight: 6 }} /> Phase 2 — Scaled Edition</h4>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem', marginBottom: '12px' }}>
                    Production scale with async event queues &amp; caching:
                  </p>
                  <ul>
                    <li>OAuth (Google / GitHub authentication)</li>
                    <li>Redis multi-stage caching &amp; rate limiting</li>
                    <li>Kafka async pipelines (resume &amp; LLM generation)</li>
                    <li>FastAPI ML job matching + ATS scoring layer</li>
                    <li>API Apply (custom payload builder)</li>
                    <li>External job support (manual JD paste for Naukri/LinkedIn)</li>
                  </ul>
                </div>
              </div>

              <div className="hustle-box-card" style={{ marginBottom: '24px' }}>
                  <h4 style={{ color: '#ff6f91' }}>Redis — 5 Justified Use Cases</h4>
                <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px', paddingLeft: '16px' }}>
                  <li><strong>Job Search Cache:</strong> 24hr TTL cache for frequent queries</li>
                  <li><strong>JD Analysis Cache:</strong> Hash JD → cache extracted keywords</li>
                  <li><strong>Generation Job Status:</strong> Async Kafka status store for UI polling</li>
                  <li><strong>Rate Limiting:</strong> Hourly counter per user for LLM bill safety</li>
                  <li><strong>JWT Blacklist:</strong> Invalidate logged out tokens instantly</li>
                </ul>
              </div>

              <div className="hustle-box-card" style={{ marginBottom: '32px' }}>
                  <h4 style={{ color: '#6366f1' }}>Kafka — 2 Justified Async Pipelines</h4>
                <ul>
                  <li><strong>Resume Processing Pipeline:</strong> ML scoring (5-10s) runs async via FastAPI without blocking API endpoints.</li>
                  <li><strong>LLM Document Generation:</strong> 10-30s LLM calls run async, publish status to Redis, and notify frontend.</li>
                </ul>
              </div>
            </>
          )}

          <div style={{ marginTop: 'auto', paddingTop: '32px', display: 'flex', gap: '20px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <a
              href={selectedProject.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-btn"
              style={{ fontSize: '1rem', padding: '14px 28px' }}
            >
              View Repository on GitHub ↗
            </a>
          </div>
        </div>
      )}
    </>
  );
}
