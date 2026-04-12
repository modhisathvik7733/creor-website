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
  DocsDivider,
  DocsCard,
} from "@/components/docs-page";

export const metadata: Metadata = generatePageMetadata({
  title: "Cloud Agents Setup | Creor",
  description:
    "Get started with Creor cloud agents: API key setup, workspace configuration, and launching your first agent.",
  path: "/docs/cloud-agents/setup",
});

export default function CloudAgentsSetupPage() {
  return (
    <DocsPage
      breadcrumb="Cloud Agents"
      title="Setup"
      description="Get cloud agents running in under five minutes. This guide walks you through API key creation, workspace configuration, and launching your first cloud agent."
      toc={[
        { label: "Prerequisites", href: "#prerequisites" },
        { label: "Create an API Key", href: "#create-api-key" },
        { label: "Connect a Repository", href: "#connect-repository" },
        { label: "Launch via Dashboard", href: "#launch-dashboard" },
        { label: "Launch via API", href: "#launch-api" },
        { label: "Launch via CLI", href: "#launch-cli" },
        { label: "Monitoring Runs", href: "#monitoring" },
        { label: "Next Steps", href: "#next-steps" },
      ]}
    >
      <DocsSection id="prerequisites" title="Prerequisites">
        <DocsList
          items={[
            "A Creor account (sign up at creor.ai if you do not have one).",
            "An active subscription (Starter, Pro, or BYOK plan) with credit balance.",
            "A GitHub, GitLab, or Bitbucket repository you want cloud agents to work on.",
          ]}
        />
        <DocsCallout type="info">
          Free plan users get limited cloud agent access (5 runs per month). Upgrade to Starter
          or Pro for higher limits and priority scheduling.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="create-api-key" title="Create an API Key">
        <DocsParagraph>
          Cloud agents authenticate using API keys tied to your workspace. You can create keys
          from the dashboard or let the IDE create one automatically on first sign-in.
        </DocsParagraph>
        <DocsList
          items={[
            "Go to creor.ai/dashboard and sign in.",
            "Navigate to Settings > API Keys.",
            "Click \"Create Key\" and give it a descriptive name (e.g., \"cloud-agents-prod\").",
            "Select the scope: \"Cloud Agents\" for agent-only access, or \"Full Access\" for all API endpoints.",
            "Copy the key immediately -- it will not be shown again.",
          ]}
        />
        <DocsCode>{`# Store your API key as an environment variable
export CREOR_API_KEY="cr_live_xxxxxxxxxxxxxxxxxxxx"`}</DocsCode>
        <DocsCallout type="warning">
          Treat API keys like passwords. Do not commit them to version control or share them in
          public channels. Rotate keys regularly and revoke any that may have been exposed.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="connect-repository" title="Connect a Repository">
        <DocsParagraph>
          Cloud agents need access to your repository to clone it. Connect your Git provider
          from the dashboard.
        </DocsParagraph>

        <DocsH3>GitHub</DocsH3>
        <DocsList
          items={[
            "Go to Dashboard > Settings > Integrations.",
            "Click \"Connect GitHub\" and authorize the Creor GitHub App.",
            "Select which repositories or organizations the app can access.",
            "Creor requests read-only access by default. Write access is needed for agents that post PR comments.",
          ]}
        />

        <DocsH3>GitLab and Bitbucket</DocsH3>
        <DocsParagraph>
          For GitLab and Bitbucket, create a personal access token with read_repository scope
          and add it in Dashboard &gt; Settings &gt; Integrations. Cloud agents will use this
          token to clone your repository.
        </DocsParagraph>
        <DocsCode lines>{`# GitLab: create a token at Settings > Access Tokens
# Required scopes: read_repository, write_repository (for PR comments)

# Bitbucket: create an App Password at Personal Settings > App passwords
# Required permissions: Repositories (Read), Pull Requests (Write)`}</DocsCode>
      </DocsSection>

      <DocsSection id="launch-dashboard" title="Launch via Dashboard">
        <DocsParagraph>
          The quickest way to try cloud agents is through the web dashboard.
        </DocsParagraph>
        <DocsList
          items={[
            "Go to Dashboard > Cloud Agents.",
            "Click \"New Agent Run\".",
            "Select a repository and branch.",
            "Choose an agent type (e.g., Code Review, Bug Detection, Custom Task).",
            "For custom tasks, enter your prompt describing what the agent should do.",
            "Optionally select a model (defaults to your workspace's default model).",
            "Click \"Launch\" to start the agent.",
          ]}
        />
        <DocsParagraph>
          The dashboard shows a real-time log of the agent&apos;s activity, including which
          tools it calls and what files it reads or modifies. When the run completes, you can
          view artifacts like diffs and reports directly in the dashboard.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="launch-api" title="Launch via API">
        <DocsParagraph>
          For programmatic access and CI/CD integration, use the Cloud Agents API.
        </DocsParagraph>
        <DocsCode lines>{`curl -X POST https://api.creor.ai/v1/agents/launch \\
  -H "Authorization: Bearer $CREOR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "repository": "github.com/your-org/your-repo",
    "branch": "main",
    "agent": "code-review",
    "prompt": "Review the latest 3 commits for bugs and style issues.",
    "model": "claude-sonnet-4-20250514",
    "webhook": "https://your-server.com/webhooks/creor"
  }'`}</DocsCode>
        <DocsParagraph>
          The API returns an agent run ID that you can use to check status, stream logs, and
          retrieve artifacts.
        </DocsParagraph>
        <DocsCode lines>{`# Check agent status
curl https://api.creor.ai/v1/agents/run_abc123/status \\
  -H "Authorization: Bearer $CREOR_API_KEY"

# Response
{
  "id": "run_abc123",
  "status": "running",
  "started_at": "2026-04-12T10:30:00Z",
  "tools_called": 14,
  "tokens_used": { "input": 45000, "output": 3200 }
}`}</DocsCode>
      </DocsSection>

      <DocsSection id="launch-cli" title="Launch via CLI">
        <DocsParagraph>
          If you have the Creor CLI installed, you can launch cloud agents from your terminal.
        </DocsParagraph>
        <DocsCode lines>{`# Launch a code review agent on the current branch
creor cloud review --branch $(git branch --show-current)

# Launch a custom task
creor cloud run --repo github.com/your-org/your-repo \\
  --branch feature/auth \\
  --prompt "Add unit tests for the AuthService class"

# Check status of a running agent
creor cloud status run_abc123

# List recent agent runs
creor cloud list --limit 10`}</DocsCode>
      </DocsSection>

      <DocsSection id="monitoring" title="Monitoring Runs">
        <DocsParagraph>
          Once an agent is running, you have several ways to monitor its progress.
        </DocsParagraph>
        <DocsTable
          headers={["Method", "Details"]}
          rows={[
            ["Dashboard", "Real-time activity log, tool call cards, and artifact preview."],
            ["API polling", "GET /v1/agents/:id/status returns current status, token usage, and tools called."],
            ["SSE stream", "GET /v1/agents/:id/stream returns a Server-Sent Events stream of the agent's activity in real time."],
            ["Webhooks", "Configure a webhook URL to receive POST notifications on status changes (started, completed, failed)."],
            ["CLI", "\"creor cloud logs run_abc123\" streams logs to your terminal."],
          ]}
        />
        <DocsCallout type="tip">
          Set up webhooks for production workflows. They provide reliable, push-based notifications
          without the overhead of polling.
        </DocsCallout>
      </DocsSection>

      <DocsDivider />

      <DocsSection id="next-steps" title="Next Steps">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DocsCard
            title="Capabilities"
            description="Explore what cloud agents can do and which tools are available."
            href="/docs/cloud-agents/capabilities"
          />
          <DocsCard
            title="Bugbot"
            description="Set up automated bug detection on your pull requests."
            href="/docs/cloud-agents/bugbot"
          />
          <DocsCard
            title="Best Practices"
            description="Write effective prompts and structure tasks for best results."
            href="/docs/cloud-agents/best-practices"
          />
          <DocsCard
            title="API Reference"
            description="Full API documentation for the Cloud Agents endpoints."
            href="/docs/api/cloud-agents/overview"
          />
        </div>
      </DocsSection>
    </DocsPage>
  );
}
