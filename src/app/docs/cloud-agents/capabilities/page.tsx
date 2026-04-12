import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import {
  DocsPage,
  DocsSection,
  DocsParagraph,
  DocsCode,
  DocsTable,
  DocsList,
  DocsCallout,
  DocsDivider,
  DocsCard,
} from "@/components/docs-page";

export const metadata: Metadata = generatePageMetadata({
  title: "Cloud Agent Capabilities | Creor",
  description:
    "What cloud agents can do: code generation, refactoring, testing, documentation, and available tools in the cloud environment.",
  path: "/docs/cloud-agents/capabilities",
});

export default function CloudAgentsCapabilitiesPage() {
  return (
    <DocsPage
      breadcrumb="Cloud Agents"
      title="Capabilities"
      description="Cloud agents share the same AI engine as the local Creor agent, giving them access to a powerful set of tools for reading, writing, searching, and executing code. This page covers what they can do and where their boundaries are."
      toc={[
        { label: "Code Generation", href: "#code-generation" },
        { label: "Code Review & Analysis", href: "#code-review" },
        { label: "Refactoring", href: "#refactoring" },
        { label: "Testing", href: "#testing" },
        { label: "Documentation", href: "#documentation" },
        { label: "Available Tools", href: "#available-tools" },
        { label: "Limitations", href: "#limitations" },
        { label: "Next Steps", href: "#next-steps" },
      ]}
    >
      <DocsSection id="code-generation" title="Code Generation">
        <DocsParagraph>
          Cloud agents can generate new code from scratch based on your prompt. They read the
          existing codebase to understand patterns, conventions, and dependencies, then produce
          code that fits naturally into the project.
        </DocsParagraph>
        <DocsList
          items={[
            "New features: describe what you want and the agent writes the implementation across multiple files.",
            "Boilerplate: generate API routes, database models, form components, or configuration files.",
            "Migrations: create database migration scripts based on schema changes.",
            "Integrations: add third-party service integrations with proper error handling.",
          ]}
        />
        <DocsCode lines>{`# Example: generate a new API endpoint
curl -X POST https://api.creor.ai/v1/agents/launch \\
  -H "Authorization: Bearer $CREOR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "repository": "github.com/acme/backend",
    "branch": "main",
    "prompt": "Add a POST /api/v1/invitations endpoint that creates a team invitation, sends an email via the existing EmailService, and returns the invitation object. Follow the patterns in the existing /api/v1/users endpoints."
  }'`}</DocsCode>
      </DocsSection>

      <DocsSection id="code-review" title="Code Review & Analysis">
        <DocsParagraph>
          Cloud agents can review code changes and provide detailed feedback. They analyze diffs
          against the full codebase context, not just the changed lines.
        </DocsParagraph>
        <DocsList
          items={[
            "Bug detection: identify logic errors, off-by-one mistakes, null pointer risks, and race conditions.",
            "Security review: flag potential vulnerabilities like SQL injection, XSS, insecure deserialization, and hardcoded secrets.",
            "Style consistency: check that new code follows project conventions, naming patterns, and architectural boundaries.",
            "Performance: identify N+1 queries, unnecessary allocations, missing indexes, and expensive re-renders.",
            "Type safety: catch type assertion misuse, implicit any usage, and missing null checks in TypeScript codebases.",
          ]}
        />
        <DocsCallout type="tip">
          For the best review quality, provide context about what the change is intended to do.
          A prompt like &quot;Review this PR that adds rate limiting to the API gateway&quot;
          gives the agent domain context that improves its feedback.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="refactoring" title="Refactoring">
        <DocsParagraph>
          Cloud agents can perform large-scale refactoring across your codebase. Because they
          operate on a cloned copy, there is no risk to your working directory.
        </DocsParagraph>
        <DocsList
          items={[
            "Rename across files: rename a function, class, or variable across every file that references it.",
            "Extract patterns: pull repeated code into shared utilities or base classes.",
            "Migrate APIs: update code to use a new API version, library, or framework pattern.",
            "Architecture changes: move files between directories, split large modules, or merge related ones.",
            "Type system upgrades: add TypeScript types to a JavaScript project, tighten loose types, or migrate to stricter tsconfig settings.",
          ]}
        />
        <DocsParagraph>
          Refactoring results are returned as a diff that you can review before applying. The
          agent does not push changes directly to your repository.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="testing" title="Testing">
        <DocsParagraph>
          Cloud agents can generate and run tests for your codebase.
        </DocsParagraph>
        <DocsList
          items={[
            "Unit tests: generate test files for existing functions and classes, matching your project's testing framework.",
            "Integration tests: create tests that exercise multiple components together.",
            "Test coverage gaps: analyze existing tests and generate tests for uncovered code paths.",
            "Test fixes: update failing tests after a refactoring or API change.",
            "Test execution: run the test suite inside the sandboxed container and report results.",
          ]}
        />
        <DocsCode lines>{`# Example: generate tests for uncovered code
{
  "repository": "github.com/acme/frontend",
  "branch": "main",
  "prompt": "Find functions in src/utils/ that have no corresponding test file in src/utils/__tests__/. Generate unit tests for them using Vitest, following the patterns in the existing test files."
}`}</DocsCode>
      </DocsSection>

      <DocsSection id="documentation" title="Documentation">
        <DocsParagraph>
          Cloud agents can generate and update documentation based on your code.
        </DocsParagraph>
        <DocsList
          items={[
            "API documentation: generate OpenAPI specs, endpoint descriptions, and example requests from your route handlers.",
            "Code documentation: add JSDoc, docstrings, or inline comments to public APIs.",
            "README updates: regenerate project READMEs based on current code structure.",
            "Architecture docs: produce Mermaid diagrams or written descriptions of system architecture.",
            "Changelog: summarize recent commits into a human-readable changelog entry.",
          ]}
        />
      </DocsSection>

      <DocsSection id="available-tools" title="Available Tools">
        <DocsParagraph>
          Cloud agents have access to a subset of the local agent&apos;s tools, adapted for the
          sandboxed cloud environment.
        </DocsParagraph>
        <DocsTable
          headers={["Tool", "Available", "Notes"]}
          rows={[
            ["read", "Yes", "Read files from the cloned repository."],
            ["write", "Yes", "Write new files or overwrite existing ones."],
            ["edit", "Yes", "Exact string replacement edits."],
            ["multiedit", "Yes", "Multiple edits in a single tool call."],
            ["glob", "Yes", "File pattern matching."],
            ["grep", "Yes", "Content search with regex support."],
            ["ls", "Yes", "List directory contents."],
            ["bash", "Limited", "Shell commands in a sandboxed environment. No network access by default."],
            ["codesearch", "Yes", "Semantic codebase search (requires RAG plugin)."],
            ["websearch", "No", "Disabled in cloud for security."],
            ["webfetch", "No", "Disabled in cloud for security."],
            ["task", "Yes", "Spawn sub-agents for parallel work."],
            ["plan", "Yes", "Create structured plans."],
            ["git", "Read-only", "Git log, diff, and blame. No push."],
          ]}
        />
        <DocsCallout type="info">
          The bash tool runs in a restricted shell with no outbound network access. Package
          installation commands that require downloading from registries will fail unless the
          dependencies are already in the cloned repository (e.g., a committed lock file with
          a cached node_modules).
        </DocsCallout>
      </DocsSection>

      <DocsSection id="limitations" title="Limitations">
        <DocsParagraph>
          Cloud agents have some limitations compared to local agents.
        </DocsParagraph>
        <DocsTable
          headers={["Limitation", "Reason", "Workaround"]}
          rows={[
            ["No internet access from bash", "Network isolation for security", "Pre-install dependencies before the agent run, or use a Docker image with deps."],
            ["No PTY/interactive terminal", "Sandboxed environment", "Use non-interactive commands only. Avoid tools that require user input."],
            ["No persistent storage", "Containers are ephemeral", "Export artifacts via the API or configure a webhook to receive results."],
            ["No IDE integration", "Runs headless on server", "View results in the dashboard, PR comments, or API responses."],
            ["10-minute default timeout", "Resource management", "Increase timeout in agent settings (max 60 minutes on Pro plan)."],
            ["Repository size limit", "Container disk space", "Max 5 GB repository size. Use sparse checkout for monorepos."],
          ]}
        />
      </DocsSection>

      <DocsDivider />

      <DocsSection id="next-steps" title="Next Steps">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DocsCard
            title="Best Practices"
            description="Write effective prompts and structure tasks for optimal results."
            href="/docs/cloud-agents/best-practices"
          />
          <DocsCard
            title="Settings"
            description="Configure model selection, timeouts, and resource limits."
            href="/docs/cloud-agents/settings"
          />
        </div>
      </DocsSection>
    </DocsPage>
  );
}
