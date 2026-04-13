import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { generatePageMetadata } from "@/lib/metadata";
import { Navbar } from "@/components/navbar";
import { FadeIn } from "@/components/fade-in";

export const metadata: Metadata = generatePageMetadata({
  title: "Pricing",
  description:
    "Simple, transparent pricing for Creor. Use free with your own API keys or subscribe to Creor Gateway for one key, all models.",
  path: "/pricing",
});

const PLANS = [
  {
    name: "Free",
    price: 0,
    period: null,
    desc: "Try Creor with your own API keys",
    badge: null,
    features: [
      "All models",
      "$0.50/month included usage",
      "Top up anytime",
    ],
    cta: "Download Free",
    href: "/waitlist",
    highlighted: false,
  },
  {
    name: "Starter",
    price: 18,
    period: "/month",
    desc: "One key, all models",
    badge: null,
    features: [
      "All models",
      "$6/month included usage",
      "Email support",
    ],
    cta: "Get Starter",
    href: "/login",
    highlighted: false,
  },
  {
    name: "Pro",
    price: 42,
    period: "/month",
    desc: "More usage, priority access",
    badge: "Most popular",
    features: [
      "All models",
      "$24/month included usage",
      "Priority model access",
      "Priority support",
    ],
    cta: "Get Pro",
    href: "/login",
    highlighted: true,
  },
  {
    name: "BYOK",
    price: 9,
    period: "/month",
    desc: "Your own keys, no quotas",
    badge: null,
    features: [
      "Bring your own API keys",
      "No usage limits",
      "Skip all quota checks",
    ],
    cta: "Get BYOK",
    href: "/login",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="px-6 pb-4 pt-32 sm:pt-40">
        <FadeIn>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Simple, transparent pricing
            </h1>
            <p className="mt-4 text-[17px] leading-relaxed text-white/40 sm:text-lg">
              Use Creor free with your own API keys, or subscribe for the Creor
              Gateway — one key, all models. Pay only for what you use.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* All 4 plans */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto grid max-w-[1280px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan, idx) => (
            <FadeIn key={plan.name} delay={idx * 100}>
              <div
                className={`relative flex h-full flex-col rounded-2xl border p-6 transition-colors ${
                  plan.highlighted
                    ? "border-indigo-500/30 bg-indigo-500/[0.04]"
                    : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]"
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-6">
                    <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-[13px] font-medium text-indigo-300">
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Header */}
                <div className="mb-5">
                  <h2 className="text-[19px] font-semibold text-white">{plan.name}</h2>
                  <p className="mt-1 text-[14px] text-white/35">{plan.desc}</p>
                </div>

                {/* Price */}
                <div className="mb-5">
                  {plan.price === 0 ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold tracking-tight text-white">Free</span>
                      <span className="text-[14px] text-white/25">forever</span>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-[14px] text-white/25">$</span>
                      <span className="text-3xl font-bold tracking-tight text-white">
                        {plan.price}
                      </span>
                      <span className="text-[14px] text-white/25">{plan.period}</span>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <Link
                  href={plan.href}
                  className={`group mb-6 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-[15px] font-medium transition-all ${
                    plan.highlighted
                      ? "bg-white text-black hover:bg-white/90"
                      : "border border-white/[0.1] bg-white/[0.04] text-white/80 hover:border-white/[0.2] hover:bg-white/[0.08]"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>

                {/* Divider */}
                <div className="mb-5 h-px bg-white/[0.06]" />

                {/* Features */}
                <ul className="flex-1 space-y-2.5">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-[14px] leading-relaxed text-white/45"
                    >
                      <Check className={`mt-0.5 h-3.5 w-3.5 flex-shrink-0 ${
                        plan.highlighted ? "text-indigo-400/70" : "text-white/25"
                      }`} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Footer note */}
      <div className="border-t border-white/[0.06] px-6 py-8 text-center text-[14px] text-white/20">
        All prices in USD. Billed monthly. Cancel anytime. Extra usage billed at pay-as-you-go rates.
      </div>
    </div>
  );
}
