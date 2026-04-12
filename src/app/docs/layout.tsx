"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Search, ChevronRight, ChevronDown } from "lucide-react";
import { useState } from "react";

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

interface SidebarItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

const docsSections: SidebarSection[] = [
  {
    title: "Get Started",
    items: [
      { label: "Welcome", href: "/docs" },
      { label: "Installation", href: "/docs/installation" },
      { label: "Quickstart", href: "/docs/quickstart" },
      { label: "Models & Pricing", href: "/docs/models" },
      { label: "Changelog", href: "/docs/changelog" },
    ],
  },
  {
    title: "Agent",
    items: [
      { label: "Overview", href: "/docs/agent/overview" },
      { label: "Planning", href: "/docs/agent/planning" },
      { label: "Prompting", href: "/docs/agent/prompting" },
      { label: "Debugging", href: "/docs/agent/debugging" },
      {
        label: "Tools",
        href: "/docs/agent/tools",
        children: [
          { label: "File Tools", href: "/docs/agent/tools/file" },
          { label: "Shell & Terminal", href: "/docs/agent/tools/shell" },
          { label: "Code Intelligence", href: "/docs/agent/tools/code-intelligence" },
          { label: "Web Tools", href: "/docs/agent/tools/web" },
          { label: "Task & Planning", href: "/docs/agent/tools/task-planning" },
        ],
      },
      { label: "Parallel Agents", href: "/docs/agent/parallel-agents" },
      { label: "Security", href: "/docs/agent/security" },
    ],
  },
  {
    title: "Customizing",
    items: [
      { label: "Configuration", href: "/docs/customizing/configuration" },
      { label: "Rules", href: "/docs/customizing/rules" },
      { label: "Skills", href: "/docs/customizing/skills" },
      { label: "Subagents", href: "/docs/customizing/subagents" },
      { label: "Hooks", href: "/docs/customizing/hooks" },
      { label: "Plugins", href: "/docs/customizing/plugins" },
      { label: "MCP", href: "/docs/customizing/mcp" },
    ],
  },
  {
    title: "Models & Providers",
    items: [
      { label: "Overview", href: "/docs/providers/overview" },
      { label: "Creor Gateway", href: "/docs/providers/gateway" },
      { label: "Anthropic", href: "/docs/providers/anthropic" },
      { label: "OpenAI", href: "/docs/providers/openai" },
      { label: "Google", href: "/docs/providers/google" },
      { label: "AWS Bedrock", href: "/docs/providers/bedrock" },
      { label: "Azure OpenAI", href: "/docs/providers/azure" },
      { label: "Open Source & Others", href: "/docs/providers/open-source" },
      { label: "OpenRouter", href: "/docs/providers/openrouter" },
      { label: "GitHub Copilot", href: "/docs/providers/copilot" },
      { label: "BYOK", href: "/docs/providers/byok" },
    ],
  },
  {
    title: "Codebase Search",
    items: [
      { label: "Overview", href: "/docs/rag/overview" },
      { label: "Indexing", href: "/docs/rag/indexing" },
      { label: "Configuration", href: "/docs/rag/configuration" },
    ],
  },
  {
    title: "Cloud Agents",
    items: [
      { label: "Overview", href: "/docs/cloud-agents/overview" },
      { label: "Setup", href: "/docs/cloud-agents/setup" },
      { label: "Capabilities", href: "/docs/cloud-agents/capabilities" },
      { label: "Bugbot", href: "/docs/cloud-agents/bugbot" },
      { label: "Best Practices", href: "/docs/cloud-agents/best-practices" },
      { label: "Security & Network", href: "/docs/cloud-agents/security-network" },
      { label: "Settings", href: "/docs/cloud-agents/settings" },
    ],
  },
  {
    title: "Dashboard & Account",
    items: [
      { label: "Billing & Credits", href: "/docs/dashboard/billing" },
      { label: "API Keys", href: "/docs/dashboard/keys" },
      { label: "Usage & Analytics", href: "/docs/dashboard/usage" },
      { label: "Team Management", href: "/docs/dashboard/team" },
      { label: "Marketplace", href: "/docs/dashboard/marketplace" },
      { label: "Settings", href: "/docs/dashboard/settings" },
    ],
  },
  {
    title: "Troubleshooting",
    items: [
      { label: "Common Issues", href: "/docs/troubleshooting" },
      { label: "Terminal & Shell", href: "/docs/troubleshooting/terminal" },
      { label: "Network & Proxy", href: "/docs/troubleshooting/network" },
    ],
  },
];

const apiSections: SidebarSection[] = [
  {
    title: "API Overview",
    items: [
      { label: "Overview", href: "/docs/api" },
      { label: "Authentication", href: "/docs/api/authentication" },
      { label: "Rate Limits", href: "/docs/api/rate-limits" },
      { label: "Best Practices", href: "/docs/api/best-practices" },
    ],
  },
  {
    title: "Gateway API",
    items: [
      { label: "Overview", href: "/docs/api/gateway/overview" },
      { label: "Supported Models", href: "/docs/api/gateway/models" },
      { label: "Streaming", href: "/docs/api/gateway/streaming" },
    ],
  },
  {
    title: "Cloud Agents API",
    items: [
      "Overview", "List Agents", "Agent Status", "Agent Conversation",
      "List Artifacts", "Download Artifact", "Launch Agent", "Add Follow-up",
      "Stop Agent", "Delete Agent", "API Key Info", "List Models",
      "List Repositories", "Webhooks",
    ].map((item) => ({
      label: item,
      href: `/docs/api/cloud-agents/${item.toLowerCase().replace(/ /g, "-")}`,
    })),
  },
  {
    title: "Admin API",
    items: [
      "Overview", "Team Members", "Audit Logs", "Get Daily Usage Data",
      "Spending Data", "Get Usage Events Data", "User Spend Limit",
    ].map((item) => ({
      label: item,
      href: `/docs/api/admin/${item.toLowerCase().replace(/ /g, "-")}`,
    })),
  },
];

