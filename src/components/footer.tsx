import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] px-6 pt-16 pb-10">
      <div className="mx-auto max-w-[1100px]">
        <div className="grid gap-12 sm:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2.5 transition-opacity hover:opacity-70">
              <img
                src="/creor-nobg-icon.png"
                alt="Creor"
                className="h-9 w-9"
              />
              <span className="text-[16px] font-semibold tracking-[-0.03em] text-white">
                Creor
              </span>
            </Link>
            <p className="mt-3 max-w-[200px] text-[13px] leading-relaxed text-white/30">
              The AI-native code editor. Ship faster with agents that understand your codebase.
            </p>
          </div>

          {/* Link columns */}
          <div className="text-[13px]">
            <p className="mb-4 text-[12px] font-medium uppercase tracking-wider text-white/50">Product</p>
            <div className="space-y-3 text-white/30">
              <Link href="/product/agents" className="block transition-colors hover:text-white/70">
                Agents
              </Link>
              <Link href="/product/editor" className="block transition-colors hover:text-white/70">
                Editor
              </Link>
              <Link href="/product/terminal" className="block transition-colors hover:text-white/70">
                Terminal
              </Link>
              <Link href="/product/search" className="block transition-colors hover:text-white/70">
                Code Search
              </Link>
            </div>
          </div>
          <div className="text-[13px]">
            <p className="mb-4 text-[12px] font-medium uppercase tracking-wider text-white/50">Resources</p>
            <div className="space-y-3 text-white/30">
              <Link href="/docs" className="block transition-colors hover:text-white/70">
                Docs
              </Link>
              <Link href="/blog" className="block transition-colors hover:text-white/70">
                Blog
              </Link>
              <Link href="/changelog" className="block transition-colors hover:text-white/70">
                Changelog
              </Link>
            </div>
          </div>
          <div className="text-[13px]">
            <p className="mb-4 text-[12px] font-medium uppercase tracking-wider text-white/50">Company</p>
            <div className="space-y-3 text-white/30">
              <Link href="/pricing" className="block transition-colors hover:text-white/70">
                Pricing
              </Link>
              <Link href="/enterprise" className="block transition-colors hover:text-white/70">
                Enterprise
              </Link>
            </div>
          </div>
          <div className="text-[13px]">
            <p className="mb-4 text-[12px] font-medium uppercase tracking-wider text-white/50">Connect</p>
            <div className="space-y-3 text-white/30">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 transition-colors hover:text-white/70"
              >
                Twitter <ArrowUpRight className="h-3 w-3" />
              </a>
              <Link href="/docs" className="block transition-colors hover:text-white/70">
                Support
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-6 text-[12px] text-white/25 sm:flex-row">
          <p>
            &copy; 2026 Creor &middot;{" "}
            <span className="italic text-white/15">Latin: to be created</span>
          </p>
          <div className="flex gap-5">
            <Link href="/privacy" className="transition-colors hover:text-white/50">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white/50">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
