'use client';
import { useEffect, useRef } from 'react';

const useWordReveal = <T extends HTMLElement = HTMLElement>(heroId: string | null, reduce: boolean) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const elAny = el as HTMLElement & { _wrapped?: boolean };
    if (elAny._wrapped) return;
    elAny._wrapped = true;

    const nodes = [...el.childNodes];
    el.textContent = '';
    const units: Element[] = [];

    nodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || '';
        text.split(/(\s+)/).forEach((part) => {
          if (part === '') return;
          if (/^\s+$/.test(part)) {
            el.appendChild(document.createTextNode(part));
            return;
          }
          const s = document.createElement('span');
          s.textContent = part;
          s.style.display = 'inline-block';
          units.push(s);
          el.appendChild(s);
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const elem = node as HTMLElement;
        elem.style.display = 'inline-block';
        units.push(elem);
        el.appendChild(elem);
      } else {
        // comment/other nodes (e.g. React's text-separator markers) — keep, don't style
        el.appendChild(node);
      }
    });

    units.forEach((u, i) => {
      const d = (i * 0.045).toFixed(3);
      const uh = u as HTMLElement;
      uh.style.opacity = '0';
      uh.style.transform = 'translateY(0.5em)';
      uh.style.filter = 'blur(9px)';
      uh.style.willChange = 'transform, opacity, filter';
      uh.style.transition = `opacity .65s cubic-bezier(.22,1,.36,1) ${d}s, transform .65s cubic-bezier(.22,1,.36,1) ${d}s, filter .65s cubic-bezier(.22,1,.36,1) ${d}s`;
    });

    const revealAll = () => {
      Array.from(el.children).forEach((u) => {
        const uh = u as HTMLElement;
        uh.style.opacity = '1';
        uh.style.transform = 'none';
        uh.style.filter = 'blur(0)';
      });
    };

    if (reduce) {
      revealAll();
      return;
    }

    const isHero = heroId !== null && el.id === heroId;

    if (isHero) {
      const t = setTimeout(revealAll, 160);
      return () => clearTimeout(t);
    } else {
      const wio = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              revealAll();
              wio.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.35 }
      );
      wio.observe(el);
      const safetyTimer = setTimeout(revealAll, 1900);
      return () => {
        wio.disconnect();
        clearTimeout(safetyTimer);
      };
    }
  }, [heroId, reduce]);

  return ref;
};

export default useWordReveal;
