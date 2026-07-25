'use client';

import { useEffect } from 'react';
import { FaRocket } from 'react-icons/fa6';
import { ProjectData } from '@/data/projects';

interface ProjectModalProps {
  project: ProjectData;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="fullscreen-project-modal">
      <div className="fullscreen-modal-header">
        <div>
          <span className="eyebrow" style={{ color: 'var(--lime)', marginBottom: '6px' }}>
            Project {project.num} · System Architecture &amp; Showcase
          </span>
          <h2 style={{ fontSize: '2.4rem', margin: 0, color: 'var(--text)' }}>{project.title}</h2>
        </div>
        <button type="button" className="fullscreen-modal-close" onClick={onClose} aria-label="Close modal">✕</button>
      </div>

      {project.motto && (
        <span className="hustle-motto-tag" style={{ fontSize: '0.9rem', padding: '8px 18px', marginBottom: '24px' }}>
          {project.motto}
        </span>
      )}

      <div className="project-tags" style={{ marginBottom: '28px' }}>
        {project.tags.map((t) => (
          <span key={t} style={{ fontSize: '0.85rem', padding: '8px 18px', borderColor: 'rgba(255, 255, 255, 0.2)' }}>{t}</span>
        ))}
      </div>

      <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '32px', marginBottom: '28px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--lime)' }}>System &amp; Overview</h3>
        <p style={{ color: 'var(--text-dim)', fontSize: '1.05rem', lineHeight: '1.7', margin: 0 }}>{project.fullDesc}</p>
      </div>

      <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '32px', marginBottom: '28px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', color: '#ffb454' }}>Key Engineering Highlights</h3>
        <ul style={{ paddingLeft: '20px', margin: 0, color: 'var(--text)', fontSize: '1rem', lineHeight: '1.8' }}>
          {project.features.map((feat, idx) => <li key={idx} style={{ marginBottom: '8px' }}>{feat}</li>)}
        </ul>
      </div>

      {project.hustleDetails && (
        <>
          <div className="hustle-pitch-box" style={{ fontSize: '1.05rem', padding: '24px', marginBottom: '28px' }}>
            &ldquo;I built a job hunting platform with a built-in job portal, one-click AI-generated ATS-optimized resumes and cover letters, and auto-apply via email and API — backed by an async ML pipeline using Kafka, Redis caching, and a FastAPI model layer.&rdquo;
          </div>
          <div className="hustle-grid-two">
            <div className="hustle-box-card">
              <h4 style={{ color: 'var(--lime)' }}>Phase 1 — MVP Edition</h4>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem', marginBottom: '12px' }}>Proves zero to applied in under 2 minutes:</p>
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
              <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem', marginBottom: '12px' }}>Production scale with async event queues &amp; caching:</p>
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
        <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="contact-btn" style={{ fontSize: '1rem', padding: '14px 28px' }}>
          View Repository on GitHub ↗
        </a>
      </div>
    </div>
  );
}
