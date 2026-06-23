'use client';
import usePrefersReducedMotion from '@/shared/lib/usePrefersReducedMotion';
import useReveal from '@/shared/lib/useReveal';
import useWordReveal from '@/shared/lib/useWordReveal';
import styles from '../WhoFor.module.css';

function FitCard({ reduce }: { reduce: boolean }) {
  const ref = useReveal<HTMLDivElement>(reduce);
  return (
    <div
      ref={ref}
      data-reveal
      className={styles.fitCard}
      style={{ opacity: 0, translate: '0 24px', transition: 'opacity .6s cubic-bezier(.22,1,.36,1) .05s, translate .6s cubic-bezier(.22,1,.36,1) .05s' }}
    >
      <span aria-hidden="true" className={styles.fitBar} />
      <h3 className={styles.fitTitle}>This is for you if…</h3>
      <ul className={styles.list}>
        <li className={styles.fitItem}>
          <span aria-hidden="true" className={styles.check}><span className={styles.checkMark} /></span>
          <span>You&apos;re a mid-market business with repetitive routine that quietly loses time.</span>
        </li>
        <li className={styles.fitItem}>
          <span aria-hidden="true" className={styles.check}><span className={styles.checkMark} /></span>
          <span>You&apos;re a founder or operator burned by pilots — or simply tired of the hype.</span>
        </li>
        <li className={styles.fitItem}>
          <span aria-hidden="true" className={styles.check}><span className={styles.checkMark} /></span>
          <span>You&apos;d rather pay for an honest answer than another impressive demo.</span>
        </li>
      </ul>
    </div>
  );
}

function NotFitCard({ reduce }: { reduce: boolean }) {
  const ref = useReveal<HTMLDivElement>(reduce);
  return (
    <div
      ref={ref}
      data-reveal
      className={styles.notFitCard}
      style={{ opacity: 0, translate: '0 24px', transition: 'opacity .6s cubic-bezier(.22,1,.36,1) .14s, translate .6s cubic-bezier(.22,1,.36,1) .14s' }}
    >
      <span aria-hidden="true" className={styles.notFitBar} />
      <h3 className={styles.notFitTitle}>Not a fit if…</h3>
      <ul className={styles.list}>
        <li className={styles.fitItem}>
          <span aria-hidden="true" className={styles.dash}><span className={styles.dashMark} /></span>
          <span className={styles.notFitText}>You want a one-off demo to show the board, with no intent to run it.</span>
        </li>
        <li className={styles.fitItem}>
          <span aria-hidden="true" className={styles.dash}><span className={styles.dashMark} /></span>
          <span className={styles.notFitText}>You need the cheapest vendor, not the one accountable for the outcome.</span>
        </li>
        <li className={styles.fitItem}>
          <span aria-hidden="true" className={styles.dash}><span className={styles.dashMark} /></span>
          <span className={styles.notFitText}>There&apos;s no repetitive, measurable work for a system to learn from yet.</span>
        </li>
      </ul>
    </div>
  );
}

export default function WhoFor() {
  const reduce = usePrefersReducedMotion();
  const sectionRef = useReveal(reduce);
  const h2Ref = useWordReveal<HTMLHeadingElement>(null, reduce);

  return (
    <section
      ref={sectionRef}
      data-reveal
      aria-labelledby="fit-h"
      className={styles.section}
      style={{ opacity: 0, translate: '0 34px', transition: 'opacity .7s cubic-bezier(.22,1,.36,1), translate .7s cubic-bezier(.22,1,.36,1)' }}
    >
      <p className={styles.eyebrow}>Who this is for</p>
      <h2 ref={h2Ref} id="fit-h" className={styles.h2}>We&apos;re selective. The equity model demands it.</h2>
      <div className={styles.grid}>
        <FitCard reduce={reduce} />
        <NotFitCard reduce={reduce} />
      </div>
    </section>
  );
}
