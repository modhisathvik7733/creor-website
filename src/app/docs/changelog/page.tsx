import type { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata } from "@/lib/metadata";
import {
  DocsPage,
  DocsSection,
  DocsH3,
  DocsParagraph,
  DocsList,
  DocsCallout,
  DocsDivider,
} from "@/components/docs-page";

export const metadata: Metadata = generatePageMetadata({
  title: "Changelog | Creor",
  description:
    "Latest releases, new features, and improvements in Creor. Stay up to date with what has changed.",
  path: "/docs/changelog",
});

export default function ChangelogPage() {
  return (
    <DocsPage
      breadcrumb="Get Started"
      title="Changelog"
      description="What is new in Creor. This page covers recent releases and highlights. For the full history, see the GitHub releases page."
      toc={[
        { label: "Latest", href: "#latest" },
        { label: "v0.5.0", href: "#v050" },
        { label: "v0.4.0", href: "#v040" },
        { label: "v0.3.0", href: "#v030" },
      ]}
    >
      <DocsSection id="latest" title="Latest">
        <DocsParagraph>
          Creor follows a rolling release cycle with updates every 1-2 weeks.
          The editor checks for updates automatically and prompts you to install
          them. You can also check manually from Help &gt; Check for Updates.
        </DocsParagraph>
        <DocsParagraph>
          For the complete release history and detailed changelogs, visit the{" "}
          <Link
            href="https://github.com/creor-ai/creor-app/releases"
            className="text-[#FF6A13] underline decoration-[#FF6A13]/30 underline-offset-4 hover:decoration-[#FF6A13]"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Releases
          </Link>{" "}
          page.
        </DocsParagraph>
      </DocsSection>

      <DocsDivider />

      <DocsSection id="v050" title="v0.5.0 — Plan Mode & Background Agents">
        <DocsParagraph>
          Released April 2026. This release introduces plan mode for structured
          multi-step tasks, background agents for parallel work, and significant
          improvements to the diff viewer.
        </DocsParagraph>

        <DocsH3>New features</DocsH3>
        <DocsList
          items={[
            "Plan Mode — toggle with Shift+Cmd+P. The agent creates a structured plan before writing code, with a dedicated Plan panel for reviewing and approving steps.",
            "Background Agents — launch multiple agents that work in parallel on separate tasks. Each agent runs in its own git worktree, so changes don't conflict.",
            "Question Dock — when the agent needs clarification, questions appear in a persistent dock at the bottom of the chat instead of inline, reducing interruptions.",
            "Session archive — archive old sessions to keep the sidebar clean. Archived sessions are searchable and can be restored.",
            "Skills system — define reusable prompt templates as skills (e.g., /review-pr, /write-tests) that can be triggered from the chat.",
          ]}
        />

        <DocsH3>Improvements</DocsH3>
        <DocsList
          items={[
            "Diff viewer now shows changes grouped by file with inline accept/reject buttons.",
            "Terminal tool output is rendered in a real terminal emulator with full ANSI color support.",
            "Model picker redesigned with speed/cost/context indicators and recent model history.",
            "Chat input now supports multi-line editing with Shift+Enter and @-mention file references.",
            "Settings UI rewritten with 12 modular sections for easier navigation.",
          ]}
        />

        <DocsH3>Bug fixes</DocsH3>
        <DocsList
          items={[
            "Fixed: agent could not read files with non-UTF-8 encodings.",
            "Fixed: inline edit decorations sometimes persisted after accepting changes.",
            "Fixed: session list did not update when switching workspaces.",
            "Fixed: permission dialog blocked the UI when the agent ran multiple tools in parallel.",
          ]}
        />
      </DocsSection>

      <DocsDivider />

      <DocsSection id="v040" title="v0.4.0 — 19 LLM Providers & MCP">
        <DocsParagraph>
          Released February 2026. A major expansion of provider support, the
          introduction of MCP (Model Context Protocol) integration, and the
          new RAG-powered codebase search.
        </DocsParagraph>

        <DocsH3>New features</DocsH3>
        <DocsList
          items={[
            "19 LLM providers supported — added Groq, Cohere, xAI, Perplexity, Together AI, DeepInfra, Cerebras, Vercel AI, OpenRouter, and GitLab alongside existing Anthropic, OpenAI, Google, AWS Bedrock, Azure, and Mistral.",
            "MCP integration — connect external tools and data sources via the Model Context Protocol. Configure MCP servers in settings or install them from the MCP marketplace.",
            "RAG codebase search — Creor now indexes your codebase using embeddings (Voyage AI or Nomic) for semantic code search. The agent uses this to find relevant code faster.",
            "Creor Gateway — managed API access to all providers through a single Creor account. No need to manage individual API keys.",
            "Web search and web fetch tools — the agent can search the web and read documentation pages to answer questions or find solutions.",
          ]}
        />

        <DocsH3>Improvements</DocsH3>
        <DocsList
          items={[
            "Multi-edit tool — the agent can now apply multiple edits to the same file in a single operation, reducing round trips.",
            "Batch tool — tools can run in parallel for faster task completion.",
            "Provider health indicators — the model picker shows live status for each provider.",
            "BYOK keys are now stored in the OS keychain instead of plain config files.",
            "Agent now uses ripgrep for code search, matching VS Code's built-in search speed.",
          ]}
        />

        <DocsH3>Bug fixes</DocsH3>
        <DocsList
          items={[
            "Fixed: large file edits sometimes timed out on slow connections.",
            "Fixed: Google Vertex AI authentication failed when using workload identity.",
            "Fixed: chat panel did not scroll to latest message in long sessions.",
          ]}
        />
      </DocsSection>

      <DocsDivider />

      <DocsSection id="v030" title="v0.3.0 — AI-Native Editor Launch">
        <DocsParagraph>
          Released December 2025. The first public release of Creor, establishing
          the core AI-integrated editor experience.
        </DocsParagraph>

        <DocsH3>Features at launch</DocsH3>
        <DocsList
          items={[
            "VS Code-compatible editor — full support for VS Code extensions, themes, keybindings, and settings. Familiar interface with AI built in natively.",
            "AI chat panel — converse with an AI agent that can read, search, edit, and run commands in your project. No extensions or plugins required.",
            "25+ built-in tools — file read/write/edit, glob, grep, bash, git integration, code search, LSP integration, and more.",
            "Inline edit — select code and press Cmd+K to get AI-powered inline suggestions with accept/reject UI.",
            "Permission system — granular control over what the agent can do. Default ask-before-acting policy with configurable overrides.",
            "Multi-provider support — Anthropic, OpenAI, Google AI, Google Vertex AI, AWS Bedrock, Azure OpenAI, and Mistral at launch.",
            "Session management — conversations are saved per-project. Switch between sessions, continue old conversations, or start fresh.",
            "PTY integration — the agent runs terminal commands in a real PTY with full shell support, not a sandboxed subprocess.",
          ]}
        />

        <DocsH3>Known limitations at launch</DocsH3>
        <DocsList
          items={[
            "macOS only (Apple Silicon and Intel). Windows and Linux builds followed in v0.3.1.",
            "No codebase indexing — the agent relied on grep and glob for code discovery.",
            "Single session at a time — no parallel agents or background tasks.",
          ]}
        />
      </DocsSection>

      <DocsDivider />

      <DocsCallout type="info">
        Want to be notified about new releases? Watch the{" "}
        <Link
          href="https://github.com/creor-ai/creor-app"
          className="text-[#FF6A13] underline decoration-[#FF6A13]/30 underline-offset-4 hover:decoration-[#FF6A13]"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub repository
        </Link>{" "}
        or follow{" "}
        <Link
          href="https://twitter.com/creor_ai"
          className="text-[#FF6A13] underline decoration-[#FF6A13]/30 underline-offset-4 hover:decoration-[#FF6A13]"
          target="_blank"
          rel="noopener noreferrer"
        >
          @creor_ai
        </Link>{" "}
        on Twitter for announcements.
      </DocsCallout>
    </DocsPage>
  );
}
