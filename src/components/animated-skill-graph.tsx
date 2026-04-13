"use client";

import { useEffect, useRef, useState } from "react";

type Phase = "idle" | "query" | "traverse" | "found" | "response";

export function AnimatedSkillGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const started = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          observer.disconnect();
          setTimeout(() => setPhase("query"), 300);
          setTimeout(() => setPhase("traverse"), 1200);
          setTimeout(() => setPhase("found"), 2000);
          setTimeout(() => setPhase("response"), 2800);
        }
      },
      { threshold: 0.1, rootMargin: "-80px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const past = (target: Phase) => {
    const order: Phase[] = ["idle", "query", "traverse", "found", "response"];
    return order.indexOf(phase) >= order.indexOf(target);
  };

  return (
    <div ref={containerRef}>
      <span className="mb-4 block font-mono text-[10px] uppercase tracking-widest text-white/35">
        Skill Graph
      </span>

      {/* Query input */}
      <div
        className={`mb-5 rounded-md border px-3 py-2 font-mono text-[10px] transition-all duration-500 ${
          past("query")
            ? "border-indigo-500/25 bg-indigo-500/[0.05] text-white/50 opacity-100"
            : "border-white/[0.06] text-white/20 opacity-0"
        }`}
      >
        <span className="text-indigo-400/50 mr-2">$</span>
        How does JWT verification work?
      </div>

      {/* Tree with SVG connections */}
      <div className="relative" style={{ height: 180 }}>
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 400 180"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Root to children lines */}
          {/* Root -> oauth */}
          <line
            x1="200" y1="30" x2="70" y2="90"
            className={`transition-all duration-500 ${past("traverse") ? "stroke-white/15" : "stroke-white/[0.06]"}`}
            strokeWidth="1"
          />
          {/* Root -> jwt (active path) */}
          <line
            x1="200" y1="30" x2="200" y2="90"
            className={`transition-all duration-500 ${
              past("traverse") ? "stroke-indigo-500/50" : "stroke-white/[0.06]"
            }`}
            strokeWidth={past("traverse") ? 1.5 : 1}
          />
          {/* Root -> middleware */}
          <line
            x1="200" y1="30" x2="330" y2="90"
            className={`transition-all duration-500 ${past("traverse") ? "stroke-white/15" : "stroke-white/[0.06]"}`}
            strokeWidth="1"
          />
          {/* jwt -> children */}
          <line
            x1="175" y1="110" x2="155" y2="150"
            className={`transition-all duration-700 ${past("found") ? "stroke-indigo-500/30" : "stroke-white/[0.04]"}`}
            strokeWidth="1"
          />
          <line
            x1="225" y1="110" x2="245" y2="150"
            className={`transition-all duration-700 ${past("found") ? "stroke-indigo-500/30" : "stroke-white/[0.04]"}`}
            strokeWidth="1"
          />
          {/* oauth -> children */}
          <line x1="50" y1="110" x2="30" y2="150" className="stroke-white/[0.06]" strokeWidth="1" />
          <line x1="90" y1="110" x2="110" y2="150" className="stroke-white/[0.06]" strokeWidth="1" />
          {/* middleware -> children */}
          <line x1="310" y1="110" x2="290" y2="150" className="stroke-white/[0.06]" strokeWidth="1" />
          <line x1="350" y1="110" x2="370" y2="150" className="stroke-white/[0.06]" strokeWidth="1" />

          {/* Animated pulse dot traveling down the active path */}
          {phase === "traverse" && (
            <circle r="3" fill="#818cf8" opacity="0.8">
              <animateMotion dur="0.8s" fill="freeze" path="M200,30 L200,90" />
            </circle>
          )}
        </svg>

        {/* Root node */}
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2"
          style={{ width: 120 }}
        >
          <div
            className={`rounded-md border px-3 py-1.5 text-center transition-all duration-500 ${
              past("traverse")
                ? "border-indigo-400/40 bg-indigo-500/[0.10]"
                : "border-white/[0.10] bg-white/[0.05]"
            }`}
          >
            <div className="text-[10px] font-medium text-indigo-300/80">SKILL.md</div>
            <div className="text-[8px] text-white/30">Auth system</div>
          </div>
        </div>

        {/* Child: oauth-flow */}
        <div className="absolute top-[80px]" style={{ left: "5%", width: 100 }}>
          <div className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-1.5 text-center">
            <div className="font-mono text-[9px] text-white/35">oauth-flow</div>
          </div>
        </div>

        {/* Child: jwt-tokens (ACTIVE) */}
        <div className="absolute left-1/2 top-[80px] -translate-x-1/2" style={{ width: 110 }}>
          <div
            className={`rounded-md border px-2 py-1.5 text-center transition-all duration-500 ${
              past("found")
                ? "border-indigo-400/50 bg-indigo-500/[0.15]"
                : past("traverse")
                  ? "border-indigo-500/25 bg-indigo-500/[0.06]"
                  : "border-white/[0.08] bg-white/[0.04]"
            }`}
          >
            <div className={`font-mono text-[9px] transition-colors duration-500 ${past("found") ? "text-indigo-300/90" : "text-white/35"}`}>
              jwt-tokens
            </div>
            {past("found") && (
              <div className="mt-0.5 text-[7px] text-indigo-400/60 animate-pulse">
                pulling context...
              </div>
            )}
          </div>
        </div>

        {/* Child: middleware */}
        <div className="absolute top-[80px]" style={{ right: "5%", width: 100 }}>
          <div className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-1.5 text-center">
            <div className="font-mono text-[9px] text-white/35">middleware</div>
          </div>
        </div>

        {/* Grandchildren: oauth */}
        <div className="absolute top-[140px] flex gap-1" style={{ left: "0%" }}>
          <div className="rounded border border-white/[0.06] bg-white/[0.03] px-1.5 py-0.5 font-mono text-[7px] text-white/20">google-sso</div>
          <div className="rounded border border-white/[0.06] bg-white/[0.03] px-1.5 py-0.5 font-mono text-[7px] text-white/20">github-oauth</div>
        </div>

        {/* Grandchildren: jwt (ACTIVE) */}
        <div className="absolute left-1/2 top-[140px] -translate-x-1/2 flex gap-1">
          <div className={`rounded border px-1.5 py-0.5 font-mono text-[7px] transition-all duration-500 ${
            past("found") ? "border-indigo-500/25 bg-indigo-500/[0.06] text-indigo-300/60" : "border-white/[0.06] bg-white/[0.03] text-white/20"
          }`}>refresh-flow</div>
          <div className={`rounded border px-1.5 py-0.5 font-mono text-[7px] transition-all duration-500 ${
            past("found") ? "border-indigo-500/25 bg-indigo-500/[0.06] text-indigo-300/60" : "border-white/[0.06] bg-white/[0.03] text-white/20"
          }`}>verify</div>
        </div>

        {/* Grandchildren: middleware */}
        <div className="absolute top-[140px] flex gap-1" style={{ right: "0%" }}>
          <div className="rounded border border-white/[0.06] bg-white/[0.03] px-1.5 py-0.5 font-mono text-[7px] text-white/20">rate-limit</div>
          <div className="rounded border border-white/[0.06] bg-white/[0.03] px-1.5 py-0.5 font-mono text-[7px] text-white/20">cors-policy</div>
        </div>
      </div>

      {/* Response */}
      <div
        className={`mt-4 rounded-md border px-3 py-2 font-mono text-[10px] transition-all duration-500 ${
          past("response")
            ? "border-emerald-500/20 bg-emerald-500/[0.05] text-white/50 opacity-100 translate-y-0"
            : "border-transparent text-white/20 opacity-0 translate-y-2"
        }`}
      >
        <span className="text-emerald-400/50 mr-2">←</span>
        JWT tokens are verified via <span className="text-emerald-400/60">verifyJWT(token, SECRET)</span> in auth middleware...
      </div>
    </div>
  );
}
