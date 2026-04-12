"use client";

import {
  Files,
  Search,
  GitBranch,
  Blocks,
  Bug,
  Settings,
  X,
  PanelLeft,
  PanelBottom,
  Maximize2,
  MoreHorizontal,
} from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useDemoTimeline } from "./use-demo-timeline";
import { FileExplorer } from "./file-explorer";
import { CodeEditor } from "./code-editor";
import { AIChatPanel } from "./ai-chat-panel";

function ActivityBar() {
  const icons = [
    { Icon: Files, active: true },
    { Icon: Search, active: false },
    { Icon: GitBranch, active: false },
    { Icon: Bug, active: false },
    { Icon: Blocks, active: false },
  ];

  return (
    <div className="hidden w-12 shrink-0 flex-col items-center border-r border-white/[0.06] bg-[#0a0a0c] py-2 sm:flex">
      {icons.map(({ Icon, active }, i) => (
        <div
          key={i}
          className={`mb-0.5 flex h-10 w-12 items-center justify-center ${active
            ? "border-l-2 border-white/70 text-white/70"
            : "text-white/20 hover:text-white/40"
            }`}
        >
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </div>
      ))}
      <div className="mt-auto flex flex-col items-center gap-1">
        <div className="flex h-10 w-12 items-center justify-center text-white/20">
          <Settings className="h-5 w-5" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}

function Breadcrumbs() {
  const parts = [
    "ecommerce-web",
    "src",
    "components",
    "CartSummary.tsx",
  ];
  return (
    <div className="flex items-center gap-1 border-b border-white/[0.04] px-4 py-1 text-[11px] text-white/25">
      {parts.map((part, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <span className="text-white/10">&rsaquo;</span>}
          <span className={i === parts.length - 1 ? "text-white/40" : ""}>
            {part}
          </span>
        </span>
      ))}
    </div>
  );
}

function TerminalPanel() {
  return (
    <div className="hidden border-t border-white/[0.06] lg:block">
      {/* Terminal tabs */}
      <div className="flex items-center border-b border-white/[0.04] text-[11px]">
        <span className="px-3 py-1.5 text-white/20">PROBLEMS</span>
        <span className="px-3 py-1.5 text-white/20">OUTPUT</span>
        <span className="px-3 py-1.5 text-white/20">DEBUG CONSOLE</span>
        <span className="border-b border-white/50 px-3 py-1.5 text-white/50">
          TERMINAL
        </span>
        <span className="px-3 py-1.5 text-white/20">PORTS</span>
        <div className="ml-auto mr-2 flex items-center gap-1.5 text-white/15">
          <PanelLeft className="h-3.5 w-3.5" />
          <Maximize2 className="h-3 w-3" />
          <X className="h-3.5 w-3.5" />
        </div>
      </div>
      {/* Terminal content */}
      <div className="flex">
        <div className="flex-1 px-4 py-2 font-mono text-[11px] leading-relaxed text-white/30">
          <p>
            <span className="text-white/40">&gt; ecommerce-web@0.0.0 dev</span>
          </p>
          <p>
            <span className="text-white/40">&gt; vite</span>
          </p>
          <p className="mt-1.5">
            <span className="text-green-400/60 font-semibold">VITE</span>{" "}
            <span className="text-green-400/40">v7.3.1</span>{" "}
            <span className="text-white/30">ready in</span>{" "}
            <span className="font-semibold text-white/50">232</span>{" "}
            <span className="text-white/30">ms</span>
          </p>
          <p className="mt-1.5">
            <span className="text-cyan-400/40">→</span>{" "}
            <span className="text-white/30 font-semibold">Local:</span>{"   "}
            <span className="text-cyan-400/50">http://localhost:5173/</span>
          </p>
          <p>
            <span className="text-cyan-400/40">→</span>{" "}
            <span className="text-white/30">press</span>{" "}
            <span className="font-semibold text-white/50">h + enter</span>{" "}
            <span className="text-white/30">to show help</span>
          </p>
          <p className="mt-1">
            <span className="text-white/15">12:07:48 AM</span>{" "}
            <span className="text-cyan-400/50">[vite]</span>{" "}
            <span className="text-white/25">(client)</span>{" "}
            <span className="text-white/30">hmr update</span>{" "}
            <span className="text-white/40">/src/components/CartSummary.tsx</span>
          </p>
        </div>
        {/* Terminal tabs on right */}
        <div className="hidden w-52 shrink-0 border-l border-white/[0.04] py-1.5 text-[10px] lg:block">
          <div className="flex items-center gap-1.5 rounded bg-white/[0.04] px-2 py-1 text-white/40">
            <span className="text-[13px]">⌥</span>
            Creor Agent: ecommerce
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 text-white/25">
            <span className="text-[13px]">⌥</span>
            zsh
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="flex items-center justify-between bg-[#1a1a1a] px-3 py-0.5 text-[10px] text-white/40">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1">
          <GitBranch className="h-3 w-3" strokeWidth={1.5} />
          main*+
        </span>
        <span className="flex items-center gap-1">
          <span className="text-[9px]">&#9711;</span> 0
          <span className="text-[9px]">&#9651;</span> 1&#8593;
        </span>
        <span>&#9888; 0 &#10005; 0</span>
      </div>
      <div className="flex items-center gap-3 text-white/30">
        <span>Sathvik (1 month ago)</span>
        <span>Ln 24, Col 1</span>
        <span>Spaces: 2</span>
        <span>UTF-8</span>
        <span>LF</span>
        <span>{"{}"} TypeScript TSX</span>
      </div>
    </div>
  );
}

