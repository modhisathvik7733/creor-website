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
  title: "Cloud Agents Security & Network | Creor",
  description:
    "Network isolation, sandboxing, data handling, and security architecture for Creor cloud agents.",
  path: "/docs/cloud-agents/security-network",
});

export default function CloudAgentsSecurityPage() {
  return (
    <DocsPage
      breadcrumb="Cloud Agents"
      title="Security & Network"
      description="Cloud agents run in isolated, sandboxed environments with strict network controls. This page details the security architecture, data handling policies, and compliance posture."
      toc={[
        { label: "Sandboxing", href: "#sandboxing" },
        { label: "Network Isolation", href: "#network-isolation" },
        { label: "Data Handling", href: "#data-handling" },
        { label: "Authentication & Access", href: "#authentication" },
        { label: "Compliance", href: "#compliance" },
        { label: "Security FAQ", href: "#security-faq" },
      ]}
    >
      <DocsSection id="sandboxing" title="Sandboxing">
        <DocsParagraph>
          Each cloud agent run executes inside a dedicated, ephemeral container with strict
          resource and access controls. No two agent runs share a container.
        </DocsParagraph>

        <DocsH3>Container Isolation</DocsH3>
        <DocsList
          items={[
            "Dedicated container: each run gets its own container with an isolated filesystem, process namespace, and network stack.",
            "No persistence: the container and all its contents are destroyed when the run completes or times out.",
            "Resource limits: CPU, memory, and disk are capped per container to prevent abuse. Defaults: 2 vCPU, 4 GB RAM, 10 GB disk.",
            "No privilege escalation: containers run as a non-root user with no sudo access.",
            "Read-only system: the base filesystem is read-only. Only the workspace directory and /tmp are writable.",
          ]}
        />

        <DocsH3>Shell Restrictions</DocsH3>
        <DocsParagraph>
          The bash tool inside cloud agents runs in a restricted shell environment.
        </DocsParagraph>
        <DocsTable
          headers={["Allowed", "Blocked"]}
          rows={[
            ["File operations (cat, ls, cp, mv, rm within workspace)", "Network tools (curl, wget, ssh, nc)"],
            ["Git operations (read-only: log, diff, blame, show)", "Git push, git remote operations"],
            ["Build tools (npm, bun, cargo, go, make)", "Package installation from registries (blocked by network)"],
            ["Test runners (vitest, jest, pytest, go test)", "Docker, container management"],
            ["Text processing (grep, sed, awk, jq)", "System administration (systemctl, mount)"],
          ]}
        />
        <DocsCallout type="info">
          Build tools are available, but package installation commands will fail because outbound
          network access is blocked. Pre-install dependencies by committing a lock file and
          node_modules (or equivalent) to your repository, or use a custom Docker image.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="network-isolation" title="Network Isolation">
        <DocsParagraph>
          Cloud agent containers have no outbound internet access by default. This prevents
          data exfiltration and reduces the attack surface.
        </DocsParagraph>

        <DocsH3>Network Policy</DocsH3>
        <DocsTable
          headers={["Direction", "Policy", "Details"]}
          rows={[
            ["Outbound to internet", "Blocked", "No HTTP, HTTPS, DNS, or raw socket access to external hosts."],
            ["Outbound to Creor API", "Allowed", "Agent communicates with the Creor API for LLM inference and status reporting."],
            ["Outbound to Git provider", "Allowed (read-only)", "Clone and fetch operations for the configured repository."],
            ["Inbound", "Blocked", "No inbound connections accepted. Container is not addressable."],
            ["Inter-container", "Blocked", "No container-to-container communication."],
          ]}
        />

        <DocsH3>Custom Network Rules (Enterprise)</DocsH3>
        <DocsParagraph>
          Enterprise plan customers can configure custom network allow lists to permit access
          to specific internal endpoints (e.g., private package registries or internal APIs).
        </DocsParagraph>
        <DocsCode lines>{`# Enterprise network allow list (configured via dashboard)
{
  "networkAllowList": [
    "registry.internal.acme.com:443",
    "api.internal.acme.com:443",
    "npm.pkg.github.com:443"
  ]
}`}</DocsCode>
      </DocsSection>

      <DocsSection id="data-handling" title="Data Handling">
        <DocsParagraph>
          Creor takes a minimal-data approach to cloud agent execution. Here is what happens
          to your code at each stage.
        </DocsParagraph>

        <DocsH3>During Execution</DocsH3>
        <DocsList
          items={[
            "Repository is cloned into the ephemeral container. The clone exists only in memory and on the container's temporary disk.",
            "Code chunks are sent to the LLM provider for inference. These are processed in real time and not stored by Creor.",
            "Tool call inputs and outputs are logged for the duration of the run to support status reporting and artifact collection.",
          ]}
        />

        <DocsH3>After Execution</DocsH3>
        <DocsList
          items={[
            "Container and all file contents are destroyed immediately.",
            "Agent run metadata (status, timing, token counts) is retained for 90 days for billing and analytics.",
            "Artifacts (diffs, reports) are stored encrypted and retained for 30 days or until you delete them.",
            "Full conversation logs are retained for 7 days for debugging, then deleted.",
          ]}
        />

        <DocsH3>What Creor Does Not Store</DocsH3>
        <DocsList
          items={[
            "Full repository contents beyond the agent run.",
            "Your API keys, secrets, or credentials found in the repository.",
            "LLM conversation history beyond the 7-day debugging window.",
            "File contents from files the agent read but did not include in artifacts.",
          ]}
        />
        <DocsCallout type="warning">
          While Creor does not intentionally store your code, the LLM provider processes code
          snippets during inference. Review your LLM provider&apos;s data handling policy. When
          using the Creor Gateway, inference data is not used for training.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="authentication" title="Authentication & Access">
        <DocsParagraph>
          Cloud agents authenticate using your workspace&apos;s API key and the Git provider
          integration you configured.
        </DocsParagraph>
        <DocsTable
          headers={["Component", "Authentication", "Permissions"]}
          rows={[
            ["Creor API", "API key (Bearer token)", "Scoped to workspace. Cannot access other workspaces."],
            ["GitHub", "Creor GitHub App (OAuth)", "Repository access as configured. Read + write for PR comments."],
            ["GitLab", "Personal access token", "Scoped by token permissions."],
            ["Bitbucket", "App password", "Scoped by app password permissions."],
            ["LLM provider", "Workspace credentials", "Managed by Creor. Agent does not see raw API keys."],
          ]}
        />
        <DocsParagraph>
          API keys have configurable scopes. A key with &quot;Cloud Agents&quot; scope can only
          launch and manage agent runs -- it cannot access billing, team management, or other
          dashboard features.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="compliance" title="Compliance">
        <DocsParagraph>
          Creor&apos;s cloud infrastructure is designed to meet common compliance requirements.
        </DocsParagraph>
        <DocsTable
          headers={["Standard", "Status", "Details"]}
          rows={[
            ["SOC 2 Type II", "In progress", "Audit expected to complete Q3 2026."],
            ["GDPR", "Compliant", "EU data processing agreement available on request."],
            ["CCPA", "Compliant", "California consumer privacy rights supported."],
            ["HIPAA", "Not yet", "Planned for enterprise tier. Contact sales for timeline."],
            ["Data residency", "US (default)", "EU data residency available for enterprise customers."],
          ]}
        />
        <DocsCallout type="info">
          For the latest compliance documentation and to request a DPA, contact
          security@creor.ai or visit the Trust Center at creor.ai/trust.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="security-faq" title="Security FAQ">
        <DocsH3>Can a cloud agent access my other repositories?</DocsH3>
        <DocsParagraph>
          No. Each agent run is scoped to a single repository. The clone credentials are
          limited to the specific repository and branch you specify.
        </DocsParagraph>

        <DocsH3>Can a cloud agent push commits to my repository?</DocsH3>
        <DocsParagraph>
          No. Cloud agents have read-only Git access. They produce artifacts (diffs, comments)
          that you apply manually. The Bugbot integration posts PR review comments using the
          GitHub API, but it cannot merge, push, or modify branch protection rules.
        </DocsParagraph>

        <DocsH3>Is my code used to train AI models?</DocsH3>
        <DocsParagraph>
          No. Code processed by cloud agents via the Creor Gateway is never used for model
          training. If you use a third-party LLM provider directly (BYOK), check that
          provider&apos;s data policy.
        </DocsParagraph>

        <DocsH3>What happens if a cloud agent encounters a secret in my code?</DocsH3>
        <DocsParagraph>
          The agent includes a secret scanner that detects API keys, passwords, and tokens in
          code. If a secret is found, it is redacted in the agent&apos;s output and flagged as a
          security issue. However, this is best-effort -- use a dedicated secrets manager and
          avoid committing secrets to your repository.
        </DocsParagraph>
      </DocsSection>
    </DocsPage>
  );
}
