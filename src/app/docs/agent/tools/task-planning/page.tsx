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
} from "@/components/docs-page";

export const metadata: Metadata = generatePageMetadata({
  title: "Task & Planning Tools | Creor",
  description:
    "Manage todos, spawn parallel tasks, enter plan mode, prompt for user input, and invoke reusable skills.",
  path: "/docs/agent/tools/task-planning",
});

export default function TaskPlanningToolsPage() {
  return (
    <DocsPage
      breadcrumb="Agent / Tools"
      title="Task & Planning Tools"
      description="Task and planning tools help the agent organize complex workflows, track progress, interact with you during automation, and invoke reusable prompt patterns."
      toc={[
        { label: "Todo", href: "#todo" },
        { label: "Task", href: "#task" },
        { label: "Plan", href: "#plan" },
        { label: "Question", href: "#question" },
        { label: "Skill", href: "#skill" },
        { label: "Batch", href: "#batch" },
      ]}
    >
      <DocsSection id="todo" title="Todo">
        <DocsParagraph>
          The todo tool reads and writes todo lists stored in the .creor/ directory. The agent uses
          it to track progress on multi-step tasks, create checklists, and maintain a record of
          what has been done and what remains.
        </DocsParagraph>

        <DocsH3>How It Works</DocsH3>
        <DocsParagraph>
          Todo lists are stored as structured data in .creor/todos/. The agent creates, updates, and
          checks off items as it works through a task. You can see the todo list in the chat timeline
          and in the .creor/ directory.
        </DocsParagraph>

        <DocsCode>{`# The agent creates a todo list for a complex task:
- [x] Read the current authentication module
- [x] Identify all routes that need auth middleware
- [ ] Create the JWT validation middleware
- [ ] Add middleware to protected routes
- [ ] Write integration tests
- [ ] Update API documentation`}</DocsCode>

        <DocsH3>When the Agent Uses Todos</DocsH3>
        <DocsList
          items={[
            "Multi-step tasks where tracking progress helps the agent stay on course.",
            "Tasks that span multiple tool calls and might benefit from a visible checklist.",
            "When you ask the agent to create a task list or implementation plan.",
            "During iterative workflows where the agent needs to remember what it has already done.",
          ]}
        />

        <DocsCallout type="tip">
          You can ask the agent to create a todo list before starting work. This gives you a chance
          to review the steps and adjust the approach before any code is written.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="task" title="Task">
        <DocsParagraph>
          The task tool spawns child agents (subagents) that can execute work in parallel. This is
          the agent&apos;s mechanism for parallelizing work -- each task agent gets its own context and
          can use the full set of tools independently.
        </DocsParagraph>

        <DocsTable
          headers={["Parameter", "Type", "Description"]}
          rows={[
            ["description", "string", "What the task agent should do."],
            ["prompt", "string", "The full prompt for the task agent, including all necessary context."],
          ]}
        />

        <DocsH3>How Task Agents Work</DocsH3>
        <DocsList
          items={[
            "Each task agent runs as an independent agent with its own message history.",
            "Task agents can use the same tools as the parent agent.",
            "Multiple tasks can run in parallel for faster execution.",
            "Each task agent may work in its own git worktree to avoid conflicts.",
            "Results from all task agents are collected and returned to the parent agent.",
          ]}
        />

        <DocsCode>{`# The parent agent might spawn tasks like:
Task 1: "Search for all uses of the deprecated UserDTO type
         and list the files that need updating."
Task 2: "Read the migration guide for v3 and summarize the
         breaking changes relevant to our codebase."
Task 3: "Check all test files for references to UserDTO
         and identify which tests need to be updated."`}</DocsCode>

        <DocsParagraph>
          See the Parallel Agents page for detailed documentation on task orchestration and
          worktree isolation.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="plan" title="Plan">
        <DocsParagraph>
          The plan tool switches the agent between build mode and plan mode. When activated, the
          agent transitions to the Plan agent configuration, which is read-only and optimized for
          analysis and planning.
        </DocsParagraph>

        <DocsH3>Operations</DocsH3>
        <DocsTable
          headers={["Action", "Description"]}
          rows={[
            ["Enter plan mode", "Switch to the Plan agent. All subsequent messages use the read-only plan configuration."],
            ["Exit plan mode", "Switch back to the Build agent. The agent can now modify files and run commands."],
          ]}
        />

        <DocsParagraph>
          Plans are written to the .creor/plans/ directory as markdown files. Each plan has a title,
          overview, numbered steps with file references, and a risk assessment.
        </DocsParagraph>

        <DocsCallout type="info">
          See the Planning page for comprehensive documentation on plan mode, plan
          file format, and best practices.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="question" title="Question">
        <DocsParagraph>
          The question tool prompts you for input during an automated workflow. When the agent
          encounters a decision point where it does not have enough context to proceed, it pauses
          and asks you a question rather than guessing.
        </DocsParagraph>

        <DocsH3>When the Agent Asks Questions</DocsH3>
        <DocsList
          items={[
            "Ambiguous requirements: 'Should the API return paginated results or the full list?'",
            "Design decisions: 'Should I use Redis or in-memory caching for this use case?'",
            "Confirmation before destructive actions: 'This will delete 15 test fixture files. Continue?'",
            "Missing configuration: 'I need the database connection string. Where should I read it from?'",
            "Multiple valid approaches: 'I can implement this with either a class-based or functional approach. Which do you prefer?'",
          ]}
        />

        <DocsParagraph>
          When a question is asked, a question card appears in the chat timeline. Your response is
          fed back to the agent, which continues execution with the new context.
        </DocsParagraph>

        <DocsCallout type="tip">
          Provide as much context as possible in your initial prompt to reduce the number of
          questions the agent needs to ask. Clear requirements and constraints prevent interruptions.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="skill" title="Skill">
        <DocsParagraph>
          The skill tool invokes a defined skill -- a reusable prompt workflow that encapsulates a
          common task pattern. Skills are predefined recipes that combine a system prompt, tool
          configuration, and instructions into a single invocable unit.
        </DocsParagraph>

        <DocsH3>How Skills Work</DocsH3>
        <DocsList
          items={[
            "Skills are defined as markdown files in .creor/skills/ or configured in creor.json.",
            "Each skill has a name, description, trigger pattern, and instruction content.",
            "When invoked, the skill's instructions are injected into the agent's context.",
            "The agent follows the skill's workflow while retaining access to all tools.",
          ]}
        />

        <DocsH3>Example: Code Review Skill</DocsH3>
        <DocsCode lines>{`# .creor/skills/review.md
---
name: review
description: Perform a thorough code review of staged changes
---

Review the staged git changes and provide feedback on:
1. Correctness: logic bugs, edge cases, error handling
2. Performance: N+1 queries, unnecessary allocations
3. Security: injection risks, auth bypasses, secret exposure
4. Style: naming, consistency with project conventions
5. Tests: coverage gaps, missing edge case tests

Format: list each finding with file, line, severity, and
a suggested fix.`}</DocsCode>

        <DocsParagraph>
          You can trigger a skill by name using the /skill command or by asking the agent to
          use a specific skill.
        </DocsParagraph>
        <DocsCode>{`/skill review
# or
Run the code review skill on my staged changes.`}</DocsCode>
      </DocsSection>

      <DocsSection id="batch" title="Batch">
        <DocsParagraph>
          The batch tool combines multiple tool calls into a single operation. This is primarily
          used internally by the agent to optimize performance when several independent operations
          can run simultaneously.
        </DocsParagraph>

        <DocsH3>When Batch Is Used</DocsH3>
        <DocsList
          items={[
            "Reading multiple files simultaneously when exploring a feature area.",
            "Running several grep searches in parallel to find different patterns.",
            "Performing multiple glob searches to discover different types of files.",
            "Applying independent edits to different files at the same time.",
          ]}
        />

        <DocsParagraph>
          You do not need to ask the agent to use batch explicitly. It automatically batches
          independent tool calls when it determines that parallel execution will be faster than
          sequential execution.
        </DocsParagraph>
      </DocsSection>
    </DocsPage>
  );
}
