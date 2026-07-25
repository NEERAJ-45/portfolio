'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaArrowUpRightFromSquare, FaEye } from 'react-icons/fa6';
import { projectsData, ProjectData } from '@/data/projects';

gsap.registerPlugin(ScrollTrigger);

interface ProjectsSectionProps {
  onSelectProject: (p: ProjectData) => void;
}

export default function ProjectsSection({ onSelectProject }: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.section-head', sectionRef.current!).forEach((head) => {
        gsap.from(head, { y: 40, duration: 1.0, ease: 'power3.out', scrollTrigger: { trigger: head, start: 'top 85%' } });
      });
      gsap.utils.toArray<HTMLElement>('.project-card', sectionRef.current!).forEach((card) => {
        gsap.from(card, { y: 60, duration: 1.1, ease: 'power4.out', scrollTrigger: { trigger: card, start: 'top 85%' } });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="projects" id="projects" ref={sectionRef}>
      <div className="section-head">
        <span className="eyebrow">04 · Selected Work</span>
        <h2>Shipped Deployments.</h2>
        <p>A selection of projects fusing clean, robust system architecture with custom interactive web elements.</p>
      </div>
      <div className="project-grid">
        {projectsData.map((project) => (
          <div key={project.id} className="project-card"
            style={{ '--pc': project.color, cursor: 'pointer' } as React.CSSProperties}
            onClick={() => onSelectProject(project)}
          >
            <span className="num">{project.num}</span>
            <div className="glow-orb" />
            <div className="project-tags">
              {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
            {project.motto && <span className="hustle-motto-tag" style={{ alignSelf: 'flex-start', margin: '4px 0 12px 0' }}>{project.motto}</span>}
            <h3>{project.title}</h3>
            <p>{project.shortDesc}</p>
            <div className="project-card-actions">
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()} className="project-btn">
                View <FaArrowUpRightFromSquare size={14} />
              </a>
              <button type="button" onClick={(e) => { e.stopPropagation(); onSelectProject(project); }}
                className="project-btn project-btn-secondary">
                <FaEye style={{ marginRight: 6 }} /> Show
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
