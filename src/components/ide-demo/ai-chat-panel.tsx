"use client";

import {
  Search,
  FileText,
  Pencil,
  Code2,
  Bug,
  FlaskConical,
  GitBranch,
  ArrowUp,
  ChevronDown,
  Shield,
  Paperclip,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  DEMO_PROMPT,
  DEMO_STEPS,
  DEMO_RESPONSE,
  CHANGED_FILES,
} from "./demo-data";
import type { DemoStep } from "./demo-data";
import type { DemoTimelineState } from "./use-demo-timeline";

function StepIcon({ kind }: { kind: DemoStep["kind"] }) {
  const cls = "h-3.5 w-3.5 shrink-0";
  switch (kind) {
    case "grep":
      return <Search className={`${cls} text-blue-400/80`} />;
    case "read":
      return <FileText className={`${cls} text-yellow-400/80`} />;
    case "edit":
      return <Pencil className={`${cls} text-emerald-400/80`} />;
  }
}

function StepRow({ step }: { step: DemoStep }) {
  return (
    <div className="flex items-center gap-2 rounded-md bg-white/[0.04] px-2.5 py-1.5">
      <StepIcon kind={step.kind} />
      <span className="flex-1 truncate text-[11px] text-white/60">
        {step.label}
      </span>
      {step.badges?.map((badge) => (
        <span
          key={badge}
          className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[9px] text-white/40"
        >
          {badge}
        </span>
      ))}
      {step.additions !== undefined && (
        <span className="text-[10px] font-medium text-emerald-400">
          +{step.additions}
        </span>
      )}
      {step.deletions !== undefined && (
        <span className="text-[10px] font-medium text-red-400">
          -{step.deletions}
        </span>
      )}
    </div>
  );
}

