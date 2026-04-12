import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import {
  DocsPage,
  DocsSection,
  DocsParagraph,
  DocsCode,
  DocsList,
  DocsCallout,
  DocsTable,
  DocsH3,
  DocsDivider,
  DocsCard,
} from "@/components/docs-page";

export const metadata: Metadata = generatePageMetadata({
  title: "Planning | Creor",
  description:
    "Use plan mode to analyze your codebase and create structured implementation plans before writing code.",
  path: "/docs/agent/planning",
});

export default function PlanningPage() {
  return (
    <DocsPage
      breadcrumb="Agent"
      title="Planning"
      description="Plan mode lets you analyze your codebase and create structured implementation plans without modifying any files. Think before you code."
      toc={[
        { label: "What Is Plan Mode", href: "#what-is-plan-mode" },
        { label: "Entering Plan Mode", href: "#entering-plan-mode" },
        { label: "The Plan Agent", href: "#the-plan-agent" },
        { label: "Plan File Format", href: "#plan-file-format" },
        { label: "Reviewing Plans", href: "#reviewing-plans" },
        { label: "Executing Plans", href: "#executing-plans" },
        { label: "Best Practices", href: "#best-practices" },
      ]}
    >
      <DocsSection id="what-is-plan-mode" title="What Is Plan Mode">
        <DocsParagraph>
          Plan mode switches the agent from its default build configuration to a read-only Plan agent.
          In this mode, the agent can explore your entire codebase -- reading files, searching with
          grep and glob, analyzing dependencies -- but it cannot edit files, run destructive shell
          commands, or make any changes to your project.
        </DocsParagraph>
        <DocsParagraph>
          The output is a structured markdown plan saved to the .creor/plans/ directory in your project.
          These plans break down a task into concrete, ordered steps with file references, code
          snippets, and rationale for each decision.
        </DocsParagraph>
        <DocsCallout type="tip">
          Plan mode is ideal for unfamiliar codebases. Before making changes, ask the agent to create a
          plan so you can review the approach, catch potential issues, and understand the scope of
          changes before any code is touched.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="entering-plan-mode" title="Entering Plan Mode">
        <DocsParagraph>
          There are several ways to enter plan mode.
        </DocsParagraph>

        <DocsH3>Keyboard Shortcut</DocsH3>
        <DocsParagraph>
          Press Shift+Cmd+P (macOS) or Shift+Ctrl+P (Windows/Linux) to toggle plan mode on or off.
          When active, you will see a plan indicator in the chat input area.
        </DocsParagraph>

        <DocsH3>Slash Command</DocsH3>
        <DocsParagraph>
          Type /plan in the chat input followed by your request. This activates plan mode for
          that specific message.
        </DocsParagraph>
        <DocsCode>{`/plan Add authentication with OAuth2 to the user service`}</DocsCode>

        <DocsH3>Chat Command</DocsH3>
        <DocsParagraph>
          You can also ask the agent directly to plan something. The agent will recognize planning
          intent and switch to the plan workflow.
        </DocsParagraph>
        <DocsCode>{`Create a plan for migrating the database from PostgreSQL to MySQL`}</DocsCode>

        <DocsCallout type="info">
          Plan mode persists across messages in a session until you exit it. To exit, press the
          keyboard shortcut again, type /plan to toggle it off, or start a new session.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="the-plan-agent" title="The Plan Agent">
        <DocsParagraph>
          The Plan agent is a distinct agent configuration with restricted tool access. It is not
          simply the Build agent with fewer permissions -- it has its own system prompt optimized
          for analysis and planning.
        </DocsParagraph>

        <DocsTable
          headers={["Capability", "Plan Agent", "Build Agent"]}
          rows={[
            ["Read files", "Yes", "Yes"],
            ["Search with glob/grep", "Yes", "Yes"],
            ["Write/edit files", "No", "Yes"],
            ["Run shell commands", "Read-only (e.g., git log)", "Yes"],
            ["Write plans to .creor/plans/", "Yes", "No (writes code instead)"],
            ["Web search", "Yes", "Yes"],
            ["LSP code intelligence", "Yes", "Yes"],
          ]}
        />

        <DocsParagraph>
          Because the Plan agent cannot modify your project, it is safe to run on production
          repositories, shared codebases, or any project where you want to analyze without risk.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="plan-file-format" title="Plan File Format">
        <DocsParagraph>
          Plans are saved as markdown files in the .creor/plans/ directory at your project root. Each
          plan follows a structured format with a title, overview, and numbered steps.
        </DocsParagraph>
        <DocsCode lines>{`# Add OAuth2 Authentication

## Overview
Add OAuth2 authentication to the user service using the
existing session middleware. This requires changes to 4 files
and the addition of 2 new modules.

## Steps

### 1. Create the OAuth2 provider configuration
- File: src/auth/providers.ts (new file)
- Define provider interfaces for Google and GitHub
- Export a configuration factory function

### 2. Add token exchange endpoint
- File: src/routes/auth.ts (modify)
- Add POST /auth/callback route
- Validate state parameter against session

### 3. Update session middleware
- File: src/middleware/session.ts (modify)
- Extend session type to include OAuth tokens
- Add token refresh logic

### 4. Add integration tests
- File: tests/auth.test.ts (new file)
- Test token exchange flow
- Test session persistence
- Test token refresh

## Dependencies
- No new packages required
- Uses existing express-session middleware

## Risks
- Token refresh timing may cause race conditions
  under high concurrency`}</DocsCode>
      </DocsSection>

      <DocsSection id="reviewing-plans" title="Reviewing Plans">
        <DocsParagraph>
          After the agent generates a plan, you should review it before executing. Plans appear in both
          the chat panel and as files in .creor/plans/ that you can open in the editor.
        </DocsParagraph>

        <DocsH3>What to Check</DocsH3>
        <DocsList
          items={[
            "Are all the files referenced correct? Does the agent understand the existing structure?",
            "Are the steps in the right order? Dependencies between steps should flow logically.",
            "Is the scope appropriate? Plans that touch too many files may indicate the task should be broken down further.",
            "Are there any missing steps? Check for things like updating tests, documentation, or configuration.",
            "Are the risks and tradeoffs clearly identified?",
          ]}
        />

        <DocsH3>Refining Plans</DocsH3>
        <DocsParagraph>
          You can ask the agent to refine the plan by sending follow-up messages. The agent will
          update the plan file with your feedback.
        </DocsParagraph>
        <DocsCode>{`The plan looks good but step 3 should happen before step 2.
Also, we need to add rate limiting to the callback endpoint.`}</DocsCode>
      </DocsSection>

      <DocsSection id="executing-plans" title="Executing Plans">
        <DocsParagraph>
          Once you are satisfied with a plan, exit plan mode and ask the Build agent to execute it.
          The agent will read the plan file and follow the steps, asking for clarification where needed.
        </DocsParagraph>
        <DocsCode>{`Execute the plan in .creor/plans/add-oauth2-authentication.md`}</DocsCode>
        <DocsParagraph>
          The Build agent treats the plan as a high-level guide, not a rigid script. It will adapt
          to the actual state of the code it encounters, handle edge cases the plan did not anticipate,
          and may adjust the order of steps if it discovers dependencies.
        </DocsParagraph>

        <DocsCallout type="warning">
          Always exit plan mode before asking the agent to execute a plan. The Plan agent cannot
          write code -- it will attempt to create another plan instead.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="best-practices" title="Best Practices">
        <DocsList
          items={[
            "Start complex tasks with a plan. The 5 minutes spent reviewing a plan can save hours of debugging incorrect implementations.",
            "Use plan mode for code reviews. Ask the agent to analyze a PR or diff and create a review plan with specific feedback.",
            "Plan before refactoring. Large refactors benefit from a plan that maps out all affected files and the order of changes.",
            "Break large plans into phases. If a plan has more than 10 steps, ask the agent to split it into phases that can be executed and verified independently.",
            "Keep plans in version control. The .creor/plans/ directory is part of your project, so plans are tracked in git and visible to your team.",
          ]}
        />
      </DocsSection>
    </DocsPage>
  );
}
