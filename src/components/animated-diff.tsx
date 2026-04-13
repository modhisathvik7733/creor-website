"use client";

import { useEffect, useState } from "react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

interface DiffLine {
  type: "context" | "add" | "remove";
  lineNum: string;
  content: string;
}

const diffLines: DiffLine[] = [
  { type: "context", lineNum: "14", content: "export function authMiddleware(req, res, next) {" },
  { type: "remove", lineNum: "15", content: "  const token = req.headers.auth" },
  { type: "add", lineNum: "15", content: '  const token = req.headers.authorization?.split(" ")[1]' },
  { type: "add", lineNum: "16", content: '  if (!token) return res.status(401).json({ error: "Unauthorized" })' },
  { type: "context", lineNum: "17", content: "  try {" },
  { type: "remove", lineNum: "18", content: "    const user = verify(token)" },
  { type: "add", lineNum: "18", content: "    const user = await verifyJWT(token, SECRET)" },
  { type: "add", lineNum: "19", content: "    req.user = { id: user.sub, role: user.role }" },
  { type: "context", lineNum: "20", content: "    next()" },
];

function AnimatedCounter({ target, animate, className }: { target: number; animate: boolean; className: string }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!animate) return;
    const duration = 800;
    const start = performance.now();
    let raf: number;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animate, target]);

  return <span className={className}>{target >= 0 ? "+" : "-"}{Math.abs(value)}</span>;
}

export function AnimatedDiffPreview() {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.5 });
  const [visibleLines, setVisibleLines] = useState(0);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    if (!isIntersecting) return;

    // Stagger each line appearing
    diffLines.forEach((_, i) => {
      setTimeout(() => setVisibleLines(i + 1), 200 + i * 120);
    });

    // Show accept/reject after all lines
    setTimeout(() => setShowButtons(true), 200 + diffLines.length * 120 + 300);
  }, [isIntersecting]);

  return (
    <div ref={ref}>
      <span className="mb-3 block font-mono text-[10px] uppercase tracking-widest text-white/35">
        Diff Preview
      </span>
      <div className="overflow-hidden rounded-lg border border-white/[0.06] bg-[#0a0a0c] font-mono text-[10px]">
        {/* Diff header */}
        <div className="flex items-center justify-between border-b border-white/[0.04] px-3 py-1.5">
          <span className="text-white/40">src/middleware/auth.ts</span>
          <div className="flex gap-2">
            <AnimatedCounter target={12} animate={isIntersecting} className="text-emerald-400/70" />
            <AnimatedCounter target={-3} animate={isIntersecting} className="text-red-400/70" />
          </div>
        </div>

        {/* Diff lines */}
        <div className="space-y-0 p-0">
          {diffLines.map((line, i) => {
            const visible = i < visibleLines;
            const lineClass =
              line.type === "remove"
                ? "border-l-2 border-red-400/50 bg-red-500/[0.10] px-3 py-0.5 text-white/40"
                : line.type === "add"
                  ? "border-l-2 border-emerald-400/50 bg-emerald-500/[0.10] px-3 py-0.5 text-white/50"
                  : "px-3 py-0.5 text-white/35";
            const numClass =
              line.type === "remove"
                ? "mr-3 text-red-400/50"
                : line.type === "add"
                  ? "mr-3 text-emerald-400/50"
                  : "mr-3 text-white/20";

            return (
              <div
                key={i}
                className={`${lineClass} transition-all duration-300 ease-out ${
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
                }`}
              >
                <span className={numClass}>{line.lineNum}</span>
                {line.content}
              </div>
            );
          })}
        </div>

        {/* Accept/reject bar */}
        <div
          className={`flex items-center justify-end gap-2 border-t border-white/[0.04] px-3 py-1.5 transition-all duration-500 ease-out ${
            showButtons ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
          }`}
        >
          <span className="rounded border border-white/[0.12] px-2 py-0.5 text-[9px] text-white/35">
            Reject
          </span>
          <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[9px] text-emerald-400/60">
            Accept
          </span>
        </div>
      </div>
    </div>
  );
}
