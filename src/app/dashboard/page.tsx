"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  Wallet,
  Zap,
  Key,
  ArrowUpRight,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface DashboardData {
  balance: number;
  requests: number;
  keys: number;
  plan: string | null;
  planPrice: number | null;
  monthlyPct: number | null;
  monthlyCurrent: number | null;
  monthlyMax: number | null;
  canSend: boolean;
  daily: Array<{ date: string; cost: number; requests: number }>;
  nextPlan: { id: string; name: string; price: number } | null;
}

function formatAmount(amount: number): string {
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function DashboardOverview() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getQuota().catch(() => null),
      api.getUsage().catch(() => null),
      api.getKeys().catch(() => []),
      api.getUsageDaily().catch(() => []),
      api.getPlans().catch(() => ({ plans: [] })),
      api.getSubscription().catch(() => null),
    ])
      .then(([quota, usage, keys, daily, plansData, sub]) => {
        const currentPlanId = quota?.plan?.id ?? sub?.plan ?? "free";
        const plans = plansData?.plans ?? [];
        const planOrder = ["free", "starter", "pro"];
        const currentIdx = planOrder.indexOf(currentPlanId);
        const nextPlan =
          currentIdx >= 0 && currentIdx < planOrder.length - 1
            ? plans.find((p) => p.id === planOrder[currentIdx + 1]) ?? null
            : null;

        setData({
          balance: quota?.balance ?? 0,
          requests: usage?.requests ?? 0,
          keys: keys?.length ?? 0,
          plan: quota?.plan?.name ?? null,
          planPrice: quota?.plan?.price ?? null,
          monthlyPct: quota?.monthly?.pct ?? null,
          monthlyCurrent: quota?.monthly?.current ?? null,
          monthlyMax: quota?.monthly?.max ?? null,
          canSend: quota?.canSend ?? true,
          daily: daily ?? [],
          nextPlan,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-foreground" />
      </div>
    );
  }

  const maxDailyReqs = Math.max(...(data?.daily.map((d) => d.requests) ?? []), 1);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Stop writing code. Start creating it.
        </p>
      </div>

      {/* ── Plan Banner ── */}
      <div className="mb-6 rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/[0.08]">
              <Sparkles className="h-5 w-5 text-foreground/60" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-semibold">
                  {data?.plan ?? "Free"} Plan
                </span>
                {data?.planPrice != null && data.planPrice > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {formatAmount(data.planPrice)}/mo
                  </span>
                )}
              </div>
              {data?.monthlyPct != null && (
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-1.5 w-40 overflow-hidden rounded-full bg-foreground/[0.08]">
                    <div
                      className="h-full rounded-full bg-foreground/50 transition-all"
                      style={{ width: `${Math.min(data.monthlyPct, 100)}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {data.monthlyPct}% used
                    {data.monthlyCurrent != null && data.monthlyMax != null && (
                      <> &middot; {formatAmount(data.monthlyCurrent)} / {formatAmount(data.monthlyMax)}</>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          {data?.nextPlan && (
            <Link
              href="/dashboard/billing"
              className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Upgrade to {data.nextPlan.name}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* ── Stats Grid (3 cards) ── */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Link
          href="/dashboard/billing"
          className="rounded-xl border border-border bg-card p-5 transition-colors hover:bg-muted"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Balance</span>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-3xl font-bold">
            {data ? formatAmount(data.balance) : "—"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {data?.plan ? `${data.plan} plan` : "Free plan"}
          </p>
        </Link>

        <Link
          href="/dashboard/usage"
          className="rounded-xl border border-border bg-card p-5 transition-colors hover:bg-muted"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Requests (this month)
            </span>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-3xl font-bold">
            {data?.requests.toLocaleString() ?? "—"}
          </p>
          {data?.monthlyPct != null && (
            <p className="mt-1 text-xs text-muted-foreground">
              {data.monthlyPct}% of limit used
            </p>
          )}
        </Link>

        <Link
          href="/dashboard/keys"
          className="rounded-xl border border-border bg-card p-5 transition-colors hover:bg-muted"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">API Keys</span>
            <Key className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-3xl font-bold">
            {data?.keys.toString() ?? "—"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {data?.keys === 0 ? "Create your first key" : "Active keys"}
          </p>
        </Link>
      </div>

      {/* ── Daily Activity ── */}
      {data?.daily && data.daily.length > 0 && (
        <div className="mb-6 rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">Activity</h2>
            </div>
            <Link
              href="/dashboard/usage"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              View details
            </Link>
          </div>

          <div className="flex items-end gap-[3px]" style={{ height: 96 }}>
            {data.daily.map((d) => {
              const pct = Math.max((d.requests / maxDailyReqs) * 100, 3);
              return (
                <div
                  key={d.date}
                  className="group relative flex-1"
                  style={{ height: "100%" }}
                >
                  <div
                    className="absolute bottom-0 w-full rounded-sm bg-foreground/15 transition-colors group-hover:bg-foreground/35"
                    style={{ height: `${pct}%` }}
                  />
                  <div className="pointer-events-none absolute -top-7 left-1/2 hidden -translate-x-1/2 rounded bg-foreground px-2 py-0.5 text-[10px] text-background whitespace-nowrap group-hover:block">
                    {d.requests} req &middot; {d.date.slice(5)}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
            <span>{data.daily[0]?.date.slice(5)}</span>
            <span>Last 30 days</span>
            <span>{data.daily[data.daily.length - 1]?.date.slice(5)}</span>
          </div>
        </div>
      )}

      {/* ── Quick Actions ── */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold">Quick Actions</h2>
        </div>
        <div className="divide-y divide-border">
          {[
            {
              label: "Add Credits",
              desc: "Top up your balance",
              href: "/dashboard/billing",
            },
            {
              label: "Create API Key",
              desc: "Generate a key for the Creor Gateway",
              href: "/dashboard/keys",
            },
            {
              label: "View Usage",
              desc: "See requests and cost breakdown by model",
              href: "/dashboard/usage",
            },
            {
              label: "Download Creor IDE",
              desc: "Get the desktop app for your platform",
              href: "/waitlist",
            },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex w-full items-center justify-between px-5 py-3.5 text-left transition-colors hover:bg-muted"
            >
              <div>
                <p className="text-sm font-medium">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.desc}</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
