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
  title: "Creor Gateway | Creor",
  description:
    "Use Creor Gateway to access Claude, GPT, Gemini, and more through a built-in LLM proxy with no API key management.",
  path: "/docs/providers/gateway",
});

export default function GatewayPage() {
  return (
    <DocsPage
      breadcrumb="Models & Providers"
      title="Creor Gateway"
      description="A built-in LLM proxy that gives you access to top models from Anthropic, OpenAI, Google, xAI, and more -- no API keys required."
      toc={[
        { label: "What Is the Gateway?", href: "#what-is-the-gateway" },
        { label: "How It Works", href: "#how-it-works" },
        { label: "Supported Models", href: "#supported-models" },
        { label: "Credit-Based Billing", href: "#credit-based-billing" },
        { label: "Getting Started", href: "#getting-started" },
        { label: "Configuration", href: "#configuration" },
        { label: "When to Use the Gateway", href: "#when-to-use-the-gateway" },
      ]}
    >
      <DocsSection id="what-is-the-gateway" title="What Is the Gateway?">
        <DocsParagraph>
          Creor Gateway is the default LLM provider built into every Creor installation. It
          routes your requests through Creor&apos;s infrastructure to the underlying model provider
          (Anthropic, OpenAI, Google, etc.) so you never need to manage individual API keys.
        </DocsParagraph>
        <DocsParagraph>
          When you first open Creor and sign in with your Creor account, the gateway is ready
          to use immediately. No additional setup is needed.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="how-it-works" title="How It Works">
        <DocsList
          items={[
            "You send a message in Creor.",
            "The Creor engine forwards your request to the gateway API with your Creor auth token.",
            "The gateway routes the request to the appropriate model provider (e.g., Anthropic for Claude, Google for Gemini).",
            "The response streams back through the gateway to your editor in real time.",
            "Token usage is tracked against your Creor account credits.",
          ]}
        />
        <DocsCallout type="info">
          All gateway traffic is encrypted in transit. Your prompts and responses are not stored
          on Creor servers beyond the lifetime of the request. The gateway acts as a stateless proxy.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="supported-models" title="Supported Models">
        <DocsParagraph>
          The gateway model catalog is managed server-side and refreshes automatically every
          15 minutes. Available models depend on your Creor plan. Below are commonly available
          models:
        </DocsParagraph>
        <DocsTable
          headers={["Model", "Provider", "Best For"]}
          rows={[
            ["Claude 4 Sonnet", "Anthropic", "General coding, complex reasoning"],
            ["Claude 4 Opus", "Anthropic", "Hardest problems, deep analysis"],
            ["Claude 3.5 Haiku", "Anthropic", "Fast responses, simple tasks"],
            ["GPT-4o", "OpenAI", "Broad knowledge, fast"],
            ["o3", "OpenAI", "Advanced reasoning"],
            ["o3-mini", "OpenAI", "Fast reasoning, cost-effective"],
            ["o4-mini", "OpenAI", "Newest reasoning model"],
            ["Gemini 2.5 Pro", "Google", "Long context, multimodal"],
            ["Gemini 2.5 Flash", "Google", "Fast, cost-effective"],
            ["Gemini 3 Flash Preview", "Google", "Cutting-edge speed"],
            ["Grok 3", "xAI", "Reasoning, real-time knowledge"],
            ["Grok 3 Mini", "xAI", "Fast reasoning"],
          ]}
        />
        <DocsCallout type="tip">
          The exact model list and availability may change as providers release new models. Check
          the model selector in Creor&apos;s settings for the current catalog.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="credit-based-billing" title="Credit-Based Billing">
        <DocsParagraph>
          Gateway usage is billed per token through Creor credits. Every Creor account
          receives credits based on its plan tier. Token costs vary by model -- premium models
          like Claude 4 Opus and o3 cost more per token than lighter models like Gemini Flash.
        </DocsParagraph>
        <DocsH3>How Credits Work</DocsH3>
        <DocsList
          items={[
            "Credits are denominated in USD. $1 in credits equals $1 of token usage at the provider's rate.",
            "Input tokens (your prompts, context) and output tokens (model responses) are billed separately.",
            "You can monitor your usage and remaining credits in the Creor Dashboard.",
            "When credits run out, gateway requests will fail. Add more credits or switch to a direct API key provider.",
          ]}
        />
        <DocsParagraph>
          For detailed pricing per model, visit the{" "}
          <a href="/docs/dashboard/billing" className="text-[#FF6A13] hover:underline">
            Billing & Credits
          </a>{" "}
          page in the Dashboard docs.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="getting-started" title="Getting Started">
        <DocsParagraph>
          The gateway is enabled by default. To start using it:
        </DocsParagraph>
        <DocsList
          items={[
            "Sign in to Creor with your Creor account (or create one at creor.ai).",
            "Open any project in Creor.",
            "Start chatting -- the gateway is already configured as your default provider.",
          ]}
        />
        <DocsParagraph>
          If you want to explicitly select a gateway model, reference it with the{" "}
          <code className="text-[#FF6A13]">creor-gateway/</code> prefix:
        </DocsParagraph>
        <DocsCode lines>{`{
  "model": "creor-gateway/anthropic/claude-sonnet-4-20250514"
}`}</DocsCode>
      </DocsSection>

      <DocsSection id="configuration" title="Configuration">
        <DocsParagraph>
          While the gateway works out of the box, you can customize its behavior in{" "}
          <code className="text-[#FF6A13]">creor.json</code>:
        </DocsParagraph>
        <DocsCode lines>{`{
  "model": "creor-gateway/anthropic/claude-sonnet-4-20250514",
  "small_model": "creor-gateway/google/gemini-3-flash-preview",
  "provider": {
    "creor-gateway": {
      "name": "Creor Gateway",
      "npm": "@ai-sdk/openai-compatible",
      "options": {
        "baseURL": "https://uwhckbpjrpgopduiyeaw.supabase.co/functions/v1/api/v1"
      }
    }
  }
}`}</DocsCode>
        <DocsCallout type="warning">
          You typically do not need to configure the gateway provider block manually. The
          defaults are set automatically. Only modify this if you are working with a custom
          or enterprise gateway endpoint.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="when-to-use-the-gateway" title="When to Use the Gateway">
        <DocsH3>Ideal For</DocsH3>
        <DocsList
          items={[
            "Getting started quickly -- no API keys to manage.",
            "Trying out different models without signing up for multiple provider accounts.",
            "Teams that want centralized billing through Creor credits.",
            "Users who prefer a managed experience over self-service API keys.",
          ]}
        />
        <DocsH3>When to Use Direct API Keys Instead</DocsH3>
        <DocsList
          items={[
            "You have existing API key agreements with volume discounts.",
            "You need models that are not yet available on the gateway.",
            "Your organization requires requests to go directly to the provider (compliance).",
            "You want to avoid the small gateway routing overhead.",
          ]}
        />
      </DocsSection>

      <DocsDivider />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DocsCard
          title="Billing & Credits"
          description="Understand how gateway credits work and manage your usage."
          href="/docs/dashboard/billing"
        />
        <DocsCard
          title="BYOK (Bring Your Own Key)"
          description="Use your own API keys instead of the gateway."
          href="/docs/providers/byok"
        />
      </div>
    </DocsPage>
  );
}
