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
} from "@/components/docs-page";

export const metadata: Metadata = generatePageMetadata({
  title: "Usage & Analytics | Creor",
  description:
    "Track your Creor usage: monthly summaries, cost breakdowns by model, token consumption, and daily usage charts.",
  path: "/docs/dashboard/usage",
});

export default function DashboardUsagePage() {
  return (
    <DocsPage
      breadcrumb="Dashboard & Account"
      title="Usage & Analytics"
      description="The Usage page gives you full visibility into how your workspace consumes credits, which models you use most, and how your usage trends over time. Use this data to optimize costs and plan capacity."
      toc={[
        { label: "Monthly Summary", href: "#monthly-summary" },
        { label: "Cost by Model", href: "#cost-by-model" },
        { label: "Token Usage", href: "#token-usage" },
        { label: "Daily Charts", href: "#daily-charts" },
        { label: "Usage History", href: "#usage-history" },
        { label: "API Access", href: "#api-access" },
      ]}
    >
      <DocsSection id="monthly-summary" title="Monthly Summary">
        <DocsParagraph>
          The monthly summary card at the top of the Usage page shows your current billing
          cycle&apos;s key metrics at a glance.
        </DocsParagraph>
        <DocsTable
          headers={["Metric", "Description"]}
          rows={[
            ["Total credits used", "Credits consumed across all services this billing cycle."],
            ["Credits remaining", "Current credit balance (subscription + purchased credits)."],
            ["Gateway requests", "Number of inference requests through the Creor Gateway."],
            ["Cloud agent runs", "Number of cloud agent invocations this cycle."],
            ["Total tokens", "Sum of input and output tokens across all models."],
            ["Billing period", "Start and end dates of the current cycle."],
          ]}
        />
        <DocsParagraph>
          The summary updates in near real-time. A small delay (up to 5 minutes) may occur
          between a request and its appearance in the summary.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="cost-by-model" title="Cost by Model">
        <DocsParagraph>
          The cost breakdown shows how your credits are distributed across different LLM models.
          This helps you identify which models consume the most resources and whether switching
          to a different model could reduce costs.
        </DocsParagraph>
        <DocsTable
          headers={["Model", "Requests", "Input Tokens", "Output Tokens", "Credits"]}
          rows={[
            ["Claude Sonnet 4", "1,234", "4.2M", "380K", "142.50"],
            ["Claude Haiku 3.5", "856", "2.1M", "190K", "18.20"],
            ["GPT-4o", "423", "1.8M", "210K", "98.30"],
            ["GPT-4o mini", "2,100", "3.5M", "420K", "12.80"],
            ["Claude Opus 4", "45", "890K", "120K", "67.40"],
          ]}
        />
        <DocsParagraph>
          The table is sortable by any column. Click on a model name to drill down into daily
          usage for that specific model.
        </DocsParagraph>
        <DocsCallout type="tip">
          If a large portion of your credits goes to a premium model (Opus, GPT-4), check
          whether those requests could be handled by a cheaper model (Haiku, GPT-4o mini).
          Simple tasks like documentation and formatting rarely need the most capable model.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="token-usage" title="Token Usage">
        <DocsParagraph>
          The token breakdown shows input vs output token consumption. This matters because
          most providers charge differently for input and output tokens.
        </DocsParagraph>

        <DocsH3>Input Tokens</DocsH3>
        <DocsParagraph>
          Input tokens include your message, system prompt, tool definitions, project context,
          and any code the agent reads. Input tokens are typically 3-10x more than output tokens
          because the agent reads a lot of code before producing a response.
        </DocsParagraph>

        <DocsH3>Output Tokens</DocsH3>
        <DocsParagraph>
          Output tokens include the agent&apos;s response text, tool call arguments (file edits,
          shell commands), and thinking tokens (for models that support extended thinking).
        </DocsParagraph>

        <DocsH3>Reducing Token Usage</DocsH3>
        <DocsList
          items={[
            "Use project instructions (CREOR.md) to give the agent context upfront, reducing the need for exploratory tool calls.",
            "Scope your requests to specific files or directories when possible.",
            "Use the Plan agent for read-only analysis -- it generates plans without expensive edit/bash cycles.",
            "Enable session compaction to reduce token accumulation in long conversations.",
            "Close and start new sessions for unrelated tasks instead of continuing a long thread.",
          ]}
        />
      </DocsSection>

      <DocsSection id="daily-charts" title="Daily Charts">
        <DocsParagraph>
          Interactive charts show your usage patterns over time. Available views include:
        </DocsParagraph>
        <DocsList
          items={[
            "Credits per day: bar chart showing daily credit consumption.",
            "Requests per day: line chart showing daily request volume.",
            "Tokens per day: stacked area chart showing input vs output tokens.",
            "Cost by model per day: stacked bar chart breaking down daily cost by model.",
          ]}
        />

        <DocsH3>Reading the Charts</DocsH3>
        <DocsParagraph>
          Hover over any data point to see exact values. Click and drag to zoom into a date
          range. Use the time range selector (7 days, 30 days, 90 days, custom) to adjust the
          view.
        </DocsParagraph>
        <DocsParagraph>
          Spikes in usage often correlate with specific events -- a large refactoring session,
          a batch of cloud agent runs, or a new team member onboarding. Use the charts to
          understand these patterns and set appropriate spending limits.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="usage-history" title="Usage History">
        <DocsParagraph>
          The history table at the bottom of the page shows every billable event in reverse
          chronological order. Filter by date range, model, API key, or event type.
        </DocsParagraph>
        <DocsTable
          headers={["Column", "Description"]}
          rows={[
            ["Timestamp", "When the request was made."],
            ["Type", "Gateway inference, cloud agent compute, or cloud agent inference."],
            ["Model", "Which LLM model was used."],
            ["API Key", "Which key authenticated the request (name, not the key itself)."],
            ["Input tokens", "Number of input tokens consumed."],
            ["Output tokens", "Number of output tokens consumed."],
            ["Credits", "Credits charged for this event."],
          ]}
        />
        <DocsParagraph>
          Export the history table as a CSV file for external analysis or expense reporting.
          Click the &quot;Export CSV&quot; button in the top right of the table.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="api-access" title="API Access">
        <DocsParagraph>
          Access usage data programmatically for custom dashboards, alerts, or integration
          with your internal billing systems.
        </DocsParagraph>
        <DocsCode lines>{`# Get daily usage rollup for the current month
curl https://api.creor.ai/v1/usage/daily \\
  -H "Authorization: Bearer $CREOR_API_KEY" \\
  -G -d "start=2026-04-01" -d "end=2026-04-12"

# Response
{
  "days": [
    {
      "date": "2026-04-01",
      "credits": 12.50,
      "requests": 145,
      "inputTokens": 520000,
      "outputTokens": 48000,
      "models": {
        "claude-sonnet-4-20250514": { "credits": 8.20, "requests": 98 },
        "claude-haiku-3.5": { "credits": 4.30, "requests": 47 }
      }
    }
  ]
}`}</DocsCode>
        <DocsCode lines>{`# Get monthly summary
curl https://api.creor.ai/v1/usage/summary \\
  -H "Authorization: Bearer $CREOR_API_KEY" \\
  -G -d "month=2026-04"

# Get usage breakdown by API key
curl https://api.creor.ai/v1/usage/by-key \\
  -H "Authorization: Bearer $CREOR_API_KEY" \\
  -G -d "month=2026-04"`}</DocsCode>
      </DocsSection>
    </DocsPage>
  );
}
