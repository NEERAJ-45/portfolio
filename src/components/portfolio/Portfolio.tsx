"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  CSSProperties,
  MouseEvent as ReactMouseEvent,
  ReactNode,
  RefObject,
} from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import Lenis from "lenis";
import SignalCanvas from "./SignalCanvas";
import { Reveal } from "./Reveal";
import {
  experience,
  principles,
  profile,
  projects,
  sections,
  stackGroups,
  tickerItems,
} from "./data";
import type { Experience, Project } from "./data";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [istTime, setIstTime] = useState("");
  const lenisRef = useRef<Lenis | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.2,
      autoRaf: true,
      respectReducedMotion: true,
    });

    lenisRef.current = lenis;

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const formatTime = () => {
      setIstTime(
        new Intl.DateTimeFormat("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    };

    formatTime();
    const timer = window.setInterval(formatTime, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          setActiveSection(visible.target.id);
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.1, 0.25, 0.5] },
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;

    if (menuOpen) {
      lenis?.stop();
      document.documentElement.classList.add("menu-open");
    } else {
      lenis?.start();
      document.documentElement.classList.remove("menu-open");
    }

    return () => document.documentElement.classList.remove("menu-open");
  }, [menuOpen]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    window.setTimeout(() => menuButtonRef.current?.focus(), 60);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 80);
    const menu = menuRef.current;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
        return;
      }

      if (event.key !== "Tab" || !menu) return;

      const focusable = Array.from(
        menu.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
      );

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [closeMenu, menuOpen]);

  const scrollToSection = useCallback((id: string) => {
    setMenuOpen(false);

    const target = document.getElementById(id);
    if (!target) return;

    const lenis = lenisRef.current;

    if (lenis) {
      lenis.scrollTo(target, {
        offset: -84,
        duration: 1.15,
        force: true,
      });
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleAnchor = useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement>, id: string) => {
      event.preventDefault();
      scrollToSection(id);
    },
    [scrollToSection],
  );

  return (
    <div className="site">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <motion.div
        className="scroll-progress"
        style={{ scaleX: progress }}
        aria-hidden="true"
      />

      <Header
        menuOpen={menuOpen}
        menuButtonRef={menuButtonRef}
        onMenu={() => setMenuOpen(true)}
        onHome={() => scrollToSection("hero")}
      />

      <SectionIndex active={activeSection} onNavigate={scrollToSection} />

      <AnimatePresence>
        {menuOpen ? (
          <Menu
            menuRef={menuRef}
            closeButtonRef={closeButtonRef}
            time={istTime}
            onClose={closeMenu}
            onNavigate={scrollToSection}
          />
        ) : null}
      </AnimatePresence>

      <main id="main">
        <Hero time={istTime} onAnchor={handleAnchor} />

        <Ticker />

        <SectionShell id="principles" number="01" label="Operating principles">
          <SectionHeader
            id="principles-title"
            kicker="Operating principles"
            title={
              <>
                Correctness is a feature.
                <br />
                <em>Speed is a consequence.</em>
              </>
            }
            description="The rules I keep coming back to when a system has to stay honest under load."
          />
          <Principles />
        </SectionShell>

        <SectionShell id="ledger" number="02" label="The ledger">
          <SectionHeader
            id="ledger-title"
            kicker="The ledger"
            title={
              <>
                A record of systems
                <br />
                <em>shipped and lessons earned.</em>
              </>
            }
            description="Five entries. A short history of building, breaking, and tuning systems in production."
          />
          <Timeline />
        </SectionShell>

        <SectionShell id="systems" number="03" label="Selected systems">
          <SectionHeader
            id="systems-title"
            kicker="Selected systems"
            title={
              <>
                Four systems.
                <br />
                One obsession:
                <br />
                <em>it must hold.</em>
              </>
            }
            description="Selected work where correctness, throughput, and the unglamorous edges mattered most."
          />
          <ProjectDeck />
        </SectionShell>

        <SectionShell id="toolkit" number="04" label="Toolkit">
          <SectionHeader
            id="toolkit-title"
            kicker="Toolkit"
            title={
              <>
                Instruments,
                <br />
                <em>not identities.</em>
              </>
            }
            description="The tools I reach for when the problem needs a correct, observable, maintainable answer."
          />
          <Stack />
        </SectionShell>

        <Contact time={istTime} onTop={() => scrollToSection("hero")} />
      </main>
    </div>
  );
}

