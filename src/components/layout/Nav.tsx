'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface NavProps {
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
}

export default function Nav({ menuOpen, setMenuOpen }: NavProps) {
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const line1 = line1Ref.current;
    const line2 = line2Ref.current;
    if (!line1 || !line2) return;
    const menuBtn = line1.closest('button');
    if (!menuBtn) return;

    const observer = new MutationObserver(() => {
      const isActive = menuBtn.classList.contains('menu-active');
      if (isActive) {
        gsap.to(line1, { rotate: 45, y: 8, backgroundColor: 'var(--lime)', duration: 0.4, ease: 'power3.out' });
        gsap.to(line2, { rotate: -45, y: -8, backgroundColor: 'var(--lime)', duration: 0.4, ease: 'power3.out' });
      } else {
        gsap.to(line1, { rotate: 0, y: 0, backgroundColor: 'var(--text)', duration: 0.4, ease: 'power3.out' });
        gsap.to(line2, { rotate: 0, y: 0, backgroundColor: 'var(--text)', duration: 0.4, ease: 'power3.out' });
      }
    });
    observer.observe(menuBtn, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return (
    <nav>
      <a href="#hero" className="logo" data-nav>
        NEERAJ<span className="logo-dot" />
      </a>
      <button className={`menu-toggle ${menuOpen ? 'menu-active' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation menu">
        <div ref={line1Ref} className="menu-line" style={{ transformOrigin: 'center' }} />
        <div ref={line2Ref} className="menu-line" style={{ transformOrigin: 'center' }} />
      </button>
    </nav>
  );
}
