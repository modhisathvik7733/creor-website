"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

/* ── Types ── */

type Phase =
  | "idle"
  | "agent-thinking"
  | "command-sent"
  | "terminal-streaming"
  | "server-detected"
  | "agent-response"
  | "done";

/* ── Data ── */

const TERMINAL_LINES = [
  { text: "$ npm run dev", color: "text-white/70", delay: 0 },
  { text: "", color: "", delay: 300 },
  { text: "> ecommerce@0.0.0 dev", color: "text-white/40", delay: 500 },
  { text: "> vite", color: "text-white/40", delay: 700 },
  { text: "", color: "", delay: 1000 },
  { text: "VITE v7.3.1 ready in 187 ms", color: "text-emerald-400/80", delay: 1500 },
  { text: "", color: "", delay: 1700 },
  { text: "→  Local:   http://localhost:5173/", color: "text-cyan-400/70", delay: 1900 },
  { text: "→  press h + enter to show help", color: "text-white/30", delay: 2100 },
];

const CYCLE_MS = 10000;

/* ── Agent Context Panel ── */

function AgentContextPanel({ phase }: { phase: Phase }) {
  const order: Phase[] = [
    "idle",
    "agent-thinking",
    "command-sent",
    "terminal-streaming",
    "server-detected",
    "agent-response",
    "done",
  ];
  const past = (target: Phase) =>
    order.indexOf(phase) >= order.indexOf(target);

  return (
    <div className="flex flex-col gap-2">
      <div className="mb-1 flex items-center gap-2">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/20">
          <span className="text-[9px] text-indigo-400">AI</span>
        </div>
        <span className="text-[10px] font-medium text-white/50">
          Creor Agent
        </span>
      </div>

      {/* Thinking */}
      <AnimatePresence>
        {past("agent-thinking") && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-lg bg-white/[0.04] px-3 py-2"
          >
            <p className="text-[11px] leading-relaxed text-white/55">
              This is a dev server — it&apos;ll keep running. I&apos;ll open a
              terminal so you can see the output.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tool call */}
      <AnimatePresence>
        {past("command-sent") && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-lg border border-indigo-500/15 bg-indigo-500/[0.05] px-3 py-2"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-indigo-400/60">⚡</span>
              <span className="font-mono text-[10px] text-indigo-300/70">
                bash
              </span>
              <span className="rounded bg-indigo-500/10 px-1 py-px text-[8px] text-indigo-400/50">
                run_in_terminal
              </span>
            </div>
            <code className="mt-1 block font-mono text-[10px] text-white/45">
              npm run dev
            </code>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Arrow indicator — sending to terminal */}
      <AnimatePresence>
        {phase === "command-sent" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-1.5 py-0.5"
          >
            <span className="text-[9px] text-indigo-400/40">
              sending to terminal →
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Streaming indicator */}
      <AnimatePresence>
        {(phase === "terminal-streaming" || phase === "server-detected") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 py-0.5"
          >
            <span className="flex items-center gap-[3px]">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="inline-block h-1 w-1 rounded-full bg-amber-400/70"
                  style={{
                    animation: "dotWave 1.2s ease-in-out infinite",
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </span>
            <span className="text-[10px] text-white/30">
              watching terminal output...
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback received */}
      <AnimatePresence>
        {past("agent-response") && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-1.5"
          >
            <div className="rounded-lg border border-emerald-500/15 bg-emerald-500/[0.05] px-3 py-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-emerald-400/60">←</span>
                <span className="text-[9px] font-medium text-emerald-400/60">
                  Output received
                </span>
              </div>
              <div className="mt-1 font-mono text-[9px] text-white/35">
                <div>exit_code: 0</div>
                <div className="truncate">
                  VITE v7.3.1 ready → localhost:5173
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-white/[0.04] px-3 py-2">
              <p className="text-[11px] leading-relaxed text-white/55">
                Dev server is running at{" "}
                <span className="text-cyan-400/70">localhost:5173</span>. The
                changes are working correctly.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Mock Terminal ── */

function MockTerminal({
  visibleLines,
  showBadge,
}: {
  visibleLines: number;
  showBadge: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/[0.08] bg-[#141416]">
      {/* Title bar */}
      <div className="flex items-center justify-between bg-[#1e1e20] px-3 py-1.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-[10px] text-white/30">
          Creor Agent Terminal
        </span>
        <div className="w-12" />
      </div>

      {/* Terminal body */}
      <div className="relative min-h-[290px] px-3 py-2.5 font-mono text-[11px] leading-[20px] sm:min-h-[290px]">
        {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            {line.text === "" ? (
              <div className="h-[20px]" />
            ) : (
              <div className={line.color}>{line.text}</div>
            )}
          </motion.div>
        ))}

        {/* Blinking cursor */}
        {visibleLines > 0 && visibleLines < TERMINAL_LINES.length && (
          <span className="inline-block h-3.5 w-[7px] animate-pulse bg-white/40" />
        )}

        {/* Server ready badge */}
        <AnimatePresence>
          {showBadge && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/[0.08] px-2.5 py-1"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-[9px] font-medium text-emerald-400/80">
                Server ready detected
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Main Component ── */

export function AnimatedInteractiveTerminal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [visibleLines, setVisibleLines] = useState(0);

  const runCycle = useCallback(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const t = (fn: () => void, ms: number) => {
      timeouts.push(setTimeout(fn, ms));
    };

    // Reset
    setPhase("idle");
    setVisibleLines(0);

    // Agent thinking
    t(() => setPhase("agent-thinking"), 400);

    // Command sent
    t(() => setPhase("command-sent"), 1800);

    // Terminal starts streaming
    t(() => setPhase("terminal-streaming"), 2800);

    // Stream terminal lines one by one
    TERMINAL_LINES.forEach((line, i) => {
      t(() => setVisibleLines(i + 1), 2800 + line.delay);
    });

    // Server detected
    t(() => setPhase("server-detected"), 4800);

    // Agent response
    t(() => setPhase("agent-response"), 5600);

    // Done
    t(() => setPhase("done"), 7000);

    return timeouts;
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let timeouts: ReturnType<typeof setTimeout>[] = [];
    let interval: ReturnType<typeof setInterval>;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          observer.disconnect();

          // First run
          timeouts = runCycle();

          // Loop
          interval = setInterval(() => {
            timeouts.forEach(clearTimeout);
            timeouts = runCycle();
          }, CYCLE_MS);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      timeouts.forEach(clearTimeout);
      if (interval) clearInterval(interval);
    };
  }, [runCycle]);

  const showBadge =
    phase === "server-detected" ||
    phase === "agent-response" ||
    phase === "done";

  return (
    <div ref={containerRef}>
      <div className="grid items-start gap-6 md:grid-cols-2">
        {/* Left: Agent context */}
        <div className="min-h-[340px] rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 sm:min-h-[320px]">
          <AgentContextPanel phase={phase} />
        </div>

        {/* Right: Terminal */}
        <div>
          <MockTerminal visibleLines={visibleLines} showBadge={showBadge} />
        </div>
      </div>
    </div>
  );
}