type HeaderProps = {
  menuOpen: boolean;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
  onMenu: () => void;
  onHome: () => void;
};

function Header({ menuOpen, menuButtonRef, onMenu, onHome }: HeaderProps) {
  return (
    <header className="topbar">
      <button
        type="button"
        className="brand"
        onClick={onHome}
        aria-label="Neeraj Surnis — back to top"
      >
        <span className="brand-mark" aria-hidden="true">
          NS
        </span>
        <span className="brand-name">Neeraj Surnis</span>
      </button>

      <p className="topbar-center" aria-hidden="true">
        Backend engineer / Payments / Distributed systems
      </p>

      <div className="topbar-right">
        <span className="availability">
          <span className="status-dot" aria-hidden="true" />
          Open to work
        </span>

        <button
          ref={menuButtonRef}
          type="button"
          className="menu-button"
          onClick={onMenu}
          aria-expanded={menuOpen}
          aria-controls="site-menu"
        >
          <span>Menu</span>
          <span className="menu-icon" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </div>
    </header>
  );
}

type SectionIndexProps = {
  active: string;
  onNavigate: (id: string) => void;
};

function SectionIndex({ active, onNavigate }: SectionIndexProps) {
  return (
    <aside className="section-index" aria-label="Section index">
      <span className="index-caption">Index</span>

      <nav aria-label="Section shortcuts">
        <ul>
          {sections.map((section) => {
            const isActive = active === section.id;

            return (
              <li key={section.id}>
                <button
                  type="button"
                  className={`index-link${isActive ? " is-active" : ""}`}
                  onClick={() => onNavigate(section.id)}
                  aria-current={isActive ? "location" : undefined}
                >
                  <span className="index-number">{section.number}</span>
                  <span className="index-label">{section.label}</span>
                  {isActive ? (
                    <motion.span
                      className="index-active"
                      layoutId="index-active"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <span className="index-year">2026</span>
    </aside>
  );
}

type MenuProps = {
  menuRef: RefObject<HTMLDivElement | null>;
  closeButtonRef: RefObject<HTMLButtonElement | null>;
  time: string;
  onClose: () => void;
  onNavigate: (id: string) => void;
};

function Menu({
  menuRef,
  closeButtonRef,
  time,
  onClose,
  onNavigate,
}: MenuProps) {
  return (
    <motion.div
      id="site-menu"
      ref={menuRef}
      className="menu-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="menu-title"
      initial={{ y: "-100%" }}
      animate={{ y: 0 }}
      exit={{ y: "-100%" }}
      transition={{ duration: 0.65, ease: EASE }}
    >
      <div className="menu-top">
        <h2 id="menu-title" className="menu-brand">
          NS / Index
        </h2>
        <button
          ref={closeButtonRef}
          type="button"
          className="menu-close"
          onClick={onClose}
          aria-label="Close navigation"
        >
          Close <span aria-hidden="true">×</span>
        </button>
      </div>

      <nav className="menu-nav" aria-label="Primary">
        {sections.map((section, index) => (
          <motion.a
            key={section.id}
            href={`#${section.id}`}
            className="menu-link"
            onClick={(event) => {
              event.preventDefault();
              onNavigate(section.id);
            }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.12 + index * 0.05,
              duration: 0.55,
              ease: EASE,
            }}
          >
            <span className="menu-number">{section.number}</span>
            <span className="menu-label">{section.label}</span>
            <span className="menu-arrow" aria-hidden="true">
              ↗
            </span>
          </motion.a>
        ))}
      </nav>

      <div className="menu-footer">
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
        <span>
          {profile.location} / {time || "—"} IST
        </span>
      </div>
    </motion.div>
  );
}

type HeroProps = {
  time: string;
  onAnchor: (event: ReactMouseEvent<HTMLAnchorElement>, id: string) => void;
};

function Hero({ time, onAnchor }: HeroProps) {
  const reduce = useReducedMotion();

  const lineTransition = (delay: number) => ({
    duration: 1.05,
    delay,
    ease: EASE,
  });

  return (
    <section id="hero" className="hero" aria-labelledby="hero-title">
      <div className="hero-canvas" aria-hidden="true">
        <SignalCanvas />
      </div>

      <div className="hero-inner">
        <div className="hero-copy">
          <Reveal className="hero-kicker" y={12}>
            <span className="status-dot" aria-hidden="true" />
            Backend engineer · Payments · Distributed systems
          </Reveal>

          <h1 id="hero-title" className="hero-title">
            <span className="line-mask">
              <motion.span
                className="line-inner"
                initial={reduce ? false : { y: "115%" }}
                animate={reduce ? undefined : { y: 0 }}
                transition={lineTransition(0.12)}
              >
                Systems
              </motion.span>
            </span>
            <span className="line-mask">
              <motion.span
                className="line-inner"
                initial={reduce ? false : { y: "115%" }}
                animate={reduce ? undefined : { y: 0 }}
                transition={lineTransition(0.2)}
              >
                For <em>money</em>
              </motion.span>
            </span>
            <span className="line-mask">
              <motion.span
                className="line-inner"
                initial={reduce ? false : { y: "115%" }}
                animate={reduce ? undefined : { y: 0 }}
                transition={lineTransition(0.28)}
              >
                In motion
                <span className="hero-period">.</span>
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="hero-lede"
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.48, ease: EASE }}
          >
            I&apos;m Neeraj Surnis. I build payment rails, event-driven services,
            and the quiet infrastructure that keeps transactions correct under
            load.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.58, ease: EASE }}
          >
            <a
              href="#ledger"
              className="button-primary"
              onClick={(event) => onAnchor(event, "ledger")}
            >
              Explore the ledger
              <span aria-hidden="true">↘</span>
            </a>
            <a
              href="#contact"
              className="button-link"
              onClick={(event) => onAnchor(event, "contact")}
            >
              Start a conversation
              <span aria-hidden="true">↗</span>
            </a>
          </motion.div>

          <motion.dl
            className="hero-meta"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.68, ease: EASE }}
          >
            <div>
              <dt>Based in</dt>
              <dd>{profile.location}</dd>
            </div>
            <div>
              <dt>Currently</dt>
              <dd>{profile.current}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>
                <span className="status-dot" aria-hidden="true" />
                Open to work
              </dd>
            </div>
          </motion.dl>
        </div>

        <motion.aside
          className="hero-panel"
          aria-label="Selected metrics"
          initial={reduce ? false : { opacity: 0, y: 32 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.36, ease: EASE }}
        >
          <div className="panel-top">
            <span>Live ledger / 001</span>
            <span className="panel-status">
              <span className="status-dot" aria-hidden="true" />
              Connected
            </span>
          </div>

          <p className="panel-number">
            10K<span>+</span>
          </p>
          <p className="panel-caption">
            transactions secured behind RBAC / Maximus Infoware
          </p>

          <div className="panel-signal" aria-hidden="true">
            {Array.from({ length: 9 }).map((_, index) => (
              <span
                key={index}
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))}
          </div>

          <dl className="panel-stats">
            <div>
              <dt>Users served</dt>
              <dd>5K+</dd>
            </div>
            <div>
              <dt>Load time</dt>
              <dd>−40%</dd>
            </div>
            <div>
              <dt>Query tuning</dt>
              <dd>−40%</dd>
            </div>
          </dl>

          <div className="panel-foot">
            <span>Kafka / Oracle / Spring Boot</span>
            <span>{time || "—"} IST</span>
          </div>
        </motion.aside>
      </div>

      <div className="hero-footer" aria-hidden="true">
        <span>Scroll to audit</span>
        <span className="hero-scroll-line" />
        <span>Portfolio / 2026</span>
      </div>
    </section>
  );
}

