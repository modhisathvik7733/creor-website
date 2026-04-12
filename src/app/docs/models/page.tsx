import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import {
  DocsPage,
  DocsSection,
  DocsH3,
  DocsParagraph,
  DocsCode,
  DocsTable,
  DocsList,
  DocsCallout,
  DocsDivider,
} from "@/components/docs-page";

export const metadata: Metadata = generatePageMetadata({
  title: "Models & Pricing | Creor",
  description:
    "Creor plans, pricing tiers, supported AI models, credit system, and how to switch between models.",
  path: "/docs/models",
});

export default function ModelsPage() {
  return (
    <DocsPage
      breadcrumb="Get Started"
      title="Models & Pricing"
      description="Creor gives you access to the best AI models from every major provider through a single interface. Use the Creor Gateway for managed access, or bring your own API keys."
      toc={[
        { label: "Plans", href: "#plans" },
        { label: "Free Tier", href: "#free-tier" },
        { label: "Starter", href: "#starter" },
        { label: "Pro", href: "#pro" },
        { label: "BYOK", href: "#byok" },
        { label: "Supported Models", href: "#supported-models" },
        { label: "Credits", href: "#credits" },
        { label: "Switching Models", href: "#switching-models" },
      ]}
    >
      <DocsSection id="plans" title="Plans">
        <DocsParagraph>
          Creor offers three subscription tiers through the Creor Gateway, plus a
          bring-your-own-key option that is always free. All plans include the
          full Creor IDE with all features — plans only differ in how you access
          AI models.
        </DocsParagraph>
        <DocsTable
          headers={["Plan", "Price", "Requests / Month", "Best For"]}
          rows={[
            ["Free", "$0", "200 Gateway requests", "Trying Creor, light usage"],
            ["Starter", "$20/month", "1,000 Gateway requests", "Individual developers"],
            ["Pro", "$40/month", "Unlimited Gateway requests", "Daily professional use"],
            ["BYOK", "$0", "Unlimited (your own keys)", "Users who prefer direct API access"],
          ]}
        />
        <DocsCallout type="info">
          All paid plans are billed monthly. You can upgrade, downgrade, or
          cancel at any time from the dashboard. Unused requests do not roll
          over.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="free-tier" title="Free Tier">
        <DocsParagraph>
          The Free tier is a great way to try Creor without any commitment. You
          get 200 Creor Gateway requests per month, which is enough for light
          exploration and small tasks.
        </DocsParagraph>
        <DocsList
          items={[
            "200 Gateway requests per month across all models.",
            "Access to all supported models (subject to per-model rate limits).",
            "Full IDE features: editor, terminal, extensions, git integration.",
            "All 25+ AI tools: file editing, code search, web search, planning, and more.",
            "Community support via GitHub Discussions.",
          ]}
        />
        <DocsParagraph>
          When you reach the monthly limit, you can either upgrade to a paid
          plan or add your own API keys (BYOK) to continue using AI features
          without limits.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="starter" title="Starter">
        <DocsParagraph>
          The Starter plan is designed for individual developers who use AI
          coding assistance regularly but not all day.
        </DocsParagraph>
        <DocsList
          items={[
            "1,000 Gateway requests per month.",
            "Priority model access — reduced queue times during peak hours.",
            "Email support with 24-hour response time.",
            "Usage dashboard with per-session cost breakdown.",
          ]}
        />
        <DocsParagraph>
          A typical coding session uses 10-30 requests depending on task
          complexity, so 1,000 requests covers roughly 30-100 sessions per
          month.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="pro" title="Pro">
        <DocsParagraph>
          The Pro plan removes all usage limits. It is built for developers who
          rely on AI assistance throughout their workday.
        </DocsParagraph>
        <DocsList
          items={[
            "Unlimited Gateway requests — no monthly caps.",
            "Access to the latest models on launch day.",
            "Priority routing and lower latency.",
            "Cloud agents for running AI tasks in the background.",
            "Team features: shared workspaces, usage analytics, admin controls.",
            "Priority support with same-day response.",
          ]}
        />
      </DocsSection>

      <DocsSection id="byok" title="BYOK (Bring Your Own Keys)">
        <DocsParagraph>
          If you already have API keys from Anthropic, OpenAI, Google, or any
          other supported provider, you can use them directly in Creor at no
          cost. BYOK mode is always free and has no request limits — you pay the
          provider directly at their standard rates.
        </DocsParagraph>

        <DocsH3>Setting up BYOK</DocsH3>
        <DocsList
          items={[
            "Open Settings (Cmd + , on macOS, Ctrl + , on Windows/Linux).",
            "Navigate to AI > Providers.",
            "Select a provider (e.g., Anthropic) and enter your API key.",
            "The key is stored in your OS keychain — never sent to Creor servers.",
            "Models from that provider now appear in the model picker.",
          ]}
        />

        <DocsH3>Mixing Gateway and BYOK</DocsH3>
        <DocsParagraph>
          You can use both the Creor Gateway and your own keys simultaneously.
          For example, use the Gateway for Claude models and your own OpenAI key
          for GPT-4o. The model picker shows which provider handles each model.
        </DocsParagraph>
        <DocsCallout type="tip">
          BYOK is also useful as a fallback. If the Gateway is temporarily at
          capacity, your own keys provide uninterrupted access.
        </DocsCallout>
      </DocsSection>

      <DocsDivider />

      <DocsSection id="supported-models" title="Supported Models">
        <DocsParagraph>
          Creor supports models from 19+ providers. The following table lists
          the most popular models available through the Creor Gateway. BYOK
          users can access any model their provider offers.
        </DocsParagraph>

        <DocsH3>Flagship models</DocsH3>
        <DocsTable
          headers={["Model", "Provider", "Context Window", "Best For"]}
          rows={[
            ["Claude Opus 4", "Anthropic", "200K tokens", "Complex reasoning, large codebases"],
            ["Claude Sonnet 4", "Anthropic", "200K tokens", "Fast edits, balanced quality/speed"],
            ["GPT-4o", "OpenAI", "128K tokens", "General coding, broad knowledge"],
            ["GPT-4.1", "OpenAI", "1M tokens", "Long-context tasks, large refactors"],
            ["Gemini 2.5 Pro", "Google", "1M tokens", "Massive context, multi-file analysis"],
            ["Gemini 2.5 Flash", "Google", "1M tokens", "Fast responses, cost-efficient"],
          ]}
        />

        <DocsH3>Additional models</DocsH3>
        <DocsTable
          headers={["Model", "Provider", "Context Window"]}
          rows={[
            ["Claude Haiku 3.5", "Anthropic", "200K tokens"],
            ["GPT-4o Mini", "OpenAI", "128K tokens"],
            ["Grok 3", "xAI", "131K tokens"],
            ["Mistral Large", "Mistral", "128K tokens"],
            ["Command R+", "Cohere", "128K tokens"],
            ["DeepSeek V3", "DeepSeek / Together AI", "64K tokens"],
            ["Llama 4 Maverick", "Meta / Groq / Together AI", "1M tokens"],
            ["Qwen 3 235B", "Alibaba / Together AI", "128K tokens"],
          ]}
        />

        <DocsH3>Provider list</DocsH3>
        <DocsParagraph>
          Creor integrates with the following providers. See the Providers
          documentation for setup details on each one.
        </DocsParagraph>
        <DocsList
          items={[
            "Anthropic",
            "OpenAI",
            "Google AI (Gemini)",
            "Google Vertex AI",
            "AWS Bedrock",
            "Azure OpenAI",
            "Mistral",
            "Groq",
            "Cohere",
            "xAI (Grok)",
            "Perplexity",
            "Together AI",
            "DeepInfra",
            "Cerebras",
            "OpenRouter",
            "GitLab",
            "Vercel AI",
            "Fireworks AI",
            "Custom OpenAI-compatible endpoints",
          ]}
        />
      </DocsSection>

      <DocsDivider />

      <DocsSection id="credits" title="Credits">
        <DocsParagraph>
          Gateway requests are counted per agent interaction, not per API call.
          When you send a message in the chat, the agent may make multiple
          internal API calls (reading files, searching, editing) — this counts
          as a single request from your quota.
        </DocsParagraph>

        <DocsH3>How credits are consumed</DocsH3>
        <DocsTable
          headers={["Action", "Credits Used"]}
          rows={[
            ["Chat message (any model)", "1 credit"],
            ["Plan mode analysis", "1 credit"],
            ["Background agent task", "1 credit per message"],
            ["Inline edit suggestion", "1 credit"],
            ["Auto-complete (if enabled)", "0 credits (uses local model)"],
          ]}
        />
        <DocsParagraph>
          You can monitor your usage in real time from the dashboard. The status
          bar in Creor also shows your remaining credits for the current billing
          period.
        </DocsParagraph>
        <DocsCallout type="info">
          Pro plan users have unlimited credits, so usage tracking is
          informational only — there are no caps or throttles.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="switching-models" title="Switching Models">
        <DocsParagraph>
          You can change the active model at any time, even mid-conversation.
        </DocsParagraph>

        <DocsH3>From the model picker</DocsH3>
        <DocsParagraph>
          Click the model name in the chat input area (bottom of the AI panel)
          to open the model picker. It shows all available models grouped by
          provider, with indicators for speed, cost, and context window size.
        </DocsParagraph>

        <DocsH3>From the keyboard</DocsH3>
        <DocsParagraph>
          Use the keyboard shortcut Cmd + Shift + M (macOS) or Ctrl + Shift + M
          (Windows/Linux) to open the model picker without leaving the keyboard.
        </DocsParagraph>

        <DocsH3>Per-task model selection</DocsH3>
        <DocsParagraph>
          Different models excel at different tasks. A practical setup:
        </DocsParagraph>
        <DocsList
          items={[
            "Claude Opus 4 or GPT-4.1 — complex architecture decisions, large refactors, debugging tricky issues.",
            "Claude Sonnet 4 or GPT-4o — everyday coding, writing tests, quick edits. Best balance of quality and speed.",
            "Gemini 2.5 Pro — tasks that need massive context, like analyzing an entire codebase or cross-referencing many files.",
            "Claude Haiku 3.5 or GPT-4o Mini — simple tasks, boilerplate generation, formatting. Fastest response times.",
          ]}
        />
        <DocsCallout type="tip">
          The model picker remembers your last used model per workspace. If you
          always use Claude Sonnet for your main project and GPT-4o for a side
          project, Creor switches automatically when you change workspaces.
        </DocsCallout>
      </DocsSection>
    </DocsPage>
  );
}
