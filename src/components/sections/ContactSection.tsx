'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact > *', {
        y: 30, duration: 0.9, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: '.contact', start: 'top 80%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="contact" id="contact" ref={sectionRef}>
      <span className="eyebrow">05 · Contact</span>
      <h2>Let&apos;s build secure, <span className="accent-amber">scale-ready engines.</span></h2>
      <a href="mailto:neerajsurnis@gmail.com" className="contact-btn">neerajsurnis@gmail.com</a>
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
  );
}
