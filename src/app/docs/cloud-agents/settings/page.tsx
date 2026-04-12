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
} from "@/components/docs-page";

export const metadata: Metadata = generatePageMetadata({
  title: "Cloud Agent Settings | Creor",
  description:
    "Configure cloud agent model selection, timeouts, resource limits, webhook notifications, and per-repository overrides.",
  path: "/docs/cloud-agents/settings",
});

export default function CloudAgentsSettingsPage() {
  return (
    <DocsPage
      breadcrumb="Cloud Agents"
      title="Settings"
      description="Configure how cloud agents run in your workspace. These settings control model selection, resource limits, notification delivery, and per-repository behavior."
      toc={[
        { label: "Model Selection", href: "#model-selection" },
        { label: "Timeouts & Limits", href: "#timeouts-limits" },
        { label: "Webhooks", href: "#webhooks" },
        { label: "Per-Repository Overrides", href: "#per-repo-overrides" },
        { label: "Environment Variables", href: "#environment-variables" },
        { label: "Full Settings Reference", href: "#full-reference" },
      ]}
    >
      <DocsSection id="model-selection" title="Model Selection">
        <DocsParagraph>
          Cloud agents use the default model configured for your workspace. You can override
          this at the workspace, repository, or individual run level.
        </DocsParagraph>

        <DocsH3>Setting the Default Model</DocsH3>
        <DocsParagraph>
          Go to Dashboard &gt; Settings &gt; Cloud Agents &gt; Default Model. Select from
          any model available through the Creor Gateway or your configured BYOK providers.
        </DocsParagraph>
        <DocsTable
          headers={["Model", "Speed", "Quality", "Cost", "Best For"]}
          rows={[
            ["Claude Sonnet 4", "Fast", "High", "$$", "General-purpose. Best default for most tasks."],
            ["Claude Opus 4", "Slow", "Highest", "$$$", "Complex reasoning, large-scale refactoring."],
            ["Claude Haiku 3.5", "Fastest", "Good", "$", "Simple reviews, documentation, formatting."],
            ["GPT-4o", "Fast", "High", "$$", "Strong alternative to Sonnet for code generation."],
            ["GPT-4o mini", "Fastest", "Good", "$", "Budget-friendly option for simple tasks."],
          ]}
        />

        <DocsH3>Per-Run Model Override</DocsH3>
        <DocsParagraph>
          Override the model for a specific run by passing the model parameter in the launch
          request.
        </DocsParagraph>
        <DocsCode lines>{`{
  "repository": "github.com/acme/backend",
  "branch": "main",
  "prompt": "Refactor the payment processing module",
  "model": "claude-opus-4-20250514"
}`}</DocsCode>
      </DocsSection>

      <DocsSection id="timeouts-limits" title="Timeouts & Limits">
        <DocsParagraph>
          Resource limits prevent runaway agents from consuming excessive credits or compute.
        </DocsParagraph>
        <DocsTable
          headers={["Setting", "Default", "Max (Pro)", "Max (Enterprise)", "Description"]}
          rows={[
            ["Run timeout", "10 min", "60 min", "120 min", "Maximum wall-clock time for a single run."],
            ["Max tokens", "200,000", "1,000,000", "Unlimited", "Maximum total tokens (input + output) per run."],
            ["Max tool calls", "100", "500", "Unlimited", "Maximum number of tool invocations per run."],
            ["Max file reads", "50", "200", "Unlimited", "Maximum number of files the agent can read."],
            ["Container CPU", "2 vCPU", "4 vCPU", "8 vCPU", "CPU allocation for the sandboxed container."],
            ["Container RAM", "4 GB", "8 GB", "16 GB", "Memory allocation for the sandboxed container."],
            ["Container disk", "10 GB", "20 GB", "50 GB", "Disk space for repository clone and temporary files."],
          ]}
        />
        <DocsCallout type="info">
          When a limit is reached, the agent stops gracefully and returns whatever results it
          has collected so far. The run status shows which limit was hit.
        </DocsCallout>

        <DocsH3>Monthly Spending Cap</DocsH3>
        <DocsParagraph>
          Set a monthly spending cap to prevent unexpected charges. When the cap is reached,
          new agent runs are blocked until the next billing cycle or until you increase the cap.
        </DocsParagraph>
        <DocsCode lines>{`# Set monthly spending cap via API
curl -X PUT https://api.creor.ai/v1/workspace/settings \\
  -H "Authorization: Bearer $CREOR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "cloudAgents": {
      "monthlySpendingCap": 50.00
    }
  }'`}</DocsCode>
      </DocsSection>

      <DocsSection id="webhooks" title="Webhooks">
        <DocsParagraph>
          Configure webhooks to receive real-time notifications about cloud agent events.
          Webhooks are delivered as HTTP POST requests with a JSON payload.
        </DocsParagraph>

        <DocsH3>Supported Events</DocsH3>
        <DocsTable
          headers={["Event", "Trigger", "Payload Includes"]}
          rows={[
            ["agent.started", "Agent run begins execution", "Run ID, repository, branch, model"],
            ["agent.completed", "Agent run finishes successfully", "Run ID, artifacts, token usage, duration"],
            ["agent.failed", "Agent run fails or times out", "Run ID, error message, partial results"],
            ["agent.comment", "Bugbot posts a PR comment", "Run ID, comment body, file path, line number"],
          ]}
        />

        <DocsH3>Webhook Configuration</DocsH3>
        <DocsCode lines>{`# Configure a webhook endpoint
curl -X POST https://api.creor.ai/v1/webhooks \\
  -H "Authorization: Bearer $CREOR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://your-server.com/webhooks/creor",
    "events": ["agent.completed", "agent.failed"],
    "secret": "whsec_your_signing_secret"
  }'`}</DocsCode>
        <DocsParagraph>
          Webhook payloads are signed using HMAC-SHA256 with the secret you provide. Verify the
          signature in the X-Creor-Signature header to confirm the request is from Creor.
        </DocsParagraph>
        <DocsCode lines>{`# Verify webhook signature (Node.js example)
import crypto from 'crypto';

function verifyWebhook(payload: string, signature: string, secret: string): boolean {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}`}</DocsCode>
      </DocsSection>

      <DocsSection id="per-repo-overrides" title="Per-Repository Overrides">
        <DocsParagraph>
          Override workspace-level settings for specific repositories. This is useful when
          different projects need different models, timeouts, or agent behaviors.
        </DocsParagraph>
        <DocsCode lines>{`# Set per-repository overrides
curl -X PUT https://api.creor.ai/v1/repos/acme/backend/settings \\
  -H "Authorization: Bearer $CREOR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "cloudAgents": {
      "defaultModel": "claude-opus-4-20250514",
      "timeout": 30,
      "maxTokens": 500000,
      "instructions": "This is a Go backend. Use standard library where possible. Follow the patterns in CONTRIBUTING.md."
    }
  }'`}</DocsCode>
        <DocsParagraph>
          Repository-level settings override workspace-level settings. Run-level settings
          (passed in the launch request) override both.
        </DocsParagraph>
        <DocsCallout type="tip">
          Use the instructions field to give the agent project-specific context that applies to
          every run on that repository. This is especially useful for conventions, frameworks,
          and domain knowledge.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="environment-variables" title="Environment Variables">
        <DocsParagraph>
          Cloud agents can access environment variables you define in the workspace settings.
          These are injected into the container at runtime.
        </DocsParagraph>
        <DocsTable
          headers={["Variable", "Purpose", "Example"]}
          rows={[
            ["CREOR_AGENT_MODEL", "Override default model from environment", "claude-sonnet-4-20250514"],
            ["CREOR_AGENT_TIMEOUT", "Override default timeout (minutes)", "30"],
            ["Custom variables", "Passed to the shell environment", "DATABASE_URL, API_BASE_URL"],
          ]}
        />
        <DocsCallout type="warning">
          Do not put sensitive credentials (database passwords, API keys) in cloud agent
          environment variables unless you trust the agent&apos;s sandboxed environment. The
          agent&apos;s shell can read all injected environment variables.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="full-reference" title="Full Settings Reference">
        <DocsParagraph>
          Complete settings object with all cloud agent configuration options.
        </DocsParagraph>
        <DocsCode lines>{`{
  "cloudAgents": {
    "defaultModel": "claude-sonnet-4-20250514",
    "timeout": 10,
    "maxTokens": 200000,
    "maxToolCalls": 100,
    "maxFileReads": 50,
    "monthlySpendingCap": 100.00,
    "instructions": "",
    "webhooks": [
      {
        "url": "https://example.com/hooks/creor",
        "events": ["agent.completed", "agent.failed"],
        "secret": "whsec_..."
      }
    ],
    "env": {
      "NODE_ENV": "production"
    },
    "repos": {
      "acme/backend": {
        "defaultModel": "claude-opus-4-20250514",
        "timeout": 30,
        "instructions": "Go backend. Follow CONTRIBUTING.md."
      }
    }
  }
}`}</DocsCode>
      </DocsSection>
    </DocsPage>
  );
}
