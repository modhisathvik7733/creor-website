"use client";

import { useEffect, useRef, useState } from "react";

const rules = [
  { name: "code-style.md", desc: "Enforce naming conventions, formatting, import order", icon: "✦", always: true },
  { name: "security-policy.md", desc: "Block secrets in code, enforce auth patterns", icon: "◆", always: true },
  { name: "api-guidelines.md", desc: "REST conventions, error response shapes", icon: "▸", always: false },
  { name: "testing-patterns.md", desc: "Unit test structure, mock strategy, coverage", icon: "▹", always: false },
];

export function AnimatedRules() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(0);
  const [checkedIndex, setCheckedIndex] = useState(-1);
  const started = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          observer.disconnect();

          // Stagger rules appearing
          rules.forEach((_, i) => {
            setTimeout(() => setVisibleCount(i + 1), 200 + i * 150);
          });

          // After all visible, run the "check" animation
          setTimeout(() => {
            rules.forEach((_, i) => {
              setTimeout(() => setCheckedIndex(i), i * 400);
            });
          }, 200 + rules.length * 150 + 300);
        }
      },
      { threshold: 0.1, rootMargin: "-80px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef}>
      <span className="mb-3 block font-mono text-[10px] uppercase tracking-widest text-white/35">
        Rules
      </span>

      <div className="space-y-1.5">
        {rules.map((rule, i) => {
          const visible = i < visibleCount;
          const checked = i <= checkedIndex;

          return (
            <div
              key={rule.name}
              className={`group rounded-lg border px-3 py-2.5 transition-all duration-400 ease-out ${
                visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
              } ${
                checked
                  ? rule.always
                    ? "border-emerald-500/20 bg-emerald-500/[0.04]"
                    : "border-white/[0.10] bg-white/[0.05]"
                  : "border-white/[0.06] bg-white/[0.03]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {/* Check circle */}
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[9px] transition-all duration-500 ${
                      checked
                        ? rule.always
                          ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-400/80"
                          : "border-white/20 bg-white/[0.08] text-white/40"
                        : "border-white/[0.08] bg-transparent text-transparent"
                    }`}
                  >
                    ✓
                  </div>
                  <div>
                    <div className="font-mono text-[11px] text-white/50">{rule.name}</div>
                    <div className={`text-[9px] transition-all duration-500 ${
                      checked ? "text-white/30" : "text-white/15"
                    }`}>
                      {rule.desc}
                    </div>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-[9px] font-medium transition-all duration-500 ${
                    checked
                      ? rule.always
                        ? "bg-emerald-500/15 text-emerald-400/70"
                        : "bg-white/[0.06] text-white/30"
                      : "bg-white/[0.03] text-white/15"
                  }`}
                >
                  {rule.always ? "always" : "on-demand"}
                </span>
              </div>

              {/* Progress bar that fills on check */}
              <div className="mt-2 h-px w-full overflow-hidden rounded-full bg-white/[0.04]">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${
                    rule.always ? "bg-emerald-500/30" : "bg-white/[0.10]"
                  }`}
                  style={{ width: checked ? "100%" : "0%" }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary bar */}
      <div
        className={`mt-3 flex items-center justify-between rounded-md border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 font-mono text-[9px] transition-all duration-500 ${
          checkedIndex >= rules.length - 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <span className="text-white/30">
          {rules.filter((r) => r.always).length} always &middot; {rules.filter((r) => !r.always).length} on-demand
        </span>
        <span className="text-emerald-400/50">all rules loaded</span>
      </div>
    </div>
  );
}
