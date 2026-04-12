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
  title: "Subagents | Creor",
  description:
    "Define custom agents with their own models, permissions, and system prompts. Invoke them with @mention syntax.",
  path: "/docs/customizing/subagents",
});

export default function SubagentsPage() {
  return (
    <DocsPage
      breadcrumb="Customizing"
      title="Subagents"
      description="Creor ships with built-in agents for common workflows. You can customize these or create entirely new agents with their own models, permissions, prompts, and behavior."
      toc={[
        { label: "Built-in Agents", href: "#built-in" },
        { label: "Agent Config", href: "#agent-config" },
        { label: "Agent Modes", href: "#modes" },
        { label: "Creating Agents in JSON", href: "#json-agents" },
        { label: "Creating Agents in Markdown", href: "#markdown-agents" },
        { label: "Invoking Agents", href: "#invoking" },
        { label: "Permissions", href: "#permissions" },
        { label: "Examples", href: "#examples" },
      ]}
    >
      <DocsSection id="built-in" title="Built-in Agents">
        <DocsParagraph>
          Creor comes with several agents out of the box:
        </DocsParagraph>
        <DocsTable
          headers={["Agent", "Mode", "Description"]}
          rows={[
            [
              "build",
              "primary",
              "The default agent. Full tool access based on your permission config. Used for writing code, running commands, and making changes.",
            ],
            [
              "plan",
              "primary",
              "Read-only planning mode. Can read files and write plans to .creor/plans/*.md but denies all other file edits.",
            ],
            [
              "general",
              "subagent",
              "General-purpose subagent for research and multi-step tasks. Used by the primary agent to parallelize work.",
            ],
            [
              "explore",
              "subagent",
              "Read-only codebase exploration. Can search files, read code, and use LSP tools but cannot make any changes.",
            ],
          ]}
        />
        <DocsParagraph>
          Internal agents like <code>title</code>, <code>summary</code>, and{" "}
          <code>compaction</code> are hidden from the UI and handle background
          tasks automatically.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="agent-config" title="Agent Config">
        <DocsParagraph>
          Each agent is configured with the following fields:
        </DocsParagraph>
        <DocsTable
          headers={["Field", "Type", "Description"]}
          rows={[
            ["model", "string", "Model in provider/model format (e.g., \"anthropic/claude-sonnet-4-20250514\")"],
            ["variant", "string", "Default model variant for this agent"],
            ["temperature", "number", "Sampling temperature (0-2)"],
            ["top_p", "number", "Nucleus sampling parameter"],
            ["prompt", "string", "System prompt appended to the agent's instructions"],
            ["description", "string", "When to use this agent (shown in autocomplete)"],
            ["mode", "\"primary\" | \"subagent\" | \"all\"", "How this agent can be invoked"],
            ["hidden", "boolean", "Hide from the @ autocomplete menu (subagents only)"],
            ["color", "string", "Hex color (#FF5733) or theme name (primary, accent, etc.)"],
            ["steps", "number", "Max agentic iterations before forcing text-only response"],
            ["permission", "object", "Tool permission overrides for this agent"],
            ["disable", "boolean", "Remove a built-in agent entirely"],
            ["options", "object", "Additional options (e.g., preferSmallModel)"],
          ]}
        />
      </DocsSection>

      <DocsSection id="modes" title="Agent Modes">
        <DocsParagraph>
          The <code>mode</code> field controls how an agent can be used:
        </DocsParagraph>
        <DocsTable
          headers={["Mode", "Behavior"]}
          rows={[
            [
              "primary",
              "Can be selected as the active agent from the agent picker. Used directly for conversations. The build and plan agents are primary by default.",
            ],
            [
              "subagent",
              "Invoked by primary agents via @mention. Cannot be set as the main conversation agent. Good for specialized tasks delegated by the primary agent.",
            ],
            [
              "all",
              "Available both as a primary agent and as a subagent. Custom agents default to this mode.",
            ],
          ]}
        />
        <DocsCallout type="info">
          The <code>default_agent</code> config field controls which primary
          agent is selected on startup. It defaults to <code>build</code>.
          You cannot set a subagent as the default.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="json-agents" title="Creating Agents in JSON">
        <DocsParagraph>
          Define agents in the <code>agent</code> section of your{" "}
          <code>creor.json</code>:
        </DocsParagraph>
        <DocsCode lines>{`{
  "agent": {
    "review": {
      "description": "Code reviewer — reads code and provides feedback, never edits",
      "mode": "subagent",
      "model": "anthropic/claude-sonnet-4-20250514",
      "temperature": 0.3,
      "prompt": "You are a senior code reviewer. Analyze code for bugs, performance issues, security concerns, and style. Never modify files — only read and report.",
      "permission": {
        "edit": "deny",
        "bash": "deny",
        "read": "allow",
        "glob": "allow",
        "grep": "allow"
      }
    }
  }
}`}</DocsCode>
        <DocsParagraph>
          You can also override built-in agents. For example, to change the
          default model for the build agent:
        </DocsParagraph>
        <DocsCode lines>{`{
  "agent": {
    "build": {
      "model": "openai/gpt-4.1",
      "temperature": 0.1
    }
  }
}`}</DocsCode>
      </DocsSection>

      <DocsSection id="markdown-agents" title="Creating Agents in Markdown">
        <DocsParagraph>
          For agents with longer system prompts, use markdown files in the{" "}
          <code>.creor/agents/</code> directory. The filename becomes the agent
          name, and the markdown body becomes the prompt.
        </DocsParagraph>
        <DocsH3>File Structure</DocsH3>
        <DocsCode lines>{`.creor/
  agents/
    review.md
    security-audit.md`}</DocsCode>

        <DocsH3>Example: review.md</DocsH3>
        <DocsCode lines>{`---
description: Code reviewer that reads code and provides feedback
mode: subagent
model: anthropic/claude-sonnet-4-20250514
temperature: 0.3
permission:
  edit: deny
  bash: deny
  read: allow
  glob: allow
  grep: allow
---

You are a senior code reviewer working on a production codebase.

## Review Guidelines

1. **Correctness**: Check for logic errors, off-by-one mistakes, null pointer risks
2. **Performance**: Flag O(n^2) patterns, unnecessary allocations, missing indexes
3. **Security**: Look for injection risks, hardcoded secrets, improper auth checks
4. **Readability**: Suggest clearer names, simpler control flow, better abstractions

## Output Format

For each issue found, report:
- **File**: path/to/file.ts:line
- **Severity**: critical | warning | suggestion
- **Issue**: one-line description
- **Fix**: recommended change

Never modify files. Only read and report findings.`}</DocsCode>
        <DocsCallout type="tip">
          Markdown agents are great for long, detailed prompts. The
          frontmatter supports the same fields as JSON agent config. The
          markdown body is used as the <code>prompt</code> field.
        </DocsCallout>
      </DocsSection>

      <DocsDivider />

      <DocsSection id="invoking" title="Invoking Agents">
        <DocsH3>@Mention Syntax</DocsH3>
        <DocsParagraph>
          In the chat input, type <code>@agent-name</code> to invoke a
          subagent. For example:
        </DocsParagraph>
        <DocsCode>{`@review Check the authentication module for security issues`}</DocsCode>
        <DocsParagraph>
          The primary agent (build) will delegate the task to the review
          subagent, which runs with its own model, prompt, and permissions.
        </DocsParagraph>

        <DocsH3>Agent Picker</DocsH3>
        <DocsParagraph>
          Primary agents can be selected from the agent picker in the UI. Click
          the agent name in the chat header or use the configured keybind to
          switch between primary agents.
        </DocsParagraph>

        <DocsH3>Auto-Routing</DocsH3>
        <DocsParagraph>
          When <code>auto_route</code> is enabled in your config, Creor uses
          LLM intent classification to automatically route messages to the
          most appropriate agent. A question about code structure might be
          routed to the explore agent, while a request to build a feature
          goes to the build agent.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="permissions" title="Permissions">
        <DocsParagraph>
          Each agent has its own permission set that controls which tools it
          can use. Permissions are merged from multiple sources:
        </DocsParagraph>
        <DocsList
          items={[
            "Built-in defaults (e.g., all agents allow read by default, deny .env files)",
            "Global permission config from your creor.json",
            "Agent-specific permission overrides",
          ]}
        />
        <DocsParagraph>
          The permission values are:
        </DocsParagraph>
        <DocsTable
          headers={["Value", "Behavior"]}
          rows={[
            ["allow", "Tool executes without asking for confirmation"],
            ["ask", "Creor shows a permission prompt before executing"],
            ["deny", "Tool call is blocked entirely"],
          ]}
        />
        <DocsParagraph>
          For file-based tools (read, edit, external_directory), you can use
          glob patterns to set per-path permissions:
        </DocsParagraph>
        <DocsCode lines>{`{
  "permission": {
    "read": {
      "*": "allow",
      "*.env": "deny",
      "*.env.*": "deny",
      "*.env.example": "allow"
    },
    "edit": {
      "*": "allow",
      "src/generated/**": "deny"
    }
  }
}`}</DocsCode>
      </DocsSection>

      <DocsSection id="examples" title="Examples">
        <DocsH3>Security Audit Agent</DocsH3>
        <DocsCode lines>{`{
  "agent": {
    "security": {
      "description": "Security auditor — scans for vulnerabilities and compliance issues",
      "mode": "subagent",
      "model": "anthropic/claude-sonnet-4-20250514",
      "prompt": "You are a security auditor. Scan code for OWASP Top 10 vulnerabilities, hardcoded secrets, and insecure patterns. Report findings with severity ratings.",
      "permission": {
        "edit": "deny",
        "bash": "deny",
        "read": "allow",
        "grep": "allow",
        "glob": "allow",
        "websearch": "allow"
      }
    }
  }
}`}</DocsCode>

        <DocsH3>Documentation Writer</DocsH3>
        <DocsCode lines>{`{
  "agent": {
    "docs": {
      "description": "Documentation writer — generates and updates docs",
      "mode": "subagent",
      "temperature": 0.5,
      "prompt": "You are a technical writer. Generate clear, concise documentation. Use JSDoc for code comments and Markdown for standalone docs. Match the existing documentation style in the project.",
      "permission": {
        "bash": "deny",
        "read": "allow",
        "edit": {
          "*": "deny",
          "docs/**": "allow",
          "**/*.md": "allow",
          "README.md": "allow"
        }
      }
    }
  }
}`}</DocsCode>

        <DocsH3>Disabling a Built-in Agent</DocsH3>
        <DocsParagraph>
          To remove a built-in agent, set <code>disable: true</code>:
        </DocsParagraph>
        <DocsCode lines>{`{
  "agent": {
    "explore": {
      "disable": true
    }
  }
}`}</DocsCode>
      </DocsSection>
    </DocsPage>
  );
}
