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
  DocsCard,
  DocsDivider,
} from "@/components/docs-page";

export const metadata: Metadata = generatePageMetadata({
  title: "Gateway Overview | Creor API",
  description:
    "Use the Creor Gateway as an OpenAI-compatible API to access Claude, GPT, Gemini, and more with a single API key.",
  path: "/docs/api/gateway/overview",
});

export default function GatewayOverviewPage() {
  return (
    <DocsPage
      breadcrumb="API > Gateway"
      title="Gateway Overview"
      description="The Creor Gateway is an OpenAI-compatible API endpoint that gives you access to models from Anthropic, OpenAI, Google, and other providers through a single API key and a unified billing system."
      toc={[
        { label: "What Is the Gateway", href: "#what-is-the-gateway" },
        { label: "Quick Start", href: "#quick-start" },
        { label: "Request Format", href: "#request-format" },
        { label: "Response Format", href: "#response-format" },
        { label: "Streaming", href: "#streaming" },
        { label: "Usage & Billing", href: "#usage-billing" },
        { label: "Next Steps", href: "#next-steps" },
      ]}
    >
      <DocsSection id="what-is-the-gateway" title="What Is the Gateway">
        <DocsParagraph>
          Instead of managing separate API keys and SDKs for each model provider,
          the Creor Gateway provides a single /v1/chat/completions endpoint that
          is fully compatible with the OpenAI SDK. Point any OpenAI-compatible
          client at https://api.creor.ai/v1 and use your Creor API key to access
          all supported models.
        </DocsParagraph>

        <DocsH3>Key Benefits</DocsH3>
        <DocsList
          items={[
            "Single API key for all providers -- no need to manage keys for Anthropic, OpenAI, Google, and others separately.",
            "OpenAI SDK compatible -- swap the base URL and API key; your existing code works without changes.",
            "Unified billing -- all usage across all models appears on a single invoice.",
            "Automatic model routing -- the gateway routes your request to the correct provider based on the model ID.",
            "Built-in rate limiting and retry logic on the server side for provider-level errors.",
          ]}
        />
      </DocsSection>

      <DocsDivider />

      <DocsSection id="quick-start" title="Quick Start">
        <DocsParagraph>
          Make your first request in under a minute. You need a Creor API key
          from the dashboard (Settings &gt; API Keys).
        </DocsParagraph>

        <DocsH3>curl</DocsH3>
        <DocsCode>{`curl https://api.creor.ai/v1/chat/completions \\
  -u YOUR_API_KEY: \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "claude-sonnet-4-20250514",
    "messages": [
      {"role": "user", "content": "What is the Creor Gateway?"}
    ]
  }'`}</DocsCode>

        <DocsH3>OpenAI SDK (JavaScript)</DocsH3>
        <DocsCode lines>{`import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.CREOR_API_KEY,
  baseURL: "https://api.creor.ai/v1",
});

const completion = await client.chat.completions.create({
  model: "claude-sonnet-4-20250514",
  messages: [
    { role: "user", content: "What is the Creor Gateway?" },
  ],
});

console.log(completion.choices[0].message.content);`}</DocsCode>

        <DocsH3>OpenAI SDK (Python)</DocsH3>
        <DocsCode lines>{`import openai
import os

client = openai.OpenAI(
    api_key=os.environ["CREOR_API_KEY"],
    base_url="https://api.creor.ai/v1",
)

completion = client.chat.completions.create(
    model="claude-sonnet-4-20250514",
    messages=[
        {"role": "user", "content": "What is the Creor Gateway?"}
    ],
)

print(completion.choices[0].message.content)`}</DocsCode>

        <DocsCallout type="tip">
          You can use any model available in the Creor Gateway by changing the
          model parameter. Run &quot;GET /v1/models&quot; to see the full list.
        </DocsCallout>
      </DocsSection>

      <DocsDivider />

      <DocsSection id="request-format" title="Request Format">
        <DocsParagraph>
          The Gateway accepts the same request format as the OpenAI Chat
          Completions API. All standard parameters are supported.
        </DocsParagraph>

        <DocsCode>{`POST https://api.creor.ai/v1/chat/completions
Content-Type: application/json
Authorization: Basic base64(YOUR_API_KEY:)

{
  "model": "claude-sonnet-4-20250514",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Explain TCP/IP in simple terms."}
  ],
  "temperature": 0.7,
  "max_tokens": 1024,
  "stream": false
}`}</DocsCode>

        <DocsH3>Supported Parameters</DocsH3>
        <DocsTable
          headers={["Parameter", "Type", "Required", "Description"]}
          rows={[
            ["model", "string", "Yes", "Model ID (e.g., claude-sonnet-4-20250514, gpt-4o, gemini-2.5-pro)."],
            ["messages", "array", "Yes", "Array of message objects with role and content fields."],
            ["temperature", "number", "No", "Sampling temperature (0-2). Default varies by model."],
            ["max_tokens", "integer", "No", "Maximum tokens in the response. Default varies by model."],
            ["stream", "boolean", "No", "Enable SSE streaming. Default: false."],
            ["top_p", "number", "No", "Nucleus sampling parameter (0-1)."],
            ["stop", "string | array", "No", "Stop sequence(s) to end generation."],
            ["n", "integer", "No", "Number of completions to generate. Default: 1."],
          ]}
        />

        <DocsH3>Message Roles</DocsH3>
        <DocsTable
          headers={["Role", "Description"]}
          rows={[
            ["system", "Sets the behavior and context for the assistant. Sent once at the start."],
            ["user", "The user's input message."],
            ["assistant", "A previous response from the assistant (for multi-turn conversations)."],
          ]}
        />

        <DocsCallout type="info">
          Not all parameters are supported by every model. For example, the n
          parameter is not available for Claude models. The gateway silently
          ignores unsupported parameters rather than returning an error.
        </DocsCallout>
      </DocsSection>

      <DocsDivider />

      <DocsSection id="response-format" title="Response Format">
        <DocsParagraph>
          Non-streaming responses follow the OpenAI Chat Completions response
          format. The gateway normalizes responses from all providers into this
          consistent shape.
        </DocsParagraph>

        <DocsCode>{`{
  "id": "chatcmpl-9f8g7h6j5k4l3m2n1",
  "object": "chat.completion",
  "created": 1712937600,
  "model": "claude-sonnet-4-20250514",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "TCP/IP is a set of rules that computers use..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 42,
    "completion_tokens": 156,
    "total_tokens": 198
  }
}`}</DocsCode>

        <DocsH3>Response Fields</DocsH3>
        <DocsTable
          headers={["Field", "Type", "Description"]}
          rows={[
            ["id", "string", "Unique identifier for the completion."],
            ["object", "string", "Always \"chat.completion\" for non-streaming responses."],
            ["created", "integer", "Unix timestamp when the response was generated."],
            ["model", "string", "The model that generated the response."],
            ["choices", "array", "Array of completion choices (usually one)."],
            ["choices[].message", "object", "The assistant's response message with role and content."],
            ["choices[].finish_reason", "string", "Why generation stopped: \"stop\", \"length\", or \"content_filter\"."],
            ["usage", "object", "Token counts for billing and context tracking."],
          ]}
        />
      </DocsSection>

      <DocsDivider />

      <DocsSection id="streaming" title="Streaming">
        <DocsParagraph>
          Set &quot;stream&quot;: true to receive Server-Sent Events (SSE) as tokens
          are generated. This is the recommended approach for interactive
          applications where you want to display text as it arrives.
        </DocsParagraph>
        <DocsCode>{`curl https://api.creor.ai/v1/chat/completions \\
  -u YOUR_API_KEY: \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "claude-sonnet-4-20250514",
    "stream": true,
    "messages": [
      {"role": "user", "content": "Write a short poem about code"}
    ]
  }'`}</DocsCode>
        <DocsParagraph>
          See the dedicated Streaming page for the full event format, error
          handling, and complete SDK examples.
        </DocsParagraph>
      </DocsSection>

      <DocsDivider />

      <DocsSection id="usage-billing" title="Usage & Billing">
        <DocsParagraph>
          All requests through the Gateway are billed based on token usage. Each
          model has its own per-token pricing, which you can view on the Models
          page or in the dashboard.
        </DocsParagraph>

        <DocsH3>How Billing Works</DocsH3>
        <DocsList
          items={[
            "Input tokens (your messages) and output tokens (the response) are billed separately.",
            "Pricing is per million tokens and varies by model.",
            "Usage is tracked in real time and visible in the dashboard under Usage & Analytics.",
            "Free plan users have a monthly credit allowance. Starter and Pro plans have higher or unlimited credits.",
            "If you exceed your credit balance, requests return a 402 Payment Required error until you add credits or upgrade.",
          ]}
        />

        <DocsH3>Checking Your Usage</DocsH3>
        <DocsCode>{`curl https://api.creor.ai/v1/usage \\
  -u YOUR_API_KEY:`}</DocsCode>
        <DocsCode>{`{
  "period_start": "2026-04-01T00:00:00Z",
  "period_end": "2026-04-30T23:59:59Z",
  "total_tokens": 1284560,
  "total_cost_usd": 3.42,
  "credit_remaining_usd": 16.58,
  "breakdown_by_model": [
    { "model": "claude-sonnet-4-20250514", "tokens": 820000, "cost_usd": 2.46 },
    { "model": "gpt-4o", "tokens": 464560, "cost_usd": 0.96 }
  ]
}`}</DocsCode>

        <DocsCallout type="info">
          The usage object in each completion response includes token counts.
          Use these for real-time cost tracking in your application without
          making additional API calls.
        </DocsCallout>
      </DocsSection>

      <DocsDivider />

      <DocsSection id="next-steps" title="Next Steps">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DocsCard
            title="Supported Models"
            description="Browse all models available through the Gateway with pricing and capabilities."
            href="/docs/api/gateway/models"
          />
          <DocsCard
            title="Streaming"
            description="Full guide to SSE streaming with event format and SDK examples."
            href="/docs/api/gateway/streaming"
          />
          <DocsCard
            title="Authentication"
            description="API keys, device code flow, and JWT token authentication."
            href="/docs/api/authentication"
          />
          <DocsCard
            title="Rate Limits"
            description="Understand limits per plan and how to handle 429 responses."
            href="/docs/api/rate-limits"
          />
        </div>
      </DocsSection>
    </DocsPage>
  );
}
