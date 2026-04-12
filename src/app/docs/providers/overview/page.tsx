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
  DocsCard,
  DocsDivider,
} from "@/components/docs-page";

export const metadata: Metadata = generatePageMetadata({
  title: "Models & Providers Overview | Creor",
  description:
    "Learn how model selection works in Creor, configure default and agent-specific models, and explore all 19+ supported LLM providers.",
  path: "/docs/providers/overview",
});

export default function ProvidersOverviewPage() {
  return (
    <DocsPage
      breadcrumb="Models & Providers"
      title="Models & Providers Overview"
      description="Creor connects to 19+ LLM providers out of the box. Choose a model globally, per agent, or let the gateway handle it for you."
      toc={[
        { label: "How Model Selection Works", href: "#how-model-selection-works" },
        { label: "Default Model", href: "#default-model" },
        { label: "Small Model", href: "#small-model" },
        { label: "Agent-Specific Models", href: "#agent-specific-models" },
        { label: "Switching Models", href: "#switching-models" },
        { label: "Supported Providers", href: "#supported-providers" },
        { label: "Provider Authentication", href: "#provider-authentication" },
        { label: "Next Steps", href: "#next-steps" },
      ]}
    >
      <DocsSection id="how-model-selection-works" title="How Model Selection Works">
        <DocsParagraph>
          Every message you send in Creor is routed to an LLM. Which model handles that message
          depends on a layered configuration system. Creor resolves the model in this order:
        </DocsParagraph>
        <DocsList
          items={[
            "Agent-level model -- if the active agent (build, plan, explore, etc.) has a model configured, that model is used.",
            "Global model -- the top-level \"model\" field in your creor.json or the model selected in the Settings UI.",
            "Creor Gateway default -- if no model is explicitly configured, the Creor Gateway selects a default model for you.",
          ]}
        />
        <DocsParagraph>
          Models are referenced in the format <code className="text-[#FF6A13]">provider/model-id</code>, for example{" "}
          <code className="text-[#FF6A13]">anthropic/claude-sonnet-4-20250514</code> or{" "}
          <code className="text-[#FF6A13]">creor-gateway/google/gemini-2.5-pro</code>.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="default-model" title="Default Model">
        <DocsParagraph>
          The default model is the model used for all agents unless overridden. Set it in your{" "}
          <code className="text-[#FF6A13]">creor.json</code> at the project root or in{" "}
          <code className="text-[#FF6A13]">~/.creor/creor.json</code> for a global default:
        </DocsParagraph>
        <DocsCode lines>{`{
  "model": "anthropic/claude-sonnet-4-20250514"
}`}</DocsCode>
        <DocsParagraph>
          You can also select the default model from the Settings UI inside Creor. Open the command
          palette and search for &quot;Creor: Settings&quot; or click the model name in the status bar.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="small-model" title="Small Model">
        <DocsParagraph>
          Creor uses a separate &quot;small model&quot; for lightweight tasks like generating session
          titles and summaries. This keeps costs low for background operations. Configure it
          with the <code className="text-[#FF6A13]">small_model</code> field:
        </DocsParagraph>
        <DocsCode lines>{`{
  "model": "anthropic/claude-sonnet-4-20250514",
  "small_model": "creor-gateway/google/gemini-3-flash-preview"
}`}</DocsCode>
        <DocsCallout type="tip">
          If you do not set <code className="text-[#FF6A13]">small_model</code>, Creor uses a
          cost-effective default from the gateway. You only need to override this if you want a
          specific model for background tasks.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="agent-specific-models" title="Agent-Specific Models">
        <DocsParagraph>
          Each agent in Creor can use a different model. This is useful when you want a powerful
          reasoning model for planning and a fast model for building. Configure per-agent models
          in the <code className="text-[#FF6A13]">agent</code> section:
        </DocsParagraph>
        <DocsCode lines>{`{
  "model": "anthropic/claude-sonnet-4-20250514",
  "agent": {
    "build": {
      "model": "anthropic/claude-sonnet-4-20250514"
    },
    "plan": {
      "model": "anthropic/claude-opus-4-20250514"
    },
    "explore": {
      "model": "creor-gateway/google/gemini-2.5-flash"
    }
  }
}`}</DocsCode>
        <DocsParagraph>
          The agent-level model always takes priority over the global model. This lets you
          mix providers freely -- use Anthropic for building, Google for exploration, and
          OpenAI for planning, all in the same workspace.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="switching-models" title="Switching Models">
        <DocsH3>Via Settings UI</DocsH3>
        <DocsParagraph>
          Open the Creor settings panel (command palette or status bar), navigate to the Models
          section, and pick your preferred model from the dropdown. The change takes effect
          immediately for new messages.
        </DocsParagraph>

        <DocsH3>Via creor.json</DocsH3>
        <DocsParagraph>
          Edit the <code className="text-[#FF6A13]">creor.json</code> file in your project root.
          Creor watches this file and picks up changes automatically -- no restart required.
        </DocsParagraph>

        <DocsH3>Filtering Providers</DocsH3>
        <DocsParagraph>
          If you only want to use specific providers, use{" "}
          <code className="text-[#FF6A13]">enabled_providers</code> to whitelist them, or{" "}
          <code className="text-[#FF6A13]">disabled_providers</code> to blacklist specific ones:
        </DocsParagraph>
        <DocsCode lines>{`{
  "enabled_providers": ["anthropic", "creor-gateway"],
  "disabled_providers": ["openrouter"]
}`}</DocsCode>
        <DocsCallout type="info">
          When <code className="text-[#FF6A13]">enabled_providers</code> is set, only those
          providers are available. All others are ignored regardless of whether they have valid
          credentials.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="supported-providers" title="Supported Providers">
        <DocsParagraph>
          Creor supports the following LLM providers. Each provider has its own authentication
          method and model catalog.
        </DocsParagraph>
        <DocsTable
          headers={["Provider", "Key Models", "Auth Method", "Best For"]}
          rows={[
            ["Creor Gateway", "Claude, GPT, Gemini, Grok, and more", "Creor account (built-in)", "Getting started, no API key needed"],
            ["Anthropic", "Claude 4 Opus, Claude 4 Sonnet, Claude 3.5 Haiku", "API key", "Complex reasoning, large codebases"],
            ["OpenAI", "GPT-4o, o3, o3-mini, o4-mini, GPT-4 Turbo", "API key", "Fast responses, broad knowledge"],
            ["Google AI Studio", "Gemini 2.5 Pro, Gemini 2.5 Flash, Gemini 3", "API key", "Long context, multimodal"],
            ["Google Vertex AI", "Gemini models (enterprise)", "GCP credentials", "Enterprise deployments"],
            ["AWS Bedrock", "Claude, Llama, Mistral, Nova", "IAM credentials", "AWS-native infrastructure"],
            ["Azure OpenAI", "GPT-4o, GPT-4 Turbo, o-series", "API key + endpoint", "Azure-native infrastructure"],
            ["OpenRouter", "100+ models", "API key", "Multi-model access, one key"],
            ["Groq", "Llama, Mixtral, Gemma", "API key", "Ultra-fast inference"],
            ["Together AI", "Llama, Qwen, DeepSeek, Mixtral", "API key", "Open-source models"],
            ["DeepInfra", "Llama, Mistral, Qwen", "API key", "Cost-effective open models"],
            ["Cerebras", "Llama", "API key", "Wafer-scale inference speed"],
            ["Mistral", "Mistral Large, Codestral, Ministral", "API key", "European AI, code generation"],
            ["Cohere", "Command R, Command R+", "API key", "RAG and enterprise"],
            ["Perplexity", "Sonar models", "API key", "Web-grounded answers"],
            ["xAI", "Grok 3, Grok 3 Mini", "API key", "Reasoning, real-time knowledge"],
            ["Vercel", "v0 models", "API key", "Vercel platform integration"],
            ["GitHub Copilot", "GPT-4o, Claude, Gemini via Copilot", "GitHub auth", "Existing Copilot subscriptions"],
          ]}
        />
      </DocsSection>

      <DocsSection id="provider-authentication" title="Provider Authentication">
        <DocsParagraph>
          Most providers require an API key or credentials. You can set these up in three ways:
        </DocsParagraph>
        <DocsList
          items={[
            "Creor Settings UI -- navigate to the provider settings and enter your API key directly. Credentials are stored securely in the OS keychain.",
            "Environment variables -- set provider-specific env vars like ANTHROPIC_API_KEY, OPENAI_API_KEY, etc.",
            "creor.json -- for advanced provider configuration (custom endpoints, options), not for storing API keys.",
          ]}
        />
        <DocsCallout type="warning">
          Never store API keys directly in <code className="text-[#FF6A13]">creor.json</code>.
          Use the Settings UI or environment variables instead. The OS keychain provides encrypted
          storage for your credentials.
        </DocsCallout>
      </DocsSection>

      <DocsDivider />

      <DocsSection id="next-steps" title="Next Steps">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DocsCard
            title="Creor Gateway"
            description="Get started with zero configuration using the built-in gateway."
            href="/docs/providers/gateway"
          />
          <DocsCard
            title="Anthropic"
            description="Set up Claude models for complex reasoning tasks."
            href="/docs/providers/anthropic"
          />
          <DocsCard
            title="OpenAI"
            description="Configure GPT-4o and o-series models."
            href="/docs/providers/openai"
          />
          <DocsCard
            title="BYOK (Bring Your Own Key)"
            description="Use any OpenAI-compatible endpoint with your own credentials."
            href="/docs/providers/byok"
          />
        </div>
      </DocsSection>
    </DocsPage>
  );
}
