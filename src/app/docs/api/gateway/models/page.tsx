import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import {
  DocsPage,
  DocsSection,
  DocsH3,
  DocsParagraph,
  DocsCode,
  DocsTable,
  DocsCallout,
  DocsDivider,
} from "@/components/docs-page";

export const metadata: Metadata = generatePageMetadata({
  title: "Supported Models | Creor Gateway API",
  description:
    "Browse all models available through the Creor Gateway, including model IDs, capabilities, context windows, and pricing.",
  path: "/docs/api/gateway/models",
});

export default function GatewayModelsPage() {
  return (
    <DocsPage
      breadcrumb="API > Gateway"
      title="Supported Models"
      description="The Creor Gateway provides access to models from Anthropic, OpenAI, Google, and other leading providers. Use any model by specifying its ID in the model parameter."
      toc={[
        { label: "Anthropic Models", href: "#anthropic" },
        { label: "OpenAI Models", href: "#openai" },
        { label: "Google Models", href: "#google" },
        { label: "Open Source Models", href: "#open-source" },
        { label: "Pricing", href: "#pricing" },
        { label: "List Models via API", href: "#list-models-api" },
      ]}
    >
      <DocsSection id="anthropic" title="Anthropic Models">
        <DocsParagraph>
          Claude models from Anthropic are available through the Gateway. These
          models excel at coding, analysis, and long-context tasks.
        </DocsParagraph>

        <DocsTable
          headers={["Model ID", "Context Window", "Max Output", "Capabilities"]}
          rows={[
            ["claude-opus-4-20250514", "200K tokens", "32K tokens", "Most capable. Best for complex reasoning, multi-step tasks, and nuanced analysis."],
            ["claude-sonnet-4-20250514", "200K tokens", "16K tokens", "Balanced performance and cost. Best for most coding and general-purpose tasks."],
            ["claude-haiku-3-5-20241022", "200K tokens", "8K tokens", "Fastest and most affordable. Best for simple tasks, classification, and extraction."],
          ]}
        />

        <DocsCallout type="tip">
          Claude Sonnet 4 is the recommended default for most use cases. It
          offers a strong balance of intelligence, speed, and cost.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="openai" title="OpenAI Models">
        <DocsParagraph>
          GPT models from OpenAI are available for teams that prefer them or need
          specific capabilities like function calling or JSON mode.
        </DocsParagraph>

        <DocsTable
          headers={["Model ID", "Context Window", "Max Output", "Capabilities"]}
          rows={[
            ["gpt-4o", "128K tokens", "16K tokens", "Multimodal. Accepts text and images. Fast and cost-effective."],
            ["gpt-4o-mini", "128K tokens", "16K tokens", "Smaller, faster GPT-4o variant. Great for high-volume, simpler tasks."],
            ["o3", "200K tokens", "100K tokens", "Advanced reasoning model with chain-of-thought capabilities."],
            ["o4-mini", "200K tokens", "100K tokens", "Efficient reasoning model for structured problem-solving."],
          ]}
        />
      </DocsSection>

      <DocsSection id="google" title="Google Models">
        <DocsParagraph>
          Gemini models from Google are available for teams that need large
          context windows or multimodal capabilities.
        </DocsParagraph>

        <DocsTable
          headers={["Model ID", "Context Window", "Max Output", "Capabilities"]}
          rows={[
            ["gemini-2.5-pro", "1M tokens", "65K tokens", "Largest context window. Excellent for analyzing entire codebases."],
            ["gemini-2.5-flash", "1M tokens", "65K tokens", "Fast and affordable with a large context window."],
            ["gemini-2.0-flash", "1M tokens", "8K tokens", "Previous generation. Cost-effective for simpler tasks."],
          ]}
        />
      </DocsSection>

      <DocsSection id="open-source" title="Open Source Models">
        <DocsParagraph>
          Select open-source models are available through the Gateway, hosted on
          optimized infrastructure for low latency.
        </DocsParagraph>

        <DocsTable
          headers={["Model ID", "Provider", "Context Window", "Capabilities"]}
          rows={[
            ["deepseek-v3", "DeepSeek", "128K tokens", "Strong coding and reasoning capabilities. Cost-effective."],
            ["deepseek-r1", "DeepSeek", "128K tokens", "Reasoning model with chain-of-thought. Good for math and logic."],
            ["llama-4-maverick", "Meta", "1M tokens", "Open-weight model with massive context window."],
            ["qwen-2.5-coder-32b", "Alibaba", "128K tokens", "Specialized for code generation and understanding."],
          ]}
        />

        <DocsCallout type="info">
          Open source model availability may vary. Use the /v1/models endpoint
          to check which models are currently available in real time.
        </DocsCallout>
      </DocsSection>

      <DocsDivider />

      <DocsSection id="pricing" title="Pricing">
        <DocsParagraph>
          Gateway pricing is per million tokens, billed separately for input
          (prompt) and output (completion) tokens. Prices are in USD.
        </DocsParagraph>

        <DocsTable
          headers={["Model", "Input (per 1M tokens)", "Output (per 1M tokens)"]}
          rows={[
            ["claude-opus-4-20250514", "$15.00", "$75.00"],
            ["claude-sonnet-4-20250514", "$3.00", "$15.00"],
            ["claude-haiku-3-5-20241022", "$0.80", "$4.00"],
            ["gpt-4o", "$2.50", "$10.00"],
            ["gpt-4o-mini", "$0.15", "$0.60"],
            ["o3", "$10.00", "$40.00"],
            ["o4-mini", "$1.10", "$4.40"],
            ["gemini-2.5-pro", "$1.25", "$10.00"],
            ["gemini-2.5-flash", "$0.15", "$0.60"],
            ["deepseek-v3", "$0.27", "$1.10"],
            ["deepseek-r1", "$0.55", "$2.19"],
          ]}
        />

        <DocsParagraph>
          Prices reflect the Creor Gateway rate, which includes infrastructure
          and routing costs. For up-to-date pricing, check the Models &amp; Pricing
          page in the dashboard.
        </DocsParagraph>

        <DocsCallout type="tip">
          Use the usage object in each API response to track costs in real time.
          The prompt_tokens and completion_tokens fields let you calculate the
          exact cost of each request.
        </DocsCallout>
      </DocsSection>

      <DocsDivider />

      <DocsSection id="list-models-api" title="List Models via API">
        <DocsParagraph>
          Use the /v1/models endpoint to get the current list of available models
          programmatically. This is useful for building model selectors in your
          application.
        </DocsParagraph>

        <DocsH3>Request</DocsH3>
        <DocsCode>{`curl https://api.creor.ai/v1/models \\
  -u YOUR_API_KEY:`}</DocsCode>

        <DocsH3>Response</DocsH3>
        <DocsCode>{`{
  "object": "list",
  "data": [
    {
      "id": "claude-sonnet-4-20250514",
      "object": "model",
      "created": 1712937600,
      "owned_by": "anthropic",
      "capabilities": {
        "streaming": true,
        "function_calling": true,
        "vision": true,
        "json_mode": true
      },
      "context_window": 200000,
      "max_output_tokens": 16000,
      "pricing": {
        "input_per_million": 3.00,
        "output_per_million": 15.00
      }
    },
    {
      "id": "gpt-4o",
      "object": "model",
      "created": 1712937600,
      "owned_by": "openai",
      "capabilities": {
        "streaming": true,
        "function_calling": true,
        "vision": true,
        "json_mode": true
      },
      "context_window": 128000,
      "max_output_tokens": 16000,
      "pricing": {
        "input_per_million": 2.50,
        "output_per_million": 10.00
      }
    }
  ]
}`}</DocsCode>

        <DocsH3>Filtering by Capability</DocsH3>
        <DocsParagraph>
          You can filter models by capability using query parameters:
        </DocsParagraph>
        <DocsCode>{`# List only models that support vision
curl "https://api.creor.ai/v1/models?capability=vision" \\
  -u YOUR_API_KEY:

# List only models from a specific provider
curl "https://api.creor.ai/v1/models?owned_by=anthropic" \\
  -u YOUR_API_KEY:`}</DocsCode>

        <DocsH3>JavaScript Example</DocsH3>
        <DocsCode lines>{`import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.CREOR_API_KEY,
  baseURL: "https://api.creor.ai/v1",
});

const models = await client.models.list();

for (const model of models.data) {
  console.log(\`\${model.id} (by \${model.owned_by})\`);
}`}</DocsCode>
      </DocsSection>
    </DocsPage>
  );
}
