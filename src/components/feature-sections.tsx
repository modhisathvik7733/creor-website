import { FadeIn } from "@/components/fade-in";
import { TokenBudgetSlider } from "@/components/token-budget-slider";
import { ArrowRight } from "lucide-react";

/* ── Section 1: Agent Cards ── */

function AgentCard({
  fig,
  title,
  description,
  children,
  delay,
}: {
  fig: string;
  title: string;
  description: string;
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <FadeIn delay={delay}>
      <div className="flex h-full flex-col rounded-xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.02] p-6 transition-colors hover:border-white/[0.15] hover:from-white/[0.06] hover:to-white/[0.03]">
        <span className="mb-6 font-mono text-[10px] uppercase tracking-widest text-white/30">
          {fig}
        </span>
        <div className="mb-8 flex flex-1 items-center justify-center px-4 py-8">
          {children}
        </div>
        <h3 className="mb-2 text-[15px] font-semibold text-white">{title}</h3>
        <p className="text-[13px] leading-relaxed text-white/40">
          {description}
        </p>
      </div>
    </FadeIn>
  );
}

function BuildAgentVisual() {
  return (
    <div className="w-full max-w-[200px] space-y-1.5 font-mono text-[10px]">
      <div className="rounded bg-white/[0.07] px-3 py-1.5 text-white/45">
        <span className="text-purple-400/80">const</span>{" "}
        <span className="text-indigo-300/80">app</span>{" "}
        <span className="text-white/35">= express()</span>
      </div>
      <div className="rounded border-l-2 border-red-400/50 bg-red-500/[0.10] px-3 py-1.5 text-white/40">
        app.get(&quot;/api&quot;, handler)
      </div>
      <div className="rounded border-l-2 border-emerald-400/50 bg-emerald-500/[0.10] px-3 py-1.5 text-white/50">
        app.get(&quot;/api/v2&quot;, authMiddleware, handler)
      </div>
      <div className="rounded bg-white/[0.07] px-3 py-1.5 text-white/45">
        app.listen(3000)
      </div>
    </div>
  );
}

function PlanAgentVisual() {
  return (
    <div className="w-full max-w-[200px] space-y-2 font-mono text-[10px]">
      <div className="rounded bg-white/[0.07] px-3 py-2 text-white/45">
        <span className="text-amber-400/70">##</span>{" "}
        <span className="text-white/55">Implementation Plan</span>
      </div>
      {["Refactor auth middleware", "Add rate limiting", "Update API tests"].map(
        (item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded bg-white/[0.06] px-3 py-1.5 text-white/45"
          >
            <span
              className={`h-3 w-3 shrink-0 rounded border ${
                i === 0
                  ? "border-emerald-400/50 bg-emerald-500/30"
                  : "border-white/15"
              }`}
            />
            {item}
          </div>
        )
      )}
    </div>
  );
}

