import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import {
  DocsPage,
  DocsSection,
  DocsH3,
  DocsParagraph,
  DocsCode,
  DocsList,
  DocsCallout,
  DocsDivider,
} from "@/components/docs-page";

export const metadata: Metadata = generatePageMetadata({
  title: "Quickstart | Creor",
  description:
    "Go from install to your first AI-powered code change in five minutes. Learn the core Creor workflow: chat, edit, review, plan.",
  path: "/docs/quickstart",
});

export default function QuickstartPage() {
  return (
    <DocsPage
      breadcrumb="Get Started"
      title="Quickstart"
      description="Go from install to your first useful code change in five minutes. This guide walks through the core Creor workflow: open a project, chat with the agent, review its changes, and use plan mode for complex tasks."
      toc={[
        { label: "Open a Project", href: "#open-project" },
        { label: "Start a Chat", href: "#start-chat" },
        { label: "Make Your First Edit", href: "#first-edit" },
        { label: "Review Changes", href: "#review-changes" },
        { label: "Plan Mode", href: "#plan-mode" },
        { label: "Tips", href: "#tips" },
      ]}
    >
      <DocsSection id="open-project" title="1. Open a Project">
        <DocsParagraph>
          Open any project folder in Creor. You can do this from the menu
          (File &gt; Open Folder), by dragging a folder onto the window, or from
          the terminal.
        </DocsParagraph>
        <DocsCode>{`creor ~/projects/my-app`}</DocsCode>
        <DocsParagraph>
          Creor works best when you open the root of a project — the directory
          that contains your package.json, Cargo.toml, go.mod, or similar
          project file. This gives the AI agent the full context of your
          codebase.
        </DocsParagraph>
        <DocsCallout type="tip">
          If your project has a monorepo structure, open the monorepo root. The
          agent understands workspaces and can navigate between packages.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="start-chat" title="2. Start a Chat">
        <DocsParagraph>
          Press Cmd + L (macOS) or Ctrl + L (Windows/Linux) to open the AI
          chat panel. This is your primary interface for talking to the Creor
          agent.
        </DocsParagraph>
        <DocsParagraph>
          The chat panel opens on the right side of the editor. You can resize
          it, move it to the bottom, or pop it out into its own window. The agent
          has access to your entire project — it can read files, search code,
          run terminal commands, and make edits.
        </DocsParagraph>
        <DocsParagraph>
          Type a message and press Enter to send it. The agent will respond with
          a plan, ask clarifying questions, or start working immediately,
          depending on the complexity of your request.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="first-edit" title="3. Make Your First Edit">
        <DocsParagraph>
          Try asking the agent to make a real change to your code. Here are some
          good first prompts to try:
        </DocsParagraph>
        <DocsCode>{`Add a dark mode toggle to the settings page`}</DocsCode>
        <DocsCode>{`Write unit tests for the auth middleware`}</DocsCode>
        <DocsCode>{`Refactor the UserCard component to use TypeScript generics`}</DocsCode>
        <DocsCode>{`Fix the bug where the sidebar doesn't close on mobile`}</DocsCode>
        <DocsParagraph>
          The agent will read the relevant files, figure out the right approach,
          and apply changes directly to your code. You will see each step in the
          chat — file reads, searches, edits, and terminal commands — as the
          agent works through the task.
        </DocsParagraph>

        <DocsH3>Permissions</DocsH3>
        <DocsParagraph>
          By default, the agent asks for permission before running shell commands
          or making edits. You will see a permission card in the chat with
          &quot;Allow&quot; and &quot;Deny&quot; buttons. This keeps you in
          control while the agent works.
        </DocsParagraph>
        <DocsParagraph>
          You can adjust permission levels in Settings &gt; AI &gt; Permissions.
          Options range from &quot;Ask for everything&quot; to &quot;Auto-approve
          read-only operations&quot; to &quot;Auto-approve all&quot; for trusted
          projects.
        </DocsParagraph>
      </DocsSection>

      <DocsDivider />

      <DocsSection id="review-changes" title="4. Review Changes">
        <DocsParagraph>
          After the agent makes edits, Creor shows the changes in a built-in
          diff viewer. You can review every modification before accepting it.
        </DocsParagraph>

        <DocsH3>Inline diff</DocsH3>
        <DocsParagraph>
          Changed files appear with color-coded gutters in the editor — green for
          additions, red for deletions. Click any changed region to see the
          before/after side by side.
        </DocsParagraph>

        <DocsH3>Diff viewer panel</DocsH3>
        <DocsParagraph>
          For a full overview, open the diff viewer from the chat panel. It shows
          all files the agent modified in the current session, grouped by change
          type. You can accept or reject individual changes, or accept all at
          once.
        </DocsParagraph>

        <DocsH3>Undo</DocsH3>
        <DocsParagraph>
          Every agent action is tracked. You can undo any change by clicking the
          revert button on the specific tool call in the chat history, or use the
          standard undo (Cmd + Z) in the editor. The agent also supports session-
          level revert, which rolls back all changes from a conversation turn.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="plan-mode" title="5. Plan Mode">
        <DocsParagraph>
          For complex, multi-step tasks, use Plan Mode. The agent will create a
          detailed plan before writing any code, giving you a chance to review
          and adjust the approach.
        </DocsParagraph>

        <DocsH3>Activate plan mode</DocsH3>
        <DocsParagraph>
          Press Shift + Cmd + P (macOS) or Shift + Ctrl + P (Windows/Linux) to
          toggle plan mode on. You will see a &quot;Plan&quot; badge in the chat
          input area. Alternatively, start your message with &quot;/plan&quot;.
        </DocsParagraph>

        <DocsH3>How it works</DocsH3>
        <DocsList
          items={[
            "You describe what you want to build or change.",
            "The agent reads your codebase, explores the relevant files, and creates a step-by-step plan.",
            "The plan appears as a structured checklist in the Plan panel. Each step shows which files will be touched and what will change.",
            "You review the plan, suggest modifications, or approve it.",
            "Once approved, the agent executes each step, checking off items as it goes.",
          ]}
        />

        <DocsH3>When to use plan mode</DocsH3>
        <DocsParagraph>
          Plan mode is ideal for tasks that touch multiple files, require
          architectural decisions, or where you want to verify the approach
          before any code is written. Examples:
        </DocsParagraph>
        <DocsList
          items={[
            "Adding a new feature that spans frontend and backend.",
            "Refactoring a module with many dependents.",
            "Setting up CI/CD, testing infrastructure, or database migrations.",
            "Any task where you would normally write a design doc first.",
          ]}
        />
      </DocsSection>

      <DocsDivider />

      <DocsSection id="tips" title="Tips for Effective Prompting">
        <DocsH3>Be specific about the outcome</DocsH3>
        <DocsParagraph>
          Instead of &quot;improve the login page&quot;, try &quot;add email
          validation to the login form that shows an inline error message below
          the email field when the format is invalid&quot;. The more precise
          your request, the better the result.
        </DocsParagraph>

        <DocsH3>Point to files and functions</DocsH3>
        <DocsParagraph>
          The agent can find things on its own, but you will get faster results
          if you mention specific files or functions. You can reference files
          with @-mentions in the chat — type @ and start typing a filename.
        </DocsParagraph>
        <DocsCode>{`@src/components/LoginForm.tsx add email validation with a regex check`}</DocsCode>

        <DocsH3>Iterate in the same session</DocsH3>
        <DocsParagraph>
          The agent remembers context within a session. After it makes a change,
          you can follow up with refinements like &quot;also handle the case
          where the email field is empty&quot; or &quot;add a test for that
          validation&quot;. You do not need to re-explain the full context.
        </DocsParagraph>

        <DocsH3>Use the right mode</DocsH3>
        <DocsParagraph>
          For quick, focused changes — normal chat mode. For complex, multi-file
          features — plan mode. For parallel work — use background agents (check
          the Agent docs for details). Matching the mode to the task makes
          the agent significantly more effective.
        </DocsParagraph>

        <DocsH3>Provide constraints</DocsH3>
        <DocsParagraph>
          If you have preferences about how something should be built, say so
          upfront. &quot;Use Zod for validation, not Yup&quot; or &quot;keep it
          under 50 lines&quot; or &quot;follow the pattern in
          UserCard.tsx&quot;. The agent respects explicit constraints.
        </DocsParagraph>

        <DocsCallout type="tip">
          You can define persistent rules for your project by creating a
          CREOR.md or .creor/rules file in your project root. The agent reads
          these on every session and follows them automatically. See the Rules
          documentation for details.
        </DocsCallout>
      </DocsSection>
    </DocsPage>
  );
}
