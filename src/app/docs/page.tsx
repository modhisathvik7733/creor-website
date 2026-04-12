import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Copy, MessageSquare, HelpCircle, Rocket, Blocks, FileText, Code2, Wrench, Brain, Zap, Shield, Globe } from "lucide-react";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Documentation | Creor",
  description: "Guides, API reference, and tutorials for Creor — the AI-powered IDE.",
  path: "/docs",
});

export default function DocsPage() {
  return (
    <div className="flex w-full justify-center px-4 md:px-8 py-10 lg:py-16">
      <div className="flex w-full max-w-[1100px] justify-between gap-12 xl:gap-24">
        {/* Article Content */}
        <article className="min-w-0 max-w-[760px] flex-1">
          <p className="mb-3 text-[13px] text-[#A1A1A1]">Get Started</p>
          <h1 className="mb-6 text-[32px] font-semibold tracking-tight text-[#EDEDED] sm:text-[40px]">
            Creor Documentation
          </h1>
          <p className="mb-10 text-[15px] leading-relaxed text-[#D1D1D1] sm:text-[16px]">
            Creor is an AI-powered IDE and coding agent. Use it to understand your codebase, plan and build features, fix bugs, review changes, and work with the tools you already use.
          </p>

          {/* Hero Image Block */}
          <div className="mb-16 overflow-hidden rounded-xl bg-[#0a0a09]">
            <Image
              src="https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=2688&auto=format&fit=crop"
              alt="Creor Editor UI"
              width={1600}
              height={900}
              className="w-full h-auto object-cover opacity-80 mix-blend-lighten"
              unoptimized
            />
          </div>

          {/* Start Here Section */}
          <h2 id="start-here" className="mb-5 text-xl font-semibold tracking-tight text-[#EDEDED]">
            Start here
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-16">
            <Link href="/docs/quickstart" className="flex flex-col rounded-lg border border-[#222222] bg-[#141414] p-5 transition-colors hover:bg-[#1A1A1A]">
              <div className="mb-3 flex items-center gap-2">
                <Rocket className="h-4 w-4 text-[#A1A1A1]" />
                <h3 className="text-[14px] font-medium text-[#EDEDED]">Quickstart</h3>
              </div>
              <p className="text-[13px] leading-relaxed text-[#A1A1A1]">
                Go from install to your first useful change in under 5 minutes
              </p>
            </Link>

            <Link href="/docs/models" className="flex flex-col rounded-lg border border-[#222222] bg-[#141414] p-5 transition-colors hover:bg-[#1A1A1A]">
              <div className="mb-3 flex items-center gap-2">
                <Blocks className="h-4 w-4 text-[#A1A1A1]" />
                <h3 className="text-[14px] font-medium text-[#EDEDED]">Models & Pricing</h3>
              </div>
              <p className="text-[13px] leading-relaxed text-[#A1A1A1]">
                Compare models, usage plans, and pricing tiers
              </p>
            </Link>

            <Link href="/docs/installation" className="flex flex-col rounded-lg border border-[#222222] bg-[#141414] p-5 transition-colors hover:bg-[#1A1A1A]">
              <div className="mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#A1A1A1]" />
                <h3 className="text-[14px] font-medium text-[#EDEDED]">Installation</h3>
              </div>
              <p className="text-[13px] leading-relaxed text-[#A1A1A1]">
                Download and install Creor on macOS, Windows, or Linux
              </p>
            </Link>
          </div>

          {/* What You Can Do Section */}
          <h2 id="what-you-can-do" className="mb-5 text-xl font-semibold tracking-tight text-[#EDEDED]">
            What you can do with Creor
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-16">
            <Link href="/docs/agent/overview" className="flex flex-col rounded-lg border border-[#222222] bg-[#141414] p-5 transition-colors hover:bg-[#1A1A1A]">
              <div className="mb-3 flex items-center gap-2">
                <Brain className="h-4 w-4 text-[#FF6A13]" />
                <h3 className="text-[14px] font-medium text-[#EDEDED]">AI Agent</h3>
              </div>
              <p className="text-[13px] leading-relaxed text-[#A1A1A1]">
                Chat with an AI that can read, write, and execute code in your project. Plan features, fix bugs, and refactor with natural language.
              </p>
            </Link>

            <Link href="/docs/agent/tools" className="flex flex-col rounded-lg border border-[#222222] bg-[#141414] p-5 transition-colors hover:bg-[#1A1A1A]">
              <div className="mb-3 flex items-center gap-2">
                <Wrench className="h-4 w-4 text-[#FF6A13]" />
                <h3 className="text-[14px] font-medium text-[#EDEDED]">25+ Built-in Tools</h3>
              </div>
              <p className="text-[13px] leading-relaxed text-[#A1A1A1]">
                File editing, shell commands, web search, code intelligence, task tracking, and more — all controlled by the AI agent.
              </p>
            </Link>

            <Link href="/docs/providers/overview" className="flex flex-col rounded-lg border border-[#222222] bg-[#141414] p-5 transition-colors hover:bg-[#1A1A1A]">
              <div className="mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#FF6A13]" />
                <h3 className="text-[14px] font-medium text-[#EDEDED]">19+ LLM Providers</h3>
              </div>
              <p className="text-[13px] leading-relaxed text-[#A1A1A1]">
                Use Claude, GPT-4, Gemini, or any of 19+ providers. Switch models per task or bring your own API keys.
              </p>
            </Link>

            <Link href="/docs/customizing/mcp" className="flex flex-col rounded-lg border border-[#222222] bg-[#141414] p-5 transition-colors hover:bg-[#1A1A1A]">
              <div className="mb-3 flex items-center gap-2">
                <Globe className="h-4 w-4 text-[#FF6A13]" />
                <h3 className="text-[14px] font-medium text-[#EDEDED]">MCP Integrations</h3>
              </div>
              <p className="text-[13px] leading-relaxed text-[#A1A1A1]">
                Connect to external tools via Model Context Protocol — GitHub, Slack, databases, and more from the MCP marketplace.
              </p>
            </Link>

            <Link href="/docs/rag/overview" className="flex flex-col rounded-lg border border-[#222222] bg-[#141414] p-5 transition-colors hover:bg-[#1A1A1A]">
              <div className="mb-3 flex items-center gap-2">
                <Code2 className="h-4 w-4 text-[#FF6A13]" />
                <h3 className="text-[14px] font-medium text-[#EDEDED]">Codebase Search</h3>
              </div>
              <p className="text-[13px] leading-relaxed text-[#A1A1A1]">
                Semantic search powered by RAG — the agent understands your codebase structure and finds relevant code automatically.
              </p>
            </Link>

            <Link href="/docs/agent/security" className="flex flex-col rounded-lg border border-[#222222] bg-[#141414] p-5 transition-colors hover:bg-[#1A1A1A]">
              <div className="mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#FF6A13]" />
                <h3 className="text-[14px] font-medium text-[#EDEDED]">Security & Permissions</h3>
              </div>
              <p className="text-[13px] leading-relaxed text-[#A1A1A1]">
                OS-level sandboxing, per-tool permissions, git secret scanning, and network policies keep your code safe.
              </p>
            </Link>
          </div>

          {/* Explore More Section */}
          <h2 id="explore" className="mb-5 text-xl font-semibold tracking-tight text-[#EDEDED]">
            Explore more
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mb-10">
            <Link href="/docs/customizing/configuration" className="rounded-lg border border-[#222222] bg-[#141414] px-5 py-4 transition-colors hover:bg-[#1A1A1A]">
              <h3 className="text-[14px] font-medium text-[#EDEDED]">Configuration</h3>
              <p className="mt-1 text-[13px] text-[#A1A1A1]">Customize Creor with creor.json</p>
            </Link>
            <Link href="/docs/customizing/skills" className="rounded-lg border border-[#222222] bg-[#141414] px-5 py-4 transition-colors hover:bg-[#1A1A1A]">
              <h3 className="text-[14px] font-medium text-[#EDEDED]">Skills</h3>
              <p className="mt-1 text-[13px] text-[#A1A1A1]">Create reusable prompt workflows</p>
            </Link>
            <Link href="/docs/cloud-agents/overview" className="rounded-lg border border-[#222222] bg-[#141414] px-5 py-4 transition-colors hover:bg-[#1A1A1A]">
              <h3 className="text-[14px] font-medium text-[#EDEDED]">Cloud Agents</h3>
              <p className="mt-1 text-[13px] text-[#A1A1A1]">Run AI agents in the cloud</p>
            </Link>
            <Link href="/docs/api" className="rounded-lg border border-[#222222] bg-[#141414] px-5 py-4 transition-colors hover:bg-[#1A1A1A]">
              <h3 className="text-[14px] font-medium text-[#EDEDED]">API Reference</h3>
              <p className="mt-1 text-[13px] text-[#A1A1A1]">Programmatic access to Creor</p>
            </Link>
          </div>
        </article>

        {/* Right Sidebar */}
        <aside className="hidden w-[220px] shrink-0 xl:block">
          <div className="sticky top-[92px] space-y-8">
            <div>
              <h4 className="mb-3 text-[13px] font-medium text-[#EDEDED]">On this page</h4>
              <div className="flex flex-col space-y-2 text-[13px]">
                <Link href="#start-here" className="text-[#A1A1A1] transition-colors hover:text-[#EDEDED]">
                  Start here
                </Link>
                <Link href="#what-you-can-do" className="text-[#A1A1A1] transition-colors hover:text-[#EDEDED]">
                  What you can do with Creor
                </Link>
                <Link href="#explore" className="text-[#A1A1A1] transition-colors hover:text-[#EDEDED]">
                  Explore more
                </Link>
              </div>
            </div>

            <div className="h-px w-full bg-[#222222]" />

            <div className="flex flex-col space-y-3.5 text-[13px]">
              <button className="flex items-center gap-2.5 text-[#A1A1A1] transition-colors hover:text-[#EDEDED]">
                <Copy className="h-4 w-4" />
                Copy page
              </button>
              <button className="flex items-center gap-2.5 text-[#A1A1A1] transition-colors hover:text-[#EDEDED]">
                <MessageSquare className="h-4 w-4" />
                Share feedback
              </button>
              <button className="flex items-center gap-2.5 text-[#A1A1A1] transition-colors hover:text-[#EDEDED]">
                <HelpCircle className="h-4 w-4" />
                Explain more
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
