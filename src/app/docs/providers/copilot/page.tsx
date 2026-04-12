import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import {
  DocsPage,
  DocsSection,
  DocsH3,
  DocsParagraph,
  DocsCode,
  DocsList,
  DocsCallout,
  DocsTable,
  DocsDivider,
  DocsCard,
} from "@/components/docs-page";

export const metadata: Metadata = generatePageMetadata({
  title: "GitHub Copilot | Creor",
  description:
    "Use your existing GitHub Copilot subscription to access GPT-4o, Claude, Gemini, and other models in Creor.",
  path: "/docs/providers/copilot",
});

export default function CopilotPage() {
  return (
    <DocsPage
      breadcrumb="Models & Providers"
      title="GitHub Copilot"
      description="If you have a GitHub Copilot subscription (Individual, Business, or Enterprise), you can use it as an LLM provider in Creor. This routes requests through GitHub's Copilot API, using your existing subscription -- no additional API keys needed."
      toc={[
        { label: "How It Works", href: "#how-it-works" },
        { label: "Available Models", href: "#available-models" },
        { label: "Setup", href: "#setup" },
        { label: "Configuration", href: "#configuration" },
        { label: "Copilot Enterprise", href: "#copilot-enterprise" },
        { label: "Limitations", href: "#limitations" },
        { label: "Best For", href: "#best-for" },
      ]}
    >
      <DocsSection id="how-it-works" title="How It Works">
        <DocsParagraph>
          The GitHub Copilot integration uses your Copilot OAuth token to authenticate with
          GitHub&apos;s model API. Creor supports both the chat (completions) and responses API
          formats, automatically selecting the right one based on the model.
        </DocsParagraph>
        <DocsList
          items={[
            "Creor authenticates with your GitHub account.",
            "Requests are sent to GitHub's Copilot API endpoints.",
            "Your Copilot subscription quota covers the usage -- no per-token billing.",
            "Available models depend on your Copilot plan tier.",
          ]}
        />
      </DocsSection>

      <DocsSection id="available-models" title="Available Models">
        <DocsParagraph>
          GitHub Copilot provides access to models from multiple providers through GitHub&apos;s
          API. Available models depend on your Copilot plan:
        </DocsParagraph>
        <DocsTable
          headers={["Model", "Model ID", "Plan Required"]}
          rows={[
            ["GPT-4o", "gpt-4o", "Individual, Business, Enterprise"],
            ["GPT-4o Mini", "gpt-4o-mini", "Individual, Business, Enterprise"],
            ["Claude 4 Sonnet", "claude-sonnet-4-20250514", "Business, Enterprise"],
            ["Claude 3.5 Haiku", "claude-3-5-haiku", "Business, Enterprise"],
            ["Gemini 2.5 Pro", "gemini-2.5-pro", "Business, Enterprise"],
            ["o3-mini", "o3-mini", "Business, Enterprise"],
            ["o4-mini", "o4-mini", "Business, Enterprise"],
            ["GPT-5", "gpt-5", "Enterprise"],
          ]}
        />
        <DocsCallout type="info">
          Model availability through Copilot changes as GitHub adds new models. Check the
          GitHub Copilot docs for the most current list for your plan tier.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="setup" title="Setup">
        <DocsH3>Prerequisites</DocsH3>
        <DocsList
          items={[
            "An active GitHub Copilot subscription (Individual, Business, or Enterprise).",
            "A GitHub account authenticated in Creor.",
          ]}
        />

        <DocsH3>Step 1: Authenticate with GitHub</DocsH3>
        <DocsParagraph>
          In Creor, go to Settings and navigate to the Providers section. Find GitHub Copilot
          and click &quot;Sign in with GitHub&quot;. This will open a browser window for OAuth
          authentication.
        </DocsParagraph>

        <DocsH3>Step 2: Select a Model</DocsH3>
        <DocsParagraph>
          Once authenticated, Copilot models will appear in the model selector. Choose one
          as your default or assign it to specific agents.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="configuration" title="Configuration">
        <DocsParagraph>
          Reference Copilot models using the{" "}
          <code className="text-[#FF6A13]">github-copilot/</code> prefix:
        </DocsParagraph>
        <DocsCode lines>{`{
  "model": "github-copilot/gpt-4o"
}`}</DocsCode>

        <DocsParagraph>
          Use Copilot for building and a direct provider for planning:
        </DocsParagraph>
        <DocsCode lines>{`{
  "agent": {
    "build": {
      "model": "github-copilot/gpt-4o"
    },
    "plan": {
      "model": "anthropic/claude-opus-4-20250514"
    }
  }
}`}</DocsCode>
      </DocsSection>

      <DocsSection id="copilot-enterprise" title="Copilot Enterprise">
        <DocsParagraph>
          GitHub Copilot Enterprise offers additional models and higher rate limits. If your
          organization uses Copilot Enterprise, Creor can access the enterprise-specific API
          endpoint.
        </DocsParagraph>
        <DocsCode lines>{`{
  "model": "github-copilot-enterprise/gpt-4o"
}`}</DocsCode>
        <DocsParagraph>
          The <code className="text-[#FF6A13]">github-copilot-enterprise</code> provider uses
          the same OAuth flow but targets the enterprise API endpoint, which may have different
          model availability and rate limits.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="limitations" title="Limitations">
        <DocsList
          items={[
            "Rate limits are governed by your Copilot subscription tier, not by Creor.",
            "Some frontier models (like GPT-5) may only be available on Enterprise plans.",
            "Copilot API responses may have slightly different behavior compared to direct provider APIs.",
            "Token limits and context windows may differ from the direct provider equivalents.",
            "The Copilot API does not support all provider-specific features (e.g., Anthropic-specific beta headers).",
          ]}
        />
      </DocsSection>

      <DocsSection id="best-for" title="Best For">
        <DocsList
          items={[
            "Developers and teams with existing GitHub Copilot subscriptions.",
            "Organizations that want to consolidate AI spending under the GitHub billing umbrella.",
            "Users who prefer GitHub's OAuth flow over managing separate API keys.",
            "Teams that need quick access to multiple model families (GPT, Claude, Gemini) through one account.",
          ]}
        />
      </DocsSection>

      <DocsDivider />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DocsCard
          title="OpenAI (Direct)"
          description="Use OpenAI models directly for full API access."
          href="/docs/providers/openai"
        />
        <DocsCard
          title="Creor Gateway"
          description="Built-in proxy with zero configuration."
          href="/docs/providers/gateway"
        />
      </div>
    </DocsPage>
  );
}
