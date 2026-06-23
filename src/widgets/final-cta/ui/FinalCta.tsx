'use client';
import CanvasFx from '@/shared/ui/CanvasFx';
import usePrefersReducedMotion from '@/shared/lib/usePrefersReducedMotion';
import useReveal from '@/shared/lib/useReveal';
import useMagnetic from '@/shared/lib/useMagnetic';
import useWordReveal from '@/shared/lib/useWordReveal';
import styles from '../FinalCta.module.css';

export default function FinalCta() {
  const reduce = usePrefersReducedMotion();
  const sectionRef = useReveal(reduce);
  const magneticRef = useMagnetic<HTMLAnchorElement>();
  const h2Ref = useWordReveal<HTMLHeadingElement>(null, reduce);

  return (
    <section
      ref={sectionRef}
      id="book"
      data-reveal
      aria-labelledby="cta-h"
      className={styles.section}
      style={{ opacity: 0, translate: '0 34px', transition: 'opacity .7s cubic-bezier(.22,1,.36,1), translate .7s cubic-bezier(.22,1,.36,1)' }}
    >
      <CanvasFx variant="pulse" />
      <div className={styles.inner}>
        <h2 ref={h2Ref} id="cta-h" className={styles.h2}>
          Find where you lose time.{' '}
          <em className={styles.em}>Then ship the fix.</em>
        </h2>
        <p className={styles.subtext}>
          A small senior team sits inside your business, finds where you lose time, and builds AI that ships — and stays.
        </p>
        <div className={styles.btnWrap}>
          <a
            ref={magneticRef}
            href="mailto:hello@vestmind.studio"
            data-btn
            className={styles.btn}
          >
            Book a paid audit
          </a>
        </div>
      </div>
    </section>
  );
}