function WelcomeView() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      <img
        src="/creor-nobg-icon.png"
        alt="Creor"
        className="mb-3 h-10 w-10 opacity-30"
      />
      <p className="mb-1 text-[13px] font-medium text-white/60">
        What can I help you with?
      </p>
      <div className="mb-4 flex items-center gap-3 text-[9px] text-white/30">
        <span className="flex items-center gap-1">
          <FileText className="h-3 w-3" /> ecommerce
        </span>
        <span className="flex items-center gap-1">
          <GitBranch className="h-3 w-3" /> main
        </span>
      </div>
      <div className="flex flex-wrap justify-center gap-1.5">
        {[
          { icon: Code2, label: "Explain code" },
          { icon: Bug, label: "Fix a bug" },
          { icon: FlaskConical, label: "Write tests" },
        ].map(({ icon: Icon, label }) => (
          <span
            key={label}
            className="flex items-center gap-1 rounded-full border border-white/[0.10] px-2.5 py-1 text-[10px] text-white/40"
          >
            <Icon className="h-3 w-3" />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function InputBox({ state }: { state: DemoTimelineState }) {
  const isTyping = state.phase === "typing";
  const showTypedText = isTyping;
  const isSending = state.phase === "sent";

  return (
    <div className="border-t border-white/[0.08] px-3 py-2.5">
      <div
        className={`rounded-xl border bg-white/[0.03] px-3 py-2.5 transition-colors ${isTyping ? "border-white/[0.20]" : "border-white/[0.10]"
          }`}
      >
        {/* Typed text or placeholder */}
        <div className="min-h-[20px] text-[12px]">
          {showTypedText ? (
            <span className="text-white/70">
              {DEMO_PROMPT.slice(0, state.typedChars)}
              <span className="ml-0.5 inline-block h-3.5 w-[2px] animate-pulse bg-white/60" />
            </span>
          ) : isSending ? (
            <span className="text-white/20">
              Ask anything... &quot;Write unit tests for auth&quot;
            </span>
          ) : (
            <span className="text-white/25">
              Ask anything... &quot;Write unit tests for auth&quot;
            </span>
          )}
        </div>

        {/* Bottom toolbar */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1 rounded-md border border-white/[0.08] px-2 py-0.5 text-[10px] text-white/35">
              Build <ChevronDown className="h-2.5 w-2.5" />
            </span>
            <span className="flex items-center gap-1 rounded-md border border-white/[0.08] px-2 py-0.5 text-[10px] text-white/35">
              Claude Opus 4.6 <ChevronDown className="h-2.5 w-2.5" />
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 text-white/25" />
            <Paperclip className="h-3.5 w-3.5 text-white/25" />
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full transition-all ${isTyping && state.typedChars > 0
                ? "bg-white text-black"
                : "bg-white/10 text-white/20"
                }`}
            >
              <ArrowUp className="h-3.5 w-3.5" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AIChatPanel({ state }: { state: DemoTimelineState }) {
  const isIdle = state.phase === "idle" || state.phase === "reset-pause";
  const isTypingInInput = state.phase === "typing";
  const promptSent =
    state.phase === "sent" ||
    state.phase === "searching" ||
    state.phase === "steps" ||
    state.phase === "response" ||
    state.phase === "accept-bar" ||
    state.phase === "accepting";

  const showSearching =
    state.phase === "searching" ||
    state.phase === "steps" ||
    state.phase === "response" ||
    state.phase === "accept-bar" ||
    state.phase === "accepting";

  return (
    <div className="flex w-[260px] shrink-0 flex-col border-l border-white/[0.08] md:w-[320px] lg:w-[380px]">
      {/* Chat header tab */}
      <div className="flex items-center border-b border-white/[0.08] bg-[#1e1e20]">
        <div className="flex items-center gap-2 rounded-t bg-[#141416] px-3 py-1.5">
          <span className="text-[11px] text-white/50">
            {promptSent ? (
              <>
                <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-amber-400" />
                cart total is miss...
              </>
            ) : (
              "New Chat"
            )}
          </span>
          <span className="text-[10px] text-white/25">&times;</span>
        </div>
        <div className="ml-auto mr-2 flex items-center gap-2 text-white/25">
          <span className="text-[14px]">+</span>
          <span className="text-[11px]">&#9719;</span>
          <span className="text-[10px]">|</span>
          <span className="text-[11px]">&#9634;</span>
          <span className="text-[14px]">&times;</span>
        </div>
      </div>

      {/* Chat content area */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {isIdle || isTypingInInput ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <WelcomeView />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-3 p-3"
            >
              {/* User prompt bubble */}
              {promptSent && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-lg bg-white/[0.06] p-3"
                >
                  <p className="text-[12px] leading-relaxed text-white/70">
                    {DEMO_PROMPT}
                  </p>
                </motion.div>
              )}

              {/* Searching indicator */}
              {showSearching && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {state.phase === "searching" || state.phase === "steps" ? (
                    <div className="flex items-center gap-2 py-1">
                      <span className="flex items-center gap-[3px]">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="inline-block h-1 w-1 rounded-full bg-indigo-400/70"
                            style={{
                              animation: "dotWave 1.2s ease-in-out infinite",
                              animationDelay: `${i * 0.15}s`,
                            }}
                          />
                        ))}
                      </span>
                      <span className="text-[11px] text-white/40">
                        Running tools
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between py-1">
                      <span className="text-[10px] font-medium text-white/30">
                        &#9650; Hide steps &nbsp;
                        <span className="text-white/20">
                          {DEMO_STEPS.length} steps
                        </span>
                      </span>
                      <span className="text-[10px] text-white/15">
                        +{CHANGED_FILES.reduce((a, f) => a + f.additions, 0)} -
                        {CHANGED_FILES.reduce((a, f) => a + f.deletions, 0)}
                      </span>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Steps */}
              <div className="space-y-1.5">
                {DEMO_STEPS.slice(0, state.visibleSteps).map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    <StepRow step={step} />
                  </motion.div>
                ))}
              </div>

              {/* Response */}
              {state.showResponse && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-1.5"
                >
                  <p className="text-[10px] font-semibold text-amber-400/70">
                    Response
                  </p>
                  <p className="text-[11px] leading-relaxed text-white/55">
                    {DEMO_RESPONSE}
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Accept bar — above input box */}
      <AnimatePresence>
        {state.showAcceptBar && (
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/[0.06] bg-[#111113] px-3 py-2"
          >
            <div className="mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[10px] text-white/35">
                <span className="text-white/15">&#8593; &#8595; &rsaquo;</span>
                <FileText className="h-3 w-3 text-white/15" />
                {CHANGED_FILES.length} Files With Changes
              </span>
              <div className="flex gap-1.5">
                <span className="cursor-default rounded border border-white/[0.08] px-2 py-0.5 text-[9px] text-white/25">
                  Reject all
                </span>
                <span
                  className={`cursor-default rounded border px-2 py-0.5 text-[9px] font-medium transition-all duration-500 ${state.acceptHighlight
                    ? "scale-105 border-emerald-500/40 bg-emerald-500/20 text-emerald-400"
                    : "border-blue-500/40 bg-blue-500/20 text-blue-300"
                    }`}
                >
                  Accept all
                </span>
              </div>
            </div>
            <div className="space-y-0.5">
              {CHANGED_FILES.map((f) => (
                <div
                  key={f.path}
                  className="flex items-center gap-2 text-[9px] text-white/25"
                >
                  <span className="text-emerald-400/60">+{f.additions}</span>
                  <span className="text-red-400/60">-{f.deletions}</span>
                  <span className="truncate">{f.name}</span>
                  <span className="truncate text-white/10">{f.path}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input box — always at bottom */}
      <InputBox state={state} />
    </div>
  );
}
