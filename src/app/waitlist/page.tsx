import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Download, Apple, Monitor, CheckCircle2, Gift, Key, Users } from "lucide-react";
import { ShareButton } from "./share-button";
import { generatePageMetadata } from "@/lib/metadata";
import { WaitlistForm } from "./waitlist-form";

/* ─── Feature flag: flip to false when downloads are ready ─── */
const SHOW_WAITLIST = true;

export const metadata: Metadata = generatePageMetadata({
  title: SHOW_WAITLIST ? "Get Early Access — Creor" : "Download",
  description: SHOW_WAITLIST
    ? "Join the Creor waitlist. Be the first to know when the AI-native code editor launches."
    : "Download Creor — the AI-native code editor. Available for macOS and Windows.",
  path: "/waitlist",
});

const GITHUB_REPO = "modhisathvik7733/creor-app";
const RELEASE_BASE = `https://github.com/${GITHUB_REPO}/releases/latest/download`;

const PLATFORMS = [
  {
    name: "macOS (Apple Silicon)",
    desc: "For M1/M2/M3/M4 Macs",
    file: "Creor-darwin-arm64.zip",
    href: `${RELEASE_BASE}/Creor-darwin-arm64.zip`,
    icon: Apple,
    recommended: true,
  },
  {
    name: "macOS (Intel)",
    desc: "For Intel-based Macs",
    file: "Creor-darwin-x64.zip",
    href: `${RELEASE_BASE}/Creor-darwin-x64.zip`,
    icon: Apple,
    recommended: false,
  },
  {
    name: "Windows",
    desc: "Windows 10/11 (64-bit)",
    file: "Creor-win32-x64.zip",
    href: `${RELEASE_BASE}/Creor-win32-x64.zip`,
    icon: Monitor,
    recommended: false,
  },
];

const FEATURES = [
  "AI agents that write, plan, and debug code",
  "Works with Claude, GPT-4, Gemini, and more",
  "25+ built-in tools for file ops, search, and analysis",
  "MCP support for external integrations",
  "Your code never leaves your machine",
];

