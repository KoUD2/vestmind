'use client';
import CanvasFx from '@/shared/ui/CanvasFx';
import usePrefersReducedMotion from '@/shared/lib/usePrefersReducedMotion';
import useReveal from '@/shared/lib/useReveal';
import useWordReveal from '@/shared/lib/useWordReveal';
import styles from '../WhyUs.module.css';

const ORB2_CFG = { fx: 1, fy: 0, rw: 0.26, rh: 0.5, cell: 13, ambient: false };

const MOATS = [
  { num: '01', title: 'Embedded in your processes', desc: 'We sit inside your team, with access to your proprietary data — not over a wall.', delay: '.04s' },
  { num: '02', title: 'Speed & quality', desc: '3× faster and cheaper than classic studios.', delay: '.1s' },
  { num: '03', title: 'We reach production', desc: '~2× more likely to deploy than internal builds. Not slideware.', delay: '.16s' },
  { num: '04', title: 'Own the intelligence', desc: 'Your data stays yours; the intelligence compounds every day it runs.', delay: '.22s' },
  { num: '05', title: 'Anti-hype as mechanic', desc: <>Our paid audit tells you where AI is <em className={styles.em}>not</em> needed.</>, delay: '.28s' },
];

function MoatRow({ num, title, desc, delay, reduce }: { num: string; title: string; desc: React.ReactNode; delay: string; reduce: boolean }) {
  const ref = useReveal<HTMLLIElement>(reduce);
  return (
    <li
      ref={ref}
      data-reveal
      className={styles.row}
      style={{
        opacity: 0,
        translate: '0 22px',
        transition: `opacity .6s cubic-bezier(.22,1,.36,1) ${delay}, translate .6s cubic-bezier(.22,1,.36,1) ${delay}`,
      }}
    >
      <span className={styles.rowNum}>{num}</span>
      <h3 className={styles.rowTitle}>{title}</h3>
      <p className={styles.rowDesc}>{desc}</p>
    </li>
  );
}

export default function WhyUs() {
  const reduce = usePrefersReducedMotion();
  const sectionRef = useReveal(reduce);
  const h2Ref = useWordReveal<HTMLHeadingElement>(null, reduce);

  return (
    <section
      ref={sectionRef}
      id="why"
      data-reveal
      aria-labelledby="why-h"
      className={styles.section}
      style={{ opacity: 0, translate: '0 34px', transition: 'opacity .7s cubic-bezier(.22,1,.36,1), translate .7s cubic-bezier(.22,1,.36,1)' }}
    >
      <CanvasFx variant="orb" cfg={ORB2_CFG} />
      <div className={styles.content}>
        <p className={styles.eyebrow}>Why us</p>
        <h2 ref={h2Ref} id="why-h" className={styles.h2}>The moat is in how we work, not the model we rent.</h2>
        <ol className={styles.list}>
          {MOATS.map((m) => (
            <MoatRow key={m.num} {...m} reduce={reduce} />
          ))}
        </ol>
      </div>
    </section>
  );
}
