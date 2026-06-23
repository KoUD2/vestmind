'use client';
import usePrefersReducedMotion from '@/shared/lib/usePrefersReducedMotion';
import useReveal from '@/shared/lib/useReveal';
import styles from '../Security.module.css';

const COLS = [
  { title: 'Your perimeter', desc: 'Systems run inside your infrastructure and accounts. Nothing leaves without your say.' },
  { title: 'SOC 2 posture', desc: "Controls and audit trail in progress — we'll show you exactly where we are." },
  { title: 'EU AI Act readiness', desc: "Documentation and risk classification built in, so deployment doesn't stall on compliance." },
];

export default function Security() {
  const reduce = usePrefersReducedMotion();
  const sectionRef = useReveal(reduce);

  return (
    <section
      ref={sectionRef}
      data-reveal
      aria-labelledby="sec-h"
      className={styles.section}
      style={{ opacity: 0, translate: '0 34px', transition: 'opacity .7s cubic-bezier(.22,1,.36,1), translate .7s cubic-bezier(.22,1,.36,1)' }}
    >
      <div className={styles.inner}>
        <h2 id="sec-h" className={styles.h2}>
          Own the intelligence{' '}
          <em className={styles.em}>= your data stays yours.</em>
        </h2>
        <div className={styles.grid}>
          {COLS.map((col) => (
            <div key={col.title} className={styles.col}>
              <h3 className={styles.colTitle}>{col.title}</h3>
              <p className={styles.colDesc}>{col.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
