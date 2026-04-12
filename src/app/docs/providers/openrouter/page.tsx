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
  title: "OpenRouter | Creor",
  description:
    "Configure OpenRouter in Creor to access 100+ models from Anthropic, OpenAI, Google, Meta, and more through a single API key.",
  path: "/docs/providers/openrouter",
});

export default function OpenRouterPage() {
  return (
    <DocsPage
      breadcrumb="Models & Providers"
      title="OpenRouter"
      description="OpenRouter is a multi-model routing service that provides access to 100+ models from all major providers through a single API key. It handles provider failover, rate limiting, and model discovery."
      toc={[
        { label: "Why OpenRouter?", href: "#why-openrouter" },
        { label: "Setup", href: "#setup" },
        { label: "Configuration", href: "#configuration" },
        { label: "Popular Models", href: "#popular-models" },
        { label: "Model Routing", href: "#model-routing" },
        { label: "Advanced Options", href: "#advanced-options" },
        { label: "Best For", href: "#best-for" },
      ]}
    >
      <DocsSection id="why-openrouter" title="Why OpenRouter?">
        <DocsList
          items={[
            "One API key for 100+ models -- no need to manage separate accounts for each provider.",
            "Automatic failover -- if one provider is down, OpenRouter can route to an alternative.",
            "Unified billing -- one bill for all model usage regardless of the underlying provider.",
            "Model discovery -- easily try new models without signing up for new services.",
            "Rate limit pooling -- OpenRouter manages rate limits across multiple provider accounts.",
          ]}
        />
      </DocsSection>

      <DocsSection id="setup" title="Setup">
        <DocsH3>Step 1: Get an API Key</DocsH3>
        <DocsList
          items={[
            "Go to openrouter.ai and sign in or create an account.",
            "Navigate to the API Keys page.",
            "Create a new key and copy it (it starts with sk-or-).",
            "Add credits to your OpenRouter account for usage billing.",
          ]}
        />

        <DocsH3>Step 2: Add the Key to Creor</DocsH3>

        <DocsH3>Option A: Settings UI (recommended)</DocsH3>
        <DocsList
          items={[
            "Open Creor and go to Settings.",
            "Navigate to the Providers section.",
            "Find OpenRouter and enter your API key.",
          ]}
        />

        <DocsH3>Option B: Environment Variable</DocsH3>
        <DocsCode>{`export OPENROUTER_API_KEY="sk-or-your-key-here"`}</DocsCode>
      </DocsSection>

      <DocsSection id="configuration" title="Configuration">
        <DocsParagraph>
          Reference OpenRouter models using the{" "}
          <code className="text-[#FF6A13]">openrouter/</code> prefix followed by the model
          identifier from openrouter.ai:
        </DocsParagraph>
        <DocsCode lines>{`{
  "model": "openrouter/anthropic/claude-sonnet-4"
}`}</DocsCode>

        <DocsParagraph>
          Mix OpenRouter models across agents:
        </DocsParagraph>
        <DocsCode lines>{`{
  "agent": {
    "build": {
      "model": "openrouter/anthropic/claude-sonnet-4"
    },
    "plan": {
      "model": "openrouter/openai/o3"
    },
    "explore": {
      "model": "openrouter/google/gemini-2.5-flash-preview"
    }
  }
}`}</DocsCode>
      </DocsSection>

      <DocsSection id="popular-models" title="Popular Models on OpenRouter">
        <DocsTable
          headers={["Model", "OpenRouter ID", "Provider"]}
          rows={[
            ["Claude 4 Sonnet", "anthropic/claude-sonnet-4", "Anthropic"],
            ["Claude 4 Opus", "anthropic/claude-opus-4", "Anthropic"],
            ["GPT-4o", "openai/gpt-4o", "OpenAI"],
            ["o3-mini", "openai/o3-mini", "OpenAI"],
            ["Gemini 2.5 Pro", "google/gemini-2.5-pro-preview", "Google"],
            ["Gemini 2.5 Flash", "google/gemini-2.5-flash-preview", "Google"],
            ["Grok 3", "x-ai/grok-3", "xAI"],
            ["Llama 3.3 70B", "meta-llama/llama-3.3-70b-instruct", "Meta"],
            ["DeepSeek V3", "deepseek/deepseek-chat-v3", "DeepSeek"],
            ["Mistral Large", "mistralai/mistral-large", "Mistral"],
          ]}
        />
        <DocsCallout type="tip">
          Check openrouter.ai/models for the full up-to-date catalog with pricing. Model IDs
          may change as new versions are released.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="model-routing" title="Model Routing">
        <DocsParagraph>
          OpenRouter supports special routing features that let you dynamically select models:
        </DocsParagraph>

        <DocsH3>Auto Router</DocsH3>
        <DocsParagraph>
          OpenRouter offers an auto-routing model that selects the best model based on your
          prompt. This is useful for experimentation:
        </DocsParagraph>
        <DocsCode lines>{`{
  "model": "openrouter/openrouter/auto"
}`}</DocsCode>

        <DocsH3>Fallback Models</DocsH3>
        <DocsParagraph>
          OpenRouter automatically handles provider outages by routing to alternative providers
          hosting the same model. This happens transparently -- you do not need to configure
          anything.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="advanced-options" title="Advanced Options">
        <DocsH3>HTTP Headers</DocsH3>
        <DocsParagraph>
          Creor automatically sends the required <code className="text-[#FF6A13]">HTTP-Referer</code> and{" "}
          <code className="text-[#FF6A13]">X-Title</code> headers that OpenRouter uses for
          analytics. No manual configuration is needed.
        </DocsParagraph>

        <DocsH3>Model Filtering</DocsH3>
        <DocsParagraph>
          Restrict which OpenRouter models appear in the model selector:
        </DocsParagraph>
        <DocsCode lines>{`{
  "provider": {
    "openrouter": {
      "whitelist": [
        "anthropic/claude-sonnet-4",
        "openai/gpt-4o",
        "google/gemini-2.5-pro-preview"
      ]
    }
  }
}`}</DocsCode>

        <DocsH3>Request Timeout</DocsH3>
        <DocsCode lines>{`{
  "provider": {
    "openrouter": {
      "timeout": 600000
    }
  }
}`}</DocsCode>
      </DocsSection>

      <DocsSection id="best-for" title="Best For">
        <DocsList
          items={[
            "Users who want to try many models without managing multiple API keys.",
            "Teams that need a single billing source for all model usage.",
            "Projects that benefit from automatic provider failover.",
            "Experimentation and model comparison across providers.",
            "Access to niche or newly released models not yet available elsewhere.",
          ]}
        />
      </DocsSection>

      <DocsDivider />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DocsCard
          title="Creor Gateway"
          description="Use built-in gateway with zero setup."
          href="/docs/providers/gateway"
        />
        <DocsCard
          title="BYOK"
          description="Use any OpenAI-compatible endpoint with your own keys."
          href="/docs/providers/byok"
        />
      </div>
    </DocsPage>
  );
}