export function IDEDemo() {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });
  const state = useDemoTimeline(isIntersecting);

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="relative">
      <div className="overflow-hidden rounded-t-xl border border-b-0 border-white/[0.08] bg-[#0d0d0f] shadow-2xl shadow-black/50 relative z-10">
        {/* Title bar — traffic lights + right icons */}
        <div className="flex items-center justify-between bg-[#1e1e1e] px-3 py-1.5">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex items-center gap-3 text-white/25">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
              <clipPath id="av"><circle cx="10" cy="10" r="10" /></clipPath>
              <circle cx="10" cy="10" r="10" fill="#3b3b3b" />
              <g clipPath="url(#av)">
                <circle cx="10" cy="8.5" r="2.5" fill="#777" />
                <ellipse cx="10" cy="18" rx="5" ry="4.5" fill="#777" />
              </g>
            </svg>
            <Search className="h-4 w-4" strokeWidth={1.5} />
            <Settings className="h-4 w-4" strokeWidth={1.5} />
            <Blocks className="h-4 w-4" strokeWidth={1.5} />
            <PanelLeft className="h-4 w-4" strokeWidth={1.5} />
            <PanelBottom className="h-4 w-4" strokeWidth={1.5} />
            <MoreHorizontal className="h-4 w-4" strokeWidth={1.5} />
          </div>
        </div>

        {/* Main layout: activity bar + sidebar + editor/terminal + chat */}
        <div className="flex">
          {/* Activity bar — full height */}
          <ActivityBar />

          {/* File explorer — full height alongside editor + terminal */}
          <FileExplorer activeFile={state.activeFile} />

          {/* Middle: tabs, breadcrumbs, code editor, terminal */}
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Tab bar */}
            <div className="flex items-center border-b border-white/[0.06] bg-[#181818] text-[12px]">
              <div className="flex items-center gap-2 border-b-2 border-white/30 bg-[#0d0d0f] px-4 py-2">
                <span className="text-white/60">CartSummary.tsx</span>
                <span className="text-[10px] font-medium text-amber-400/60">M</span>
                <X className="h-3 w-3 text-white/20" />
              </div>
              <span className="px-4 py-2 text-white/20">utils.ts</span>
              <span className="px-4 py-2 text-white/20">page.tsx</span>
              <div className="ml-auto mr-3 flex items-center gap-2 text-white/15">
                <PanelLeft className="h-3.5 w-3.5" />
                <MoreHorizontal className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Breadcrumbs */}
            <Breadcrumbs />

            {/* Code editor */}
            <div className="shrink-0 overflow-hidden" style={{ height: "555px" }}>
              <CodeEditor state={state} />
            </div>

            {/* Terminal — only under code editor */}
            <TerminalPanel />
          </div>

          {/* Right column: chat panel */}
          <AIChatPanel state={state} />
        </div>

        {/* Status bar */}
        <StatusBar />
      </div>

      {/* Shadow/glow beneath the IDE */}
      <div
        className="pointer-events-none absolute -bottom-20 left-1/2 -translate-x-1/2 w-[90%] h-40 z-0"
        style={{
          background: "radial-gradient(ellipse at center, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 40%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />
    </div>
  );
}
