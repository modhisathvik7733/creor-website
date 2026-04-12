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
  title: "Cloud Agents Best Practices | Creor",
  description:
    "Write effective prompts, manage costs, and structure tasks for the best results with Creor cloud agents.",
  path: "/docs/cloud-agents/best-practices",
});

export default function CloudAgentsBestPracticesPage() {
  return (
    <DocsPage
      breadcrumb="Cloud Agents"
      title="Best Practices"
      description="Get the most out of cloud agents by writing clear prompts, structuring tasks effectively, and managing costs. These practices are based on patterns observed across thousands of agent runs."
      toc={[
        { label: "Writing Effective Prompts", href: "#effective-prompts" },
        { label: "Structuring Tasks", href: "#structuring-tasks" },
        { label: "Cost Management", href: "#cost-management" },
        { label: "Cloud vs Local", href: "#cloud-vs-local" },
        { label: "Common Pitfalls", href: "#common-pitfalls" },
      ]}
    >
      <DocsSection id="effective-prompts" title="Writing Effective Prompts">
        <DocsParagraph>
          The quality of a cloud agent&apos;s output depends heavily on how well you describe the
          task. A specific, well-scoped prompt consistently outperforms a vague one.
        </DocsParagraph>

        <DocsH3>Be Specific About the Goal</DocsH3>
        <DocsParagraph>
          Tell the agent exactly what you want it to produce, not just what area to look at.
        </DocsParagraph>
        <DocsTable
          headers={["Weak Prompt", "Strong Prompt"]}
          rows={[
            [
              "\"Review the auth code\"",
              "\"Review the changes in src/auth/ for SQL injection risks, missing input validation, and insecure token storage. Post inline comments on any issues found.\"",
            ],
            [
              "\"Add tests\"",
              "\"Generate Vitest unit tests for all exported functions in src/utils/validation.ts. Cover edge cases: empty input, null, undefined, and boundary values. Follow the test structure in src/utils/__tests__/format.test.ts.\"",
            ],
            [
              "\"Fix the bug\"",
              "\"The /api/users endpoint returns 500 when the email field contains unicode characters. Find the validation logic, fix the regex to support unicode, and add a test case.\"",
            ],
          ]}
        />

        <DocsH3>Provide Context</DocsH3>
        <DocsParagraph>
          Cloud agents start with a fresh clone and no prior conversation history. Include any
          context that would help a new engineer understand the task.
        </DocsParagraph>
        <DocsList
          items={[
            "Mention which files or directories are relevant.",
            "Reference the testing framework, coding style, or architecture patterns your project uses.",
            "Explain domain-specific terminology that might not be obvious from the code.",
            "If the task is part of a larger effort, describe the bigger picture.",
          ]}
        />

        <DocsH3>Define the Output Format</DocsH3>
        <DocsParagraph>
          If you want the agent to produce something specific (a diff, a report, PR comments),
          say so explicitly.
        </DocsParagraph>
        <DocsCode lines>{`{
  "prompt": "Analyze the codebase for unused exports. Output a markdown report listing each unused export with its file path and line number. Group by directory. Include a summary count at the top."
}`}</DocsCode>
      </DocsSection>

      <DocsSection id="structuring-tasks" title="Structuring Tasks">
        <DocsParagraph>
          How you break up work into agent runs affects both quality and cost.
        </DocsParagraph>

        <DocsH3>One Task Per Run</DocsH3>
        <DocsParagraph>
          Each cloud agent run should have a single, clear objective. Multi-objective prompts
          (&quot;review the code AND add tests AND update the docs&quot;) tend to produce
          lower-quality results because the agent spreads its context window across too many
          concerns.
        </DocsParagraph>
        <DocsTable
          headers={["Approach", "Quality", "Cost"]}
          rows={[
            ["One run: \"review, test, and document\"", "Lower -- agent loses focus", "Higher -- more tokens spent switching context"],
            ["Three runs: review, test, document separately", "Higher -- each run is focused", "Similar total -- but each result is better"],
          ]}
        />

        <DocsH3>Scope Appropriately</DocsH3>
        <DocsList
          items={[
            "Small scope: \"Add error handling to the createUser function\" -- fast, cheap, precise.",
            "Medium scope: \"Add input validation to all API routes in src/routes/\" -- good balance of breadth and quality.",
            "Large scope: \"Refactor the entire auth system to use JWTs\" -- may hit timeout limits. Break into sub-tasks.",
          ]}
        />

        <DocsH3>Use Follow-ups</DocsH3>
        <DocsParagraph>
          If a run produces partial results or you want to iterate, use the follow-up API to
          continue the conversation without starting a new clone.
        </DocsParagraph>
        <DocsCode lines>{`# Add a follow-up message to a running or completed agent
curl -X POST https://api.creor.ai/v1/agents/run_abc123/followup \\
  -H "Authorization: Bearer $CREOR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "message": "Good start, but also check the middleware functions in src/middleware/ for the same issues."
  }'`}</DocsCode>
      </DocsSection>

      <DocsSection id="cost-management" title="Cost Management">
        <DocsParagraph>
          Cloud agent costs come from two sources: LLM token usage and container compute time.
          Here is how to keep costs predictable.
        </DocsParagraph>

        <DocsH3>Choose the Right Model</DocsH3>
        <DocsTable
          headers={["Task Type", "Recommended Model", "Reason"]}
          rows={[
            ["Code review (complex)", "Claude Sonnet, GPT-4o", "Best reasoning for subtle bugs"],
            ["Code review (simple)", "Claude Haiku, GPT-4o-mini", "Fast and cheap for straightforward checks"],
            ["Code generation", "Claude Sonnet, GPT-4o", "Best code quality"],
            ["Documentation", "Claude Haiku, GPT-4o-mini", "Good enough for docs, much cheaper"],
            ["Large-scale refactoring", "Claude Sonnet", "Needs strong multi-file reasoning"],
          ]}
        />

        <DocsH3>Reduce Token Usage</DocsH3>
        <DocsList
          items={[
            "Use file path filters to limit which files the agent reads. A prompt scoped to \"src/auth/**\" reads far fewer files than one scoped to the entire repo.",
            "Exclude test fixtures, generated files, and vendored code from the agent's search scope.",
            "Keep prompts concise. Lengthy preambles consume tokens without improving results.",
            "Set a max token budget in agent settings to cap spending per run.",
          ]}
        />

        <DocsH3>Set Spending Limits</DocsH3>
        <DocsParagraph>
          Configure per-run and monthly spending limits in the dashboard to prevent runaway costs.
        </DocsParagraph>
        <DocsCode lines>{`# Set a per-run token limit via the API
{
  "maxTokens": 100000,
  "maxMinutes": 10,
  "model": "claude-haiku-3.5"
}`}</DocsCode>
        <DocsCallout type="tip">
          Start with cheaper models and shorter timeouts. Upgrade to stronger models only for
          tasks where the cheaper model&apos;s output is not good enough.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="cloud-vs-local" title="Cloud vs Local: When to Use Each">
        <DocsParagraph>
          Cloud agents and local agents are complementary. Here is a practical guide for
          choosing the right one.
        </DocsParagraph>
        <DocsTable
          headers={["Scenario", "Use Cloud", "Use Local"]}
          rows={[
            ["Interactive coding session", "No", "Yes -- immediate feedback loop"],
            ["Automated PR review", "Yes -- triggered by events", "No -- requires manual action"],
            ["One-off refactoring of 5 files", "Either works", "Local is faster for small scope"],
            ["Codebase-wide migration", "Yes -- long-running, parallel", "No -- blocks your editor"],
            ["Exploring and understanding code", "No", "Yes -- conversational flow"],
            ["Nightly test generation", "Yes -- scheduled, unattended", "No -- requires IDE open"],
            ["Bug investigation with debugging", "No -- limited shell access", "Yes -- full terminal access"],
          ]}
        />
      </DocsSection>

      <DocsSection id="common-pitfalls" title="Common Pitfalls">
        <DocsH3>Overly broad prompts</DocsH3>
        <DocsParagraph>
          &quot;Review the entire codebase&quot; will consume a lot of tokens and produce generic
          feedback. Scope prompts to specific files, functions, or concerns.
        </DocsParagraph>

        <DocsH3>Missing context about project conventions</DocsH3>
        <DocsParagraph>
          Cloud agents do not have your CREOR.md or local rules unless they are committed to the
          repository. Add a .creor/rules/ directory to your repo with project instructions that
          the agent will pick up automatically.
        </DocsParagraph>

        <DocsH3>Expecting interactive behavior</DocsH3>
        <DocsParagraph>
          Cloud agents cannot ask you questions mid-run (unlike local agents). If the task might
          require decisions, provide all necessary information upfront or break it into smaller
          steps with decision points.
        </DocsParagraph>

        <DocsH3>Ignoring the timeout</DocsH3>
        <DocsParagraph>
          The default timeout is 10 minutes. Complex tasks on large repos can exceed this. Check
          the estimated runtime in the dashboard before launching, and increase the timeout for
          heavy tasks.
        </DocsParagraph>
      </DocsSection>
    </DocsPage>
  );
}
