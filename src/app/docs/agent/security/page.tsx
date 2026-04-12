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
  title: "Security | Creor",
  description:
    "Sandbox isolation, file permissions, network policies, secret scanning, and the tool permission system that protects your code.",
  path: "/docs/agent/security",
});

export default function SecurityPage() {
  return (
    <DocsPage
      breadcrumb="Agent"
      title="Security"
      description="Creor is designed with multiple layers of security to protect your code, credentials, and system. This page covers sandboxing, file permissions, network policies, secret scanning, and the tool permission system."
      toc={[
        { label: "Security Model", href: "#security-model" },
        { label: "Sandbox", href: "#sandbox" },
        { label: "File Permissions", href: "#file-permissions" },
        { label: "Network Policies", href: "#network-policies" },
        { label: "Git Secret Scanner", href: "#git-secret-scanner" },
        { label: "Permission System", href: "#permission-system" },
        { label: "Best Practices", href: "#best-practices" },
      ]}
    >
      <DocsSection id="security-model" title="Security Model">
        <DocsParagraph>
          Creor's security is built on the principle of defense in depth. No single layer is
          expected to catch everything -- instead, multiple overlapping controls work together to
          minimize risk. The agent can only do what you allow it to do, and each action passes
          through several checkpoints before execution.
        </DocsParagraph>

        <DocsTable
          headers={["Layer", "What It Protects", "How"]}
          rows={[
            ["Permission system", "Tool execution", "Each tool call is checked against allow/ask/deny rules before running."],
            ["Sandbox", "OS-level isolation", "Restricts file access, network, and process creation at the OS kernel level."],
            ["File permissions", "Filesystem access", "Limits which directories and files the agent can read or write."],
            ["Network policies", "External connections", "Controls whether the agent can make outbound HTTP requests."],
            ["Secret scanner", "Credential leaks", "Detects API keys, tokens, and secrets before they are committed to git."],
          ]}
        />
      </DocsSection>

      <DocsSection id="sandbox" title="Sandbox">
        <DocsParagraph>
          The sandbox provides OS-level isolation for shell commands executed by the agent. It uses
          platform-native security mechanisms to restrict what a command can access, even if the
          command itself tries to break out of its intended boundaries.
        </DocsParagraph>

        <DocsH3>macOS (Seatbelt)</DocsH3>
        <DocsParagraph>
          On macOS, the sandbox uses Apple's Seatbelt framework (sandbox-exec) to create a
          restricted execution environment. Each bash command runs inside a sandbox profile that
          defines exactly what the process can and cannot do.
        </DocsParagraph>
        <DocsList
          items={[
            "File read access is limited to the project directory, /usr, /tmp, and explicitly allowed paths.",
            "File write access is limited to the project directory and /tmp.",
            "Network access can be fully blocked or restricted to specific hosts.",
            "Process execution is allowed but constrained to the sandbox rules.",
            "Access to sensitive directories (~/.ssh, ~/.aws, ~/.gnupg) is blocked by default.",
          ]}
        />

        <DocsH3>Linux (seccomp + namespaces)</DocsH3>
        <DocsParagraph>
          On Linux, the sandbox uses seccomp-bpf to filter system calls and Linux namespaces to
          isolate the process's view of the filesystem and network.
        </DocsParagraph>
        <DocsList
          items={[
            "System call filtering blocks dangerous operations (e.g., mount, ptrace, reboot).",
            "Filesystem namespaces limit the visible directory tree.",
            "Network namespaces can isolate or block network access.",
            "PID namespaces prevent the process from seeing or signaling other processes.",
          ]}
        />

        <DocsCallout type="info">
          Sandbox mode is enabled by default for shell commands. Some development tools may need
          sandbox exceptions to function correctly. You can configure these in your creor.json.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="file-permissions" title="File Permissions">
        <DocsParagraph>
          File permissions control which paths the agent can read from and write to. By default,
          the agent can access files within your project directory. Access to paths outside the
          project requires explicit permission.
        </DocsParagraph>

        <DocsH3>Default Access Rules</DocsH3>
        <DocsTable
          headers={["Path", "Read", "Write", "Notes"]}
          rows={[
            ["Project directory", "Allowed", "Allowed", "The project root and all subdirectories."],
            ["/tmp", "Allowed", "Allowed", "Temporary files for intermediate operations."],
            ["System paths (/usr, /bin)", "Allowed", "Blocked", "Read-only access for running system commands."],
            ["Home directory (~)", "Blocked", "Blocked", "Must be explicitly allowed."],
            ["Other projects", "Blocked", "Blocked", "Requires external-directory tool with explicit approval."],
          ]}
        />

        <DocsH3>External Directory Access</DocsH3>
        <DocsParagraph>
          The external-directory tool lets the agent access files outside your project root. This
          requires explicit approval and is used when the agent needs to read configuration files,
          reference other projects, or access shared resources.
        </DocsParagraph>
        <DocsCode>{`# The agent requests access to an external directory
external-directory path="/Users/you/other-project/src/shared"

# A permission card appears for you to approve or deny`}</DocsCode>

        <DocsCallout type="warning">
          Be cautious when approving external directory access. The agent can read (and potentially
          write to) any path you approve. Only grant access to directories you trust the agent with.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="network-policies" title="Network Policies">
        <DocsParagraph>
          Network policies control whether the agent can make outbound connections. This affects
          web tools (websearch, webfetch), package managers that download from the internet, and
          shell commands that access external services.
        </DocsParagraph>

        <DocsH3>Policy Options</DocsH3>
        <DocsTable
          headers={["Policy", "Behavior", "Use Case"]}
          rows={[
            ["Allow all", "No restrictions on outbound connections.", "Development environments where the agent needs full internet access."],
            ["Allow specific hosts", "Only connections to approved domains succeed.", "Environments that restrict internet access to specific services."],
            ["Block all", "No outbound connections permitted.", "Air-gapped environments, compliance-restricted projects, offline development."],
          ]}
        />

        <DocsParagraph>
          Network policies interact with the sandbox. When sandbox mode restricts network access,
          shell commands cannot bypass the restriction even if the tool permission is set to allow.
        </DocsParagraph>

        <DocsH3>Configuration</DocsH3>
        <DocsCode lines>{`{
  "sandbox": {
    "network": {
      "policy": "allow_specific",
      "allowedHosts": [
        "registry.npmjs.org",
        "github.com",
        "api.github.com"
      ]
    }
  }
}`}</DocsCode>
      </DocsSection>

      <DocsSection id="git-secret-scanner" title="Git Secret Scanner">
        <DocsParagraph>
          The git secret scanner automatically inspects staged changes for accidentally committed
          secrets before they reach your repository. It detects a wide range of secret patterns
          including API keys, tokens, private keys, and connection strings.
        </DocsParagraph>

        <DocsH3>Detection Patterns</DocsH3>
        <DocsTable
          headers={["Type", "Example Pattern"]}
          rows={[
            ["AWS keys", "AKIA followed by 16 alphanumeric characters"],
            ["GitHub tokens", "ghp_, gho_, ghs_, ghr_ prefixed strings"],
            ["Stripe keys", "sk_live_ or sk_test_ prefixed strings"],
            ["Private keys", "-----BEGIN RSA PRIVATE KEY-----"],
            ["JWT tokens", "eyJ followed by base64-encoded content"],
            ["Database URLs", "Connection strings with embedded passwords (postgres://, mysql://, mongodb://)"],
            ["Generic secrets", "High-entropy strings assigned to variables named 'secret', 'key', 'token', 'password'"],
          ]}
        />

        <DocsH3>What Happens on Detection</DocsH3>
        <DocsList
          items={[
            "The scanner blocks the commit from proceeding.",
            "A detailed report shows which file, line, and secret type was detected.",
            "The agent suggests removing the secret and using environment variables or a secrets manager.",
            "False positives can be dismissed, but the decision is logged.",
          ]}
        />

        <DocsCallout type="tip">
          If the scanner triggers a false positive on a test fixture or example value, you can add
          an inline comment to suppress the detection for that specific line.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="permission-system" title="Permission System">
        <DocsParagraph>
          The permission system is the primary user-facing security control. It determines whether
          each tool call runs automatically, requires your approval, or is blocked entirely.
        </DocsParagraph>

        <DocsH3>Permission Levels</DocsH3>
        <DocsTable
          headers={["Level", "Behavior", "When to Use"]}
          rows={[
            ["allow", "Tool runs immediately without prompting.", "Read-only tools, trusted operations, or when you want uninterrupted flow."],
            ["ask", "A permission card appears. You must approve each invocation.", "Default for most tools. Review each action before it happens."],
            ["deny", "Tool is completely blocked. The agent cannot use it.", "Disable tools that should never run in a specific project."],
          ]}
        />

        <DocsH3>Configuring Permissions</DocsH3>
        <DocsParagraph>
          Permissions are set in creor.json at the project root. You can configure permissions
          per tool or set a global default.
        </DocsParagraph>
        <DocsCode lines>{`{
  "permissions": {
    "*": "ask",
    "read": "allow",
    "glob": "allow",
    "grep": "allow",
    "ls": "allow",
    "bash": "ask",
    "write": "ask",
    "edit": "ask",
    "websearch": "allow",
    "webfetch": "allow"
  }
}`}</DocsCode>

        <DocsH3>Permission Prompts</DocsH3>
        <DocsParagraph>
          When a tool has &quot;ask&quot; permission, a permission card appears in the chat timeline showing
          the tool name, parameters, and a description of what the tool will do. You can approve
          the action, deny it, or approve it for the rest of the session.
        </DocsParagraph>

        <DocsTable
          headers={["Action", "Effect"]}
          rows={[
            ["Approve", "The tool runs once. The next call will prompt again."],
            ["Approve for session", "The tool runs and all future calls to this tool in this session are auto-approved."],
            ["Deny", "The tool does not run. The agent is informed and may try an alternative approach."],
          ]}
        />
      </DocsSection>

      <DocsSection id="best-practices" title="Best Practices">
        <DocsH3>Start with Ask, Relax as Needed</DocsH3>
        <DocsParagraph>
          Begin with the default &quot;ask&quot; permission for all tools. As you build trust with the agent's
          behavior on your project, selectively switch frequently-used tools to &quot;allow&quot;.
        </DocsParagraph>

        <DocsH3>Keep Secrets Out of Source Files</DocsH3>
        <DocsList
          items={[
            "Use environment variables for all secrets and API keys.",
            "Add .env files to your .gitignore.",
            "Never hardcode secrets in source files, even in comments or test fixtures.",
            "Use a secrets manager (AWS Secrets Manager, HashiCorp Vault, etc.) for production secrets.",
          ]}
        />

        <DocsH3>Review Agent-Generated Code</DocsH3>
        <DocsParagraph>
          The agent writes code that works, but always review it for security implications. Check
          for proper input validation, SQL injection prevention, authentication checks, and secure
          defaults.
        </DocsParagraph>

        <DocsH3>Use Sandbox Mode in CI/CD</DocsH3>
        <DocsParagraph>
          When running the agent in automated pipelines, enable sandbox mode with the strictest
          settings appropriate for your environment. Limit filesystem access to only the
          necessary paths and block unnecessary network access.
        </DocsParagraph>

        <DocsH3>Audit Permissions Regularly</DocsH3>
        <DocsList
          items={[
            "Review your creor.json permissions when onboarding new team members.",
            "Tighten permissions when working on security-sensitive code.",
            "Check that no tools are set to 'allow' that should require approval for your threat model.",
            "Consider different permission profiles for different branches or environments.",
          ]}
        />
      </DocsSection>
    </DocsPage>
  );
}
