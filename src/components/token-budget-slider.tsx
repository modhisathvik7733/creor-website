"use client";

import { useRef, useState, useCallback, useEffect } from "react";

const MAX_TOKENS = 30000;
const INITIAL_TOKENS = 10000;

export function TokenBudgetSlider() {
  const [tokens, setTokens] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const dragging = useRef(false);
  const animatedIn = useRef(false);

  // Animate from 0 to 10k using direct DOM updates (no React re-renders)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedIn.current) {
          animatedIn.current = true;
          observer.disconnect();

          const duration = 1400;
          const start = performance.now();
          const targetPct = (INITIAL_TOKENS / MAX_TOKENS) * 100;

          function tick(now: number) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const currentPct = targetPct * eased;
            const currentTokens = Math.round(INITIAL_TOKENS * eased);

            // Direct DOM updates — no setState, no re-renders
            if (fillRef.current) fillRef.current.style.width = `${currentPct}%`;
            if (thumbRef.current) thumbRef.current.style.left = `${currentPct}%`;
            if (counterRef.current) counterRef.current.textContent = currentTokens.toLocaleString();

            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              // Sync React state at the end so dragging works correctly
              setTokens(INITIAL_TOKENS);
            }
          }

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.1, rootMargin: "-100px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const updateFromPointer = useCallback((clientX: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setTokens(Math.round(ratio * MAX_TOKENS));
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      dragging.current = true;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      updateFromPointer(e.clientX);
    },
    [updateFromPointer]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      updateFromPointer(e.clientX);
    },
    [updateFromPointer]
  );

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const pct = (tokens / MAX_TOKENS) * 100;

  return (
    <div ref={containerRef}>
      <span className="mb-3 block font-mono text-[10px] uppercase tracking-widest text-white/35">
        Token Budget
      </span>
      <div className="flex items-center gap-3">
        <div
          ref={trackRef}
          className="relative h-2 flex-1 cursor-pointer rounded-full bg-white/[0.08]"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <div
            ref={fillRef}
            className="pointer-events-none h-full rounded-full bg-indigo-500/60"
            style={{ width: `${pct}%` }}
          />
          <div
            ref={thumbRef}
            className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ left: `${pct}%` }}
          >
            <div className="-ml-2 h-4 w-4 rounded-full border-2 border-indigo-400/60 bg-indigo-500/30" />
          </div>
        </div>
        <span ref={counterRef} className="w-14 text-right font-mono text-[11px] tabular-nums text-white/45">
          {tokens.toLocaleString()}
        </span>
      </div>
      <p className="mt-1.5 font-mono text-[9px] text-white/20">
        Drag to adjust
      </p>
    </div>
  );
}
