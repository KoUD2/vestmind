'use client';
import { useEffect, useRef } from 'react';

const useReveal = <T extends HTMLElement = HTMLElement>(reduce: boolean) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduce) {
      el.style.opacity = '1';
      el.style.translate = '0 0';
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.style.opacity = '1';
            el.style.translate = '0 0';
            if (el.tagName !== 'SECTION') {
              el.animate(
                [{ filter: 'blur(7px)' }, { filter: 'blur(0)' }],
                { duration: 780, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' }
              );
            }
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -7% 0px' }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  return ref;
};

export default useReveal;
