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
  title: "Anthropic (Claude) | Creor",
  description:
    "Configure Claude 4 Opus, Claude 4 Sonnet, and Claude 3.5 Haiku in Creor for complex reasoning, code generation, and large codebase analysis.",
  path: "/docs/providers/anthropic",
});

export default function AnthropicPage() {
  return (
    <DocsPage
      breadcrumb="Models & Providers"
      title="Anthropic (Claude)"
      description="Claude models from Anthropic are built for complex reasoning, careful instruction following, and deep code understanding. They are among the most capable models available for coding tasks."
      toc={[
        { label: "Available Models", href: "#available-models" },
        { label: "Setup", href: "#setup" },
        { label: "Configuration", href: "#configuration" },
        { label: "Advanced Options", href: "#advanced-options" },
        { label: "Best For", href: "#best-for" },
      ]}
    >
      <DocsSection id="available-models" title="Available Models">
        <DocsTable
          headers={["Model", "Model ID", "Context", "Best For"]}
          rows={[
            ["Claude 4 Opus", "claude-opus-4-20250514", "200K tokens", "Hardest problems, deep architectural analysis, multi-file refactors"],
            ["Claude 4 Sonnet", "claude-sonnet-4-20250514", "200K tokens", "Daily driver -- fast, capable, great at coding"],
            ["Claude 3.5 Haiku", "claude-3-5-haiku-20241022", "200K tokens", "Quick tasks, title generation, lightweight operations"],
          ]}
        />
        <DocsCallout type="tip">
          Claude 4 Sonnet is the recommended default model for most users. It balances speed,
          capability, and cost. Use Opus for particularly complex tasks that require extended
          reasoning.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="setup" title="Setup">
        <DocsH3>Step 1: Get an API Key</DocsH3>
        <DocsList
          items={[
            "Go to console.anthropic.com and sign in or create an account.",
            "Navigate to API Keys in the dashboard.",
            "Click \"Create Key\" and copy the key (it starts with sk-ant-).",
          ]}
        />

        <DocsH3>Step 2: Add the Key to Creor</DocsH3>
        <DocsParagraph>
          You can add your Anthropic API key in two ways:
        </DocsParagraph>

        <DocsH3>Option A: Settings UI (recommended)</DocsH3>
        <DocsList
          items={[
            "Open Creor and go to Settings (command palette: \"Creor: Settings\").",
            "Navigate to the Providers section.",
            "Find Anthropic and enter your API key.",
            "The key is stored securely in your OS keychain.",
          ]}
        />

        <DocsH3>Option B: Environment Variable</DocsH3>
        <DocsParagraph>
          Set the <code className="text-[#FF6A13]">ANTHROPIC_API_KEY</code> environment variable
          in your shell profile:
        </DocsParagraph>
        <DocsCode>{`export ANTHROPIC_API_KEY="sk-ant-your-key-here"`}</DocsCode>
      </DocsSection>

      <DocsSection id="configuration" title="Configuration">
        <DocsParagraph>
          Set Claude as your default model in <code className="text-[#FF6A13]">creor.json</code>:
        </DocsParagraph>
        <DocsCode lines>{`{
  "model": "anthropic/claude-sonnet-4-20250514",
  "small_model": "anthropic/claude-3-5-haiku-20241022"
}`}</DocsCode>

        <DocsParagraph>
          Or assign different Claude models to different agents:
        </DocsParagraph>
        <DocsCode lines>{`{
  "agent": {
    "build": {
      "model": "anthropic/claude-sonnet-4-20250514"
    },
    "plan": {
      "model": "anthropic/claude-opus-4-20250514"
    }
  }
}`}</DocsCode>
      </DocsSection>

      <DocsSection id="advanced-options" title="Advanced Options">
        <DocsH3>Custom Base URL</DocsH3>
        <DocsParagraph>
          If you use an Anthropic API proxy or enterprise endpoint, configure a custom base URL:
        </DocsParagraph>
        <DocsCode lines>{`{
  "provider": {
    "anthropic": {
      "options": {
        "baseURL": "https://your-anthropic-proxy.example.com/v1"
      }
    }
  }
}`}</DocsCode>

        <DocsH3>Model Filtering</DocsH3>
        <DocsParagraph>
          Restrict which Anthropic models appear in the model selector:
        </DocsParagraph>
        <DocsCode lines>{`{
  "provider": {
    "anthropic": {
      "whitelist": [
        "claude-sonnet-4-20250514",
        "claude-opus-4-20250514"
      ]
    }
  }
}`}</DocsCode>

        <DocsH3>Request Timeout</DocsH3>
        <DocsParagraph>
          Claude Opus can take longer on complex tasks. Adjust the request timeout (default is
          300,000ms / 5 minutes):
        </DocsParagraph>
        <DocsCode lines>{`{
  "provider": {
    "anthropic": {
      "timeout": 600000
    }
  }
}`}</DocsCode>
      </DocsSection>

      <DocsSection id="best-for" title="Best For">
        <DocsList
          items={[
            "Complex multi-step reasoning across large codebases.",
            "Careful instruction following with minimal hallucination.",
            "Architecture design, code review, and refactoring.",
            "Tasks requiring extended thinking and planning.",
            "Understanding and working with nuanced requirements.",
          ]}
        />
      </DocsSection>

      <DocsDivider />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DocsCard
          title="AWS Bedrock"
          description="Use Claude models through your AWS infrastructure."
          href="/docs/providers/bedrock"
        />
        <DocsCard
          title="Creor Gateway"
          description="Access Claude without managing an API key."
          href="/docs/providers/gateway"
        />
      </div>
    </DocsPage>
  );
}