export default function WaitlistPage() {
  if (SHOW_WAITLIST) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-background">
        {/* Full-page background */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Grid pattern — visible */}
            <pattern id="wl-grid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M80 0H0v80" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
            </pattern>
            {/* Dot grid at intersections */}
            <pattern id="wl-dots" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="0" cy="0" r="1" fill="rgba(129,140,248,0.08)" />
            </pattern>
            {/* Top gradient */}
            <radialGradient id="wl-glow-top" cx="50%" cy="0%" r="60%">
              <stop offset="0%" stopColor="rgba(129,140,248,0.12)" />
              <stop offset="60%" stopColor="rgba(99,102,241,0.04)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            {/* Bottom gradient */}
            <radialGradient id="wl-glow-bottom" cx="50%" cy="100%" r="50%">
              <stop offset="0%" stopColor="rgba(129,140,248,0.04)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            {/* Sparkle/twinkle filter */}
            <filter id="sparkle-glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Base grid */}
          <rect width="100%" height="100%" fill="url(#wl-grid)" />
          <rect width="100%" height="100%" fill="url(#wl-dots)" />
          <rect width="100%" height="100%" fill="url(#wl-glow-top)" />
          <rect width="100%" height="100%" fill="url(#wl-glow-bottom)" />

          {/* ── Sparkle / twinkle stars ── */}
          {/* 4-point star sparkles with glow */}
          <g filter="url(#sparkle-glow)">
            {/* Top area sparkles */}
            <path d="M 200,80 L 202,74 L 204,80 L 202,86 Z" fill="rgba(129,140,248,0.35)" />
            <line x1="196" y1="80" x2="208" y2="80" stroke="rgba(129,140,248,0.2)" strokeWidth="0.5" />
            <line x1="202" y1="68" x2="202" y2="92" stroke="rgba(129,140,248,0.15)" strokeWidth="0.3" />

            <path d="M 1100,120 L 1102,115 L 1104,120 L 1102,125 Z" fill="rgba(59,130,246,0.3)" />
            <line x1="1096" y1="120" x2="1108" y2="120" stroke="rgba(59,130,246,0.18)" strokeWidth="0.5" />
            <line x1="1102" y1="110" x2="1102" y2="130" stroke="rgba(59,130,246,0.12)" strokeWidth="0.3" />

            <path d="M 700,60 L 701.5,55 L 703,60 L 701.5,65 Z" fill="rgba(245,158,11,0.3)" />
            <line x1="697" y1="60" x2="706" y2="60" stroke="rgba(245,158,11,0.18)" strokeWidth="0.4" />

            {/* Mid area sparkles */}
            <path d="M 80,350 L 82,344 L 84,350 L 82,356 Z" fill="rgba(129,140,248,0.25)" />
            <line x1="75" y1="350" x2="89" y2="350" stroke="rgba(129,140,248,0.15)" strokeWidth="0.4" />

            <path d="M 1300,400 L 1302,394 L 1304,400 L 1302,406 Z" fill="rgba(59,130,246,0.25)" />
            <line x1="1295" y1="400" x2="1309" y2="400" stroke="rgba(59,130,246,0.15)" strokeWidth="0.4" />

            <path d="M 500,320 L 501.5,316 L 503,320 L 501.5,324 Z" fill="rgba(245,158,11,0.2)" />

            {/* Bottom area sparkles */}
            <path d="M 300,650 L 302,644 L 304,650 L 302,656 Z" fill="rgba(16,185,129,0.25)" />
            <line x1="295" y1="650" x2="309" y2="650" stroke="rgba(16,185,129,0.15)" strokeWidth="0.4" />

            <path d="M 1000,700 L 1002,694 L 1004,700 L 1002,706 Z" fill="rgba(129,140,248,0.2)" />

            <path d="M 150,550 L 151.5,546 L 153,550 L 151.5,554 Z" fill="rgba(59,130,246,0.2)" />

            <path d="M 900,500 L 902,495 L 904,500 L 902,505 Z" fill="rgba(245,158,11,0.22)" />
            <line x1="896" y1="500" x2="908" y2="500" stroke="rgba(245,158,11,0.12)" strokeWidth="0.3" />
          </g>

          {/* ── Small bright dots (stars) ── */}
          <circle cx="5%" cy="12%" r="1.5" fill="rgba(129,140,248,0.2)" />
          <circle cx="15%" cy="6%" r="1" fill="rgba(255,255,255,0.12)" />
          <circle cx="30%" cy="3%" r="1.2" fill="rgba(59,130,246,0.18)" />
          <circle cx="55%" cy="8%" r="1" fill="rgba(255,255,255,0.1)" />
          <circle cx="72%" cy="5%" r="1.5" fill="rgba(129,140,248,0.15)" />
          <circle cx="88%" cy="10%" r="1" fill="rgba(245,158,11,0.15)" />
          <circle cx="95%" cy="30%" r="1.2" fill="rgba(255,255,255,0.08)" />
          <circle cx="3%" cy="45%" r="1" fill="rgba(59,130,246,0.12)" />
          <circle cx="97%" cy="55%" r="1.5" fill="rgba(129,140,248,0.12)" />
          <circle cx="8%" cy="70%" r="1" fill="rgba(245,158,11,0.12)" />
          <circle cx="92%" cy="80%" r="1.2" fill="rgba(16,185,129,0.12)" />
          <circle cx="40%" cy="92%" r="1" fill="rgba(255,255,255,0.08)" />
          <circle cx="65%" cy="88%" r="1.5" fill="rgba(129,140,248,0.1)" />
          <circle cx="20%" cy="95%" r="1" fill="rgba(59,130,246,0.1)" />

          {/* ── Code icons: angle brackets < > ── */}
          <g stroke="rgba(129,140,248,0.2)" strokeWidth="1.5" fill="none" strokeLinecap="round">
            <path d="M 120,140 L 100,160 L 120,180" />
            <path d="M 150,140 L 170,160 L 150,180" />
          </g>
          <g stroke="rgba(59,130,246,0.15)" strokeWidth="1.5" fill="none" strokeLinecap="round">
            <path d="M 1200,100 L 1180,120 L 1200,140" />
            <path d="M 1230,100 L 1250,120 L 1230,140" />
          </g>
          <g stroke="rgba(245,158,11,0.12)" strokeWidth="1.2" fill="none" strokeLinecap="round">
            <path d="M 1150,580 L 1135,595 L 1150,610" />
            <path d="M 1175,580 L 1190,595 L 1175,610" />
          </g>

          {/* ── Code icons: curly braces { } ── */}
          <g stroke="rgba(129,140,248,0.15)" strokeWidth="1.2" fill="none" strokeLinecap="round">
            <path d="M 70,420 C 60,420 55,428 55,438 L 55,455 C 55,462 48,468 40,468 C 48,468 55,474 55,481 L 55,498 C 55,508 60,516 70,516" />
            <path d="M 100,420 C 110,420 115,428 115,438 L 115,455 C 115,462 122,468 130,468 C 122,468 115,474 115,481 L 115,498 C 115,508 110,516 100,516" />
          </g>
          <g stroke="rgba(16,185,129,0.12)" strokeWidth="1.2" fill="none" strokeLinecap="round">
            <path d="M 1270,320 C 1262,320 1258,326 1258,334 L 1258,346 C 1258,352 1252,356 1246,356 C 1252,356 1258,360 1258,366 L 1258,378 C 1258,386 1262,392 1270,392" />
            <path d="M 1295,320 C 1303,320 1307,326 1307,334 L 1307,346 C 1307,352 1313,356 1319,356 C 1313,356 1307,360 1307,366 L 1307,378 C 1307,386 1303,392 1295,392" />
          </g>

          {/* ── Code icons: forward slash / (code separator) ── */}
          <line x1="340" y1="70" x2="320" y2="120" stroke="rgba(129,140,248,0.18)" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="1080" y1="520" x2="1060" y2="570" stroke="rgba(59,130,246,0.12)" strokeWidth="1" strokeLinecap="round" />

          {/* ── Code icons: hash # ── */}
          <g stroke="rgba(245,158,11,0.15)" strokeWidth="1" strokeLinecap="round">
            <line x1="1160" y1="440" x2="1155" y2="470" />
            <line x1="1175" y1="440" x2="1170" y2="470" />
            <line x1="1150" y1="450" x2="1180" y2="450" />
            <line x1="1148" y1="460" x2="1178" y2="460" />
          </g>
          <g stroke="rgba(129,140,248,0.12)" strokeWidth="1" strokeLinecap="round">
            <line x1="250" y1="600" x2="245" y2="630" />
            <line x1="265" y1="600" x2="260" y2="630" />
            <line x1="240" y1="610" x2="270" y2="610" />
            <line x1="238" y1="620" x2="268" y2="620" />
          </g>

          {/* ── Code icons: semicolons ; ── */}
          <g fill="rgba(59,130,246,0.18)">
            <circle cx="180" cy="260" r="2" />
            <ellipse cx="179" cy="270" rx="2" ry="3" />
          </g>
          <g fill="rgba(129,140,248,0.15)">
            <circle cx="1050" cy="250" r="1.8" />
            <ellipse cx="1049" cy="259" rx="1.8" ry="2.5" />
          </g>

          {/* ── Code icons: equals == ── */}
          <g stroke="rgba(16,185,129,0.15)" strokeWidth="1.2" strokeLinecap="round">
            <line x1="380" y1="700" x2="410" y2="700" />
            <line x1="380" y1="708" x2="410" y2="708" />
          </g>

          {/* ── Code icons: arrow function => ── */}
          <g stroke="rgba(129,140,248,0.14)" strokeWidth="1.2" strokeLinecap="round">
            <line x1="850" y1="90" x2="880" y2="90" />
            <line x1="850" y1="98" x2="880" y2="98" />
            <path d="M 885,86 L 895,94 L 885,102" fill="none" />
          </g>

          {/* ── Code icons: parentheses ( ) ── */}
          <g stroke="rgba(245,158,11,0.14)" strokeWidth="1.2" fill="none" strokeLinecap="round">
            <path d="M 560,680 C 548,695 548,715 560,730" />
            <path d="M 585,680 C 597,695 597,715 585,730" />
          </g>

          {/* ── Code icons: square brackets [ ] ── */}
          <g stroke="rgba(59,130,246,0.14)" strokeWidth="1.2" fill="none" strokeLinecap="round">
            <path d="M 960,620 L 950,620 L 950,660 L 960,660" />
            <path d="M 990,620 L 1000,620 L 1000,660 L 990,660" />
          </g>

          {/* ── Code text snippets (faint) ── */}
          <text x="60" y="220" fill="rgba(129,140,248,0.08)" fontSize="11" fontFamily="monospace">const</text>
          <text x="1180" y="220" fill="rgba(59,130,246,0.07)" fontSize="10" fontFamily="monospace">async</text>
          <text x="1100" y="650" fill="rgba(245,158,11,0.06)" fontSize="10" fontFamily="monospace">return</text>
          <text x="200" y="500" fill="rgba(16,185,129,0.06)" fontSize="10" fontFamily="monospace">import</text>
          <text x="950" y="160" fill="rgba(129,140,248,0.06)" fontSize="9" fontFamily="monospace">export</text>
          <text x="300" y="760" fill="rgba(59,130,246,0.06)" fontSize="10" fontFamily="monospace">await</text>

          {/* ── Concentric circles ── */}
          <circle cx="8%" cy="22%" r="180" fill="none" stroke="rgba(129,140,248,0.06)" strokeWidth="0.5" />
          <circle cx="8%" cy="22%" r="120" fill="none" stroke="rgba(129,140,248,0.04)" strokeWidth="0.5" />
          <circle cx="93%" cy="75%" r="160" fill="none" stroke="rgba(245,158,11,0.05)" strokeWidth="0.5" />
          <circle cx="93%" cy="75%" r="100" fill="none" stroke="rgba(245,158,11,0.03)" strokeWidth="0.5" />

          {/* ── Dashed orbit rings ── */}
          <circle cx="50%" cy="40%" r="350" fill="none" stroke="rgba(129,140,248,0.04)" strokeWidth="0.5" strokeDasharray="6 14" />
          <circle cx="50%" cy="40%" r="480" fill="none" stroke="rgba(99,102,241,0.03)" strokeWidth="0.5" strokeDasharray="4 18" />

          {/* ── Diagonal accent lines ── */}
          <line x1="0" y1="25%" x2="20%" y2="0" stroke="rgba(129,140,248,0.06)" strokeWidth="0.5" />
          <line x1="80%" y1="100%" x2="100%" y2="65%" stroke="rgba(59,130,246,0.05)" strokeWidth="0.5" />
          <line x1="0" y1="75%" x2="12%" y2="100%" stroke="rgba(245,158,11,0.04)" strokeWidth="0.5" />
          <line x1="88%" y1="0" x2="100%" y2="20%" stroke="rgba(129,140,248,0.04)" strokeWidth="0.5" />

          {/* ── Hexagons ── */}
          <path d="M 450,40 L 470,28 L 490,40 L 490,64 L 470,76 L 450,64 Z" fill="none" stroke="rgba(129,140,248,0.1)" strokeWidth="0.8" />
          <path d="M 1050,340 L 1068,329 L 1086,340 L 1086,362 L 1068,373 L 1050,362 Z" fill="none" stroke="rgba(59,130,246,0.08)" strokeWidth="0.8" />
          <path d="M 180,680 L 198,669 L 216,680 L 216,702 L 198,713 L 180,702 Z" fill="none" stroke="rgba(245,158,11,0.07)" strokeWidth="0.8" />

          {/* ── Diamonds ── */}
          <path d="M 750,50 L 762,38 L 774,50 L 762,62 Z" fill="none" stroke="rgba(129,140,248,0.1)" strokeWidth="0.8" />
          <path d="M 100,300 L 110,290 L 120,300 L 110,310 Z" fill="none" stroke="rgba(59,130,246,0.08)" strokeWidth="0.8" />
          <path d="M 1200,550 L 1210,540 L 1220,550 L 1210,560 Z" fill="none" stroke="rgba(245,158,11,0.07)" strokeWidth="0.8" />

          {/* ── Plus/cross markers ── */}
          <g stroke="rgba(129,140,248,0.15)" strokeWidth="1" strokeLinecap="round">
            <line x1="620" y1="30" x2="620" y2="50" />
            <line x1="610" y1="40" x2="630" y2="40" />
          </g>
          <g stroke="rgba(59,130,246,0.12)" strokeWidth="1" strokeLinecap="round">
            <line x1="1250" y1="180" x2="1250" y2="200" />
            <line x1="1240" y1="190" x2="1260" y2="190" />
          </g>
          <g stroke="rgba(245,158,11,0.1)" strokeWidth="1" strokeLinecap="round">
            <line x1="350" y1="550" x2="350" y2="570" />
            <line x1="340" y1="560" x2="360" y2="560" />
          </g>
          <g stroke="rgba(16,185,129,0.1)" strokeWidth="1" strokeLinecap="round">
            <line x1="800" y1="680" x2="800" y2="700" />
            <line x1="790" y1="690" x2="810" y2="690" />
          </g>
          <g stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" strokeLinecap="round">
            <line x1="1150" y1="750" x2="1150" y2="766" />
            <line x1="1142" y1="758" x2="1158" y2="758" />
          </g>

          {/* ── Small rotated squares ── */}
          <rect x="300" y="160" width="14" height="14" rx="2" fill="none" stroke="rgba(129,140,248,0.12)" strokeWidth="0.8" transform="rotate(45,307,167)" />
          <rect x="1000" y="80" width="12" height="12" rx="2" fill="none" stroke="rgba(59,130,246,0.1)" strokeWidth="0.8" transform="rotate(30,1006,86)" />
          <rect x="700" y="720" width="10" height="10" rx="1.5" fill="none" stroke="rgba(245,158,11,0.08)" strokeWidth="0.8" transform="rotate(15,705,725)" />
          <rect x="50" y="650" width="12" height="12" rx="2" fill="none" stroke="rgba(16,185,129,0.08)" strokeWidth="0.8" transform="rotate(-20,56,656)" />

          {/* ── Triangles ── */}
          <path d="M 550,30 L 570,60 L 530,60 Z" fill="none" stroke="rgba(129,140,248,0.08)" strokeWidth="0.8" />
          <path d="M 1300,500 L 1318,528 L 1282,528 Z" fill="none" stroke="rgba(59,130,246,0.07)" strokeWidth="0.8" />
          <path d="M 420,750 L 438,778 L 402,778 Z" fill="none" stroke="rgba(245,158,11,0.06)" strokeWidth="0.8" />
        </svg>

        {/* Blurred orbs */}
        <div className="pointer-events-none absolute top-[10%] left-[5%] h-[400px] w-[400px] rounded-full bg-indigo-500/[0.07] blur-[130px]" />
        <div className="pointer-events-none absolute top-[5%] right-[8%] h-[300px] w-[300px] rounded-full bg-blue-500/[0.05] blur-[110px]" />
        <div className="pointer-events-none absolute bottom-[10%] right-[5%] h-[350px] w-[350px] rounded-full bg-indigo-500/[0.04] blur-[110px]" />
        <div className="pointer-events-none absolute bottom-[15%] left-[15%] h-[280px] w-[280px] rounded-full bg-blue-500/[0.03] blur-[90px]" />

        <Navbar />

        <main className="relative z-10 px-6 pt-28 pb-20">
          {/* Hero — full width */}
          <div className="mx-auto max-w-[700px] text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/[0.06] px-4 py-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-400" />
              <span className="text-[14px] font-medium text-indigo-400">
                Launching soon
              </span>
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Be the first to try{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                Creor
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-[18px] leading-relaxed text-white/40">
              The AI-native code editor with specialized agents, BYOK support,
              and full control over every action. Join the waitlist.
            </p>
          </div>

          {/* Waitlist form — full width contained */}
          <div className="mx-auto mt-10 max-w-[540px]">
            <WaitlistForm />
          </div>

          {/* Share */}
          <div className="mx-auto mt-4 flex justify-center">
            <ShareButton />
          </div>

          {/* Three-column features */}
          <div className="mx-auto mt-16 grid max-w-[1100px] gap-5 md:grid-cols-3">
            {/* Early bird */}
            <div className="overflow-hidden rounded-2xl border border-amber-500/20 bg-[#141416]">
              <div className="flex items-center gap-2 border-b border-amber-500/10 bg-amber-500/[0.06] px-4 py-2">
                <Gift className="h-4 w-4 text-amber-400" />
                <span className="text-[13px] font-semibold text-amber-300">
                  Early Bird
                </span>
                <span className="ml-auto rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-[12px] font-semibold text-amber-300">
                  First 500
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-2xl font-bold text-white/85">3 months free</h3>
                <p className="mt-1 text-[15px] text-white/35">
                  BYOK plan worth{" "}
                  <span className="line-through text-white/20">$27</span>{" "}
                  <span className="font-bold text-amber-400">$0</span>
                </p>
                <div className="mt-4 space-y-2">
                  <div className="rounded-lg border border-indigo-500/15 bg-indigo-500/[0.06] p-3">
                    <div className="flex items-center gap-2">
                      <Key className="h-3.5 w-3.5 text-indigo-400/70" />
                      <span className="text-[13px] font-medium text-white/60">Bring Your Own Key</span>
                    </div>
                    <p className="mt-1 text-[12px] text-white/25">
                      Any provider. No caps. $9/mo after.
                    </p>
                  </div>
                  <div className="rounded-lg border border-white/[0.06] bg-white/[0.04] p-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-emerald-400/70" />
                      <span className="text-[13px] font-medium text-white/60">Creor Auth</span>
                    </div>
                    <p className="mt-1 text-[12px] text-white/25">
                      GitHub/Google login. Managed access.
                    </p>
                  </div>
                </div>
                <div className="mt-4 rounded-lg border border-amber-500/15 bg-amber-500/[0.06] px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[17px]">🎟</span>
                    <span className="text-[15px] font-semibold text-amber-300/90">Free coupon emailed at launch</span>
                  </div>
                  <p className="mt-1 pl-[30px] text-[13px] text-white/30">
                    First 500 signups get a 3-month BYOK coupon — no card needed.
                  </p>
                </div>
              </div>
            </div>

            {/* What's included */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#141416] p-5">
              <h2 className="mb-4 text-[16px] font-semibold text-white/60">
                What&apos;s included
              </h2>
              <div className="space-y-3">
                {[
                  "AI agents that write, plan, and debug",
                  "Claude, GPT-4, Gemini, 15+ providers",
                  "25+ built-in tools",
                  "MCP for external integrations",
                  "Code never leaves your machine",
                  "Full hooks & permissions control",
                  "Interactive terminal when needed",
                  "Snapshot revert & diff preview",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400/60" />
                    <span className="text-[14px] text-white/40">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column: platforms + how it works */}
            <div className="flex flex-col gap-5">
              {/* Platforms */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#141416] p-5">
                <h2 className="mb-3 text-[16px] font-semibold text-white/60">
                  Available on
                </h2>
                <div className="space-y-2">
                  {[
                    { icon: Apple, name: "macOS", desc: "Apple Silicon & Intel" },
                    { icon: Monitor, name: "Windows", desc: "Windows 10/11 (64-bit)" },
                  ].map((p) => (
                    <div
                      key={p.name}
                      className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.04] px-3.5 py-3"
                    >
                      <p.icon className="h-5 w-5 text-white/30" />
                      <div>
                        <p className="text-[14px] font-medium text-white/50">{p.name}</p>
                        <p className="text-[12px] text-white/20">{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* How it works */}
              <div className="flex-1 rounded-2xl border border-white/[0.08] bg-[#141416] p-5">
                <h2 className="mb-4 text-[16px] font-semibold text-white/60">
                  How it works
                </h2>
                <div className="space-y-4">
                  {[
                    { step: "1", text: "Join the waitlist with your email" },
                    { step: "2", text: "We notify you when Creor launches" },
                    { step: "3", text: "First 500 get a free 3-month coupon" },
                    { step: "4", text: "Download, paste your API key, start coding" },
                  ].map((s) => (
                    <div key={s.step} className="flex items-start gap-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-[12px] font-bold text-white/40">
                        {s.step}
                      </span>
                      <span className="text-[14px] text-white/35">{s.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-[900px] px-6 pt-32 pb-20">
        {/* Hero */}
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.03] shadow-[0_0_40px_rgba(129,140,248,0.1)]">
            <Download className="h-7 w-7 text-white/60" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Download Creor
          </h1>
          <p className="mx-auto mt-4 max-w-md text-[18px] text-white/40">
            The AI-native code editor. Multi-provider, built for speed.
          </p>
        </div>

        {/* Download Cards */}
        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {PLATFORMS.map((p) => (
            <a
              key={p.name}
              href={p.href}
              className="group relative flex flex-col items-center gap-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 text-center transition-all hover:border-white/[0.15] hover:bg-white/[0.04]"
            >
              {p.recommended && (
                <span className="absolute -top-2.5 rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-[12px] font-medium text-indigo-400">
                  Recommended
                </span>
              )}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.06] transition-colors group-hover:bg-white/[0.10]">
                <p.icon className="h-5 w-5 text-white/50" />
              </div>
              <div>
                <p className="text-[16px] font-semibold">{p.name}</p>
                <p className="mt-0.5 text-[14px] text-white/30">{p.desc}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.10] bg-white/[0.04] px-4 py-1.5 text-[14px] font-medium text-white/60 transition-all group-hover:border-white/[0.20] group-hover:bg-white/[0.08]">
                <Download className="h-3.5 w-3.5" />
                Download
              </span>
            </a>
          ))}
        </div>

        {/* What's included */}
        <div className="mt-16 rounded-xl border border-white/[0.08] bg-white/[0.02] p-8">
          <h2 className="text-lg font-semibold">What&apos;s included</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div key={f} className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400/60" />
                <span className="text-[15px] text-white/45">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Requirements */}
        <div className="mt-6 rounded-xl border border-white/[0.08] bg-white/[0.02] p-8">
          <h2 className="text-lg font-semibold">System Requirements</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-[14px] font-medium uppercase tracking-wider text-white/30">
                macOS
              </p>
              <ul className="mt-2 space-y-1.5 text-[15px] text-white/40">
                <li>macOS 12+ (Monterey or later)</li>
                <li>Apple Silicon or Intel</li>
                <li>4 GB RAM minimum</li>
              </ul>
            </div>
            <div>
              <p className="text-[14px] font-medium uppercase tracking-wider text-white/30">
                Windows
              </p>
              <ul className="mt-2 space-y-1.5 text-[15px] text-white/40">
                <li>Windows 10/11 (64-bit)</li>
                <li>x64 processor</li>
                <li>4 GB RAM minimum</li>
              </ul>
            </div>
          </div>
          <p className="mt-5 text-[14px] text-white/20">
            500 MB disk space required. 8 GB RAM recommended for large projects.
          </p>
        </div>

        {/* Install via terminal */}
        <div className="mt-6 rounded-xl border border-white/[0.08] bg-white/[0.02] p-8">
          <h2 className="text-lg font-semibold">Or install via terminal</h2>
          <p className="mt-1.5 text-[15px] text-white/30">
            One command. Auto-detects your OS and architecture.
          </p>
          <div className="mt-4 rounded-lg bg-[#111113] px-4 py-3">
            <code className="font-mono text-[15px] text-emerald-400/70">
              curl -fsSL https://creor.ai/install.sh | sh
            </code>
          </div>
          <p className="mt-3 text-[13px] text-white/20">
            Works on macOS (Apple Silicon &amp; Intel) and Windows (via WSL or
            Git Bash).
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
