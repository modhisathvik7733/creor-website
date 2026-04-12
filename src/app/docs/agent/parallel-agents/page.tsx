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
} from "@/components/docs-page";

export const metadata: Metadata = generatePageMetadata({
  title: "Parallel Agents | Creor",
  description:
    "Spawn subagents for parallel task execution with git worktree isolation, batch operations, and multi-file refactoring.",
  path: "/docs/agent/parallel-agents",
});

export default function ParallelAgentsPage() {
  return (
    <DocsPage
      breadcrumb="Agent"
      title="Parallel Agents"
      description="The agent can spawn child agents (subagents) that work in parallel on independent tasks. Each subagent gets its own context and can optionally work in an isolated git worktree to avoid conflicts."
      toc={[
        { label: "How It Works", href: "#how-it-works" },
        { label: "Subagent Execution", href: "#subagent-execution" },
        { label: "Git Worktree Isolation", href: "#worktree-isolation" },
        { label: "Batch Operations", href: "#batch-operations" },
        { label: "Use Cases", href: "#use-cases" },
        { label: "Limitations", href: "#limitations" },
      ]}
    >
      <DocsSection id="how-it-works" title="How It Works">
        <DocsParagraph>
          When the agent encounters a task that can be decomposed into independent subtasks, it
          uses the task tool to spawn one or more subagents. Each subagent runs as an independent
          agent instance with its own message history, tool calls, and results. The parent agent
          collects all results and synthesizes them into a coherent response.
        </DocsParagraph>

        <DocsCode>{`Parent Agent
  ├── Task 1: Search for deprecated API usage (subagent)
  ├── Task 2: Analyze test coverage gaps (subagent)
  └── Task 3: Check for type errors in affected files (subagent)

  → All three run simultaneously
  → Parent collects results and summarizes findings`}</DocsCode>

        <DocsParagraph>
          The parent agent decides when to use parallel execution based on the nature of the request.
          Tasks that are independent (no shared state, no ordering dependency) are good candidates
          for parallelization. Tasks that depend on each other's results are executed sequentially.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="subagent-execution" title="Subagent Execution">
        <DocsParagraph>
          Each subagent is a full agent instance with access to the complete tool set. It receives
          a focused prompt from the parent agent and works independently until it finishes.
        </DocsParagraph>

        <DocsH3>Subagent Lifecycle</DocsH3>
        <DocsList
          items={[
            "The parent agent creates a task with a description and detailed prompt.",
            "A new agent instance is spawned with its own context window.",
            "The subagent receives the project instructions (CREOR.md, rules) plus its task-specific prompt.",
            "It executes tool calls, reads files, and performs work independently.",
            "When finished, it returns its result to the parent agent.",
            "The parent agent reads all subagent results and continues its workflow.",
          ]}
        />

        <DocsH3>What Subagents Can Do</DocsH3>
        <DocsTable
          headers={["Capability", "Supported"]}
          rows={[
            ["Read files", "Yes"],
            ["Edit/write files", "Yes (with worktree isolation recommended)"],
            ["Run shell commands", "Yes"],
            ["Search the web", "Yes"],
            ["Spawn further subagents", "No (single level of nesting)"],
            ["Access parent context", "No (receives only the task prompt)"],
          ]}
        />

        <DocsCallout type="info">
          Subagents do not share context with each other or with the parent agent during execution.
          Each subagent only sees its task prompt and the results of its own tool calls. The parent
          agent is responsible for combining results.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="worktree-isolation" title="Git Worktree Isolation">
        <DocsParagraph>
          When subagents need to modify files, they can be isolated using git worktrees. Each
          subagent works in its own worktree (a separate checkout of the repository) on its own
          branch, so their changes cannot conflict with each other or with the main working directory.
        </DocsParagraph>

        <DocsH3>How Worktree Isolation Works</DocsH3>
        <DocsList
          items={[
            "The parent agent creates a new git worktree for each subagent that will modify files.",
            "Each worktree is a separate directory with its own checkout of the repository.",
            "The subagent works in its worktree, making changes on an isolated branch.",
            "When the subagent finishes, its changes can be merged back into the main branch.",
            "The worktree is cleaned up after the task is complete.",
          ]}
        />

        <DocsCode>{`Main branch (your working directory)
  ├── worktree/task-1 (branch: task/migrate-user-dto)
  │   └── Subagent 1 edits files here
  ├── worktree/task-2 (branch: task/update-tests)
  │   └── Subagent 2 edits files here
  └── worktree/task-3 (branch: task/fix-type-errors)
      └── Subagent 3 edits files here`}</DocsCode>

        <DocsH3>Merging Results</DocsH3>
        <DocsParagraph>
          After all subagents complete, the parent agent can merge their branches back into the main
          branch. If there are conflicts, the parent agent handles them the same way it would handle
          any git merge conflict -- by reading the conflicting files and resolving them.
        </DocsParagraph>

        <DocsCallout type="warning">
          Worktree isolation requires a git repository. In non-git projects, subagents share the
          same working directory and must be carefully coordinated to avoid conflicts.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="batch-operations" title="Batch Operations">
        <DocsParagraph>
          The batch tool is a lighter-weight form of parallelism that combines multiple independent
          tool calls into a single operation. Unlike subagents, batch operations share the same
          agent context and do not create separate worktrees.
        </DocsParagraph>

        <DocsH3>Batch vs. Subagents</DocsH3>
        <DocsTable
          headers={["Aspect", "Batch", "Subagents"]}
          rows={[
            ["Complexity", "Simple, same-context", "Full agent with own context"],
            ["Isolation", "Shared working directory", "Optional worktree isolation"],
            ["Tool calls", "Multiple calls in one turn", "Full multi-turn workflows"],
            ["Use case", "Read 5 files, run 3 grep searches", "Refactor module A while updating module B"],
            ["Overhead", "Minimal", "Higher (new agent instance per task)"],
          ]}
        />

        <DocsParagraph>
          The agent automatically decides between batch operations and subagents based on the
          complexity of the work. Simple, homogeneous operations (e.g., reading several files)
          use batch. Complex, multi-step workflows use subagents.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="use-cases" title="Use Cases">
        <DocsH3>Multi-File Refactoring</DocsH3>
        <DocsParagraph>
          When a refactoring touches many files, the parent agent can split the work into subagents
          that each handle a subset of files. This is especially useful for large-scale renames,
          import path changes, or API migrations.
        </DocsParagraph>
        <DocsCode>{`Rename the UserService to AccountService across the entire
codebase. This affects approximately 40 files.`}</DocsCode>

        <DocsH3>Parallel Research</DocsH3>
        <DocsParagraph>
          When the agent needs to gather information from multiple sources, it can spawn subagents
          to search different parts of the codebase or web simultaneously.
        </DocsParagraph>
        <DocsCode>{`Analyze the performance of our API endpoints. Check the
route handlers, database queries, middleware, and caching
layer for bottlenecks.`}</DocsCode>

        <DocsH3>Independent Feature Work</DocsH3>
        <DocsParagraph>
          For features that have independent components (e.g., frontend and backend, or multiple
          microservices), subagents can work on each component simultaneously.
        </DocsParagraph>

        <DocsH3>Test Suite Updates</DocsH3>
        <DocsParagraph>
          After a significant change, the agent can spawn subagents to update different test files
          in parallel, each in its own worktree to avoid conflicts.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="limitations" title="Limitations">
        <DocsList
          items={[
            "Subagents cannot spawn their own subagents. Parallelism is limited to one level of nesting.",
            "Each subagent has its own context window, so very large tasks may still exceed context limits.",
            "Subagents cannot communicate with each other during execution. All coordination goes through the parent agent.",
            "Worktree creation and cleanup adds overhead. For very small tasks, sequential execution may be faster.",
            "Merge conflicts between subagent branches require manual resolution by the parent agent.",
            "The total number of concurrent subagents may be limited by system resources.",
          ]}
        />

        <DocsCallout type="tip">
          Parallel agents work best when the subtasks are truly independent. If tasks have shared
          state or ordering dependencies, let the parent agent handle them sequentially.
        </DocsCallout>
      </DocsSection>
    </DocsPage>
  );
}
