'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LogoLoop from '@/components/LogoLoop';
import { skillRow1, skillRow2, skillRow3 } from '@/data/skills';

gsap.registerPlugin(ScrollTrigger);

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.section-head', sectionRef.current!).forEach((head) => {
        gsap.from(head, { y: 40, duration: 1.0, ease: 'power3.out', scrollTrigger: { trigger: head, start: 'top 85%' } });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="skills" id="skills" ref={sectionRef}>
      <div className="section-head">
        <span className="eyebrow">02 · Toolbox</span>
        <h2>Modern Tech Stack.</h2>
        <p>An aggregate of secure frameworks, message brokers, and transactional databases leveraged to engineer high-throughput and resilient cloud systems.</p>
      </div>
      <div className="skills-container">
        <div className="skills-rows">
          <LogoLoop logos={skillRow1} speed={55} direction="left" logoHeight={64} gap={36} hoverSpeed={0} scaleOnHover fadeOut fadeOutColor="#030408" />
          <LogoLoop logos={skillRow2} speed={55} direction="right" logoHeight={64} gap={36} hoverSpeed={0} scaleOnHover fadeOut fadeOutColor="#030408" />
          <LogoLoop logos={skillRow3} speed={55} direction="left" logoHeight={64} gap={36} hoverSpeed={0} scaleOnHover fadeOut fadeOutColor="#030408" />
        </div>
      </div>
    </section>
  );
}
