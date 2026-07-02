'use client';
import type { ReactNode } from 'react';
import usePrefersReducedMotion from '@/shared/lib/usePrefersReducedMotion';
import useReveal from '@/shared/lib/useReveal';
import { useBookAudit } from '@/features/book-audit';
import styles from '../Services.module.css';

const FLAGSHIP_STATS = [
  { num: '8-sec', label: 'reply' },
  { num: '24/7', label: 'always on' },
  { num: 'Warm', label: 'leads only' },
  { num: 'CRM', label: '+ messengers' },
];

const CUSTOM_ROWS = [
  { label: 'Document processing', meta: '48h → 4h' },
  { label: 'Customer support', meta: '24/7' },
  { label: 'HR & recruiting', meta: 'auto-screening' },
  { label: 'Procurement & tenders', meta: 'spec analysis' },
];

function RevealDiv({ delay, reduce, className, children }: { delay: string; reduce: boolean; className: string; children: ReactNode }) {
  const ref = useReveal<HTMLDivElement>(reduce);
  return (
    <div
      ref={ref}
      data-reveal
      className={className}
      style={{
        opacity: 0,
        translate: '0 26px',
        transition: `opacity .7s cubic-bezier(.22,1,.36,1) ${delay}, translate .7s cubic-bezier(.22,1,.36,1) ${delay}`,
      }}
    >
      {children}
    </div>
  );
}

export default function Services() {
  const reduce = usePrefersReducedMotion();
  const sectionRef = useReveal(reduce);
  const { open } = useBookAudit();

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
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Services</p>
            <h2 id="auto-h" className={styles.h2}>Our services</h2>
          </div>
          <p className={styles.headerNote}>Every engagement includes a free audit and post-launch support.</p>
        </div>

        <div className={styles.grid}>
          {/* CARD 1 · FLAGSHIP */}
          <RevealDiv delay=".05s" reduce={reduce} className={`${styles.card} ${styles.cardDark}`}>
            <span className={`${styles.badge} ${styles.badgeFlagship}`}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M13 2L4.5 13.5H11L10 22L19.5 10H12.5L13 2Z" fill="#fffdf9" />
              </svg>
              Flagship
            </span>
            <h3 className={`${styles.cardTitle} ${styles.cardTitleDark}`}>AI salesperson</h3>
            <p className={`${styles.cardDesc} ${styles.cardDescDark}`}>Qualifies, replies, closes — on your script, in your channels, 24/7.</p>
            <div className={styles.statGrid}>
              {FLAGSHIP_STATS.map((s) => (
                <div key={s.num} className={styles.stat}>
                  <span className={styles.statNum}>{s.num}</span>
                  <p className={styles.statLabel}>{s.label}</p>
                </div>
              ))}
            </div>
            <button type="button" className={`${styles.btn} ${styles.btnFlagship}`} onClick={(e) => open(e.currentTarget)}>
              Book an audit <span className={styles.arrow} aria-hidden="true">→</span>
            </button>
          </RevealDiv>

          {/* CARD 2 · CUSTOM */}
          <RevealDiv delay=".16s" reduce={reduce} className={`${styles.card} ${styles.cardLight}`}>
            <span className={`${styles.badge} ${styles.badgeCustom}`}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 3l2.1 4.6L19 8.3l-3.5 3.4.9 4.9L12 14.3 7.6 16.6l.9-4.9L5 8.3l4.9-.7L12 3z" stroke="#a8763e" strokeWidth="1.6" strokeLinejoin="round" />
              </svg>
              Custom
            </span>
            <h3 className={`${styles.cardTitle} ${styles.cardTitleLight}`}>Custom AI employee</h3>
            <p className={`${styles.cardDesc} ${styles.cardDescLight}`}>Any process where your business loses time.</p>
            <ul className={styles.rowList}>
              {CUSTOM_ROWS.map((r) => (
                <li key={r.label} className={styles.row}>
                  <span className={styles.rowLabel}>{r.label}</span>
                  <span className={styles.rowMeta}>{r.meta}</span>
                </li>
              ))}
            </ul>
            <button type="button" className={`${styles.btn} ${styles.btnCustom}`} onClick={(e) => open(e.currentTarget, 'Other')}>
              Discuss your case <span className={styles.arrow} aria-hidden="true">→</span>
            </button>
          </RevealDiv>
        </div>
      </div>
    </section>
  );
}