function SidebarLink({ item, pathname }: { item: SidebarItem; pathname: string }) {
  const isActive = pathname === item.href;
  const isParentActive = item.children?.some((child) => pathname === child.href);
  const [isOpen, setIsOpen] = useState(isActive || isParentActive || false);

  if (item.children) {
    return (
      <div>
        <div className="flex items-center">
          <Link
            href={item.href}
            className={cn(
              "flex-1 rounded-md px-2 py-1.5 transition-colors",
              isActive
                ? "font-medium text-[#FF6A13]"
                : "text-[#A1A1A1] hover:bg-[#1A1A1A] hover:text-[#EDEDED]"
            )}
          >
            {item.label}
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-md p-1 text-[#A1A1A1] hover:bg-[#1A1A1A] hover:text-[#EDEDED] transition-colors"
          >
            {isOpen ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
        {isOpen && (
          <div className="ml-3 mt-0.5 flex flex-col space-y-0.5 border-l border-[#222222] pl-2">
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  "rounded-md px-2 py-1.5 text-[13px] transition-colors",
                  pathname === child.href
                    ? "font-medium text-[#FF6A13]"
                    : "text-[#A1A1A1] hover:bg-[#1A1A1A] hover:text-[#EDEDED]"
                )}
              >
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={cn(
        "rounded-md px-2 py-1.5 transition-colors",
        isActive
          ? "font-medium text-[#FF6A13]"
          : "text-[#A1A1A1] hover:bg-[#1A1A1A] hover:text-[#EDEDED]"
      )}
    >
      {item.label}
    </Link>
  );
}

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isApi = pathname.startsWith("/docs/api");
  const sections = isApi ? apiSections : docsSections;

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-[#EDEDED] font-sans selection:bg-[#FF6A13] selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 flex h-[52px] items-center justify-between border-b border-[#222222] bg-[#0E0E0E]/95 px-4 backdrop-blur-md">
        <div className="flex h-full items-center gap-6">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#EDEDED]"
            >
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            <span className="text-[15px] font-semibold tracking-tight">Creor</span>
          </Link>
          <nav className="hidden h-full items-center gap-1 md:flex">
            <Link
              href="/docs"
              className={cn(
                "relative flex h-full items-center px-4 text-[13px] transition-colors hover:text-[#EDEDED]",
                !isApi ? "font-medium text-[#FF6A13]" : "text-[#A1A1A1]"
              )}
            >
              Docs
              {!isApi && <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#FF6A13]" />}
            </Link>
            <Link
              href="/docs/api"
              className={cn(
                "relative flex h-full items-center px-4 text-[13px] transition-colors hover:text-[#EDEDED]",
                isApi ? "font-medium text-[#FF6A13]" : "text-[#A1A1A1]"
              )}
            >
              API
              {isApi && <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#FF6A13]" />}
            </Link>
            <Link
              href="/learn"
              className="flex h-full items-center px-4 text-[13px] text-[#A1A1A1] transition-colors hover:text-[#EDEDED]"
            >
              Learn
            </Link>
            <Link
              href="/help"
              className="flex h-full items-center px-4 text-[13px] text-[#A1A1A1] transition-colors hover:text-[#EDEDED]"
            >
              Help
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex h-8 items-center gap-2 rounded-md border border-[#333333] bg-[#141414] px-3 text-[13px] text-[#A1A1A1] transition-colors hover:bg-[#1A1A1A] hover:text-[#EDEDED]">
            <Search className="h-3.5 w-3.5" />
            <span className="w-40 text-left">Search docs...</span>
            <span className="flex items-center gap-0.5 rounded-sm bg-[#222222] px-1.5 py-0.5 text-[10px] uppercase font-mono">
              <span className="text-[11px]">&#x2318;</span>K
            </span>
          </button>

          <Link
            href="/dashboard"
            className="flex h-8 items-center rounded-md border border-[#333333] bg-[#1A1A1A] px-4 text-[13px] font-medium text-[#EDEDED] transition-colors hover:bg-[#222222]"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <div className="flex mx-auto w-full">
        {/* Left Sidebar */}
        <aside className="sticky top-[52px] hidden h-[calc(100vh-52px)] w-[260px] shrink-0 overflow-y-auto border-r border-[#222222] py-8 pl-6 pr-4 md:block">
          <div className="space-y-8">
            {sections.map((section) => (
              <div key={section.title}>
                <h4 className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-wider text-[#A1A1A1]">
                  {section.title}
                </h4>
                <div className="flex flex-col space-y-0.5 text-[14px]">
                  {section.items.map((item) => (
                    <SidebarLink key={item.href} item={item} pathname={pathname} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Area */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
