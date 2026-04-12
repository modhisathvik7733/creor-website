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
  title: "Terminal & Shell Troubleshooting | Creor",
  description:
    "Fix PTY attachment issues, command timeouts, sandbox restrictions, and interactive command problems in Creor.",
  path: "/docs/troubleshooting/terminal",
});

export default function TroubleshootingTerminalPage() {
  return (
    <DocsPage
      breadcrumb="Troubleshooting"
      title="Terminal & Shell"
      description="The agent uses a PTY-based terminal to execute shell commands. This page covers common terminal issues including PTY attachment failures, timeouts, sandbox restrictions, and problems with interactive commands."
      toc={[
        { label: "PTY Not Attaching", href: "#pty-not-attaching" },
        { label: "Command Timeouts", href: "#command-timeouts" },
        { label: "Sandbox Restrictions", href: "#sandbox-restrictions" },
        { label: "Interactive Commands", href: "#interactive-commands" },
        { label: "Shell Environment", href: "#shell-environment" },
        { label: "Output Issues", href: "#output-issues" },
      ]}
    >
      <DocsSection id="pty-not-attaching" title="PTY Not Attaching">
        <DocsParagraph>
          The agent&apos;s terminal uses a PTY (pseudo-terminal) to execute shell commands.
          The PTY must be attached to a DOM element before it can display output. If this
          fails, you will see a blank terminal card or &quot;Terminal not available&quot;.
        </DocsParagraph>

        <DocsH3>Symptoms</DocsH3>
        <DocsList
          items={[
            "Terminal card appears but shows no output.",
            "\"Terminal not available\" message in the chat panel.",
            "Commands execute but output is not visible.",
            "Terminal card flickers or appears and immediately disappears.",
          ]}
        />

        <DocsH3>Solutions</DocsH3>
        <DocsList
          items={[
            "Restart the engine: Command Palette > \"Creor: Restart Engine\". This re-initializes the PTY manager.",
            "Check the Output panel (View > Output > Creor Engine) for PTY-related errors.",
            "If you are using a custom theme or extension that modifies the chat panel layout, try disabling it temporarily.",
            "Resize the chat panel. Sometimes the PTY fails to attach because the container element has zero dimensions.",
          ]}
        />
        <DocsCallout type="info">
          The terminal container must be in the DOM before the PTY can attach. Creor buffers
          output during initialization and replays it once the terminal element is ready. If
          output is lost, the command likely finished before the DOM was ready -- rerun the
          command to see the output.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="command-timeouts" title="Command Timeouts">
        <DocsParagraph>
          The agent&apos;s bash tool has a default timeout to prevent long-running commands from
          blocking the conversation. When a command exceeds the timeout, it is terminated and
          the agent receives a timeout error.
        </DocsParagraph>

        <DocsH3>Default Timeouts</DocsH3>
        <DocsTable
          headers={["Command Type", "Default Timeout", "Configurable"]}
          rows={[
            ["Regular bash commands", "120 seconds", "Yes, in creor.json"],
            ["Build commands (npm, cargo, go)", "300 seconds", "Yes, in creor.json"],
            ["Test commands", "300 seconds", "Yes, in creor.json"],
            ["Background processes", "No timeout", "N/A (runs until killed)"],
          ]}
        />

        <DocsH3>Increasing Timeouts</DocsH3>
        <DocsParagraph>
          If your project has slow builds or long test suites, increase the timeout in your
          project&apos;s creor.json file.
        </DocsParagraph>
        <DocsCode lines>{`{
  "tools": {
    "bash": {
      "timeout": 600
    }
  }
}`}</DocsCode>
        <DocsParagraph>
          The timeout value is in seconds. Setting it to 0 disables the timeout entirely, but
          this is not recommended -- a runaway command could block the agent indefinitely.
        </DocsParagraph>

        <DocsH3>Working Around Timeouts</DocsH3>
        <DocsList
          items={[
            "Ask the agent to run the command in the background: \"Run the tests in the background and check the results.\"",
            "Break long-running commands into smaller steps: \"Run the unit tests first, then the integration tests.\"",
            "For builds, ask the agent to watch for specific output instead of waiting for completion.",
          ]}
        />
        <DocsCallout type="tip">
          If a command times out, the agent can still read partial output that was captured before
          the timeout. It often uses this output to diagnose the issue (e.g., a test that hangs).
        </DocsCallout>
      </DocsSection>

      <DocsSection id="sandbox-restrictions" title="Sandbox Restrictions">
        <DocsParagraph>
          The agent&apos;s bash tool runs in a sandboxed environment that restricts access to
          certain paths and commands. This protects your system from unintended modifications.
        </DocsParagraph>

        <DocsH3>Path Restrictions</DocsH3>
        <DocsParagraph>
          By default, the agent can only access files within the workspace directory and
          standard system paths (for reading). Attempts to read or write files outside the
          workspace are blocked.
        </DocsParagraph>
        <DocsCode lines>{`# Allow additional paths in creor.json
{
  "tools": {
    "bash": {
      "allowPaths": [
        "/usr/local/bin",
        "$HOME/.config/some-tool",
        "/tmp"
      ]
    }
  }
}`}</DocsCode>

        <DocsH3>Command Restrictions</DocsH3>
        <DocsParagraph>
          Certain destructive commands require explicit permission. The agent will prompt you
          before running commands that match the deny list.
        </DocsParagraph>
        <DocsTable
          headers={["Command Pattern", "Default Policy", "Reason"]}
          rows={[
            ["rm -rf /", "Deny", "Prevents accidental system wipe."],
            ["sudo *", "Ask", "Requires explicit user approval."],
            ["docker *", "Ask", "Container operations may affect system state."],
            ["git push --force", "Ask", "Force push can destroy remote history."],
            ["curl | bash", "Deny", "Prevents execution of untrusted remote scripts."],
          ]}
        />

        <DocsH3>Customizing Restrictions</DocsH3>
        <DocsCode lines>{`{
  "permissions": {
    "bash": {
      "allow": [
        "npm *",
        "bun *",
        "git *",
        "make *"
      ],
      "deny": [
        "rm -rf /",
        "curl * | bash"
      ],
      "default": "ask"
    }
  }
}`}</DocsCode>
        <DocsParagraph>
          The default policy controls what happens when a command does not match any allow or
          deny rule. &quot;ask&quot; prompts you for approval. &quot;allow&quot; lets it run
          automatically. &quot;deny&quot; blocks it silently.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="interactive-commands" title="Interactive Commands">
        <DocsParagraph>
          The agent&apos;s bash tool is designed for non-interactive commands. Commands that
          require user input (prompts, confirmations, interactive menus) will hang until they
          timeout.
        </DocsParagraph>

        <DocsH3>Common Problematic Commands</DocsH3>
        <DocsTable
          headers={["Command", "Problem", "Solution"]}
          rows={[
            ["npm init", "Prompts for package details", "Use npm init -y for defaults."],
            ["git rebase -i", "Opens an interactive editor", "Use git rebase --onto or non-interactive rebase."],
            ["ssh", "Prompts for password", "Use SSH key authentication with no passphrase, or set up ssh-agent."],
            ["vim, nano", "Opens interactive editor", "Use the edit/write tools instead."],
            ["python (REPL)", "Starts interactive interpreter", "Use python -c 'command' or python script.py."],
            ["npx create-*", "Interactive scaffolding", "Pass all options as flags to skip prompts."],
          ]}
        />

        <DocsH3>Workarounds</DocsH3>
        <DocsList
          items={[
            "Use the -y or --yes flag to auto-accept defaults where available.",
            "Pipe input to stdin: echo 'yes' | some-command (the agent can do this automatically).",
            "Set environment variables to skip prompts: CI=true, DEBIAN_FRONTEND=noninteractive.",
            "Ask the agent to use a non-interactive alternative.",
          ]}
        />
        <DocsCallout type="info">
          The agent is aware of interactive command limitations. When it encounters a command
          that would be interactive, it typically adds flags to make it non-interactive or uses
          an alternative approach.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="shell-environment" title="Shell Environment">
        <DocsParagraph>
          The agent&apos;s shell environment may differ from your personal terminal. This can
          cause issues with commands that depend on specific shell configurations.
        </DocsParagraph>

        <DocsH3>Common Environment Differences</DocsH3>
        <DocsList
          items={[
            "PATH: the agent's PATH includes standard system paths but may not include custom directories from your .bashrc or .zshrc.",
            "Shell: the agent uses your default shell (bash or zsh), but it may not load all profile scripts.",
            "NVM / RVM / pyenv: version managers that rely on shell initialization may not be active.",
            "Aliases: shell aliases from your profile are not loaded.",
          ]}
        />

        <DocsH3>Adding to the Shell Environment</DocsH3>
        <DocsCode lines>{`{
  "tools": {
    "bash": {
      "env": {
        "PATH": "/usr/local/bin:/usr/bin:/bin:$HOME/.nvm/versions/node/v20/bin",
        "NODE_ENV": "development",
        "CUSTOM_VAR": "value"
      }
    }
  }
}`}</DocsCode>
        <DocsParagraph>
          Environment variables set in creor.json are available to every command the agent runs.
          Use this to ensure tools like Node.js, Python, or Go are in the PATH.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="output-issues" title="Output Issues">
        <DocsH3>Truncated output</DocsH3>
        <DocsParagraph>
          Very long command outputs are truncated to prevent consuming too many tokens in the
          agent&apos;s context window. The agent sees a note indicating that the output was
          truncated.
        </DocsParagraph>
        <DocsList
          items={[
            "The default output limit is approximately 10,000 lines.",
            "If you need full output, ask the agent to redirect output to a file: \"Run the tests and save the output to test-results.txt\".",
            "The agent can then read specific parts of the file to find relevant information.",
          ]}
        />

        <DocsH3>Garbled or encoding issues</DocsH3>
        <DocsParagraph>
          If terminal output contains garbled characters or escape codes, the command may be
          producing output designed for an interactive terminal.
        </DocsParagraph>
        <DocsList
          items={[
            "Add --no-color or --color=false flags to suppress ANSI color codes.",
            "Use --plain or --json output modes when available.",
            "Set the TERM environment variable: TERM=dumb for the simplest output format.",
          ]}
        />
      </DocsSection>
    </DocsPage>
  );
}
