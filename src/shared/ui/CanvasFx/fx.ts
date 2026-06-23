export interface OrbCfg {
  fx: number;
  fy: number;
  rw: number;
  rh: number;
  cell?: number;
  ambient?: boolean;
}

export interface FlowCfg {
  color: string;
  baseA: number;
  peakA: number;
}

interface RafState {
  id: number;
}

export function initPulse(
  canvas: HTMLCanvasElement,
  rafs: RafState[],
  resizers: Array<() => void>,
  reduce: boolean
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const cell = 16;
  let w = 0, h = 0, cols = 0, rows = 0, cx = 0, cy = 0, maxR = 1;
  const spacing = 82;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    if (!w || !h) return;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(w / cell);
    rows = Math.ceil(h / cell);
    cx = w / 2;
    cy = h * 0.42;
    maxR = Math.hypot(w, h) / 2;
  };
  resize();
  resizers.push(resize);
  window.addEventListener('resize', resize);

  const st: RafState = { id: 0 };
  rafs.push(st);

  const draw = (time: number) => {
    if (!w || !h) { st.id = requestAnimationFrame(draw); return; }
    ctx.clearRect(0, 0, w, h);
    const t = time * 0.001;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * cell + cell / 2;
        const y = j * cell + cell / 2;
        const r = Math.hypot(x - cx, y - cy);
        const phase = r / spacing - t * 0.5;
        const fp = phase - Math.floor(phase);
        const ring = Math.max(0, 1 - fp * 3);
        const fade = Math.max(0, 1 - r / maxR);
        const a = 0.045 + 0.3 * ring * fade;
        const s = 2 + 1.8 * ring;
        ctx.fillStyle = `rgba(168,118,62,${a.toFixed(3)})`;
        ctx.fillRect(x - s / 2, y - s / 2, s, s);
      }
    }
    if (!reduce) st.id = requestAnimationFrame(draw);
  };

  if (reduce) draw(1000);
  else st.id = requestAnimationFrame(draw);
}

export function initFlow(
  canvas: HTMLCanvasElement,
  cfg: FlowCfg,
  rafs: RafState[],
  resizers: Array<() => void>,
  reduce: boolean
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const cell = 19;
  const { color, baseA, peakA } = cfg;
  let w = 0, h = 0, cols = 0, rows = 0;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    if (!w || !h) return;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(w / cell);
    rows = Math.ceil(h / cell);
  };
  resize();
  resizers.push(resize);
  window.addEventListener('resize', resize);

  const st: RafState = { id: 0 };
  rafs.push(st);

  const draw = (time: number) => {
    if (!w || !h) { st.id = requestAnimationFrame(draw); return; }
    ctx.clearRect(0, 0, w, h);
    const t = time * 0.001;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * cell + cell / 2;
        const y = j * cell + cell / 2;
        const ph = Math.sin(x * 0.011 + y * 0.02 - t * 1.05);
        const b = Math.max(0, ph);
        const a = baseA + peakA * b * b;
        const s = 2 + 2.2 * b;
        ctx.fillStyle = `rgba(${color},${a.toFixed(3)})`;
        ctx.fillRect(x - s / 2, y - s / 2, s, s);
      }
    }
    if (!reduce) st.id = requestAnimationFrame(draw);
  };

  if (reduce) draw(800);
  else st.id = requestAnimationFrame(draw);
}

export function initOrb(
  canvas: HTMLCanvasElement,
  cfg: OrbCfg,
  rafs: RafState[],
  resizers: Array<() => void>,
  reduce: boolean
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const cell = cfg.cell ?? 15;
  const ambient = cfg.ambient !== false;
  let w = 0, h = 0, cols = 0, rows = 0, cx = 0, cy = 0, R = 0;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    if (!w || !h) return;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(w / cell);
    rows = Math.ceil(h / cell);
    cx = w * cfg.fx;
    cy = h * cfg.fy;
    R = Math.min(w * cfg.rw, h * cfg.rh);
  };
  resize();
  resizers.push(resize);
  window.addEventListener('resize', resize);

  const hash = (x: number, y: number): number => {
    const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return n - Math.floor(n);
  };

  const st: RafState = { id: 0 };
  rafs.push(st);

  const draw = (time: number) => {
    if (!w || !h) { st.id = requestAnimationFrame(draw); return; }
    ctx.clearRect(0, 0, w, h);
    const t = time * 0.001;
    const dot = 1.1;
    const sq = cell * 0.6;
    const Rb = R * (1 + 0.04 * Math.sin(t * 0.7));
    const scanAng = t * 0.45 + cfg.fx * 3;
    const tb = Math.floor(t * 2);
    const TWO = Math.PI * 2;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * cell + cell / 2;
        const y = j * cell + cell / 2;
        const dx = x - cx;
        const dy = y - cy;
        const r = Math.hypot(dx, dy);

        if (r > Rb * 1.14) {
          if (ambient) {
            ctx.fillStyle = 'rgba(168,118,62,0.06)';
            ctx.fillRect(x - dot, y - dot, dot * 2, dot * 2);
          }
          continue;
        }

        const struct = Math.pow(Math.max(0, 1 - r / Rb), 1.1);
        if (struct <= 0) continue;

        let on = 1;
        if (r > Rb * 0.68) on = hash(i, j + tb) > 0.42 ? 1 : 0.22;
        if (reduce) on = 1;

        const ang = Math.atan2(dy, dx);
        const dA = Math.abs(((ang - scanAng + Math.PI) % TWO + TWO) % TWO - Math.PI);
        const gleam = reduce ? 0 : 0.20 * Math.max(0, 1 - dA / 0.55) * struct;

        let a = struct * 0.82 * on + gleam;
        a = Math.min(0.95, a);
        if (a < 0.02) continue;
        ctx.fillStyle = `rgba(168,118,62,${a.toFixed(3)})`;
        ctx.fillRect(x - sq / 2, y - sq / 2, sq, sq);
      }
    }
    if (!reduce) st.id = requestAnimationFrame(draw);
  };

  if (reduce) draw(2300);
  else st.id = requestAnimationFrame(draw);
}
