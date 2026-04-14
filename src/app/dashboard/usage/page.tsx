"use client";

import { useEffect, useState, useMemo } from "react";
import { api } from "@/lib/api";
import {
  BarChart3, Cpu, DollarSign, Zap, Download, Search,
  ArrowUpRight, ArrowDownRight, ChevronUp, ChevronDown,
  Crown, Calendar,
} from "lucide-react";

interface UsageSummary {
  period: { start: string; end: string };
  cost: number;
  tokens: { input: number; output: number };
  requests: number;
  previousPeriod: { cost: number; requests: number };
  costChangePercent: number | null;
}

interface ModelUsage {
  model: string;
  cost: number;
  tokens: { input: number; output: number };
  requests: number;
}

interface DailyUsage {
  date: string;
  cost: number;
  requests: number;
}

type SortKey = "model" | "requests" | "input" | "output" | "cost";
type SortDir = "asc" | "desc";

const RANGES = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
  { label: "This Month", days: 0 },
] as const;

function formatUSD(amount: number): string {
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function getDateRange(days: number): { start: string; end: string } {
  const end = new Date();
  let start: Date;
  if (days === 0) {
    start = new Date(end.getFullYear(), end.getMonth(), 1);
  } else {
    start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
  }
  return { start: start.toISOString(), end: end.toISOString() };
}

function TrendBadge({ percent }: { percent: number | null }) {
  if (percent === null) return null;
  const isUp = percent > 0;
  const isZero = Math.abs(percent) < 0.5;
  if (isZero) return <span className="text-xs text-muted-foreground ml-2">No change</span>;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ml-2 ${isUp ? "text-red-400" : "text-emerald-400"}`}>
      {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
      {Math.abs(percent).toFixed(0)}%
    </span>
  );
}

export default function UsagePage() {
  const [summary, setSummary] = useState<UsageSummary | null>(null);
  const [byModel, setByModel] = useState<ModelUsage[]>([]);
  const [daily, setDaily] = useState<DailyUsage[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [rangeIdx, setRangeIdx] = useState(1); // default 30D
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("cost");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [searchQuery, setSearchQuery] = useState("");

  const activeRange = useMemo(() => {
    if (showCustom && customStart && customEnd) {
      return { start: new Date(customStart).toISOString(), end: new Date(customEnd + "T23:59:59").toISOString() };
    }
    return getDateRange(RANGES[rangeIdx].days);
  }, [rangeIdx, showCustom, customStart, customEnd]);

  useEffect(() => {
    let stale = false;
    Promise.all([
      api.getUsage(activeRange),
      api.getUsageByModel(activeRange),
      api.getUsageDaily(activeRange),
    ])
      .then(([s, m, d]) => {
        if (stale) return;
        setSummary(s);
        setByModel(m);
        setDaily(d);
        setLoaded(true);
      })
      .catch(() => {});
    return () => { stale = true; };
  }, [activeRange]);

  const loading = !loaded;

  // Sorted + filtered model data
  const filteredModels = useMemo(() => {
    let data = [...byModel];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter((m) => m.model.toLowerCase().includes(q));
    }
    data.sort((a, b) => {
      let va: number | string, vb: number | string;
      switch (sortKey) {
        case "model": va = a.model; vb = b.model; break;
        case "requests": va = a.requests; vb = b.requests; break;
        case "input": va = a.tokens.input; vb = b.tokens.input; break;
        case "output": va = a.tokens.output; vb = b.tokens.output; break;
        case "cost": va = a.cost; vb = b.cost; break;
        default: va = a.cost; vb = b.cost;
      }
      if (typeof va === "string") {
        return sortDir === "asc" ? va.localeCompare(vb as string) : (vb as string).localeCompare(va);
      }
      return sortDir === "asc" ? (va as number) - (vb as number) : (vb as number) - (va as number);
    });
    return data;
  }, [byModel, sortKey, sortDir, searchQuery]);

  const topModel = useMemo(() => {
    if (byModel.length === 0) return null;
    return byModel.reduce((top, m) => (m.cost > top.cost ? m : top));
  }, [byModel]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const handleExport = () => {
    const url = api.getUsageExportUrl(activeRange);
    window.open(url, "_blank");
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronDown className="h-3 w-3 opacity-0 group-hover:opacity-40" />;
    return sortDir === "asc"
      ? <ChevronUp className="h-3 w-3 opacity-70" />
      : <ChevronDown className="h-3 w-3 opacity-70" />;
  };

  const maxDailyCost = Math.max(...daily.map((d) => d.cost), 0.01);
  const rangeLabel = summary
    ? `${new Date(summary.period.start).toLocaleDateString("en-US", { month: "short", day: "numeric" })} — ${new Date(summary.period.end).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
    : "";

  if (loading && !summary) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-foreground" />
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Usage</h1>
          <p className="mt-1 text-sm text-muted-foreground">{rangeLabel}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Preset Range Buttons */}
          <div className="flex items-center rounded-lg border border-border bg-card overflow-hidden">
            {RANGES.map((r, i) => (
              <button
                key={r.label}
                onClick={() => { setRangeIdx(i); setShowCustom(false); }}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  rangeIdx === i && !showCustom
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r.label}
              </button>
            ))}
            <button
              onClick={() => setShowCustom(!showCustom)}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium transition-colors ${
                showCustom
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Calendar className="h-3 w-3" />
              Custom
            </button>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <Download className="h-3.5 w-3.5" />
            CSV
          </button>
        </div>
      </div>

      {/* Custom Date Range */}
      {showCustom && (
        <div className="mb-8 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card px-5 py-3">
          <span className="text-xs text-muted-foreground">From</span>
          <input
            type="date"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            className="h-8 rounded-lg border border-border bg-background px-3 text-xs outline-none transition-colors focus:border-foreground/30 [color-scheme:dark]"
          />
          <span className="text-xs text-muted-foreground">to</span>
          <input
            type="date"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            className="h-8 rounded-lg border border-border bg-background px-3 text-xs outline-none transition-colors focus:border-foreground/30 [color-scheme:dark]"
          />
        </div>
      )}

      {/* Summary Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Cost</span>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-2 flex items-baseline">
            <p className="text-3xl font-bold">{summary ? formatUSD(summary.cost) : "—"}</p>
            <TrendBadge percent={summary?.costChangePercent ?? null} />
          </div>
          {summary?.previousPeriod && summary.previousPeriod.cost > 0 && (
            <p className="mt-1 text-[11px] text-muted-foreground">
              vs {formatUSD(summary.previousPeriod.cost)} prev period
            </p>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Requests</span>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-3xl font-bold">{summary?.requests.toLocaleString() ?? "—"}</p>
          {summary?.previousPeriod && summary.previousPeriod.requests > 0 && (
            <p className="mt-1 text-[11px] text-muted-foreground">
              vs {summary.previousPeriod.requests.toLocaleString()} prev period
            </p>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Input Tokens</span>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-3xl font-bold">{summary ? formatTokens(summary.tokens.input) : "—"}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Output Tokens</span>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-3xl font-bold">{summary ? formatTokens(summary.tokens.output) : "—"}</p>
        </div>
      </div>

      {/* Top Model Highlight */}
      {topModel && topModel.cost > 0 && (
        <div className="mb-8 flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.04] px-5 py-3">
          <Crown className="h-4 w-4 text-amber-400 shrink-0" />
          <p className="text-sm">
            <span className="font-medium text-amber-300">{topModel.model}</span>
            <span className="text-muted-foreground"> is your most expensive model at </span>
            <span className="font-medium">{formatUSD(topModel.cost)}</span>
            <span className="text-muted-foreground"> ({topModel.requests.toLocaleString()} requests)</span>
          </p>
        </div>
      )}

      {/* Daily Usage Chart */}
      {daily.length > 0 && (
        <div className="mb-8 rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Daily Cost</h2>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-end gap-[2px] sm:gap-1" style={{ height: 140 }}>
            {daily.map((d) => (
              <div key={d.date} className="group relative flex-1" style={{ height: "100%" }}>
                <div
                  className="absolute bottom-0 w-full rounded-sm bg-foreground/20 transition-colors group-hover:bg-foreground/40"
                  style={{ height: `${Math.max((d.cost / maxDailyCost) * 100, 2)}%` }}
                />
                <div className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 rounded bg-foreground px-2 py-0.5 text-[10px] text-background whitespace-nowrap group-hover:block z-10">
                  <div>{formatUSD(d.cost)}</div>
                  <div className="text-background/60">{new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
            <span>{daily[0] && new Date(daily[0].date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
            <span>{daily.at(-1) && new Date(daily.at(-1)!.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
          </div>
        </div>
      )}

      {/* By Model */}
      {byModel.length > 0 && (
        <div className="rounded-xl border border-border bg-card">
          <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-semibold">Usage by Model</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Filter models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-full rounded-lg border border-border bg-background pl-8 pr-3 text-xs outline-none transition-colors focus:border-foreground/30 sm:w-56"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  {([
                    ["model", "Model", false],
                    ["requests", "Requests", true],
                    ["input", "Input", true],
                    ["output", "Output", true],
                    ["cost", "Cost", true],
                  ] as [SortKey, string, boolean][]).map(([key, label, isRight]) => (
                    <th
                      key={key}
                      onClick={() => handleSort(key)}
                      className={`group cursor-pointer select-none px-5 py-3 font-medium transition-colors hover:text-foreground ${isRight ? "text-right" : ""}`}
                    >
                      <span className="inline-flex items-center gap-1">
                        {label}
                        <SortIcon col={key} />
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredModels.map((m) => {
                  const isTop = topModel?.model === m.model && byModel.length > 1;
                  return (
                    <tr key={m.model} className={isTop ? "bg-amber-500/[0.03]" : ""}>
                      <td className="px-5 py-3 text-sm font-medium">
                        <span className="inline-flex items-center gap-2">
                          {m.model}
                          {isTop && <Crown className="h-3 w-3 text-amber-400" />}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right text-sm text-muted-foreground">{m.requests.toLocaleString()}</td>
                      <td className="px-5 py-3 text-right text-sm text-muted-foreground">{formatTokens(m.tokens.input)}</td>
                      <td className="px-5 py-3 text-right text-sm text-muted-foreground">{formatTokens(m.tokens.output)}</td>
                      <td className="px-5 py-3 text-right text-sm font-medium">{formatUSD(m.cost)}</td>
                    </tr>
                  );
                })}
                {filteredModels.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-sm text-muted-foreground">
                      {searchQuery ? "No models match your filter" : "No usage data for this period"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
