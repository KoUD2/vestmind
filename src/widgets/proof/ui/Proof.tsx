'use client';
import CanvasFx from '@/shared/ui/CanvasFx';
import usePrefersReducedMotion from '@/shared/lib/usePrefersReducedMotion';
import useReveal from '@/shared/lib/useReveal';
import useWordReveal from '@/shared/lib/useWordReveal';
import styles from '../Proof.module.css';

const FLOW2_CFG = { color: '168,118,62', baseA: 0.03, peakA: 0.12 };

const MECHANISMS = [
  { label: 'Deployment', text: <>External partnerships reach deployment <em className={styles.em}>~2×</em> vs internal builds.</>, delay: '.05s' },
  { label: 'Cadence', text: <>Results <em className={styles.em}>every week</em> — not at the end.</>, delay: '.12s' },
  { label: 'Rollout', text: <>We launch on a <em className={styles.em}>small group</em> first.</>, delay: '.19s' },
];

function MechCard({ label, text, delay, reduce }: { label: string; text: React.ReactNode; delay: string; reduce: boolean }) {
  const ref = useReveal<HTMLDivElement>(reduce);
  return (
    <div
      ref={ref}
      data-reveal
      className={styles.card}
      style={{
        opacity: 0,
        translate: '0 24px',
        transition: `opacity .6s cubic-bezier(.22,1,.36,1) ${delay}, translate .6s cubic-bezier(.22,1,.36,1) ${delay}`,
      }}
    >
      <span className={styles.cardLabel}>
        <span aria-hidden="true" className={styles.dot} />
        {label}
      </span>
      <p className={styles.cardText}>{text}</p>
    </div>
  );
}

export default function Proof() {
  const reduce = usePrefersReducedMotion();
  const sectionRef = useReveal(reduce);
  const deRiskRef = useReveal<HTMLParagraphElement>(reduce);
  const h2Ref = useWordReveal<HTMLHeadingElement>(null, reduce);

  return (
    <section
      ref={sectionRef}
      data-reveal
      aria-labelledby="proof-h"
      className={styles.section}
      style={{ opacity: 0, translate: '0 34px', transition: 'opacity .7s cubic-bezier(.22,1,.36,1), translate .7s cubic-bezier(.22,1,.36,1)' }}
    >
      <CanvasFx variant="flow" cfg={FLOW2_CFG} />
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Proof</p>
        <h2 ref={h2Ref} id="proof-h" className={styles.h2}>Early-stage and honest. We lead with mechanism, not logos.</h2>
        <div className={styles.grid}>
          {MECHANISMS.map((m) => (
            <MechCard key={m.label} {...m} reduce={reduce} />
          ))}
        </div>
        <p
          ref={deRiskRef}
          data-reveal
          className={styles.deRisk}
          style={{ opacity: 0, translate: '0 20px', transition: 'opacity .6s cubic-bezier(.22,1,.36,1) .1s, translate .6s cubic-bezier(.22,1,.36,1) .1s' }}
        >
          De-risked by design: a fixed-price audit before any build, transparent dashboards once we&apos;re live, and a staged rollout so nothing ships to everyone before it&apos;s earned.
        </p>
      </div>
    </section>
  );
}
