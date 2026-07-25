'use client';

import { AnimatePresence, motion } from 'framer-motion';

interface FullscreenMenuProps {
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
}

const items = [
  { href: '#skills',     label: '01 · Toolbox' },
  { href: '#experience', label: '02 · Journey' },
  { href: '#projects',   label: '03 · Work'    },
  { href: '#contact',    label: '04 · Contact'  },
];

export default function FullscreenMenu({ menuOpen, setMenuOpen }: FullscreenMenuProps) {
  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.div className="fullscreen-menu is-open"
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => setMenuOpen(false)}
        >
          <motion.div className="menu-container"
            onClick={(e) => e.stopPropagation()}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
              hidden:  { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
            }}
          >
            {items.map(({ href, label }) => (
              <a key={href} href={href} className="menu-item" data-nav onClick={() => setMenuOpen(false)}>
                <motion.span
                  variants={{
                    hidden:  { y: '110%', opacity: 0 },
                    visible: { y: '0%',   opacity: 1, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
                  }}
                >
                  {label}
                </motion.span>
              </a>
            ))}
            <motion.div className="menu-meta"
              variants={{
                hidden:  { opacity: 0, y: 16 },
                visible: { opacity: 0.6, y: 0, transition: { duration: 0.5, delay: 0.35, ease: 'easeOut' } },
              }}
            >
              NEERAJ SURNIS — MAHARASHTRA, INDIA
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
