'use client';
import { useEffect, useRef } from 'react';

interface CountUpOptions {
  target: number;
  prefix?: string;
  suffix?: string;
  reduce: boolean;
}

const useCountUp = ({ target, prefix = '', suffix = '', reduce }: CountUpOptions) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduce) {
      el.textContent = `${prefix}${target}${suffix}`;
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            io.unobserve(entry.target);
            const dur = 1100;
            const start = performance.now();
            const tick = (now: number) => {
              const t = Math.min(1, (now - start) / dur);
              const e = 1 - Math.pow(1 - t, 3);
              el.textContent = `${prefix}${Math.round(e * target)}${suffix}`;
              if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.6 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [target, prefix, suffix, reduce]);

  return ref;
};

export default useCountUp;
