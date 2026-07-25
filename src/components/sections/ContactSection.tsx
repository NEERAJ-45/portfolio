'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

type FormState = 'idle' | 'sending' | 'success' | 'error';

function ContactModal({ onClose }: { onClose: () => void }) {
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [fields, setFields] = useState<{ name: string; email: string; subject: string; message: string }>({
    name: '', email: '', subject: '', message: '',
  });
  const [mounted, setMounted] = useState<boolean>(false);

  // Only render portal on the client — document.body is undefined during SSR
  useEffect(() => { setMounted(true); }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Prevent background scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('sending');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      setFormState('success');
      setFields({ name: '', email: '', subject: '', message: '' });
    } catch (err: unknown) {
      setFormState('error');
      setErrorMsg(err instanceof Error ? err.message : 'Failed to send. Try again.');
    }
  };

  // Portal escape: render directly on document.body so that
  // position:fixed works correctly despite the CSS-transform scroll container
  if (!mounted) return null;
  return createPortal(
    <motion.div
      className="contact-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        className="contact-modal"
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.97 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="contact-modal-header">
          <div>
            <p className="contact-modal-eyebrow">Let&apos;s connect</p>
            <h3 className="contact-modal-title">Send me a message</h3>
            <p className="contact-modal-hint">
              or ping me at{' '}
              <a href="mailto:neerajsurnis@gmail.com" className="contact-modal-email">neerajsurnis@gmail.com</a>
            </p>
          </div>
          <button className="contact-modal-close" id="btn-close-contact-modal" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Form */}
        {formState !== 'success' ? (
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="modal-name">Name</label>
                <input id="modal-name" type="text" name="name" placeholder="Your name"
                  value={fields.name} onChange={handleChange} required disabled={formState === 'sending'} />
              </div>
              <div className="form-group">
                <label htmlFor="modal-email">Email</label>
                <input id="modal-email" type="email" name="email" placeholder="you@email.com"
                  value={fields.email} onChange={handleChange} required disabled={formState === 'sending'} />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="modal-subject">Subject <span className="form-optional">(optional)</span></label>
              <input id="modal-subject" type="text" name="subject" placeholder="What's this about?"
                value={fields.subject} onChange={handleChange} disabled={formState === 'sending'} />
            </div>
            <div className="form-group">
              <label htmlFor="modal-message">Message</label>
              <textarea id="modal-message" name="message" placeholder="Tell me about your project or opportunity…"
                rows={4} value={fields.message} onChange={handleChange} required disabled={formState === 'sending'} />
            </div>

            {formState === 'error' && (
              <p className="form-feedback form-feedback--error">⚠ {errorMsg}</p>
            )}

            <button type="submit" className="contact-submit-btn" id="btn-contact-submit"
              disabled={formState === 'sending'}>
              {formState === 'sending'
                ? <><span className="btn-spinner" /> Sending…</>
                : 'Send message →'}
            </button>
          </form>
        ) : (
          <motion.div
            className="contact-success"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="contact-success-icon">✓</div>
            <h4>Message sent!</h4>
            <p>Thanks for reaching out. I&apos;ll get back to you shortly.</p>
            <button className="contact-submit-btn" onClick={onClose}>Close</button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>,
    document.body
  );
}

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-inner > *', {
        y: 30, duration: 0.9, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: '.contact', start: 'top 80%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <section className="contact" id="contact" ref={sectionRef}>
        <div className="contact-inner">
          <span className="eyebrow">05 · Contact</span>
          <h2>Let&apos;s build secure, <span className="accent-amber">scale-ready engines.</span></h2>

          <div className="contact-actions">
            <button
              className="contact-btn"
              id="btn-open-contact-modal"
              onClick={() => setModalOpen(true)}
            >
              Send a message ↗
            </button>
          </div>

          <div className="socials">
            <a href="https://github.com/NEERAJ-45" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/neeraj-surnis-8739752b1/" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="tel:+919322696345">Call (+91 93226 96345)</a>
          </div>
        </div>

        <footer>
          <span>© 2026 Neeraj Surnis</span>
        </footer>
      </section>

      <AnimatePresence>
        {modalOpen && <ContactModal onClose={() => setModalOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
