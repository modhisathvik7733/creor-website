import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function BlogCta() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent px-6 py-10 text-center sm:px-10">
      <p className="mb-2 text-[13px] font-medium uppercase tracking-wider text-white/30">
        Built for developers
      </p>
      <h3 className="mb-3 text-xl font-bold tracking-tight sm:text-2xl">
        Try Creor — the AI-native code editor
      </h3>
      <p className="mx-auto mb-6 max-w-md text-[14px] text-white/40">
        Open source. 19+ LLM providers. Built-in agents. No vendor lock-in.
        See what AI-native development actually feels like.
      </p>
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/download"
          className="glow-pulse group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-[14px] font-semibold text-background transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Join Waitlist
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link
          href="https://github.com/modhisathvik7733/creor-app"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-6 py-2.5 text-[14px] font-medium text-foreground transition-colors hover:bg-muted"
        >
          Star on GitHub
        </Link>
      </div>
    </div>
  );
}