function Ticker() {
  const reduce = useReducedMotion();

  return (
    <div className="ticker" aria-hidden="true">
      <motion.div
        className="ticker-track"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 32, ease: "linear", repeat: Infinity }}
      >
        {[0, 1].map((group) => (
          <div className="ticker-group" key={group}>
            {tickerItems.map((item) => (
              <span className="ticker-item" key={`${group}-${item}`}>
                {item}
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

type SectionShellProps = {
  id: string;
  number: string;
  label: string;
  children: ReactNode;
};

function SectionShell({ id, number, label, children }: SectionShellProps) {
  return (
    <section id={id} className="section-shell" aria-labelledby={`${id}-title`}>
      <div className="section-rail" aria-hidden="true">
        <span className="section-rail-number">{number}</span>
        <span className="section-rail-label">{label}</span>
      </div>
      <div className="section-content">{children}</div>
    </section>
  );
}

type SectionHeaderProps = {
  id: string;
  kicker: string;
  title: ReactNode;
  description: string;
};

function SectionHeader({ id, kicker, title, description }: SectionHeaderProps) {
  const reduce = useReducedMotion();

  return (
    <motion.header
      className="section-header"
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <div className="section-header-main">
        <span className="section-kicker">{kicker}</span>
        <h2 id={id} className="section-title">
          {title}
        </h2>
      </div>
      <p className="section-description">{description}</p>
    </motion.header>
  );
}

function Principles() {
  return (
    <div className="principles-grid">
      {principles.map((principle, index) => (
        <Reveal
          key={principle.index}
          className="principle"
          delay={index * 0.08}
        >
          <div className="principle-top">
            <span>{principle.index}</span>
            <span>{principle.tag}</span>
          </div>
          <h3>{principle.title}</h3>
          <p>{principle.body}</p>
        </Reveal>
      ))}
    </div>
  );
}

function Timeline() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 70%", "end 80%"],
  });
  const fill = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="timeline" ref={timelineRef}>
      <div className="timeline-track" aria-hidden="true">
        <motion.div className="timeline-fill" style={{ scaleY: fill }} />
      </div>

      {experience.map((item) => (
        <TimelineEntry key={item.index} item={item} />
      ))}
    </div>
  );
}

function TimelineEntry({ item }: { item: Experience }) {
  const ref = useRef<HTMLElement>(null);
  const active = useInView(ref, { margin: "-38% 0px -46% 0px" });
  const reduce = useReducedMotion();

  return (
    <motion.article
      ref={ref}
      className={`timeline-entry${active ? " is-active" : ""}`}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="timeline-marker" aria-hidden="true">
        {item.index}
      </div>

      <div className="timeline-period">
        <time>{item.period}</time>
        <span>{item.role}</span>
      </div>

      <div className="timeline-body">
        <h3>{item.company}</h3>
        <p>{item.description}</p>

        <ul className="tag-list">
          {item.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>

        <div className="timeline-metric">
          <strong>{item.metric.value}</strong>
          <span>{item.metric.label}</span>
        </div>
      </div>
    </motion.article>
  );
}

function ProjectDeck() {
  return (
    <div className="project-deck">
      {projects.map((project, index) => (
        <ProjectCard key={project.index} project={project} index={index} />
      ))}
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const reduce = useReducedMotion();
  const style = { "--i": index } as CSSProperties;

  return (
    <motion.article
      className={`project-card tone-${project.tone}`}
      style={style}
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <div className="project-top">
        <span>Case {project.index}</span>
        <span>{project.kicker}</span>
      </div>

      <div className="project-main">
        <div className="project-copy">
          <h3 className="project-title">{project.name}</h3>
          <p className="project-subtitle">{project.subtitle}</p>
          <p className="project-description">{project.description}</p>

          <ul className="tag-list">
            {project.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </div>

        <div className="project-diagram" aria-hidden="true">
          <span className="diagram-label">Event flow</span>

          <div className="flow-track">
            {project.flow.map((node, flowIndex) => (
              <div className="flow-step" key={node}>
                <span className="flow-node">{node}</span>
                {flowIndex < project.flow.length - 1 ? (
                  <span className="flow-arrow">→</span>
                ) : null}
              </div>
            ))}
          </div>

          <ul className="diagram-readout">
            {project.readout.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="project-footer">
        <div className="project-stats">
          {project.stats.map((stat) => (
            <div className="project-stat" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
        <span className="project-footer-note">Dossier / {project.index}</span>
      </div>
    </motion.article>
  );
}

function Stack() {
  return (
    <div className="stack">
      {stackGroups.map((group, index) => (
        <Reveal
          key={group.title}
          className="stack-group"
          delay={index * 0.05}
        >
          <div className="stack-head">
            <span className="stack-index">{group.index}</span>
            <h3>{group.title}</h3>
          </div>

          <ul className="stack-items">
            {group.items.map((item, itemIndex) => (
              <li key={item}>
                <span>{item}</span>
                <span>{String(itemIndex + 1).padStart(2, "0")}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      ))}

      <p className="stack-note">The stack is a means. Correctness is the point.</p>
    </div>
  );
}

type ContactProps = {
  time: string;
  onTop: () => void;
};

function Contact({ time, onTop }: ContactProps) {
  const reduce = useReducedMotion();

  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="contact-top">
        <span className="section-kicker">05 / Open channel</span>
        <span className="contact-status">
          <span className="status-dot" aria-hidden="true" />
          Available for work
        </span>
      </div>

      <motion.h2
        id="contact-title"
        className="contact-title"
        initial={reduce ? false : { opacity: 0, y: 32 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        Let&apos;s build
        <br />
        <em>the next</em>
        <br />
        ledger.
      </motion.h2>

      <div className="contact-grid">
        <div className="contact-copy">
          <p>
            Open to full-time roles and serious freelance work. If the system
            has to stay correct under load, we should talk.
          </p>

          <a className="contact-email" href={`mailto:${profile.email}`}>
            {profile.email}
            <span aria-hidden="true"> ↗</span>
          </a>

          <a
            className="button-primary contact-button"
            href={`mailto:${profile.email}`}
          >
            Write a brief
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="contact-details">
          <div>
            <span>Phone</span>
            <a href={profile.phoneHref}>{profile.phone}</a>
          </div>
          <div>
            <span>Location</span>
            <p>{profile.location}</p>
          </div>
          <div>
            <span>Local time</span>
            <p>{time || "—"} IST</p>
          </div>
          <div>
            <span>Elsewhere</span>
            <div className="contact-socials">
              <a href={profile.github} target="_blank" rel="noreferrer">
                GitHub ↗
              </a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn ↗
              </a>
            </div>
          </div>
        </div>
      </div>

      <footer className="contact-footer">
        <span>© 2026 Neeraj Surnis</span>
        <span>Built with Next.js / Motion / Lenis</span>
        <button type="button" className="back-to-top" onClick={onTop}>
          Back to top <span aria-hidden="true">↑</span>
        </button>
      </footer>

      <div className="contact-stamp" aria-hidden="true">
        <span>Verified</span>
        <strong>2026</strong>
        <span>Ready to ship</span>
      </div>
    </section>
  );
}
