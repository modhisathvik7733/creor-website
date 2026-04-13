import Link from "next/link";
import {
  Search,
  ArrowRight,
  Zap,
  Download,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FadeIn } from "@/components/fade-in";
import { GridBackground } from "@/components/grid-background";
import {
  OrganizationSchema,
  SoftwareApplicationSchema,
} from "@/components/structured-data";

import { ProviderMarquee } from "@/components/provider-marquee";
import { AnimatedHero } from "@/components/animated-hero";
import { FeatureSections } from "@/components/feature-sections";

/* ─── Data ─── */

/* stats row removed — replaced by ProviderMarquee */



const steps = [
  {
    step: "01",
    title: "Download & Open",
    description:
      "Get Creor for macOS, Windows, or Linux. Open any project — your codebase is automatically mapped and ready for AI.",
    icon: Download,
  },
  {
    step: "02",
    title: "Choose Your Model",
    description:
      "Bring your own API keys from Anthropic, OpenAI, Google — or subscribe to Creor Gateway for unified billing across 19+ providers. Switch models anytime.",
    icon: Search,
  },
  {
    step: "03",
    title: "Agents Build, You Ship",
    description:
      "Describe what you want. Agents plan the approach, write the code, run the tests. Review inline diffs, approve changes, iterate \u2014 all without leaving the editor.",
    icon: Zap,
  },
];


/* ─── Page ─── */

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <OrganizationSchema />
      <SoftwareApplicationSchema />
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative h-auto pb-16 lg:h-[160vh]">
        <GridBackground />
        <AnimatedHero />
      </section>

      {/* ── Provider Marquee ── */}
      <ProviderMarquee />

      {/* ── Feature Sections ── */}
      <FeatureSections />

      {/* ── How It Works + CTA ── */}
      <section className="px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-[1100px]">
          <FadeIn>
            <h2 className="mb-3 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Get started in minutes
            </h2>
            <p className="mx-auto mb-14 max-w-md text-center text-[14px] leading-relaxed text-white/40">
              From download to shipping code — three steps.
            </p>
          </FadeIn>

          {/* Step cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            {steps.map((item, i) => {
              const Icon = item.icon;
              return (
                <FadeIn key={item.step} delay={i * 120}>
                  <div className="group relative flex h-full flex-col rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-colors hover:border-white/[0.12] hover:bg-white/[0.04]">
                    {/* Top row: icon + step number */}
                    <div className="mb-5 flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/[0.08]">
                        <Icon className="h-[18px] w-[18px] text-indigo-400/70" />
                      </div>
                      <span className="font-mono text-[12px] font-medium text-white/15">
                        Step {item.step}
                      </span>
                    </div>
                    <h3 className="mb-2 text-[16px] font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="text-[13px] leading-relaxed text-white/40">
                      {item.description}
                    </p>
                  </div>
                </FadeIn>
              );
            })}
          </div>

          {/* CTA */}
          <FadeIn delay={450}>
            <div className="mt-16 rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent px-6 py-14 text-center sm:mt-20 sm:px-12">
              <h3 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
                Ship faster. Stay in control.
              </h3>
              <p className="mb-8 text-[14px] text-foreground-secondary">
                Join the waitlist. Be the first to try Creor.
              </p>
              <div className="flex justify-center gap-3">
                <Link
                  href="/download"
                  className="glow-pulse group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-[14px] font-semibold text-background transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Join Waitlist
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-6 py-2.5 text-[14px] font-medium text-foreground transition-colors hover:bg-muted"
                >
                  See Pricing
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
