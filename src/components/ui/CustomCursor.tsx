'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorFollowerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursorDot = cursorDotRef.current;
    const cursorFollower = cursorFollowerRef.current;
    if (!cursorDot || !cursorFollower) return;

    let mouseX = -100, mouseY = -100, followerX = -100, followerY = -100;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    };
    window.addEventListener('mousemove', onMouseMove);

    const animateFollower = () => {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;
      cursorFollower.style.left = `${followerX}px`;
      cursorFollower.style.top = `${followerY}px`;
      requestAnimationFrame(animateFollower);
    };
    requestAnimationFrame(animateFollower);

    const handleMouseEnter = () => document.body.classList.add('cursor-hovering');
    const handleMouseLeave = () => document.body.classList.remove('cursor-hovering');

    const addListeners = () => {
      document.querySelectorAll('a, button, .btn, .project-card, .badge, .menu-toggle').forEach((el) => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });
    };
    addListeners();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.querySelectorAll('a, button, .btn, .project-card, .badge, .menu-toggle').forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <div ref={cursorDotRef} className="custom-cursor" />
      <div ref={cursorFollowerRef} className="custom-cursor-follower" />
    </>
  );
}
