'use client';
import usePrefersReducedMotion from '@/shared/lib/usePrefersReducedMotion';
import useReveal from '@/shared/lib/useReveal';
import useCountUp from '@/shared/lib/useCountUp';
import useWordReveal from '@/shared/lib/useWordReveal';
import styles from '../Problem.module.css';

function StatCard({
  target,
  prefix,
  suffix,
  desc,
  delay,
  reduce,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  desc: string;
  delay: string;
  reduce: boolean;
}) {
  const cardRef = useReveal<HTMLDivElement>(reduce);
  const countRef = useCountUp({ target, prefix, suffix, reduce });

  return (
    <div
      ref={cardRef}
      data-reveal
      className={styles.statCard}
      style={{
        opacity: 0,
        translate: '0 28px',
        transition: `opacity .7s cubic-bezier(.22,1,.36,1) ${delay}, translate .7s cubic-bezier(.22,1,.36,1) ${delay}`,
      }}
    >
      <div ref={countRef} className={styles.statNum}>
        {prefix ?? ''}{0}{suffix ?? ''}
      </div>
      <p className={styles.statDesc}>{desc}</p>
    </div>
  );
}

export default function Problem() {
  const reduce = usePrefersReducedMotion();
  const sectionRef = useReveal(reduce);
  const quoteRef = useReveal<HTMLElement>(reduce);
  const h2Ref = useWordReveal<HTMLHeadingElement>(null, reduce);

  return (
    <section
      ref={sectionRef}
      data-reveal
      aria-labelledby="prob-h"
      className={styles.section}
      style={{ opacity: 0, translate: '0 34px', transition: 'opacity .7s cubic-bezier(.22,1,.36,1), translate .7s cubic-bezier(.22,1,.36,1)' }}
    >
      <p className={styles.eyebrow}>Why your AI pilot failed</p>
      <h2 ref={h2Ref} id="prob-h" className={styles.h2}>
        It wasn&apos;t the model. <em className={styles.em}>Nobody got it to production.</em>
      </h2>

      <div className={styles.statsGrid}>
        <StatCard
          target={42}
          suffix="%"
          desc="of companies abandoned most of their AI initiatives in 2025 — up from 17%."
          delay=".05s"
          reduce={reduce}
        />
        <StatCard
          target={88}
          prefix="~"
          suffix="%"
          desc="of AI pilots never make it to production."
          delay=".15s"
          reduce={reduce}
        />
        <StatCard
          target={2}
          suffix="×"
          desc="more likely to deploy with an external partner than an internal build."
          delay=".25s"
          reduce={reduce}
        />
      </div>

      <figure
        ref={quoteRef}
        data-reveal
        className={styles.quote}
        style={{ opacity: 0, translate: '0 28px', transition: 'opacity .7s cubic-bezier(.22,1,.36,1) .1s, translate .7s cubic-bezier(.22,1,.36,1) .1s' }}
      >
        <blockquote className={styles.blockquote}>
          &ldquo;It&apos;s useful the first week, then it just repeats the same mistakes. Why would I use that?&rdquo;
        </blockquote>
        <figcaption className={styles.figcaption}>— A buyer, MIT GenAI study 2025</figcaption>
      </figure>
    </section>
  );
}
