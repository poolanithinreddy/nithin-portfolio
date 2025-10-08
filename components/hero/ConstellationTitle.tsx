"use client";

import { useEffect, useRef } from "react";

/** ——— knobs ——— */
const WORDS = ["NITHIN", "FULL–STACK", "SYSTEMS", "CLOUD + AI","RELIABLE",
    "NGINX · TLS",
    "OBSERVABILITY"];
const WORD_SWITCH_FRAMES = 300;   // ~5s at 60fps
const CONNECT_DIST = 92;          // px
const SPRING = 0.06;
const DAMP = 0.88;

type Pt = { x: number; y: number; tx: number; ty: number; vx: number; vy: number };

export default function ConstellationTitle({
  className = "",
  density = 1.0, // 1.0 = default; 1.25 = denser
}: { className?: string; density?: number }) {
  const cvs = useRef<HTMLCanvasElement | null>(null);
  const raf = useRef<number | null>(null);
  const pts = useRef<Pt[]>([]);
  const mouse = useRef({ x: 0, y: 0, act: false });
  const word = useRef({ i: 0, t: 0 });
  const ready = useRef(false);
  const dpr = useRef(1);

  // perf: bail early when tab is hidden
  const hidden = () => typeof document !== "undefined" && document.hidden;

  useEffect(() => {
    const c = cvs.current!;
    const ctx = c.getContext("2d")!;
    dpr.current = Math.max(1, window.devicePixelRatio || 1);

    // offscreen for rasterizing words (no layout thrash)
    const off = document.createElement("canvas");
    const octx = off.getContext("2d", { willReadFrequently: true })!;

    function resize() {
      const r = c.getBoundingClientRect();
      c.width = Math.round(r.width * dpr.current);
      c.height = Math.round(r.height * dpr.current);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr.current, dpr.current);

      off.width = Math.round(r.width);
      off.height = Math.round(r.height);
      build(WORDS[word.current.i]);
    }

    function build(text: string) {
      const w = off.width, h = off.height;
      octx.clearRect(0, 0, w, h);
      const size = Math.min(88, Math.max(30, Math.floor(w / 9)));
      octx.font = `800 ${size}px ui-sans-serif, -apple-system, system-ui, Inter`;
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.fillStyle = "#000";
      octx.fillText(text, w / 2, h / 2);

      const img = octx.getImageData(0, 0, w, h).data;
      const step = Math.max(5, Math.floor(size / (9 / density)));
      const next: Pt[] = [];
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const a = img[(y * w + x) * 4 + 3];
          if (a > 128) {
            const jitter = 1.25;
            next.push({
              x: w / 2 + (Math.random() - 0.5) * w * 0.18,
              y: h / 2 + (Math.random() - 0.5) * h * 0.18,
              tx: x + (Math.random() - 0.5) * jitter,
              ty: y + (Math.random() - 0.5) * jitter,
              vx: 0, vy: 0,
            });
          }
        }
      }

      if (pts.current.length === 0) {
        pts.current = next;
      } else {
        const a = pts.current, b = next;
        const n = Math.min(a.length, b.length);
        for (let i = 0; i < n; i++) { a[i].tx = b[i].tx; a[i].ty = b[i].ty; }
        if (b.length > a.length) a.push(...b.slice(a.length));
        else if (a.length > b.length) a.splice(b.length);
      }
      ready.current = true;
    }

    function drawBg(g: CanvasRenderingContext2D, w: number, h: number) {
      const dark = document.documentElement.classList.contains("dark");
      const grad = g.createRadialGradient(w * 0.5, h * 0.2, 10, w * 0.5, h * 0.2, h);
      if (dark) {
        grad.addColorStop(0, "rgba(120,140,255,0.12)");
        grad.addColorStop(1, "rgba(0,0,0,0)");
      } else {
        grad.addColorStop(0, "rgba(200,210,255,0.20)");
        grad.addColorStop(1, "rgba(255,255,255,0)");
      }
      g.fillStyle = grad;
      g.fillRect(0, 0, w, h);

      // soft inner vignette
      g.fillStyle = dark ? "rgba(0,0,0,0.22)" : "rgba(0,0,0,0.04)";
      g.beginPath(); g.roundRect(8, 8, w - 16, h - 16, 16); g.strokeStyle = "transparent"; g.fill();
    }

    const prefersReduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    function loop() {
      if (hidden()) { raf.current = requestAnimationFrame(loop); return; }
      const rect = c.getBoundingClientRect();
      const w = rect.width, h = rect.height;
      ctx.clearRect(0, 0, w, h);
      drawBg(ctx, w, h);
      if (!ready.current) { raf.current = requestAnimationFrame(loop); return; }

      const M = mouse.current;
      const repelK = prefersReduce ? 0.18 : 0.32;

      for (const p of pts.current) {
        // spring
        p.vx += (p.tx - p.x) * SPRING;
        p.vy += (p.ty - p.y) * SPRING;

        // repel
        if (M.act) {
          const dx = p.x - M.x, dy = p.y - M.y;
          const r2 = dx * dx + dy * dy;
          if (r2 > 0.001) {
            const f = Math.min(1400 / r2, repelK);
            const r = Math.sqrt(r2);
            p.vx += (dx / r) * f;
            p.vy += (dy / r) * f;
          }
        }

        // damp & integrate
        p.vx *= DAMP; p.vy *= DAMP;
        p.x += p.vx; p.y += p.vy;
      }

      // links
      ctx.lineWidth = 1;
      for (let i = 0; i < pts.current.length; i += 1) {
        const a = pts.current[i];
        for (let j = i + 1; j < i + 12 && j < pts.current.length; j++) {
          const b = pts.current[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < CONNECT_DIST) {
            ctx.strokeStyle = document.documentElement.classList.contains("dark")
              ? `rgba(210,220,255,${(CONNECT_DIST - d) / 600})`
              : `rgba(60,70,140,${(CONNECT_DIST - d) / 800})`;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }

      // points
      ctx.fillStyle = document.documentElement.classList.contains("dark") ? "rgba(245,247,255,0.92)" : "rgba(15,18,35,0.92)";
      for (const p of pts.current) { ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2); ctx.fill(); }

      // change word
      if (!prefersReduce) {
        word.current.t++;
        if (word.current.t > WORD_SWITCH_FRAMES) {
          word.current.t = 0;
          word.current.i = (word.current.i + 1) % WORDS.length;
          build(WORDS[word.current.i]);
        }
      }

      raf.current = requestAnimationFrame(loop);
    }

    function move(e: MouseEvent) {
      const r = c.getBoundingClientRect();
      mouse.current.x = e.clientX - r.left;
      mouse.current.y = e.clientY - r.top;
      mouse.current.act = true;
    }
    function leave() { mouse.current.act = false; }

    function touch(e: TouchEvent) {
      const t = e.touches[0]; if (!t) { mouse.current.act = false; return; }
      const r = c.getBoundingClientRect();
      mouse.current.x = t.clientX - r.left;
      mouse.current.y = t.clientY - r.top;
      mouse.current.act = true;
    }

    resize();
    loop();
    window.addEventListener("resize", resize);
    c.addEventListener("mousemove", move);
    c.addEventListener("mouseleave", leave);
    c.addEventListener("touchstart", touch, { passive: true });
    c.addEventListener("touchmove", touch, { passive: true });
    c.addEventListener("touchend", () => (mouse.current.act = false));

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
      c.removeEventListener("mousemove", move);
      c.removeEventListener("mouseleave", leave);
      c.removeEventListener("touchstart", touch);
      c.removeEventListener("touchmove", touch);
      c.removeEventListener("touchend", () => undefined);
    };
  }, [density]);

  const heightClasses = className && /h-\[|h-\d/.test(className) ? "" : " h-[300px] sm:h-[360px]";
  const wrapperClasses = `relative overflow-hidden rounded-2xl border bg-white/40 backdrop-blur-sm
                   border-neutral-200/70 ring-1 ring-black/0
                   dark:border-white/10 dark:bg-[#0b0f14] dark:ring-white/0${heightClasses}${className ? ` ${className}` : ""}`;

  return (
    <div className={wrapperClasses}>
      <canvas
        ref={cvs}
        role="img"
        aria-label="Animated constellation forming words describing expertise"
        className="block h-full w-full"
      />
    </div>
  );
}
