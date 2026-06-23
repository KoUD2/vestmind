'use client';
import usePrefersReducedMotion from '@/shared/lib/usePrefersReducedMotion';
import useReveal from '@/shared/lib/useReveal';
import useWordReveal from '@/shared/lib/useWordReveal';
import styles from '../WhatWeAutomate.module.css';

const USE_CASES = [
  { title: 'Sales', desc: "Qualification, follow-up, proposal drafting — pipeline that doesn't go cold.", delay: '.04s' },
  { title: 'Support', desc: 'Triage, drafted replies, and resolution that learns from every ticket.', delay: '.1s' },
  { title: 'Document workflows', desc: 'Extraction, review, and routing across the paperwork that gates revenue.', delay: '.16s' },
  { title: 'HR', desc: 'Screening, onboarding, and policy answers without the inbox pile-up.', delay: '.22s' },
  { title: 'Procurement', desc: 'Vendor comparison, PO handling, and spend that stays visible.', delay: '.28s' },
];

function UseCase({ title, desc, delay, reduce }: { title: string; desc: string; delay: string; reduce: boolean }) {
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
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDesc}>{desc}</p>
    </div>
  );
}

export default function WhatWeAutomate() {
  const reduce = usePrefersReducedMotion();
  const sectionRef = useReveal(reduce);
  const principleRef = useReveal<HTMLParagraphElement>(reduce);
  const h2Ref = useWordReveal<HTMLHeadingElement>(null, reduce);

  return (
    <section
      ref={sectionRef}
      id="automate"
      data-reveal
      aria-labelledby="auto-h"
      className={styles.section}
      style={{ opacity: 0, translate: '0 34px', transition: 'opacity .7s cubic-bezier(.22,1,.36,1), translate .7s cubic-bezier(.22,1,.36,1)' }}
    >
      <div className={styles.inner}>
        <p className={styles.eyebrow}>What we automate</p>
        <h2 ref={h2Ref} id="auto-h" className={styles.h2}>The repetitive work that quietly drains a mid-market team.</h2>
        <div className={styles.grid}>
          {USE_CASES.map((uc) => (
            <UseCase key={uc.title} {...uc} reduce={reduce} />
          ))}
        </div>
        <p
          ref={principleRef}
          data-reveal
          className={styles.principle}
          style={{ opacity: 0, translate: '0 20px', transition: 'opacity .6s cubic-bezier(.22,1,.36,1) .1s, translate .6s cubic-bezier(.22,1,.36,1) .1s' }}
        >
          AI where it helps. Plain code where it&apos;s enough. Nothing you don&apos;t need.
        </p>
      </div>
    </section>
  );
}