function ExploreAgentVisual() {
  return (
    <div className="relative w-full max-w-[200px]">
      {/* Nodes */}
      <div className="flex flex-col items-center gap-3">
        <div className="rounded-full border border-indigo-400/40 bg-indigo-500/15 px-3 py-1 text-[9px] text-indigo-300/80">
          useAuth.ts
        </div>
        <div className="flex w-full justify-between px-2">
          <div className="rounded-full border border-white/15 bg-white/[0.06] px-2 py-0.5 text-[9px] text-white/45">
            session.ts
          </div>
          <div className="rounded-full border border-white/15 bg-white/[0.06] px-2 py-0.5 text-[9px] text-white/45">
            token.ts
          </div>
        </div>
        <div className="flex w-full justify-center gap-6">
          <div className="rounded-full border border-white/15 bg-white/[0.06] px-2 py-0.5 text-[9px] text-white/45">
            db.ts
          </div>
          <div className="rounded-full border border-white/15 bg-white/[0.06] px-2 py-0.5 text-[9px] text-white/45">
            crypto.ts
          </div>
        </div>
      </div>
      {/* Connection lines via SVG */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 200 100"
        fill="none"
      >
        <line x1="100" y1="15" x2="50" y2="42" stroke="white" strokeOpacity="0.12" />
        <line x1="100" y1="15" x2="150" y2="42" stroke="white" strokeOpacity="0.12" />
        <line x1="50" y1="50" x2="65" y2="80" stroke="white" strokeOpacity="0.12" />
        <line x1="150" y1="50" x2="135" y2="80" stroke="white" strokeOpacity="0.12" />
      </svg>
    </div>
  );
}

/* ── Section 2-5: Two-Column Feature Sections ── */

function FeatureSection({
  heading,
  description,
  label,
  children,
  reverse,
}: {
  heading: string;
  description: string;
  label: string;
  children: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <section className="px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-[1200px]">
        <FadeIn>
          <div
            className={`grid gap-8 md:grid-cols-[1fr_1.5fr] md:gap-16 ${
              reverse ? "md:grid-cols-[1.5fr_1fr]" : ""
            }`}
          >
            <div className={reverse ? "md:order-2" : ""}>
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {heading}
              </h2>
            </div>
            <div className={reverse ? "md:order-1" : ""}>
              <p className="mb-4 text-[14px] leading-relaxed text-white/40">
                {description}
              </p>
              <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white/50 transition-colors hover:text-white/70">
                {label} <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </FadeIn>

        {/* Visual */}
        <FadeIn delay={150}>
          <div className="mt-12 overflow-hidden rounded-xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.02] p-6 sm:mt-16 sm:p-10">
            {children}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ── Visual: Repo Map + Context ── */

function RepoMapVisual() {
  const files = [
    { name: "src/", indent: 0, type: "folder" },
    { name: "app/", indent: 1, type: "folder" },
    { name: "layout.tsx", indent: 2, type: "file" },
    { name: "page.tsx", indent: 2, type: "file" },
    { name: "components/", indent: 1, type: "folder" },
    { name: "Navbar.tsx", indent: 2, type: "file" },
    { name: "CartSummary.tsx", indent: 2, type: "file" },
    { name: "lib/", indent: 1, type: "folder" },
    { name: "utils.ts", indent: 2, type: "file" },
    { name: "api.ts", indent: 2, type: "file" },
  ];

  const excludeTags = [".gitignore", "binaries", "lockfiles", "secrets", "node_modules"];

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* File tree */}
      <div>
        <span className="mb-3 block font-mono text-[10px] uppercase tracking-widest text-white/35">
          Repo Map
        </span>
        <div className="space-y-0.5 font-mono text-[11px]">
          {files.map((f, i) => (
            <div
              key={i}
              className="text-white/45"
              style={{ paddingLeft: `${f.indent * 16}px` }}
            >
              <span className={f.type === "folder" ? "text-amber-400/60" : "text-white/35"}>
                {f.type === "folder" ? "▸ " : "  "}
              </span>
              {f.name}
            </div>
          ))}
        </div>
      </div>

      {/* Context settings */}
      <div className="space-y-5">
        <TokenBudgetSlider />
        <div>
          <span className="mb-3 block font-mono text-[10px] uppercase tracking-widest text-white/35">
            Excluded
          </span>
          <div className="flex flex-wrap gap-1.5">
            {excludeTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/[0.10] bg-white/[0.06] px-2.5 py-0.5 font-mono text-[10px] text-white/40"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div>
          <span className="mb-3 block font-mono text-[10px] uppercase tracking-widest text-white/35">
            Auto-injected
          </span>
          <div className="flex gap-3 text-[11px] text-white/40">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/70" />
              Git state
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/70" />
              File tree
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/70" />
              Dependencies
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Visual: Skills & Rules ── */

function SkillsRulesVisual() {
  const rules = [
    { name: "code-style.md", always: true },
    { name: "security-policy.md", always: true },
    { name: "api-guidelines.md", always: false },
    { name: "testing-patterns.md", always: false },
  ];

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Skill graph */}
      <div>
        <span className="mb-3 block font-mono text-[10px] uppercase tracking-widest text-white/35">
          Skill Graph
        </span>
        <div className="space-y-2">
          <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/[0.08] p-3">
            <div className="mb-1 text-[11px] font-medium text-indigo-300/80">
              SKILL.md
            </div>
            <div className="text-[10px] text-white/40">
              Auth system overview
            </div>
          </div>
          <div className="flex gap-2 pl-4">
            {["[[oauth-flow]]", "[[jwt-tokens]]", "[[middleware]]"].map((link) => (
              <div
                key={link}
                className="rounded border border-white/[0.10] bg-white/[0.06] px-2 py-1 font-mono text-[9px] text-purple-300/60"
              >
                {link}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rules list */}
      <div>
        <span className="mb-3 block font-mono text-[10px] uppercase tracking-widest text-white/35">
          Rules
        </span>
        <div className="space-y-1.5">
          {rules.map((rule) => (
            <div
              key={rule.name}
              className="flex items-center justify-between rounded-lg bg-white/[0.06] px-3 py-2"
            >
              <span className="font-mono text-[11px] text-white/45">
                {rule.name}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${
                  rule.always
                    ? "bg-emerald-500/10 text-emerald-400/60"
                    : "bg-white/[0.04] text-white/20"
                }`}
              >
                {rule.always ? "always" : "on-demand"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Visual: Tools & MCP ── */

function ToolsMCPVisual() {
  const tools = [
    { name: "read", desc: "Read files" },
    { name: "edit", desc: "Edit files" },
    { name: "bash", desc: "Run commands" },
    { name: "grep", desc: "Search code" },
    { name: "glob", desc: "Find files" },
    { name: "lsp", desc: "Go to def" },
  ];

  const mcpServers = [
    { name: "GitHub", status: "connected" },
    { name: "Notion", status: "connected" },
    { name: "Slack", status: "disabled" },
  ];

  return (
    <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
      {/* Tools grid */}
      <div>
        <span className="mb-3 block font-mono text-[10px] uppercase tracking-widest text-white/35">
          Built-in Tools
        </span>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="rounded-lg bg-white/[0.06] px-3 py-2"
            >
              <div className="font-mono text-[11px] text-white/50">
                {tool.name}
              </div>
              <div className="text-[9px] text-white/30">{tool.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* MCP servers */}
      <div>
        <span className="mb-3 block font-mono text-[10px] uppercase tracking-widest text-white/35">
          MCP Servers
        </span>
        <div className="space-y-1.5">
          {mcpServers.map((server) => (
            <div
              key={server.name}
              className="flex items-center justify-between rounded-lg bg-white/[0.06] px-3 py-2.5"
            >
              <span className="text-[11px] text-white/45">{server.name}</span>
              <span className="flex items-center gap-1.5 text-[9px]">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    server.status === "connected"
                      ? "bg-emerald-500/60"
                      : "bg-white/15"
                  }`}
                />
                <span className="text-white/35">{server.status}</span>
              </span>
            </div>
          ))}
          <div className="rounded-lg border border-dashed border-white/[0.12] px-3 py-2 text-center text-[10px] text-white/30">
            + Add Server
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Visual: Hooks & Permissions ── */

function HooksPermissionsVisual() {
  const permissions = [
    { tool: "edit", level: "allow" },
    { tool: "bash", level: "ask" },
    { tool: "read *.env", level: "ask" },
    { tool: "write", level: "allow" },
    { tool: "delete", level: "deny" },
  ];

  const hooks = [
    { event: "tool.execute.before", enabled: true },
    { event: "session.start", enabled: true },
    { event: "tool.execute.failure", enabled: false },
    { event: "shell.env", enabled: true },
  ];

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Permissions */}
      <div>
        <span className="mb-3 block font-mono text-[10px] uppercase tracking-widest text-white/35">
          Permissions
        </span>
        <div className="space-y-1">
          {permissions.map((p) => (
            <div
              key={p.tool}
              className="flex items-center justify-between rounded bg-white/[0.06] px-3 py-1.5"
            >
              <span className="font-mono text-[11px] text-white/45">
                {p.tool}
              </span>
              <span
                className={`rounded px-2 py-0.5 text-[9px] font-medium ${
                  p.level === "allow"
                    ? "bg-emerald-500/10 text-emerald-400/60"
                    : p.level === "ask"
                      ? "bg-amber-500/10 text-amber-400/60"
                      : "bg-red-500/10 text-red-400/60"
                }`}
              >
                {p.level}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hooks */}
      <div>
        <span className="mb-3 block font-mono text-[10px] uppercase tracking-widest text-white/35">
          Hooks
        </span>
        <div className="space-y-1">
          {hooks.map((h) => (
            <div
              key={h.event}
              className="flex items-center justify-between rounded bg-white/[0.06] px-3 py-1.5"
            >
              <span className="font-mono text-[11px] text-white/45">
                {h.event}
              </span>
              <div
                className={`h-4 w-7 rounded-full p-0.5 ${
                  h.enabled ? "bg-indigo-500/40" : "bg-white/[0.08]"
                }`}
              >
                <div
                  className={`h-3 w-3 rounded-full bg-white/60 transition-transform ${
                    h.enabled ? "translate-x-3" : ""
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Visual: Snapshot Revert & Diff Preview ── */

function SnapshotDiffVisual() {
  const snapshots = [
    { id: "a3f2", time: "2 min ago", label: "Added auth middleware", active: false },
    { id: "b7e1", time: "5 min ago", label: "Refactored API routes", active: true },
    { id: "c9d4", time: "12 min ago", label: "Initial session", active: false },
  ];

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Snapshot timeline */}
      <div>
        <span className="mb-3 block font-mono text-[10px] uppercase tracking-widest text-white/35">
          Snapshot Timeline
        </span>
        <div className="relative space-y-0 pl-4">
          {/* Vertical line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/[0.12]" />
          {snapshots.map((snap, i) => (
            <div key={snap.id} className="relative flex items-start gap-3 py-2">
              {/* Dot */}
              <div
                className={`relative z-10 mt-1 h-3 w-3 shrink-0 rounded-full border-2 ${
                  snap.active
                    ? "border-amber-400/60 bg-amber-400/20"
                    : "border-white/15 bg-background"
                }`}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-white/35">
                    {snap.id}
                  </span>
                  <span className="text-[9px] text-white/25">{snap.time}</span>
                </div>
                <div className="text-[11px] text-white/45">{snap.label}</div>
                {snap.active && (
                  <button className="mt-1.5 rounded border border-amber-500/20 bg-amber-500/[0.08] px-2 py-0.5 font-mono text-[9px] text-amber-400/60">
                    ← Revert to here
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Diff preview */}
      <div>
        <span className="mb-3 block font-mono text-[10px] uppercase tracking-widest text-white/35">
          Diff Preview
        </span>
        <div className="overflow-hidden rounded-lg border border-white/[0.06] bg-[#0a0a0c] font-mono text-[10px]">
          {/* Diff header */}
          <div className="flex items-center justify-between border-b border-white/[0.04] px-3 py-1.5">
            <span className="text-white/40">src/middleware/auth.ts</span>
            <div className="flex gap-2">
              <span className="text-emerald-400/70">+12</span>
              <span className="text-red-400/70">-3</span>
            </div>
          </div>
          {/* Diff lines */}
          <div className="space-y-0 p-0">
            <div className="px-3 py-0.5 text-white/35">
              <span className="mr-3 text-white/20">14</span>
              export function authMiddleware(req, res, next) {"{"}
            </div>
            <div className="border-l-2 border-red-400/50 bg-red-500/[0.10] px-3 py-0.5 text-white/40">
              <span className="mr-3 text-red-400/50">15</span>
              {"  "}const token = req.headers.auth
            </div>
            <div className="border-l-2 border-emerald-400/50 bg-emerald-500/[0.10] px-3 py-0.5 text-white/50">
              <span className="mr-3 text-emerald-400/50">15</span>
              {"  "}const token = req.headers.authorization?.split(&quot; &quot;)[1]
            </div>
            <div className="border-l-2 border-emerald-400/50 bg-emerald-500/[0.10] px-3 py-0.5 text-white/50">
              <span className="mr-3 text-emerald-400/50">16</span>
              {"  "}if (!token) return res.status(401).json({"{"} error: &quot;Unauthorized&quot; {"}"})
            </div>
            <div className="px-3 py-0.5 text-white/35">
              <span className="mr-3 text-white/20">17</span>
              {"  "}try {"{"}
            </div>
            <div className="border-l-2 border-red-400/50 bg-red-500/[0.10] px-3 py-0.5 text-white/40">
              <span className="mr-3 text-red-400/50">18</span>
              {"    "}const user = verify(token)
            </div>
            <div className="border-l-2 border-emerald-400/50 bg-emerald-500/[0.10] px-3 py-0.5 text-white/50">
              <span className="mr-3 text-emerald-400/50">18</span>
              {"    "}const user = await verifyJWT(token, SECRET)
            </div>
            <div className="border-l-2 border-emerald-400/50 bg-emerald-500/[0.10] px-3 py-0.5 text-white/50">
              <span className="mr-3 text-emerald-400/50">19</span>
              {"    "}req.user = {"{"} id: user.sub, role: user.role {"}"}
            </div>
            <div className="px-3 py-0.5 text-white/35">
              <span className="mr-3 text-white/20">20</span>
              {"    "}next()
            </div>
          </div>
          {/* Accept/reject bar */}
          <div className="flex items-center justify-end gap-2 border-t border-white/[0.04] px-3 py-1.5">
            <span className="rounded border border-white/[0.12] px-2 py-0.5 text-[9px] text-white/35">
              Reject
            </span>
            <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[9px] text-emerald-400/60">
              Accept
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Export ── */

export function FeatureSections() {
  return (
    <div>
      {/* Section 1: Agents */}
      <section className="px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-[1200px]">
          <FadeIn>
            <h2 className="mb-3 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Agents that specialize
            </h2>
            <p className="mx-auto mb-14 max-w-lg text-center text-[14px] leading-relaxed text-white/40">
              Not one AI, but many. Each agent has its own permissions, tools, and purpose. Auto-routing picks the right one.
            </p>
          </FadeIn>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AgentCard
              fig="FIG 0.1"
              title="Build Agent"
              description="Full-access agent that writes code, runs commands, and executes multi-file changes in isolated git branches."
              delay={0}
            >
              <BuildAgentVisual />
            </AgentCard>
            <AgentCard
              fig="FIG 0.2"
              title="Plan Agent"
              description="Read-only agent that explores your codebase and writes implementation plans — never touches your code."
              delay={100}
            >
              <PlanAgentVisual />
            </AgentCard>
            <AgentCard
              fig="FIG 0.3"
              title="Explore Agent"
              description="Deep codebase researcher. Traces symbols, maps dependencies, searches across every file."
              delay={200}
            >
              <ExploreAgentVisual />
            </AgentCard>
          </div>
        </div>
      </section>

      {/* Section 2: Repo Map + Context */}
      <FeatureSection
        heading="Your codebase, fully understood"
        description="Repo Map builds a structural overview of your entire project — auto-injected into every session. Context settings let you tune what's included: git state, file trees, token budgets. The AI doesn't guess your architecture — it sees it."
        label="1.0 Codebase Intelligence"
      >
        <RepoMapVisual />
      </FeatureSection>

      {/* Section 3: Skills & Rules */}
      <FeatureSection
        heading="Teach it your standards"
        description="Skills embed team knowledge as interconnected markdown graphs — coding patterns, architecture decisions, domain context. Rules enforce policies in every AI interaction. Define once, apply everywhere."
        label="2.0 Skills & Rules"
        reverse
      >
        <SkillsRulesVisual />
      </FeatureSection>

      {/* Section 4: Tools & MCP */}
      <FeatureSection
        heading="Extend with anything"
        description="25+ built-in tools for file ops, search, LSP, and analysis. Connect external services through MCP — Notion, Gmail, GitHub, or any custom server. Add your own tools with a single TypeScript file."
        label="3.0 Tools & MCP"
      >
        <ToolsMCPVisual />
      </FeatureSection>

      {/* Section 5: Hooks & Permissions */}
      <FeatureSection
        heading="Complete control, always"
        description="Hooks intercept every lifecycle event — before tool execution, on session start, after failures. Pattern-based permissions gate access per tool, per file, per agent. Nothing happens without your say."
        label="4.0 Hooks & Permissions"
        reverse
      >
        <HooksPermissionsVisual />
      </FeatureSection>

      {/* Section 6: Snapshot Revert & Diff Preview */}
      <FeatureSection
        heading="Review every change. Revert any moment."
        description="Every edit is shown as a diff before it touches your code — accept, reject, or retry. Snapshot revert lets you roll back specific files to any prior state in the session. Nothing is permanent until you say so."
        label="5.0 Snapshot & Diff"
      >
        <SnapshotDiffVisual />
      </FeatureSection>
    </div>
  );
}
