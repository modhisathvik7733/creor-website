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
  title: "Agent Overview | Creor",
  description:
    "Understand how Creor's AI agent processes requests, selects tools, and executes multi-step coding workflows.",
  path: "/docs/agent/overview",
});

export default function AgentOverviewPage() {
  return (
    <DocsPage
      breadcrumb="Agent"
      title="Agent Overview"
      description="The agent is the core of Creor. It receives your messages, reasons about what needs to happen, selects the right tools, and executes multi-step workflows to accomplish your coding tasks."
      toc={[
        { label: "What Is the Agent", href: "#what-is-the-agent" },
        { label: "Message Flow", href: "#message-flow" },
        { label: "Agent Types", href: "#agent-types" },
        { label: "Tool Selection", href: "#tool-selection" },
        { label: "Error Handling & Retries", href: "#error-handling" },
        { label: "Context Window", href: "#context-window" },
        { label: "Next Steps", href: "#next-steps" },
      ]}
    >
      <DocsSection id="what-is-the-agent" title="What Is the Agent">
        <DocsParagraph>
          When you type a message in the Creor chat panel, you are talking to an AI agent -- not just a
          language model. The agent wraps the underlying LLM with a tool-use loop that can read your
          codebase, edit files, run shell commands, search the web, and coordinate parallel sub-tasks.
          Each response is the result of one or more iterations through this loop until the agent decides
          it has fully addressed your request.
        </DocsParagraph>
        <DocsParagraph>
          Unlike a simple chat completion, the agent maintains a persistent session with your project
          context. It knows your file structure, open editors, recent changes, and any project-level
          instructions you have defined in CREOR.md or .creor/ rules.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="message-flow" title="Message Flow">
        <DocsParagraph>
          Every interaction follows a loop. When you send a message, the agent reasons about the task,
          decides which tools to call, executes them, observes the results, and repeats until the task
          is complete.
        </DocsParagraph>
        <DocsCode>{`User message
  -> Agent reasoning (LLM decides next action)
    -> Tool selection (read, edit, bash, grep, etc.)
      -> Tool execution (agent runs the tool)
        -> Result observation (agent reads tool output)
          -> Continue loop or return final response`}</DocsCode>
        <DocsParagraph>
          A single user message can trigger dozens of tool calls. For example, asking the agent to
          refactor a function might involve reading the file, finding all references with grep,
          editing multiple files, and running tests to verify the change.
        </DocsParagraph>

        <DocsH3>Step-by-Step Breakdown</DocsH3>
        <DocsList
          items={[
            "You send a message in the chat panel or via the CLI.",
            "The system prompt is assembled: project instructions, active rules, session history, and tool definitions.",
            "The LLM produces a response that may include one or more tool calls.",
            "Each tool call is checked against the permission system (allow, ask, or deny).",
            "Approved tool calls are executed and their results are fed back to the LLM.",
            "The LLM decides whether to make more tool calls or return a final text response.",
            "The final response is displayed in the chat panel alongside any tool call cards.",
          ]}
        />
      </DocsSection>

      <DocsSection id="agent-types" title="Agent Types">
        <DocsParagraph>
          Creor ships with several agent configurations, each tailored for a different workflow. The
          default is the Build agent, which has full access to all tools.
        </DocsParagraph>

        <DocsTable
          headers={["Agent", "Access Level", "Purpose"]}
          rows={[
            [
              "Build",
              "Full (read, write, execute)",
              "Default agent. Can read files, edit code, run commands, search the web, and perform any coding task.",
            ],
            [
              "Plan",
              "Read-only",
              "Analyzes your codebase and produces structured plans in .creor/plans/. Cannot modify files or run destructive commands.",
            ],
            [
              "CLI",
              "Full (read, write, execute)",
              "Optimized for terminal-first workflows when running Creor from the command line.",
            ],
            [
              "App",
              "Full (read, write, execute)",
              "Used by the desktop application with additional UI integrations for inline edits and diff views.",
            ],
            [
              "Web",
              "Full (read, write, execute)",
              "Used by the web-based interface with adapted tool handling for browser environments.",
            ],
          ]}
        />

        <DocsCallout type="tip">
          Use the Plan agent when you want to understand a codebase or design a feature before writing
          any code. It cannot make changes, so it is safe to run on production repositories.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="tool-selection" title="Tool Selection">
        <DocsParagraph>
          The agent does not randomly pick tools. The LLM receives a list of all available tools with
          their descriptions and parameter schemas. Based on your message and the current session
          context, it decides which tool (or tools) to invoke.
        </DocsParagraph>

        <DocsH3>Selection Heuristics</DocsH3>
        <DocsList
          items={[
            "If the task involves understanding code, the agent starts with read, glob, and grep to explore the codebase.",
            "For code changes, it uses edit (exact string replacement) or write (new file creation) after reading the target file.",
            "Shell commands (bash) are used for running tests, installing dependencies, git operations, and build commands.",
            "Web tools (websearch, webfetch) are invoked when the agent needs external documentation or API references.",
            "Task and plan tools are used for multi-step workflows that benefit from structured execution.",
          ]}
        />

        <DocsParagraph>
          The agent can call multiple tools in a single turn. When tool calls are independent of each
          other, they are executed in parallel for faster results.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="error-handling" title="Error Handling & Retries">
        <DocsParagraph>
          When a tool call fails, the agent does not give up. It reads the error output and adapts its
          approach. This is one of the key advantages of an agentic workflow over a simple code
          generation model.
        </DocsParagraph>

        <DocsH3>Common Recovery Patterns</DocsH3>
        <DocsList
          items={[
            "Edit failure (string not found): The agent re-reads the file to get the current content and retries with the correct match string.",
            "Test failure: The agent reads the test output, identifies the failing assertion, and adjusts the code.",
            "Build error: The agent reads compiler output, locates the error in the source file, and fixes type mismatches or syntax issues.",
            "Permission denied: The agent prompts you for approval or suggests an alternative approach that does not require elevated access.",
            "Timeout: Long-running commands are retried with adjusted parameters or broken into smaller steps.",
          ]}
        />

        <DocsCallout type="info">
          If the agent gets stuck in a retry loop, you can interrupt it by clicking the stop button or
          pressing Escape. You can then provide additional guidance or ask it to try a different approach.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="context-window" title="Context Window">
        <DocsParagraph>
          The agent operates within the context window of the underlying LLM. As a conversation grows,
          older messages and tool results may be compacted to stay within limits. Creor handles this
          automatically through session compaction, which summarizes earlier turns while preserving
          recent context.
        </DocsParagraph>
        <DocsList
          items={[
            "Recent messages and tool results are kept in full detail.",
            "Older turns are summarized to preserve intent while reducing token count.",
            "System instructions (CREOR.md, rules) are always included at full fidelity.",
            "Large tool outputs (e.g., reading a big file) are truncated with a note to the agent about what was cut.",
          ]}
        />
      </DocsSection>

      <DocsDivider />

      <DocsSection id="next-steps" title="Next Steps">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DocsCard
            title="Planning"
            description="Learn how to use plan mode for analysis and structured task planning."
            href="/docs/agent/planning"
          />
          <DocsCard
            title="Prompting"
            description="Write effective prompts and configure project-level instructions."
            href="/docs/agent/prompting"
          />
          <DocsCard
            title="Tools"
            description="Explore the 25+ tools available to the agent."
            href="/docs/agent/tools"
          />
          <DocsCard
            title="Security"
            description="Understand sandboxing, permissions, and secret scanning."
            href="/docs/agent/security"
          />
        </div>
      </DocsSection>
    </DocsPage>
  );
}
