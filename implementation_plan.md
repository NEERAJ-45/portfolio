# Implementation Plan - Smooth Animations Upgrade

## Library Recommendation

| Library | Size | Best For | Verdict |
|---|---|---|---|
| **GSAP** | Already installed | Timeline sequences, DOM tweens, scroll-linked | ✅ Use — already in project |
| **Framer Motion** | ~50KB | React mount/unmount transitions, spring physics | ✅ Install — best for menu overlay |
| **Anime.js** | ~17KB | DOM tweens, SVG | ❌ Skip — fully redundant with GSAP already present |

**Recommendation:** Use **GSAP** (already installed) for all element/timeline animations, and add **Framer Motion** specifically for React component mount/unmount (menu overlay `AnimatePresence`, menu item stagger). This gives us physics-based spring animations on the menu that CSS and Anime.js both lack.

## Goal Description
Replace CSS `transition` and `@keyframes` animations with GSAP timelines and Framer Motion springs for silky-smooth mobile and desktop animations.

## Dependencies
- Install `framer-motion`

## Proposed Changes

### [MODIFY] [page.tsx](file:///e:/Study/Main-Content/SigmaWebDev/SigmaWebDev/PROJECTS/Mini-Projects/portfolio/src/app/page.tsx)
1. **Menu overlay** — Replace static `<div className="fullscreen-menu">` with Framer Motion `<AnimatePresence>` + `<motion.div>` using `spring` variants (`damping: 30, stiffness: 250`).
2. **Menu items** — Replace `<span>` inside `.menu-item` with `<motion.span>` + `staggerChildren: 0.07` for a smooth cascade.
3. **Menu meta** — `<motion.div>` fade-up with spring.
4. **Hamburger ✕ morph** — Replace CSS transitions with a GSAP timeline: `gsap.to(line1, { rotate: 45, y: 8 })` + `gsap.to(line2, { rotate: -45, y: -8 })`.
5. **Scroll cue drip** — Replace `@keyframes scrollDrip` with a GSAP infinite timeline: `gsap.fromTo(scrollLineAfter, { yPercent: -100 }, { yPercent: 100, duration: 1.8, ease: 'power2.inOut', repeat: -1 })`.

### [MODIFY] [globals.css](file:///e:/Study/Main-Content/SigmaWebDev/SigmaWebDev/PROJECTS/Mini-Projects/portfolio/src/app/globals.css)
- Remove `.fullscreen-menu` opacity/visibility CSS transitions.
- Remove `.menu-item span` transform transitions.
- Remove `.menu-line` CSS transitions.
- Remove `@keyframes scrollDrip` and `.scroll-line::after` CSS animation.

## Verification Plan
### Automated Tests
- `npm run build` — verify compilation success.

### Manual Verification
- Open menu on mobile — spring physics overlay.
- Tap menu items — stagger cascade.
- Tap hamburger — GSAP ✕ morph.
- Scroll — GSAP drip on scroll cue.
