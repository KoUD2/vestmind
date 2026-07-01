'use client';
import CanvasFx from '@/shared/ui/CanvasFx';
import useMagnetic from '@/shared/lib/useMagnetic';
import usePrefersReducedMotion from '@/shared/lib/usePrefersReducedMotion';
import useWordReveal from '@/shared/lib/useWordReveal';
import { useBookAudit } from '@/features/book-audit';
import styles from '../Hero.module.css';

const ORB_CFG = { fx: 0.72, fy: 0.46, rw: 0.24, rh: 0.30 };

export default function Hero() {
  const reduce = usePrefersReducedMotion();
  const { open } = useBookAudit();
  const magneticRef = useMagnetic<HTMLAnchorElement>();
  const h1Ref = useWordReveal<HTMLHeadingElement>('hero-h', reduce);

  return (
    <section
      aria-labelledby="hero-h"
      className={styles.section}
    >
      <CanvasFx variant="orb" cfg={ORB_CFG} />
      <div className={styles.content}>
        <p className={styles.eyebrow} style={{ animation: reduce ? 'none' : 'riseUp .7s cubic-bezier(.22,1,.36,1) .05s both' }}>
          Rent the model. Own the intelligence.
        </p>
        <h1 ref={h1Ref} id="hero-h" className={styles.h1}>
          Most AI dies between the demo and production.{' '}
          <em className={styles.heroEm}>We live there.</em>
        </h1>
        <p className={styles.subhead} style={{ animation: reduce ? 'none' : 'riseUp .8s cubic-bezier(.22,1,.36,1) .34s both' }}>
          Vestmind is a forward-deployed AI studio. We embed in your team, find where you actually lose time, and ship AI systems that reach production — and stop repeating the same mistakes.
        </p>
        <div className={styles.ctas} style={{ animation: reduce ? 'none' : 'riseUp .8s cubic-bezier(.22,1,.36,1) .5s both' }}>
          <a
            ref={magneticRef}
            href="#book"
            data-btn
            className={styles.ctaPrimary}
            onClick={(e) => { e.preventDefault(); open(e.currentTarget); }}
          >
            Book a paid audit
          </a>
          <a href="#how" data-arrowlink className={styles.ctaSecondary}>
            See how we work <span data-arrow aria-hidden="true">→</span>
          </a>
        </div>
        <p className={styles.micro} style={{ animation: reduce ? 'none' : 'riseUp .8s cubic-bezier(.22,1,.36,1) .66s both' }}>
          A fixed-price audit, a real dollar-loss calculation, and an honest answer on where AI is — and isn&apos;t — worth it.
        </p>
      </div>
    </section>
  );
}
