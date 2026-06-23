'use client';
import CanvasFx from '@/shared/ui/CanvasFx';
import usePrefersReducedMotion from '@/shared/lib/usePrefersReducedMotion';
import useReveal from '@/shared/lib/useReveal';
import useWordReveal from '@/shared/lib/useWordReveal';
import styles from '../WhyNow.module.css';

const FLOW_CFG = { color: '247,245,240', baseA: 0.025, peakA: 0.08 };

export default function WhyNow() {
  const reduce = usePrefersReducedMotion();
  const sectionRef = useReveal(reduce);
  const wordRef = useWordReveal<HTMLParagraphElement>(null, reduce);

  return (
    <section
      ref={sectionRef}
      data-reveal
      aria-label="Why now"
      className={styles.section}
      style={{ opacity: 0, translate: '0 34px', transition: 'opacity .7s cubic-bezier(.22,1,.36,1), translate .7s cubic-bezier(.22,1,.36,1)' }}
    >
      <CanvasFx variant="flow" cfg={FLOW_CFG} />
      <div className={styles.inner}>
        <p
          ref={wordRef}
          className={styles.text}
        >
          AI budgets moved from{' '}
          <em className={styles.em}>&ldquo;experiments&rdquo;</em>
          {' '}to{' '}
          <em className={styles.em}>&ldquo;operations.&rdquo;</em>
          {' '}Now they have to pay back. We make them.
        </p>
      </div>
    </section>
  );
}
