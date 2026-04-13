"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

const MAX_TOKENS = 30000;
const INITIAL_TOKENS = 10000;

export function TokenBudgetSlider() {
  const [tokens, setTokens] = useState(0);
  const [animatedIn, setAnimatedIn] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const { ref: visRef, isIntersecting } = useIntersectionObserver({ threshold: 0.5 });

  // Animate from 0 to 10k on scroll
  useEffect(() => {
    if (!isIntersecting || animatedIn) return;
    setAnimatedIn(true);

    const duration = 1400;
    const start = performance.now();
    let raf: number;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setTokens(Math.round(INITIAL_TOKENS * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isIntersecting, animatedIn]);

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
    <div ref={visRef}>
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
          {/* Fill */}
          <div
            className="pointer-events-none h-full rounded-full bg-indigo-500/60"
            style={{
              width: `${pct}%`,
              transition: dragging.current ? "none" : "width 0.15s ease-out",
            }}
          />
          {/* Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              left: `${pct}%`,
              transition: dragging.current ? "none" : "left 0.15s ease-out",
            }}
          >
            <div className="-ml-2 h-4 w-4 rounded-full border-2 border-indigo-400/60 bg-indigo-500/30" />
          </div>
        </div>
        <span className="w-14 text-right font-mono text-[11px] tabular-nums text-white/45">
          {tokens.toLocaleString()}
        </span>
      </div>
      <p className="mt-1.5 font-mono text-[9px] text-white/20">
        Drag to adjust
      </p>
    </div>
  );
}
