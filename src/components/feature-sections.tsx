import { FadeIn } from "@/components/fade-in";
import { TokenBudgetSlider } from "@/components/token-budget-slider";
import { AnimatedRepoMap } from "@/components/animated-repo-map";
import { AnimatedSkillGraph } from "@/components/animated-skill-graph";
import { AnimatedRules } from "@/components/animated-rules";
import { AnimatedDiffPreview } from "@/components/animated-diff";
import { AnimatedPermissions } from "@/components/animated-permissions";
import { AnimatedInteractiveTerminal } from "@/components/animated-interactive-terminal";
import { AnimatedExploreGraph } from "@/components/animated-explore-graph";


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
  return <AnimatedExploreGraph />;
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
              <span className="text-[13px] font-medium text-white/50">
                {label}
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
  const excludeTags = [".gitignore", "binaries", "lockfiles", "secrets", "node_modules"];

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* File tree */}
      <AnimatedRepoMap />

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
  return (
    <div className="grid items-center gap-10 md:grid-cols-[1.2fr_1fr]">
      {/* Skill graph */}
      <AnimatedSkillGraph />

      {/* Rules */}
      <AnimatedRules />
    </div>
  );
}

/* ── Visual: Tools & MCP ── */

function ToolsMCPVisual() {
  const tools = [
    { name: "read", desc: "Read files", icon: "📄" },
    { name: "edit", desc: "Edit files", icon: "✏️" },
    { name: "write", desc: "Create files", icon: "📝" },
    { name: "bash", desc: "Run commands", icon: "⌨️" },
    { name: "grep", desc: "Search content", icon: "🔍" },
    { name: "glob", desc: "Find files", icon: "📂" },
    { name: "lsp", desc: "Go to definition", icon: "🔗" },
    { name: "git", desc: "Version control", icon: "🌿" },
    { name: "web", desc: "Fetch URLs", icon: "🌐" },
  ];

  const mcpServers = [
    {
      name: "GitHub",
      logo: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
      ),
      status: "connected",
      desc: "PRs, issues, actions",
    },
    {
      name: "Notion",
      logo: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L18.29 2.29c-.42-.326-.98-.7-2.055-.607L3.01 2.87c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.84-.046.933-.56.933-1.167V6.354c0-.606-.233-.933-.746-.886l-15.177.886c-.56.047-.747.327-.747.934zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.747 0-.933-.234-1.494-.934l-4.577-7.186v6.952l1.448.327s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V8.963L7.926 8.87c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.513.28-.886.747-.933zM2.877.466l13.916-.98c1.727-.14 2.148.046 2.868.56L23.19 2.57c.98.7 1.307 1.027 1.307 1.867v17.283c0 1.12-.42 1.773-1.867 1.866L7.926 24.5c-1.074.047-1.588-.093-2.148-.793L2.41 19.682c-.653-.84-.933-1.494-.933-2.24V2.1c0-.934.42-1.54 1.4-1.634z" />
        </svg>
      ),
      status: "connected",
      desc: "Pages, databases",
    },
    {
      name: "Slack",
      logo: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M5.042 15.165a2.528 2.528 0 01-2.52 2.523A2.528 2.528 0 010 15.165a2.527 2.527 0 012.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 012.521-2.52 2.527 2.527 0 012.521 2.52v6.313A2.528 2.528 0 018.834 24a2.528 2.528 0 01-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 01-2.521-2.52A2.528 2.528 0 018.834 0a2.528 2.528 0 012.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 012.521 2.521 2.528 2.528 0 01-2.521 2.521H2.522A2.528 2.528 0 010 8.834a2.528 2.528 0 012.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 012.522-2.521A2.528 2.528 0 0124 8.834a2.528 2.528 0 01-2.522 2.521h-2.522V8.834zm-1.27 0a2.528 2.528 0 01-2.523 2.521 2.527 2.527 0 01-2.52-2.521V2.522A2.527 2.527 0 0115.163 0a2.528 2.528 0 012.523 2.522v6.312zM15.163 18.956a2.528 2.528 0 012.523 2.522A2.528 2.528 0 0115.163 24a2.527 2.527 0 01-2.52-2.522v-2.522h2.52zm0-1.27a2.527 2.527 0 01-2.52-2.523 2.526 2.526 0 012.52-2.52h6.315A2.528 2.528 0 0124 15.163a2.528 2.528 0 01-2.522 2.523h-6.315z" />
        </svg>
      ),
      status: "connected",
      desc: "Messages, channels",
    },
    {
      name: "Linear",
      logo: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M1.04 11.16c-.12-.12-.1-.32.04-.42A11.98 11.98 0 0112 4.5c4.04 0 7.59 2 9.76 5.06.1.14.08.32-.04.42l-9.54 9.54c-.12.12-.32.1-.42-.04A11.98 11.98 0 014.5 12c0-1.15.16-2.26.46-3.32.04-.14 0-.28-.1-.36L1.04 11.16zM.42 13.24c-.12-.1-.32-.08-.42.04A12.01 12.01 0 0012 24c.34 0 .68-.02 1.02-.04.16-.01.26-.18.2-.32L.42 13.24z" />
        </svg>
      ),
      status: "disabled",
      desc: "Issues, projects",
    },
  ];

  return (
    <div className="grid items-start gap-10 md:grid-cols-2">
      {/* Tools grid */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/35">
            Built-in Tools
          </span>
          <span className="rounded-full bg-white/[0.06] px-2 py-0.5 font-mono text-[9px] text-white/30">
            25+ tools
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="group rounded-lg border border-white/[0.06] bg-white/[0.04] px-3 py-2.5 transition-colors hover:border-white/[0.12] hover:bg-white/[0.06]"
            >
              <div className="mb-1 text-[13px]">{tool.icon}</div>
              <div className="font-mono text-[11px] text-white/50">
                {tool.name}
              </div>
              <div className="text-[9px] text-white/25">{tool.desc}</div>
            </div>
          ))}
        </div>
        <div className="mt-1.5 rounded-lg border border-dashed border-white/[0.08] py-2 text-center font-mono text-[10px] text-white/25">
          +16 more tools
        </div>
      </div>

      {/* MCP servers */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/35">
            MCP Servers
          </span>
          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-mono text-[9px] text-emerald-400/50">
            3 connected
          </span>
        </div>
        <div className="space-y-1.5">
          {mcpServers.map((server) => (
            <div
              key={server.name}
              className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.04] px-3 py-2.5 transition-colors hover:border-white/[0.12] hover:bg-white/[0.06]"
            >
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
                server.status === "connected"
                  ? "bg-white/[0.08] text-white/60"
                  : "bg-white/[0.04] text-white/25"
              }`}>
                {server.logo}
              </div>
              <div className="flex-1">
                <div className="text-[11px] text-white/50">{server.name}</div>
                <div className="text-[9px] text-white/20">{server.desc}</div>
              </div>
              <span className="flex items-center gap-1.5 text-[9px]">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    server.status === "connected"
                      ? "bg-emerald-500/60"
                      : "bg-white/15"
                  }`}
                />
                <span className={server.status === "connected" ? "text-emerald-400/40" : "text-white/25"}>
                  {server.status}
                </span>
              </span>
            </div>
          ))}
          <div className="flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/[0.10] py-2.5 text-[10px] text-white/25 transition-colors hover:border-white/[0.15] hover:text-white/35">
            <span className="text-[14px] leading-none">+</span>
            Add MCP Server
          </div>
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
      <AnimatedDiffPreview />
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

      {/* Section 5: Interactive Terminal */}
      <FeatureSection
        heading="Smart terminal, only when you need it"
        description="Most commands run silently in the background. But when the agent detects a long-running process, a dev server, or a command that needs your input — it opens a real interactive terminal automatically. Output streams back to the agent so it always knows what happened."
        label="3.5 Interactive Terminal"
        reverse
      >
        <AnimatedInteractiveTerminal />
      </FeatureSection>

      {/* Section 6: Hooks & Permissions */}
      <FeatureSection
        heading="Complete control, always"
        description="Hooks intercept every lifecycle event — before tool execution, on session start, after failures. Pattern-based permissions gate access per tool, per file, per agent. Nothing happens without your say."
        label="4.0 Hooks & Permissions"
      >
        <AnimatedPermissions />
      </FeatureSection>

      {/* Section 7: Snapshot Revert & Diff Preview */}
      <FeatureSection
        heading="Review every change. Revert any moment."
        description="Every edit is shown as a diff before it touches your code — accept, reject, or retry. Snapshot revert lets you roll back specific files to any prior state in the session. Nothing is permanent until you say so."
        label="5.0 Snapshot & Diff"
        reverse
      >
        <SnapshotDiffVisual />
      </FeatureSection>
    </div>
  );
}
