'use client';
import usePrefersReducedMotion from '@/shared/lib/usePrefersReducedMotion';
import useReveal from '@/shared/lib/useReveal';
import styles from '../Faq.module.css';

const FAQS = [
  {
    q: 'Will this be another failed project?',
    a: 'We reach production (~2× vs internal builds), show results weekly, and launch on a small group before anything goes wide.',
  },
  {
    q: "I don't believe the AI hype.",
    a: "Good — neither do we. Our paid audit tells you where AI pays off and where it doesn't. We won't sell what won't work.",
  },
  {
    q: "Won't it just repeat the same mistakes?",
    a: 'Our systems learn on your data and stop repeating mistakes — the difference between a wrapper and intelligence you own.',
  },
  {
    q: 'Is it expensive or unpredictable?',
    a: 'A fixed-price audit with a real dollar-loss calculation comes first. You pay for outcomes, not surprises.',
  },
  {
    q: 'What about data security?',
    a: 'Owning the intelligence means your data stays yours, inside your perimeter. We build to your security posture, not ours.',
  },
  {
    q: "You're remote / not US-based?",
    a: 'We operate through a foreign legal entity, work transparently, and prove results — the partnership stands on output, not postcode.',
  },
];

function FaqItem({ q, a, delay, reduce }: { q: string; a: string; delay: string; reduce: boolean }) {
  const ref = useReveal<HTMLDetailsElement>(reduce);
  return (
    <details
      ref={ref}
      data-reveal
      className={styles.item}
      style={{
        opacity: 0,
        translate: '0 20px',
        transition: `opacity .6s cubic-bezier(.22,1,.36,1) ${delay}, translate .6s cubic-bezier(.22,1,.36,1) ${delay}`,
      }}
    >
      <summary className={styles.summary}>
        <span className={styles.question}>{q}</span>
        <span className={`${styles.icon} rotateIcon`} aria-hidden="true">+</span>
      </summary>
      <p className={styles.answer}>{a}</p>
    </details>
  );
}

export default function Faq() {
  const reduce = usePrefersReducedMotion();
  const sectionRef = useReveal(reduce);

  return (
    <section
      ref={sectionRef}
      data-reveal
      aria-labelledby="faq-h"
      className={styles.section}
      style={{ opacity: 0, translate: '0 34px', transition: 'opacity .7s cubic-bezier(.22,1,.36,1), translate .7s cubic-bezier(.22,1,.36,1)' }}
    >
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Questions, answered straight</p>
        <h2 id="faq-h" className={styles.h2}>FAQ</h2>
        <div className={styles.list}>
          {FAQS.map((faq, i) => (
            <FaqItem
              key={faq.q}
              q={faq.q}
              a={faq.a}
              delay={`${(i * 0.07).toFixed(2)}s`}
              reduce={reduce}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
