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
  title: "Cloud Agents Overview | Creor",
  description:
    "Cloud agents run on Creor's servers to perform automated code tasks like reviews, bug detection, and CI/CD integration.",
  path: "/docs/cloud-agents/overview",
});

export default function CloudAgentsOverviewPage() {
  return (
    <DocsPage
      breadcrumb="Cloud Agents"
      title="Cloud Agents Overview"
      description="Cloud agents are AI agents that run on Creor's infrastructure instead of your local machine. They can operate autonomously on your repositories -- reviewing pull requests, detecting bugs, generating documentation, and running long-lived coding tasks without tying up your IDE."
      toc={[
        { label: "What Are Cloud Agents", href: "#what-are-cloud-agents" },
        { label: "Use Cases", href: "#use-cases" },
        { label: "Cloud vs Local Agents", href: "#cloud-vs-local" },
        { label: "Architecture", href: "#architecture" },
        { label: "Pricing", href: "#pricing" },
        { label: "Next Steps", href: "#next-steps" },
      ]}
    >
      <DocsSection id="what-are-cloud-agents" title="What Are Cloud Agents">
        <DocsParagraph>
          A cloud agent is an instance of the Creor AI engine running on Creor&apos;s servers.
          It clones your repository into a sandboxed environment, executes a task using the same
          tool-use loop as the local agent, and reports results back to you via the dashboard,
          API, or webhooks.
        </DocsParagraph>
        <DocsParagraph>
          Cloud agents are stateless per invocation -- each run starts with a fresh clone of your
          repository at the specified commit or branch. They have read and write access to the
          cloned workspace, can run shell commands in a sandboxed container, and can interact
          with the LLM to reason about code.
        </DocsParagraph>
        <DocsCallout type="info">
          Cloud agents never push changes directly to your repository. They produce artifacts
          (diffs, reports, PR comments) that you review and apply at your discretion.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="use-cases" title="Use Cases">
        <DocsParagraph>
          Cloud agents excel at tasks that are triggered by events (a new PR, a scheduled review)
          or that take a long time to run.
        </DocsParagraph>
        <DocsTable
          headers={["Use Case", "Trigger", "Output"]}
          rows={[
            ["Automated code review", "New pull request", "Inline comments on the PR with suggestions and bug reports"],
            ["Bug detection (Bugbot)", "PR opened or updated", "Comments flagging potential bugs, logic errors, and security issues"],
            ["Test generation", "Manual or scheduled", "New test files committed as a draft PR"],
            ["Documentation generation", "Manual or scheduled", "Updated README, JSDoc, or API docs"],
            ["Refactoring", "Manual", "Diff output showing proposed changes across multiple files"],
            ["CI/CD integration", "Build failure", "Analysis of the failure with a proposed fix"],
            ["Dependency updates", "Scheduled (weekly)", "PR updating dependencies with compatibility notes"],
          ]}
        />
      </DocsSection>

      <DocsSection id="cloud-vs-local" title="Cloud vs Local Agents">
        <DocsParagraph>
          Both cloud and local agents use the same Creor engine and tool system. The differences
          are in where they run, what they can access, and how they are triggered.
        </DocsParagraph>
        <DocsTable
          headers={["Feature", "Local Agent", "Cloud Agent"]}
          rows={[
            ["Runs on", "Your machine", "Creor servers"],
            ["Trigger", "Your chat messages", "API calls, PR events, schedules, dashboard"],
            ["Repository access", "Your local filesystem", "Cloned copy in sandboxed container"],
            ["Internet access", "Full (your network)", "Restricted to allowed domains"],
            ["Tool access", "All 25+ tools", "Subset (no PTY, limited bash)"],
            ["Session persistence", "Persistent across restarts", "Per-invocation, stateless"],
            ["IDE integration", "Full (inline edits, diff views)", "Results via dashboard, API, or webhooks"],
            ["Cost", "Uses your LLM API keys or Creor credits", "Uses Creor credits (compute + LLM)"],
          ]}
        />
        <DocsCallout type="tip">
          Use local agents for interactive work where you want to iterate quickly. Use cloud
          agents for automated, event-driven tasks that should run without your involvement.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="architecture" title="Architecture">
        <DocsParagraph>
          When a cloud agent is launched, the following happens behind the scenes.
        </DocsParagraph>
        <DocsCode>{`1. API request or event trigger received
2. Sandboxed container provisioned with resource limits
3. Repository cloned at specified branch/commit
4. Creor engine started inside the container
5. System prompt assembled with task instructions
6. Agent runs tool-use loop (read, edit, bash, grep, etc.)
7. Artifacts collected (diffs, reports, comments)
8. Results delivered via API response, webhook, or PR comments
9. Container destroyed, no persistent state retained`}</DocsCode>
        <DocsParagraph>
          Each cloud agent run is fully isolated. Containers do not share filesystems, network
          namespaces, or process spaces. The repository clone is destroyed after the run completes.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="pricing" title="Pricing">
        <DocsParagraph>
          Cloud agent usage is billed from your Creor credit balance. Costs include both the
          LLM inference (input/output tokens) and a small compute surcharge for the sandboxed
          container.
        </DocsParagraph>
        <DocsTable
          headers={["Component", "Cost", "Notes"]}
          rows={[
            ["LLM tokens", "Same as gateway pricing", "Varies by model. See Models & Pricing page."],
            ["Compute", "$0.01 per minute", "Billed per minute of container runtime, rounded up."],
            ["Storage", "Free", "Temporary clone. No persistent storage charges."],
          ]}
        />
        <DocsParagraph>
          A typical code review on a medium-sized PR (500 lines changed) costs approximately
          $0.05-0.15 depending on the model used. Long-running tasks like full-codebase
          refactoring will cost more due to extended compute time and higher token usage.
        </DocsParagraph>
      </DocsSection>

      <DocsDivider />

      <DocsSection id="next-steps" title="Next Steps">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DocsCard
            title="Setup"
            description="Get started with cloud agents: API keys, workspace configuration, and your first agent run."
            href="/docs/cloud-agents/setup"
          />
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
            title="Security & Network"
            description="Understand sandboxing, data handling, and network isolation."
            href="/docs/cloud-agents/security-network"
          />
        </div>
      </DocsSection>
    </DocsPage>
  );
}
