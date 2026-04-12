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
  title: "OpenAI (GPT & o-series) | Creor",
  description:
    "Configure GPT-4o, o3, o3-mini, and o4-mini in Creor for fast coding, broad knowledge, and advanced reasoning tasks.",
  path: "/docs/providers/openai",
});

export default function OpenAIPage() {
  return (
    <DocsPage
      breadcrumb="Models & Providers"
      title="OpenAI (GPT & o-series)"
      description="OpenAI models provide fast responses, broad general knowledge, and advanced reasoning capabilities through the o-series. Creor uses the OpenAI Responses API for all supported models."
      toc={[
        { label: "Available Models", href: "#available-models" },
        { label: "Setup", href: "#setup" },
        { label: "Configuration", href: "#configuration" },
        { label: "Advanced Options", href: "#advanced-options" },
        { label: "Best For", href: "#best-for" },
      ]}
    >
      <DocsSection id="available-models" title="Available Models">
        <DocsH3>Chat Models</DocsH3>
        <DocsTable
          headers={["Model", "Model ID", "Context", "Best For"]}
          rows={[
            ["GPT-4o", "gpt-4o", "128K tokens", "Fast general-purpose coding, broad knowledge"],
            ["GPT-4o Mini", "gpt-4o-mini", "128K tokens", "Cost-effective lightweight tasks"],
            ["GPT-4 Turbo", "gpt-4-turbo", "128K tokens", "Complex coding with vision support"],
          ]}
        />

        <DocsH3>Reasoning Models (o-series)</DocsH3>
        <DocsTable
          headers={["Model", "Model ID", "Context", "Best For"]}
          rows={[
            ["o3", "o3", "200K tokens", "Hardest reasoning, math, complex code architecture"],
            ["o3-mini", "o3-mini", "200K tokens", "Fast reasoning at lower cost"],
            ["o4-mini", "o4-mini", "200K tokens", "Newest reasoning model, balanced speed/capability"],
            ["o1", "o1", "200K tokens", "Deep multi-step reasoning"],
          ]}
        />
        <DocsCallout type="info">
          The o-series models use extended thinking internally. Responses may take longer but
          produce higher quality results for complex problems. They are particularly strong at
          multi-step code reasoning.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="setup" title="Setup">
        <DocsH3>Step 1: Get an API Key</DocsH3>
        <DocsList
          items={[
            "Go to platform.openai.com and sign in or create an account.",
            "Navigate to API Keys under your account settings.",
            "Click \"Create new secret key\" and copy it (it starts with sk-).",
            "Make sure your account has a payment method and sufficient credits.",
          ]}
        />

        <DocsH3>Step 2: Add the Key to Creor</DocsH3>

        <DocsH3>Option A: Settings UI (recommended)</DocsH3>
        <DocsList
          items={[
            "Open Creor and go to Settings.",
            "Navigate to the Providers section.",
            "Find OpenAI and enter your API key.",
            "The key is stored securely in your OS keychain.",
          ]}
        />

        <DocsH3>Option B: Environment Variable</DocsH3>
        <DocsCode>{`export OPENAI_API_KEY="sk-your-key-here"`}</DocsCode>
      </DocsSection>

      <DocsSection id="configuration" title="Configuration">
        <DocsParagraph>
          Set an OpenAI model as your default in <code className="text-[#FF6A13]">creor.json</code>:
        </DocsParagraph>
        <DocsCode lines>{`{
  "model": "openai/gpt-4o"
}`}</DocsCode>

        <DocsParagraph>
          Use a reasoning model for the plan agent and a fast model for building:
        </DocsParagraph>
        <DocsCode lines>{`{
  "agent": {
    "build": {
      "model": "openai/gpt-4o"
    },
    "plan": {
      "model": "openai/o3"
    }
  }
}`}</DocsCode>
      </DocsSection>

      <DocsSection id="advanced-options" title="Advanced Options">
        <DocsH3>Custom Base URL</DocsH3>
        <DocsParagraph>
          If you use an OpenAI-compatible proxy, configure a custom base URL:
        </DocsParagraph>
        <DocsCode lines>{`{
  "provider": {
    "openai": {
      "options": {
        "baseURL": "https://your-openai-proxy.example.com/v1"
      }
    }
  }
}`}</DocsCode>

        <DocsH3>Organization ID</DocsH3>
        <DocsParagraph>
          If your OpenAI account belongs to an organization, set the org ID:
        </DocsParagraph>
        <DocsCode>{`export OPENAI_ORG_ID="org-your-org-id"`}</DocsCode>

        <DocsH3>Model Filtering</DocsH3>
        <DocsCode lines>{`{
  "provider": {
    "openai": {
      "whitelist": ["gpt-4o", "o3-mini"]
    }
  }
}`}</DocsCode>
      </DocsSection>

      <DocsSection id="best-for" title="Best For">
        <DocsList
          items={[
            "Fast, general-purpose coding with broad domain knowledge.",
            "Quick iteration loops where response speed matters.",
            "Multi-step reasoning tasks (o-series models).",
            "Projects that need GPT-specific features like vision input.",
            "Teams already using OpenAI for other products.",
          ]}
        />
      </DocsSection>

      <DocsDivider />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DocsCard
          title="Azure OpenAI"
          description="Run OpenAI models on your Azure infrastructure."
          href="/docs/providers/azure"
        />
        <DocsCard
          title="GitHub Copilot"
          description="Use OpenAI models through your Copilot subscription."
          href="/docs/providers/copilot"
        />
      </div>
    </DocsPage>
  );
}
