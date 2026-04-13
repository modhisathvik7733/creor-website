import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Download, Apple, Monitor, CheckCircle2 } from "lucide-react";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Download",
  description:
    "Download Creor — the AI-native code editor. Available for macOS and Windows.",
  path: "/download",
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

export default function DownloadPage() {
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
          <p className="mx-auto mt-4 max-w-md text-[16px] text-white/40">
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
                <span className="absolute -top-2.5 rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-[10px] font-medium text-indigo-400">
                  Recommended
                </span>
              )}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.06] transition-colors group-hover:bg-white/[0.10]">
                <p.icon className="h-5 w-5 text-white/50" />
              </div>
              <div>
                <p className="text-[14px] font-semibold">{p.name}</p>
                <p className="mt-0.5 text-[12px] text-white/30">{p.desc}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.10] bg-white/[0.04] px-4 py-1.5 text-[12px] font-medium text-white/60 transition-all group-hover:border-white/[0.20] group-hover:bg-white/[0.08]">
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
                <span className="text-[13px] text-white/45">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Requirements */}
        <div className="mt-6 rounded-xl border border-white/[0.08] bg-white/[0.02] p-8">
          <h2 className="text-lg font-semibold">System Requirements</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-[12px] font-medium uppercase tracking-wider text-white/30">
                macOS
              </p>
              <ul className="mt-2 space-y-1.5 text-[13px] text-white/40">
                <li>macOS 12+ (Monterey or later)</li>
                <li>Apple Silicon or Intel</li>
                <li>4 GB RAM minimum</li>
              </ul>
            </div>
            <div>
              <p className="text-[12px] font-medium uppercase tracking-wider text-white/30">
                Windows
              </p>
              <ul className="mt-2 space-y-1.5 text-[13px] text-white/40">
                <li>Windows 10/11 (64-bit)</li>
                <li>x64 processor</li>
                <li>4 GB RAM minimum</li>
              </ul>
            </div>
          </div>
          <p className="mt-5 text-[12px] text-white/20">
            500 MB disk space required. 8 GB RAM recommended for large projects.
          </p>
        </div>

        {/* Install via terminal */}
        <div className="mt-6 rounded-xl border border-white/[0.08] bg-white/[0.02] p-8">
          <h2 className="text-lg font-semibold">
            Or install via terminal
          </h2>
          <p className="mt-1.5 text-[13px] text-white/30">
            One command. Auto-detects your OS and architecture.
          </p>
          <div className="mt-4 rounded-lg bg-[#111113] px-4 py-3">
            <code className="font-mono text-[13px] text-emerald-400/70">
              curl -fsSL https://creor.ai/install.sh | sh
            </code>
          </div>
          <p className="mt-3 text-[11px] text-white/20">
            Works on macOS (Apple Silicon &amp; Intel) and Windows (via WSL or Git Bash).
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
