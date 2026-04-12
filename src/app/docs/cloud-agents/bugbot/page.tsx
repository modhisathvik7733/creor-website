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
  title: "Bugbot | Creor",
  description:
    "Bugbot automatically detects bugs in your pull requests and posts review comments with explanations and fix suggestions.",
  path: "/docs/cloud-agents/bugbot",
});

export default function CloudAgentsBugbotPage() {
  return (
    <DocsPage
      breadcrumb="Cloud Agents"
      title="Bugbot"
      description="Bugbot is a specialized cloud agent that monitors your pull requests for potential bugs, logic errors, and security issues. When it finds a problem, it posts an inline review comment with an explanation and suggested fix."
      toc={[
        { label: "How Bugbot Works", href: "#how-it-works" },
        { label: "Setup", href: "#setup" },
        { label: "What Bugbot Detects", href: "#what-it-detects" },
        { label: "Review Comments", href: "#review-comments" },
        { label: "Configuration", href: "#configuration" },
        { label: "False Positives", href: "#false-positives" },
        { label: "Next Steps", href: "#next-steps" },
      ]}
    >
      <DocsSection id="how-it-works" title="How Bugbot Works">
        <DocsParagraph>
          Bugbot runs as a cloud agent triggered by pull request events. When a PR is opened or
          updated, Bugbot clones the repository, checks out the PR branch, and analyzes the
          diff in the context of the full codebase.
        </DocsParagraph>
        <DocsCode>{`PR opened or updated
  -> Webhook triggers Bugbot
    -> Repository cloned at PR branch
      -> Diff analyzed against full codebase context
        -> Agent reasons about each change
          -> Bug candidates identified
            -> Inline review comments posted on the PR`}</DocsCode>
        <DocsParagraph>
          Unlike static analysis tools that check individual files in isolation, Bugbot
          understands how your changed code interacts with the rest of the codebase. It can
          catch bugs that only manifest when multiple files are considered together, such as
          breaking an API contract or using a function with the wrong argument order.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="setup" title="Setup">
        <DocsParagraph>
          Setting up Bugbot takes about two minutes.
        </DocsParagraph>

        <DocsH3>Step 1: Connect GitHub</DocsH3>
        <DocsParagraph>
          If you have not already connected your GitHub account, go to Dashboard &gt;
          Settings &gt; Integrations and click &quot;Connect GitHub&quot;. Authorize the Creor
          GitHub App with access to the repositories you want Bugbot to monitor.
        </DocsParagraph>

        <DocsH3>Step 2: Enable Bugbot</DocsH3>
        <DocsList
          items={[
            "Go to Dashboard > Cloud Agents > Bugbot.",
            "Click \"Enable Bugbot\" for each repository you want to monitor.",
            "Choose which PR events trigger Bugbot: opened, synchronize (new commits), or both.",
            "Optionally set a file path filter to only analyze changes in specific directories.",
          ]}
        />

        <DocsH3>Step 3: Verify</DocsH3>
        <DocsParagraph>
          Open a test pull request on one of the enabled repositories. Within 30-60 seconds,
          you should see Bugbot appear as a reviewer and begin posting comments if it finds
          issues. If the PR has no bugs, Bugbot posts a single summary comment confirming
          it found no issues.
        </DocsParagraph>
        <DocsCallout type="info">
          Bugbot uses the default model configured for your workspace. You can override this
          per repository in the Bugbot settings. Claude Sonnet or GPT-4o are recommended for
          the best balance of speed and accuracy.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="what-it-detects" title="What Bugbot Detects">
        <DocsParagraph>
          Bugbot checks for a wide range of issues beyond what linters and type checkers catch.
        </DocsParagraph>
        <DocsTable
          headers={["Category", "Examples"]}
          rows={[
            ["Logic errors", "Off-by-one, wrong comparison operator, inverted boolean, unreachable code paths"],
            ["Null/undefined risks", "Missing null checks, optional chaining needed, unsafe type assertions"],
            ["Race conditions", "Shared mutable state, missing await, unhandled promise rejections"],
            ["Security issues", "SQL injection, XSS, insecure deserialization, hardcoded secrets, path traversal"],
            ["API contract violations", "Wrong parameter types, missing required fields, changed return shapes"],
            ["Performance issues", "N+1 queries, missing indexes, unnecessary re-renders, large bundle imports"],
            ["Error handling", "Swallowed exceptions, missing error boundaries, incomplete try/catch"],
            ["Resource leaks", "Unclosed file handles, unregistered event listeners, missing disposable cleanup"],
          ]}
        />
      </DocsSection>

      <DocsSection id="review-comments" title="Review Comments">
        <DocsParagraph>
          Bugbot posts inline review comments on the specific lines of code where it found an
          issue. Each comment includes three parts.
        </DocsParagraph>

        <DocsH3>Comment Structure</DocsH3>
        <DocsList
          items={[
            "Bug description: A clear explanation of what the issue is and why it matters.",
            "Impact: What could go wrong if this bug reaches production -- a crash, data corruption, security vulnerability, etc.",
            "Suggested fix: A code snippet showing how to fix the issue. You can apply this directly or use it as guidance.",
          ]}
        />

        <DocsH3>Severity Levels</DocsH3>
        <DocsTable
          headers={["Level", "Label", "Meaning"]}
          rows={[
            ["Critical", "bug: critical", "Will cause a crash, data loss, or security vulnerability in production."],
            ["Warning", "bug: warning", "Likely to cause incorrect behavior under certain conditions."],
            ["Suggestion", "bug: suggestion", "Potential improvement. Not necessarily a bug, but worth reviewing."],
          ]}
        />
        <DocsParagraph>
          Bugbot labels each comment with a severity badge so you can prioritize which comments
          to address first.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="configuration" title="Configuration">
        <DocsParagraph>
          Customize Bugbot&apos;s behavior per repository.
        </DocsParagraph>
        <DocsTable
          headers={["Setting", "Default", "Description"]}
          rows={[
            ["Trigger events", "opened, synchronize", "Which PR events trigger Bugbot."],
            ["File patterns", "All files", "Glob patterns for files to analyze (e.g., \"src/**/*.ts\")."],
            ["Ignore patterns", "None", "Glob patterns for files to skip (e.g., \"**/*.test.ts\")."],
            ["Min severity", "warning", "Only post comments at this severity or higher."],
            ["Max comments", "10", "Maximum number of comments per PR review."],
            ["Model", "Workspace default", "Override the LLM model used for this repository."],
            ["Custom instructions", "None", "Additional prompt context (e.g., \"This is a financial app, pay extra attention to decimal precision\")."],
          ]}
        />
        <DocsCode lines>{`# Example: configure Bugbot via API
curl -X PUT https://api.creor.ai/v1/bugbot/repos/acme/backend \\
  -H "Authorization: Bearer $CREOR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "enabled": true,
    "triggers": ["opened", "synchronize"],
    "filePatterns": ["src/**/*.ts", "src/**/*.tsx"],
    "ignorePatterns": ["**/*.test.ts", "**/*.spec.ts"],
    "minSeverity": "warning",
    "maxComments": 10,
    "model": "claude-sonnet-4-20250514",
    "instructions": "This is a healthcare application. Flag any HIPAA compliance concerns."
  }'`}</DocsCode>
      </DocsSection>

      <DocsSection id="false-positives" title="False Positives">
        <DocsParagraph>
          Bugbot is not perfect and may occasionally flag code that is actually correct. Here
          is how to handle false positives.
        </DocsParagraph>
        <DocsList
          items={[
            "React to the comment with a thumbs-down emoji. Bugbot learns from this feedback to reduce similar false positives.",
            "Reply to the comment explaining why the code is correct. This adds context for other reviewers.",
            "Add an inline comment in your code (// bugbot:ignore) to suppress Bugbot on specific lines.",
            "Adjust the min severity setting to reduce low-confidence suggestions.",
            "Add custom instructions explaining domain-specific patterns that Bugbot may not understand.",
          ]}
        />
        <DocsCallout type="tip">
          False positive rates typically decrease over time as Bugbot processes more PRs in your
          repository and receives feedback. The first few PRs may have more noise than later ones.
        </DocsCallout>
      </DocsSection>

      <DocsDivider />

      <DocsSection id="next-steps" title="Next Steps">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DocsCard
            title="Best Practices"
            description="Write effective prompts and optimize cloud agent performance."
            href="/docs/cloud-agents/best-practices"
          />
          <DocsCard
            title="Security & Network"
            description="How Bugbot accesses your code and what data it processes."
            href="/docs/cloud-agents/security-network"
          />
        </div>
      </DocsSection>
    </DocsPage>
  );
}
