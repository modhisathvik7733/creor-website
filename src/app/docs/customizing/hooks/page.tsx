import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import {
  DocsPage,
  DocsSection,
  DocsParagraph,
  DocsCode,
  DocsCallout,
  DocsTable,
  DocsH3,
  DocsDivider,
} from "@/components/docs-page";

export const metadata: Metadata = generatePageMetadata({
  title: "Hooks | Creor",
  description:
    "Run shell commands before and after tool execution, on session start/end, and at other lifecycle events.",
  path: "/docs/customizing/hooks",
});

export default function HooksPage() {
  return (
    <DocsPage
      breadcrumb="Customizing"
      title="Hooks"
      description="Hooks let you run shell commands at specific points in the agent lifecycle. Use them to auto-format code after edits, run linters, send notifications, or enforce custom policies."
      toc={[
        { label: "Overview", href: "#overview" },
        { label: "Hook Events", href: "#events" },
        { label: "Hook Entry Config", href: "#config" },
        { label: "Environment Variables", href: "#env-vars" },
        { label: "JSON Payload", href: "#payload" },
        { label: "Blocking Hooks", href: "#blocking" },
        { label: "Examples", href: "#examples" },
      ]}
    >
      <DocsSection id="overview" title="Overview">
        <DocsParagraph>
          Hooks are configured in the <code>hooks</code> section of your{" "}
          <code>creor.json</code>. Each hook event maps to an array of hook
          entries. When the event fires, Creor runs each matching hook entry
          as a shell command.
        </DocsParagraph>
        <DocsCode lines>{`{
  "hooks": {
    "tool.execute.after": [
      {
        "command": "npx prettier --write \\"$HOOK_TOOL_OUTPUT\\"",
        "matcher": "Edit",
        "description": "Auto-format after edit"
      }
    ]
  }
}`}</DocsCode>
        <DocsParagraph>
          Hooks run in the project&apos;s working directory and inherit the
          system environment. They receive context via both environment
          variables and a JSON payload on stdin.
        </DocsParagraph>
        <DocsCallout type="info">
          Hooks added or modified via the UI or config file take effect
          immediately — no restart required. Creor reads the fresh config on
          every hook trigger.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="events" title="Hook Events">
        <DocsParagraph>
          The following lifecycle events are available:
        </DocsParagraph>
        <DocsTable
          headers={["Event", "When It Fires", "Can Block?"]}
          rows={[
            [
              "tool.execute.before",
              "Before a tool runs. Receives tool name and input args.",
              "Yes",
            ],
            [
              "tool.execute.after",
              "After a tool completes. Receives tool name and output.",
              "No",
            ],
            [
              "tool.execute.failure",
              "When a tool fails. Receives tool name and error.",
              "No",
            ],
            [
              "shell.env",
              "Before any shell command. Hook stdout sets environment variables (KEY=VALUE format).",
              "No",
            ],
            [
              "command.execute.before",
              "Before a slash command executes. Receives command name and arguments.",
              "Yes",
            ],
            [
              "chat.message",
              "When a new chat message is sent. Receives session ID and agent name.",
              "Yes",
            ],
            [
              "session.start",
              "When a new session begins.",
              "No",
            ],
            [
              "session.end",
              "When a session ends. Always runs asynchronously.",
              "No",
            ],
            [
              "notification",
              "When the agent sends a notification. Receives the message text.",
              "No",
            ],
            [
              "pre.compact",
              "Before context compaction runs. Receives trigger type and message count.",
              "No",
            ],
          ]}
        />
      </DocsSection>

      <DocsSection id="config" title="Hook Entry Config">
        <DocsParagraph>
          Each hook entry supports the following fields:
        </DocsParagraph>
        <DocsTable
          headers={["Field", "Type", "Default", "Description"]}
          rows={[
            ["command", "string", "(required)", "Shell command to execute"],
            ["description", "string", "—", "Human-readable description shown in the UI"],
            ["enabled", "boolean", "true", "Set to false to temporarily disable without removing"],
            ["timeout", "number", "30000", "Timeout in milliseconds. Hook is killed if it exceeds this."],
            [
              "matcher",
              "string",
              "— (all tools)",
              "Tool name filter for tool.* events. Exact name, pipe-separated list (\"Edit|Write\"), or regex.",
            ],
            ["statusMessage", "string", "—", "Message shown in the UI while the hook runs"],
            ["async", "boolean", "false", "Fire-and-forget: don't wait for the hook to finish before continuing"],
          ]}
        />
        <DocsCallout type="tip">
          Use <code>async: true</code> for hooks that should not block the
          agent loop — like sending Slack notifications or logging to an
          external service.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="env-vars" title="Environment Variables">
        <DocsParagraph>
          Creor sets the following environment variables before running a hook
          command. The exact set depends on the event type:
        </DocsParagraph>
        <DocsTable
          headers={["Variable", "Events", "Description"]}
          rows={[
            ["HOOK_EVENT", "All", "The event name (e.g., \"tool.execute.before\")"],
            ["HOOK_SESSION_ID", "Most", "Current session ID"],
            ["HOOK_TOOL_NAME", "tool.*", "Name of the tool being executed"],
            ["HOOK_CALL_ID", "tool.execute.*", "Unique ID for this tool call"],
            ["HOOK_TOOL_OUTPUT", "tool.execute.after", "Tool output (truncated to 8KB)"],
            ["HOOK_TOOL_ERROR", "tool.execute.failure", "Error message (truncated to 500 chars)"],
            ["HOOK_PROJECT_DIR", "All", "Absolute path to the project directory"],
            ["HOOK_CWD", "shell.env", "Current working directory for the shell command"],
            ["HOOK_COMMAND", "command.execute.before", "Slash command name"],
            ["HOOK_ARGUMENTS", "command.execute.before", "Command arguments"],
            ["HOOK_AGENT", "chat.message", "Agent name handling the message"],
            ["HOOK_MESSAGE", "notification", "Notification message text (truncated to 500 chars)"],
            ["HOOK_SOURCE", "session.start", "Session start source (e.g., \"startup\")"],
            ["HOOK_TRIGGER", "pre.compact", "Compaction trigger (\"auto\" or \"manual\")"],
          ]}
        />
      </DocsSection>

      <DocsSection id="payload" title="JSON Payload">
        <DocsParagraph>
          In addition to environment variables, Creor writes a JSON payload
          to the hook&apos;s stdin. This provides structured access to the
          same data plus any additional fields.
        </DocsParagraph>
        <DocsCode lines>{`// Example payload for tool.execute.before
{
  "hook_event_name": "tool.execute.before",
  "session_id": "abc123",
  "tool_name": "Edit",
  "tool_input": {
    "file_path": "/path/to/file.ts",
    "old_string": "const x = 1",
    "new_string": "const x = 2"
  },
  "cwd": "/path/to/project",
  "project_dir": "/path/to/project",
  "timestamp": 1712345678000
}`}</DocsCode>
        <DocsParagraph>
          You can read this payload in your hook script:
        </DocsParagraph>
        <DocsCode lines>{`#!/bin/bash
# Read JSON from stdin
payload=$(cat)
tool_name=$(echo "$payload" | jq -r '.tool_name')
file_path=$(echo "$payload" | jq -r '.tool_input.file_path // empty')

if [ "$tool_name" = "Edit" ] && [ -n "$file_path" ]; then
  npx prettier --write "$file_path"
fi`}</DocsCode>
      </DocsSection>

      <DocsDivider />

      <DocsSection id="blocking" title="Blocking Hooks">
        <DocsParagraph>
          Hooks on <code>tool.execute.before</code>,{" "}
          <code>command.execute.before</code>, and <code>chat.message</code>{" "}
          can block execution. There are two ways to block:
        </DocsParagraph>

        <DocsH3>Exit Code 2</DocsH3>
        <DocsParagraph>
          If the hook exits with code 2, Creor blocks the operation. The
          stderr output is used as the reason:
        </DocsParagraph>
        <DocsCode lines>{`#!/bin/bash
if echo "$HOOK_TOOL_NAME" | grep -q "Bash"; then
  if echo "$payload" | jq -r '.tool_input.command' | grep -q "rm -rf"; then
    echo "Destructive rm -rf commands are not allowed" >&2
    exit 2
  fi
fi
exit 0`}</DocsCode>

        <DocsH3>JSON Decision Output</DocsH3>
        <DocsParagraph>
          Alternatively, print a JSON object to stdout with{" "}
          <code>{`"decision": "block"`}</code>:
        </DocsParagraph>
        <DocsCode lines>{`#!/bin/bash
payload=$(cat)
file_path=$(echo "$payload" | jq -r '.tool_input.file_path // empty')

if [[ "$file_path" == *"package-lock.json"* ]]; then
  echo '{"decision": "block", "reason": "Do not edit package-lock.json directly"}'
  exit 0
fi
echo '{"decision": "allow"}'`}</DocsCode>

        <DocsH3>Modifying Tool Input</DocsH3>
        <DocsParagraph>
          For <code>tool.execute.before</code>, the JSON output can also
          include an <code>updatedInput</code> field to modify the tool&apos;s
          arguments before execution:
        </DocsParagraph>
        <DocsCode lines>{`#!/bin/bash
# Force all file writes to use LF line endings
payload=$(cat)
echo '{"updatedInput": {"line_endings": "lf"}}'`}</DocsCode>
      </DocsSection>

      <DocsSection id="examples" title="Examples">
        <DocsH3>Auto-Format After Edit</DocsH3>
        <DocsCode lines>{`{
  "hooks": {
    "tool.execute.after": [
      {
        "command": "npx prettier --write \\"$HOOK_TOOL_OUTPUT\\" 2>/dev/null || true",
        "matcher": "Edit",
        "description": "Run Prettier after file edits",
        "timeout": 10000
      }
    ]
  }
}`}</DocsCode>

        <DocsH3>Run Linter After File Write</DocsH3>
        <DocsCode lines>{`{
  "hooks": {
    "tool.execute.after": [
      {
        "command": "npx eslint --fix \\"$HOOK_TOOL_OUTPUT\\" 2>/dev/null || true",
        "matcher": "Edit|Write",
        "description": "Run ESLint after file changes",
        "timeout": 15000
      }
    ]
  }
}`}</DocsCode>

        <DocsH3>Notify on Task Complete</DocsH3>
        <DocsCode lines>{`{
  "hooks": {
    "notification": [
      {
        "command": "osascript -e 'display notification \\"$HOOK_MESSAGE\\" with title \\"Creor\\"'",
        "description": "macOS notification on task complete",
        "async": true
      }
    ]
  }
}`}</DocsCode>

        <DocsH3>Block Dangerous Commands</DocsH3>
        <DocsCode lines>{`{
  "hooks": {
    "tool.execute.before": [
      {
        "command": "payload=$(cat); cmd=$(echo \\"$payload\\" | jq -r '.tool_input.command // empty'); if echo \\"$cmd\\" | grep -qE 'rm -rf|DROP TABLE|truncate'; then echo 'Destructive command blocked' >&2; exit 2; fi",
        "matcher": "Bash",
        "description": "Block destructive shell commands"
      }
    ]
  }
}`}</DocsCode>

        <DocsH3>Inject Environment Variables</DocsH3>
        <DocsCode lines>{`{
  "hooks": {
    "shell.env": [
      {
        "command": "echo \\"NODE_ENV=development\\" && echo \\"DEBUG=app:*\\"",
        "description": "Set dev environment variables for shell commands"
      }
    ]
  }
}`}</DocsCode>

        <DocsH3>Log Session Activity</DocsH3>
        <DocsCode lines>{`{
  "hooks": {
    "session.start": [
      {
        "command": "echo \\"[$(date -Iseconds)] Session started: $HOOK_SESSION_ID\\" >> ~/.creor/session.log",
        "description": "Log session start",
        "async": true
      }
    ],
    "session.end": [
      {
        "command": "echo \\"[$(date -Iseconds)] Session ended: $HOOK_SESSION_ID\\" >> ~/.creor/session.log",
        "description": "Log session end"
      }
    ]
  }
}`}</DocsCode>
      </DocsSection>
    </DocsPage>
  );
}
