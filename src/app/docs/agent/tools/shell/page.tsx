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
  title: "Shell & Terminal Tools | Creor",
  description:
    "Execute shell commands, manage processes, and use the integrated terminal with Creor's bash tool and PTY system.",
  path: "/docs/agent/tools/shell",
});

export default function ShellToolsPage() {
  return (
    <DocsPage
      breadcrumb="Agent / Tools"
      title="Shell & Terminal"
      description="The shell tools let the agent execute commands, run tests, manage processes, and interact with your development environment through the terminal."
      toc={[
        { label: "Bash Tool", href: "#bash-tool" },
        { label: "Timeouts", href: "#timeouts" },
        { label: "Sandbox Mode", href: "#sandbox-mode" },
        { label: "PTY Terminal", href: "#pty-terminal" },
        { label: "Git Secret Scanner", href: "#git-secret-scanner" },
        { label: "Common Use Cases", href: "#common-use-cases" },
        { label: "Safety Considerations", href: "#safety-considerations" },
      ]}
    >
      <DocsSection id="bash-tool" title="Bash Tool">
        <DocsParagraph>
          The bash tool executes shell commands in your project&apos;s working directory. It is one of
          the agent&apos;s most versatile tools -- used for running tests, installing packages, executing
          build scripts, interacting with git, and any other terminal operation.
        </DocsParagraph>

        <DocsTable
          headers={["Parameter", "Type", "Description"]}
          rows={[
            ["command", "string", "The shell command to execute."],
            ["description", "string (optional)", "A human-readable description of what the command does. Shown in the tool call card."],
            ["timeout", "number (optional)", "Timeout in milliseconds. Default: 120000 (2 minutes). Max: 600000 (10 minutes)."],
          ]}
        />

        <DocsH3>How It Works</DocsH3>
        <DocsList
          items={[
            "The command runs in the project root directory.",
            "The shell environment is initialized from your user profile (bash or zsh).",
            "stdout and stderr are captured and returned to the agent.",
            "The exit code is included so the agent knows if the command succeeded or failed.",
            "The working directory does not persist between calls -- each command starts from the project root.",
          ]}
        />

        <DocsCode>{`# Run tests
bash command="npm test" description="Run the test suite"

# Install a package
bash command="npm install zod" description="Install zod for validation"

# Check git status
bash command="git status" description="Show working tree status"

# Run a long build with extended timeout
bash command="npm run build" timeout=300000 description="Build the project"`}</DocsCode>

        <DocsCallout type="info">
          The working directory resets to the project root for each bash call. Use absolute paths
          or chain commands with &amp;&amp; if you need to change directories.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="timeouts" title="Timeouts">
        <DocsParagraph>
          Every bash command has a timeout to prevent runaway processes from blocking the agent. The
          default timeout is 120 seconds (2 minutes), and the maximum is 600 seconds (10 minutes).
        </DocsParagraph>

        <DocsTable
          headers={["Timeout", "Duration", "Use Case"]}
          rows={[
            ["Default", "120 seconds", "Standard commands: git, file operations, quick scripts."],
            ["Extended", "300 seconds", "Build commands, test suites, package installation."],
            ["Maximum", "600 seconds", "Long-running builds, large test suites, data processing."],
          ]}
        />

        <DocsParagraph>
          If a command exceeds its timeout, the process is terminated and the agent receives a timeout
          error. The agent will either retry with a longer timeout, break the command into smaller
          steps, or ask you for guidance.
        </DocsParagraph>

        <DocsCallout type="tip">
          If your project has a long build or test cycle, mention it in your CREOR.md so the agent
          knows to use extended timeouts automatically.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="sandbox-mode" title="Sandbox Mode">
        <DocsParagraph>
          Sandbox mode adds OS-level isolation to bash commands, restricting what the command can
          access on your filesystem and network. It uses platform-specific sandboxing mechanisms.
        </DocsParagraph>

        <DocsTable
          headers={["Platform", "Technology", "Capabilities"]}
          rows={[
            ["macOS", "Seatbelt (sandbox-exec)", "Restricts file paths, network access, and process spawning."],
            ["Linux", "seccomp + namespaces", "Restricts system calls, file paths, and network access."],
          ]}
        />

        <DocsH3>What Sandbox Restricts</DocsH3>
        <DocsList
          items={[
            "File access is limited to the project directory and system paths (e.g., /usr, /tmp).",
            "Network access can be restricted or fully blocked.",
            "Process creation is monitored and can be limited.",
            "Access to sensitive system paths (e.g., ~/.ssh, ~/.aws) is blocked.",
          ]}
        />

        <DocsParagraph>
          Sandbox mode is controlled by the tool permission configuration. When sandbox is enabled,
          commands that try to access restricted resources will fail with a permission error rather
          than silently succeeding.
        </DocsParagraph>

        <DocsCallout type="info">
          Sandbox mode may interfere with some development tools that need broad filesystem or network
          access (e.g., Docker, package managers that download binaries). You can configure specific
          exceptions in your creor.json file.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="pty-terminal" title="PTY Terminal">
        <DocsParagraph>
          The PTY (pseudo-terminal) system provides a full terminal emulator for interactive command
          execution. Unlike the basic bash tool, the PTY terminal supports interactive programs,
          real-time output, and terminal control sequences.
        </DocsParagraph>

        <DocsH3>When PTY Is Used</DocsH3>
        <DocsList
          items={[
            "Commands that require interactive input (e.g., prompts, confirmations).",
            "Long-running processes that produce streaming output (e.g., dev servers, watch mode).",
            "Programs that use terminal colors, cursor movement, or other control sequences.",
            "Commands that need a real TTY to function correctly (e.g., some CLI tools that detect terminal capabilities).",
          ]}
        />

        <DocsParagraph>
          When the agent runs a command through PTY, you see a terminal card in the chat timeline
          that shows the real-time output. You can interact with the terminal directly if the
          running process requires input.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="git-secret-scanner" title="Git Secret Scanner">
        <DocsParagraph>
          The git secret scanner automatically detects leaked secrets, API keys, tokens, and
          credentials in staged git changes. It runs as a pre-commit check to prevent accidental
          exposure of sensitive data.
        </DocsParagraph>

        <DocsH3>What It Detects</DocsH3>
        <DocsList
          items={[
            "API keys and tokens (AWS, Google Cloud, Azure, Stripe, etc.).",
            "Private keys (RSA, EC, SSH).",
            "Database connection strings with embedded passwords.",
            "JWT tokens and session secrets.",
            "OAuth client secrets.",
            "Generic high-entropy strings that look like secrets.",
          ]}
        />

        <DocsParagraph>
          When the scanner detects a potential secret, it blocks the commit and reports the finding
          to the agent. The agent will then help you remove the secret from the staged changes and
          suggest using environment variables or a secrets manager instead.
        </DocsParagraph>

        <DocsCallout type="warning">
          The secret scanner catches common patterns but is not a comprehensive security audit tool.
          Always use dedicated secret scanning services (like GitHub Advanced Security) for
          production repositories.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="common-use-cases" title="Common Use Cases">
        <DocsH3>Running Tests</DocsH3>
        <DocsCode>{`# Run all tests
bash command="npm test"

# Run a specific test file
bash command="npx vitest run src/utils/format.test.ts"

# Run tests with coverage
bash command="npm run test:coverage" timeout=300000`}</DocsCode>

        <DocsH3>Package Management</DocsH3>
        <DocsCode>{`# Install dependencies
bash command="npm install"

# Add a new package
bash command="npm install @tanstack/react-query"

# Check for outdated packages
bash command="npm outdated"`}</DocsCode>

        <DocsH3>Git Operations</DocsH3>
        <DocsCode>{`# Check status and recent history
bash command="git status && git log --oneline -10"

# Create a branch and commit
bash command="git checkout -b feature/add-auth && git add -A && git commit -m 'Add OAuth2 authentication'"

# View a diff
bash command="git diff HEAD~1"`}</DocsCode>

        <DocsH3>Build and Compile</DocsH3>
        <DocsCode>{`# TypeScript compilation
bash command="npx tsc --noEmit" description="Type check the project"

# Production build
bash command="npm run build" timeout=300000 description="Build for production"`}</DocsCode>
      </DocsSection>

      <DocsSection id="safety-considerations" title="Safety Considerations">
        <DocsList
          items={[
            "The bash tool defaults to 'ask' permission. You approve each command before it runs.",
            "Destructive commands (rm -rf, git reset --hard) are flagged in the permission card.",
            "The agent avoids running commands with side effects unless specifically asked.",
            "Network-accessing commands can be blocked by sandbox mode.",
            "The agent never runs commands as root or with sudo unless explicitly instructed.",
          ]}
        />

        <DocsCallout type="tip">
          If you trust the agent to run common commands automatically, set bash permission to
          &quot;allow&quot; in your creor.json. You can still review all commands in the tool call cards
          after they execute.
        </DocsCallout>
      </DocsSection>
    </DocsPage>
  );
}
