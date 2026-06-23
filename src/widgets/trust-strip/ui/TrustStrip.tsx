'use client';
import usePrefersReducedMotion from '@/shared/lib/usePrefersReducedMotion';
import useReveal from '@/shared/lib/useReveal';
import styles from '../TrustStrip.module.css';

export default function TrustStrip() {
  const reduce = usePrefersReducedMotion();
  const ref = useReveal(reduce);

  return (
    <section
      ref={ref}
      data-reveal
      aria-label="Built on"
      className={styles.section}
      style={{ opacity: 0, translate: '0 34px', transition: 'opacity .7s cubic-bezier(.22,1,.36,1), translate .7s cubic-bezier(.22,1,.36,1)' }}
    >
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.builtOn}>Built on</span>
          <span className={styles.partners}>
            Anthropic<span className={styles.dot}>·</span>OpenAI<span className={styles.dot}>·</span>AWS
          </span>
        </div>
        <p className={styles.tagline}>
          The forward-deployed model Palantir and OpenAI use to put AI into real operations — not slideware.
        </p>
      </div>
    </section>
  );
}
