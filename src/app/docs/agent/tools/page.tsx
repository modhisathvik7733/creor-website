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
  title: "Tools Overview | Creor",
  description:
    "Explore the 25+ tools available to Creor's agent, from file editing and shell commands to web search and code intelligence.",
  path: "/docs/agent/tools",
});

export default function ToolsOverviewPage() {
  return (
    <DocsPage
      breadcrumb="Agent"
      title="Tools"
      description="The agent has access to over 25 tools that let it read, write, search, execute, and analyze code. Each tool is purpose-built for a specific type of operation."
      toc={[
        { label: "How Tools Work", href: "#how-tools-work" },
        { label: "Tool Categories", href: "#tool-categories" },
        { label: "Permission System", href: "#permission-system" },
        { label: "Configuring Permissions", href: "#configuring-permissions" },
        { label: "Tool Reference", href: "#tool-reference" },
      ]}
    >
      <DocsSection id="how-tools-work" title="How Tools Work">
        <DocsParagraph>
          When the agent decides to take an action -- reading a file, editing code, running a test --
          it invokes a tool. Each tool has a defined interface with typed parameters, a description
          the LLM uses for selection, and a permission level that controls whether it runs
          automatically or requires your approval.
        </DocsParagraph>
        <DocsParagraph>
          Tools are not plugins or extensions. They are built into the engine and optimized for the
          agent's workflow. The agent sees each tool's parameter schema and description, then
          constructs the right call based on what it needs to accomplish.
        </DocsParagraph>

        <DocsH3>Tool Call Lifecycle</DocsH3>
        <DocsList
          items={[
            "The LLM decides which tool to call and generates the parameters.",
            "The engine validates the parameters against the tool's schema.",
            "The permission system checks whether the tool is allowed, needs approval, or is denied.",
            "If approval is needed, a permission card appears in the chat for you to accept or reject.",
            "The tool executes and returns its result to the agent.",
            "The agent reads the result and decides on its next action.",
          ]}
        />
      </DocsSection>

      <DocsSection id="tool-categories" title="Tool Categories">
        <DocsParagraph>
          Tools are organized into five categories based on their function.
        </DocsParagraph>

        <DocsTable
          headers={["Category", "Tools", "Purpose"]}
          rows={[
            [
              "File",
              "read, write, edit, multiedit, glob, grep, ls",
              "Read, create, modify, and search files in your project.",
            ],
            [
              "Shell",
              "bash",
              "Execute shell commands, run tests, install packages, and interact with git.",
            ],
            [
              "Code Intelligence",
              "lsp, codesearch",
              "Navigate code with language server features: go to definition, find references, symbol search.",
            ],
            [
              "Web",
              "websearch, webfetch",
              "Search the internet and fetch web page content for documentation and references.",
            ],
            [
              "Task & Planning",
              "todo, task, plan, question, skill, batch",
              "Manage tasks, create plans, prompt for user input, invoke skills, and batch operations.",
            ],
          ]}
        />

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DocsCard
            title="File Tools"
            description="Read, write, edit, glob, and grep -- everything for working with files."
            href="/docs/agent/tools/file"
          />
          <DocsCard
            title="Shell & Terminal"
            description="Execute commands, manage processes, and interact with the terminal."
            href="/docs/agent/tools/shell"
          />
          <DocsCard
            title="Code Intelligence"
            description="LSP-powered navigation, symbol lookup, and code analysis."
            href="/docs/agent/tools/code-intelligence"
          />
          <DocsCard
            title="Web Tools"
            description="Search the web and fetch page content for external references."
            href="/docs/agent/tools/web"
          />
          <DocsCard
            title="Task & Planning"
            description="Todo lists, task agents, plan mode, and interactive skills."
            href="/docs/agent/tools/task-planning"
          />
        </div>
      </DocsSection>

      <DocsSection id="permission-system" title="Permission System">
        <DocsParagraph>
          Every tool has a permission level that determines whether it runs automatically, prompts
          you for approval, or is blocked entirely.
        </DocsParagraph>

        <DocsTable
          headers={["Level", "Behavior", "Use Case"]}
          rows={[
            [
              "allow",
              "Tool executes immediately without prompting.",
              "Safe, read-only operations or tools you fully trust (e.g., read, glob, grep).",
            ],
            [
              "ask",
              "A permission card appears. You must approve before the tool runs.",
              "Default for most tools. Lets you review each action before it happens.",
            ],
            [
              "deny",
              "Tool is completely blocked. The agent cannot invoke it.",
              "Disable tools you never want the agent to use in a particular project.",
            ],
          ]}
        />

        <DocsCallout type="info">
          The default permission for most tools is &quot;ask&quot;. Read-only tools like read, glob, and grep
          default to &quot;allow&quot; so the agent can explore your codebase without interrupting your flow.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="configuring-permissions" title="Configuring Permissions">
        <DocsParagraph>
          Tool permissions are configured in your creor.json file at the project root. You can set
          permissions per tool, per category, or with a global default.
        </DocsParagraph>

        <DocsH3>Per-Tool Permissions</DocsH3>
        <DocsCode lines>{`{
  "permissions": {
    "bash": "ask",
    "write": "ask",
    "edit": "allow",
    "read": "allow",
    "glob": "allow",
    "grep": "allow",
    "websearch": "deny"
  }
}`}</DocsCode>

        <DocsH3>Default Permission</DocsH3>
        <DocsParagraph>
          Set a default that applies to all tools not explicitly configured.
        </DocsParagraph>
        <DocsCode lines>{`{
  "permissions": {
    "*": "ask",
    "read": "allow",
    "glob": "allow",
    "grep": "allow"
  }
}`}</DocsCode>

        <DocsCallout type="warning">
          Setting all permissions to &quot;allow&quot; lets the agent execute any operation without confirmation.
          This is convenient for trusted projects but removes the safety net. Use with caution.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="tool-reference" title="Tool Reference">
        <DocsParagraph>
          Below is the complete list of tools available to the agent. Click through to each category
          page for detailed documentation on parameters and usage.
        </DocsParagraph>

        <DocsTable
          headers={["Tool", "Category", "Description"]}
          rows={[
            ["read", "File", "Read file contents with optional line ranges. Supports text, images, PDFs, and Jupyter notebooks."],
            ["write", "File", "Create a new file or completely overwrite an existing one."],
            ["edit", "File", "Exact string replacement within a file (old_string to new_string)."],
            ["multiedit", "File", "Apply multiple edits to one or more files in a single operation."],
            ["glob", "File", "Find files by pattern matching (e.g., **/*.ts, src/**/test.*)."],
            ["grep", "File", "Search file contents with regex patterns using ripgrep."],
            ["ls", "File", "List directory contents with file metadata."],
            ["bash", "Shell", "Execute shell commands with configurable timeout and sandboxing."],
            ["lsp", "Code Intelligence", "Language server operations: definitions, references, symbols, diagnostics."],
            ["codesearch", "Code Intelligence", "Semantic code search across your project using RAG indexing."],
            ["websearch", "Web", "Search the web using Exa for documentation and references."],
            ["webfetch", "Web", "Fetch and read the content of a web page."],
            ["todo", "Task", "Read and write todo lists in the .creor/ directory."],
            ["task", "Task", "Spawn child agents for parallel task execution."],
            ["plan", "Task", "Enter or exit plan mode."],
            ["question", "Task", "Prompt the user for input during automated workflows."],
            ["skill", "Task", "Invoke a defined skill (reusable prompt workflow)."],
            ["batch", "Task", "Combine multiple tool calls into a single operation."],
            ["apply_patch", "File", "Apply a unified diff patch to one or more files."],
            ["git-secret-scanner", "Shell", "Scan for leaked secrets, API keys, and tokens in staged changes."],
            ["external-directory", "File", "Access files outside the project root with explicit permission."],
          ]}
        />
      </DocsSection>
    </DocsPage>
  );
}
