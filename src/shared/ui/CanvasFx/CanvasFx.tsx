'use client';
import { useEffect, useRef } from 'react';
import usePrefersReducedMotion from '@/shared/lib/usePrefersReducedMotion';
import { initOrb, initFlow, initPulse, OrbCfg, FlowCfg } from './fx';

interface CanvasFxProps {
  variant: 'orb' | 'flow' | 'pulse';
  cfg?: OrbCfg | FlowCfg;
}

const CanvasFx = ({ variant, cfg }: CanvasFxProps) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const rafs: Array<{ id: number }> = [];
    const resizers: Array<() => void> = [];

    if (variant === 'orb') {
      initOrb(canvas, cfg as OrbCfg, rafs, resizers, reduce);
    } else if (variant === 'flow') {
      initFlow(canvas, cfg as FlowCfg, rafs, resizers, reduce);
    } else if (variant === 'pulse') {
      initPulse(canvas, rafs, resizers, reduce);
    }

    return () => {
      rafs.forEach((s) => cancelAnimationFrame(s.id));
      resizers.forEach((fn) => window.removeEventListener('resize', fn));
    };
  }, [variant, cfg, reduce]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

export default CanvasFx;
