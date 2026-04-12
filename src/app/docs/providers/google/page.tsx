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
  title: "Google (Gemini) | Creor",
  description:
    "Configure Gemini 2.5 Pro, Gemini 2.5 Flash, and Gemini 3 in Creor via Google AI Studio or Google Vertex AI.",
  path: "/docs/providers/google",
});

export default function GooglePage() {
  return (
    <DocsPage
      breadcrumb="Models & Providers"
      title="Google (Gemini)"
      description="Google provides Gemini models through two services: Google AI Studio (personal API keys) and Google Vertex AI (enterprise GCP integration). Creor supports both."
      toc={[
        { label: "Available Models", href: "#available-models" },
        { label: "Google AI Studio", href: "#google-ai-studio" },
        { label: "Google Vertex AI", href: "#google-vertex-ai" },
        { label: "Vertex Anthropic (Claude on GCP)", href: "#vertex-anthropic" },
        { label: "Configuration Examples", href: "#configuration-examples" },
        { label: "Best For", href: "#best-for" },
      ]}
    >
      <DocsSection id="available-models" title="Available Models">
        <DocsTable
          headers={["Model", "Model ID", "Context", "Best For"]}
          rows={[
            ["Gemini 2.5 Pro", "gemini-2.5-pro-preview-05-06", "1M tokens", "Complex reasoning, long context, multimodal"],
            ["Gemini 2.5 Flash", "gemini-2.5-flash-preview-05-20", "1M tokens", "Fast responses, cost-effective, large context"],
            ["Gemini 3 Flash Preview", "gemini-3-flash-preview", "1M tokens", "Cutting-edge speed and capability"],
            ["Gemini 2.0 Flash", "gemini-2.0-flash", "1M tokens", "Stable, production-ready"],
          ]}
        />
        <DocsCallout type="tip">
          Gemini models support up to 1 million tokens of context, making them excellent for
          working with very large codebases where you need to include many files in a single
          conversation.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="google-ai-studio" title="Google AI Studio">
        <DocsParagraph>
          Google AI Studio is the easiest way to get started with Gemini models. It provides
          free API keys with generous rate limits.
        </DocsParagraph>

        <DocsH3>Step 1: Get an API Key</DocsH3>
        <DocsList
          items={[
            "Go to aistudio.google.com and sign in with your Google account.",
            "Click \"Get API key\" in the left sidebar.",
            "Create a new API key or use an existing one.",
            "Copy the key.",
          ]}
        />

        <DocsH3>Step 2: Add the Key to Creor</DocsH3>

        <DocsH3>Option A: Settings UI (recommended)</DocsH3>
        <DocsList
          items={[
            "Open Creor and go to Settings.",
            "Navigate to the Providers section.",
            "Find Google AI Studio and enter your API key.",
          ]}
        />

        <DocsH3>Option B: Environment Variable</DocsH3>
        <DocsCode>{`export GOOGLE_GENERATIVE_AI_API_KEY="your-key-here"`}</DocsCode>

        <DocsH3>Configuration</DocsH3>
        <DocsCode lines>{`{
  "model": "google/gemini-2.5-pro-preview-05-06"
}`}</DocsCode>
      </DocsSection>

      <DocsSection id="google-vertex-ai" title="Google Vertex AI">
        <DocsParagraph>
          Google Vertex AI is the enterprise option for running Gemini models. It uses your
          existing GCP project and IAM authentication, making it ideal for organizations with
          compliance requirements.
        </DocsParagraph>

        <DocsH3>Prerequisites</DocsH3>
        <DocsList
          items={[
            "A Google Cloud Platform project with billing enabled.",
            "The Vertex AI API enabled in your project.",
            "Application Default Credentials (ADC) configured on your machine.",
          ]}
        />

        <DocsH3>Step 1: Set Up Authentication</DocsH3>
        <DocsParagraph>
          Configure Application Default Credentials using the gcloud CLI:
        </DocsParagraph>
        <DocsCode>{`gcloud auth application-default login`}</DocsCode>

        <DocsH3>Step 2: Set Environment Variables</DocsH3>
        <DocsCode lines>{`# Required: your GCP project ID
export GOOGLE_CLOUD_PROJECT="your-project-id"

# Optional: region (defaults to us-east5)
export GOOGLE_CLOUD_LOCATION="us-east5"`}</DocsCode>

        <DocsH3>Configuration</DocsH3>
        <DocsCode lines>{`{
  "model": "google-vertex/gemini-2.5-pro-preview-05-06"
}`}</DocsCode>
        <DocsCallout type="info">
          Note the different provider prefix:{" "}
          <code className="text-[#FF6A13]">google/</code> for AI Studio and{" "}
          <code className="text-[#FF6A13]">google-vertex/</code> for Vertex AI. The model IDs
          are the same, but the routing and authentication differ.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="vertex-anthropic" title="Vertex Anthropic (Claude on GCP)">
        <DocsParagraph>
          Google Vertex AI also hosts Claude models from Anthropic. This lets you use Claude
          while keeping all traffic within your GCP infrastructure.
        </DocsParagraph>

        <DocsH3>Setup</DocsH3>
        <DocsCode lines>{`# Same GCP credentials as Vertex AI
export GOOGLE_CLOUD_PROJECT="your-project-id"

# Claude models use "global" as the default location
export GOOGLE_CLOUD_LOCATION="global"`}</DocsCode>

        <DocsH3>Configuration</DocsH3>
        <DocsCode lines>{`{
  "model": "google-vertex-anthropic/claude-sonnet-4-20250514"
}`}</DocsCode>
      </DocsSection>

      <DocsSection id="configuration-examples" title="Configuration Examples">
        <DocsH3>AI Studio with Agent Overrides</DocsH3>
        <DocsCode lines>{`{
  "model": "google/gemini-2.5-pro-preview-05-06",
  "small_model": "google/gemini-2.5-flash-preview-05-20",
  "agent": {
    "build": {
      "model": "google/gemini-2.5-pro-preview-05-06"
    },
    "explore": {
      "model": "google/gemini-2.5-flash-preview-05-20"
    }
  }
}`}</DocsCode>

        <DocsH3>Vertex AI Enterprise Setup</DocsH3>
        <DocsCode lines>{`{
  "model": "google-vertex/gemini-2.5-pro-preview-05-06",
  "enabled_providers": ["google-vertex", "google-vertex-anthropic"],
  "provider": {
    "google-vertex": {
      "options": {
        "project": "my-gcp-project",
        "location": "us-east5"
      }
    }
  }
}`}</DocsCode>
      </DocsSection>

      <DocsSection id="best-for" title="Best For">
        <DocsList
          items={[
            "Working with very large codebases (up to 1M tokens of context).",
            "Multimodal tasks involving images, diagrams, or screenshots.",
            "Cost-effective coding with Gemini Flash models.",
            "Enterprise deployments on Google Cloud (Vertex AI).",
            "Teams that need Claude models through GCP infrastructure (Vertex Anthropic).",
          ]}
        />
      </DocsSection>

      <DocsDivider />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DocsCard
          title="AWS Bedrock"
          description="Run Claude and other models on AWS infrastructure."
          href="/docs/providers/bedrock"
        />
        <DocsCard
          title="Azure OpenAI"
          description="Run GPT models on Azure infrastructure."
          href="/docs/providers/azure"
        />
      </div>
    </DocsPage>
  );
}
