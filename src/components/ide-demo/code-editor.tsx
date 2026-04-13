"use client";

import { motion } from "motion/react";
import { CODE_LINES, DIFF_HUNKS } from "./demo-data";
import type { DemoTimelineState } from "./use-demo-timeline";

const HUNK_MAP = new Map(DIFF_HUNKS.map((h) => [h.lineIndex, h]));

const ANIM_DELAYS = (() => {
  const map = new Map<number, { removed: number; added: number }>();
  let order = 0;
  for (const hunk of DIFF_HUNKS) {
    map.set(hunk.lineIndex, {
      removed: order * 0.2,
      added: (order + 1) * 0.2,
    });
    order += 2;
  }
  return map;
})();

const WIDGET_DELAY = DIFF_HUNKS.length * 2 * 0.2 + 0.15;

function AcceptChangesWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: WIDGET_DELAY }}
      className="absolute left-1/2 z-10 -translate-x-1/2 flex items-center gap-0.5 rounded border border-white/[0.1] bg-[#252526] px-0.5 py-0.5 shadow-xl"
      style={{ bottom: "16px" }}
    >
      <span className="rounded bg-blue-600/90 px-2 py-0.5 text-[9px] font-medium text-white">
        Accept Changes ⌘&gt;
      </span>
      <span className="flex items-center gap-1 px-1.5 text-[9px] text-white/30">
        ↑ <span className="font-medium text-white/50">1/2</span> ↓
      </span>
      <span className="rounded border border-white/[0.08] px-2 py-0.5 text-[9px] text-white/30">
        Reject ⌘D
      </span>
    </motion.div>
  );
}

function renderTokens(tokens: { text: string; color: string }[]) {
  if (tokens.length === 0) return <span>&nbsp;</span>;
  return tokens.map((token, j) => (
    <span key={j} className={token.color}>
      {token.text}
    </span>
  ));
}

export function CodeEditor({ state }: { state: DemoTimelineState }) {
  const editStepReached = state.visibleSteps >= 4;
  const showDiff =
    editStepReached &&
    state.phase !== "idle" &&
    state.phase !== "typing" &&
    state.phase !== "reset-pause";

  return (
    <div className="relative flex-1 overflow-hidden p-4 font-mono text-[11px] leading-[22px] sm:text-[12px]">
      {showDiff && <AcceptChangesWidget />}

      <div>
        {CODE_LINES.map((line, i) => {
          const hunk = HUNK_MAP.get(i);
          const delays = ANIM_DELAYS.get(i);

          /* ── Diff active: show removed + added lines ── */
          if (hunk && showDiff) {
            return (
              <div key={i}>
                {/* Removed line */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: delays!.removed }}
                  className="flex border-l-2 border-red-500/40 bg-red-500/[0.07]"
                  style={{ height: 22 }}
                >
                  <span className="mr-3 inline-block w-6 shrink-0 select-none text-right text-[10px] text-red-400/30">
                    {i + 1}
                  </span>
                  <div className="whitespace-nowrap opacity-60">
                    {renderTokens(hunk.removed[0].tokens)}
                  </div>
                </motion.div>
                {/* Added line — streams in from height 0 */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 22 }}
                  transition={{
                    duration: 0.35,
                    delay: delays!.added,
                    ease: "easeOut",
                  }}
                  className="flex overflow-hidden border-l-2 border-emerald-500/40 bg-emerald-500/[0.07]"
                >
                  <span className="mr-3 inline-block w-6 shrink-0 select-none text-right text-[10px] text-emerald-400/30">
                    {i + 1}
                  </span>
                  <div className="whitespace-nowrap">
                    {renderTokens(hunk.added[0].tokens)}
                  </div>
                </motion.div>
              </div>
            );
          }

          /* ── Normal line ── */
          return (
            <div key={i} className="flex" style={{ height: 22 }}>
              <span className="mr-3 inline-block w-6 shrink-0 select-none text-right text-white/25">
                {i + 1}
              </span>
              <div className="whitespace-nowrap">{renderTokens(line.tokens)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
