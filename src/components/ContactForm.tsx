'use client';

import { useState, FormEvent } from 'react';

type FormState = 'idle' | 'loading' | 'success' | 'error';

export const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [state, setState] = useState<FormState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [touched, setTouched] = useState({ name: false, email: false, message: false });

  const nameErr = touched.name && name.trim().length < 2;
  const emailErr = touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const messageErr = touched.message && message.trim().length < 10;
  const valid = name.trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && message.trim().length >= 10;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!valid) {
      setTouched({ name: true, email: true, message: true });
      return;
    }

    setState('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to send message');
      }

      setState('success');
      setName('');
      setEmail('');
      setMessage('');
      setTouched({ name: false, email: false, message: false });
    } catch (err) {
      setState('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  if (state === 'success') {
    return (
      <div className="contact-success">
        <div className="success-icon">✓</div>
        <h3>Message sent!</h3>
        <p>Thanks for reaching out. I&apos;ll get back to you soon.</p>
        <button className="btn btn-ghost" onClick={() => setState('idle')}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="contact-name">Name</label>
        <input
          id="contact-name"
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setTouched((p) => ({ ...p, name: true }))}
          className={nameErr ? 'input-error' : ''}
          aria-invalid={nameErr}
          aria-describedby={nameErr ? 'name-error' : undefined}
        />
        {nameErr && <p id="name-error" className="field-error">Name must be at least 2 characters</p>}
      </div>

      <div className="form-field">
        <label htmlFor="contact-email">Email</label>
        <input
          id="contact-email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched((p) => ({ ...p, email: true }))}
          className={emailErr ? 'input-error' : ''}
          aria-invalid={emailErr}
          aria-describedby={emailErr ? 'email-error' : undefined}
        />
        {emailErr && <p id="email-error" className="field-error">Enter a valid email address</p>}
      </div>

      <div className="form-field">
        <label htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          rows={4}
          placeholder="Your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onBlur={() => setTouched((p) => ({ ...p, message: true }))}
          className={messageErr ? 'input-error' : ''}
          aria-invalid={messageErr}
          aria-describedby={messageErr ? 'message-error' : undefined}
        />
        {messageErr && <p id="message-error" className="field-error">Message must be at least 10 characters</p>}
      </div>

      {state === 'error' && (
        <div className="form-error-banner" role="alert">{errorMsg}</div>
      )}

      <button
        type="submit"
        className="btn btn-primary contact-submit"
        disabled={state === 'loading'}
      >
        {state === 'loading' ? (
          <span className="btn-loading">
            <span className="spinner" />
            Sending...
          </span>
        ) : (
          'Send message'
        )}
      </button>
    </form>
  );
};
