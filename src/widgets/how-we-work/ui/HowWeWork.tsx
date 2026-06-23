'use client';
import { useRef, useEffect } from 'react';
import usePrefersReducedMotion from '@/shared/lib/usePrefersReducedMotion';
import useReveal from '@/shared/lib/useReveal';
import useWordReveal from '@/shared/lib/useWordReveal';
import styles from '../HowWeWork.module.css';

function Card({
  num,
  title,
  desc,
  price,
  dark,
  delay,
  reduce,
}: {
  num: string;
  title: React.ReactNode;
  desc: React.ReactNode;
  price: string;
  dark?: boolean;
  delay: string;
  reduce: boolean;
  children?: React.ReactNode;
}) {
  const ref = useReveal<HTMLLIElement>(reduce);
  return (
    <li
      ref={ref}
      data-reveal
      className={dark ? styles.cardDark : styles.card}
      style={{
        opacity: 0,
        translate: '0 28px',
        transition: `opacity .7s cubic-bezier(.22,1,.36,1) ${delay}, translate .7s cubic-bezier(.22,1,.36,1) ${delay}`,
      }}
    >
      <span className={dark ? styles.numDark : styles.num}>{num}</span>
      <h3 className={dark ? styles.titleDark : styles.title}>{title}</h3>
      <p className={dark ? styles.descDark : styles.desc}>{desc}</p>
      <p className={dark ? styles.priceDark : styles.price}>{price}</p>
    </li>
  );
}

export default function HowWeWork() {
  const reduce = usePrefersReducedMotion();
  const sectionRef = useReveal(reduce);
  const pipelineWrapRef = useReveal<HTMLDivElement>(reduce);
  const pipelineLineRef = useRef<SVGLineElement>(null);
  const h2Ref = useWordReveal<HTMLHeadingElement>(null, reduce);

  useEffect(() => {
    const wrap = pipelineWrapRef.current;
    const line = pipelineLineRef.current;
    if (!wrap || !line) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            line.style.strokeDashoffset = '0';
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, [pipelineWrapRef]);

  return (
    <section
      ref={sectionRef}
      id="how"
      data-reveal
      aria-labelledby="how-h"
      className={styles.section}
      style={{ opacity: 0, translate: '0 34px', transition: 'opacity .7s cubic-bezier(.22,1,.36,1), translate .7s cubic-bezier(.22,1,.36,1)' }}
    >
      <p className={styles.eyebrow}>How we work</p>
      <h2 ref={h2Ref} id="how-h" className={styles.h2}>An offer ladder, not a deck. Each step earns the next.</h2>

      <div
        ref={pipelineWrapRef}
        data-reveal
        className={styles.pipeline}
        style={{ opacity: 0, translate: '0 20px', transition: 'opacity .7s cubic-bezier(.22,1,.36,1) .1s, translate .7s cubic-bezier(.22,1,.36,1) .1s' }}
      >
        <div className={styles.pipelineLabels}>
          <span>Pilot</span><span>Production</span>
        </div>
        <svg viewBox="0 0 1000 8" preserveAspectRatio="none" className={styles.pipelineSvg} aria-hidden="true">
          <line x1="0" y1="4" x2="1000" y2="4" stroke="#e3ded4" strokeWidth="2" />
          <line
            ref={pipelineLineRef}
            data-pipeline
            x1="0" y1="4" x2="1000" y2="4"
            stroke="#a8763e"
            strokeWidth="2"
            strokeDasharray="1000"
            strokeDashoffset="1000"
            style={{ transition: reduce ? 'none' : 'stroke-dashoffset 1.7s cubic-bezier(.22,1,.36,1)' }}
          />
        </svg>
      </div>

      <ol className={styles.cards}>
        <Card num="01" title="Audit" desc={<>We map your processes, calculate where you lose money, and tell you honestly where AI is <em className={styles.emDesc}>not</em> worth it.</>} price="~$500, credited toward the build." delay=".05s" reduce={reduce} />
        <Card num="02" title="Build" desc="Discovery → MVP → an embedded agent system wired into your workflow." price="Setup fee, scoped to complexity." delay=".13s" reduce={reduce} />
        <Card num="03" title="Run & Own" desc="The system keeps learning on your data and compounds. You own the intelligence." price="Monthly retainer $3–8K." delay=".21s" reduce={reduce} />
        <Card
          num="04"
          title={<>Equity <span className={styles.selective}>(selective)</span></>}
          desc="For a select few: we co-build a niche product on your processes and grow with you."
          price="Equity."
          dark
          delay=".29s"
          reduce={reduce}
        />
      </ol>
    </section>
  );
}
