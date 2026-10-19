'use client';

import { useEffect, useRef } from 'react';

// 背景のアイソメトリック格子（トップ・サービスページと同じ間隔と色）。
// 画面の上の方が見えている間だけ動かす。裏のタブ・狭い画面・動きを減らす設定では静止した1枚だけ描く
export default function IsoGrid() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const cx = cv.getContext('2d');
    if (!cx) return;
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const DPR = Math.min(2, window.devicePixelRatio || 1);
    const SP = 92;
    const TAN = Math.tan(Math.PI / 6);
    let W = 0;
    let H = 0;
    let off = 0;
    let raf = 0;
    let running = false;
    let segs: { a: 'x' | 'r' | 'l'; o: number; life: number; sp: number }[] = [];

    const frame = () => {
      cx.clearRect(0, 0, W, H);
      off = (off + 0.13) % SP;
      for (let i = 0; i < segs.length; i++) {
        const s = segs[i];
        s.life += s.sp;
        if (s.life > 1) s.life -= 1;
        const a = Math.sin(s.life * Math.PI);
        if (a < 0.02) continue;
        const al = a * 0.55 * 0.34;
        cx.strokeStyle =
          i % 7 === 0 ? `rgba(15,191,176,${al * 1.7})` : i % 11 === 0 ? `rgba(122,69,232,${al * 1.5})` : `rgba(40,70,140,${al})`;
        cx.lineWidth = 1;
        cx.beginPath();
        if (s.a === 'x') {
          cx.moveTo(s.o + off, -50);
          cx.lineTo(s.o + off, H + 50);
        } else if (s.a === 'r') {
          const y = s.o + off;
          cx.moveTo(-50, y - 50 * TAN);
          cx.lineTo(W + 50, y + (W + 50) * TAN);
        } else {
          const y = s.o + off;
          cx.moveTo(-50, y + 50 * TAN);
          cx.lineTo(W + 50, y - (W + 50) * TAN);
        }
        cx.stroke();
      }
    };
    const loop = () => {
      frame();
      raf = running ? requestAnimationFrame(loop) : 0;
    };
    const check = () => {
      const want = !RM && !document.hidden && !window.matchMedia('(max-width:620px)').matches && window.scrollY < window.innerHeight * 1.2;
      if (want && !running) {
        running = true;
        raf = requestAnimationFrame(loop);
      } else if (!want && running) {
        running = false;
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    const resize = () => {
      W = cv.clientWidth;
      H = cv.clientHeight;
      cv.width = W * DPR;
      cv.height = H * DPR;
      cx.setTransform(DPR, 0, 0, DPR, 0, 0);
      segs = [];
      for (let i = -30; i < 60; i++) {
        (['x', 'r', 'l'] as const).forEach((a) => segs.push({ a, o: i * SP, life: Math.random(), sp: 0.0015 + Math.random() * 0.0038 }));
      }
      if (!running) frame();
      check();
    };
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', check, { passive: true });
    document.addEventListener('visibilitychange', check);
    return () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', check);
      document.removeEventListener('visibilitychange', check);
    };
  }, []);

  return <canvas className="iso" ref={ref} aria-hidden="true" />;
}
