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
} from "@/components/docs-page";

export const metadata: Metadata = generatePageMetadata({
  title: "API Keys | Creor",
  description:
    "Create, manage, and revoke API keys for the Creor API and cloud agents. Key scopes, usage tracking, and security.",
  path: "/docs/dashboard/keys",
});

export default function DashboardKeysPage() {
  return (
    <DocsPage
      breadcrumb="Dashboard & Account"
      title="API Keys"
      description="API keys authenticate your applications, scripts, and integrations with the Creor API. Manage keys from the dashboard with full control over scopes, usage tracking, and revocation."
      toc={[
        { label: "Creating Keys", href: "#creating-keys" },
        { label: "IDE Auto-Created Keys", href: "#ide-keys" },
        { label: "Key Scopes", href: "#key-scopes" },
        { label: "Usage Tracking", href: "#usage-tracking" },
        { label: "Revoking Keys", href: "#revoking-keys" },
        { label: "Security Best Practices", href: "#security" },
      ]}
    >
      <DocsSection id="creating-keys" title="Creating Keys">
        <DocsParagraph>
          Create API keys from the dashboard to authenticate API requests, launch cloud agents,
          or integrate Creor into your CI/CD pipeline.
        </DocsParagraph>
        <DocsList
          items={[
            "Go to Dashboard > Settings > API Keys.",
            "Click \"Create Key\".",
            "Enter a descriptive name (e.g., \"ci-pipeline-prod\", \"cloud-agents-staging\").",
            "Select the key scope (see Key Scopes below).",
            "Optionally set an expiration date.",
            "Click \"Create\" and copy the key immediately.",
          ]}
        />
        <DocsCallout type="warning">
          The full API key is shown only once at creation time. If you lose it, you will need
          to create a new key. Store it securely in a secrets manager or environment variable.
        </DocsCallout>

        <DocsH3>Key Format</DocsH3>
        <DocsParagraph>
          Creor API keys follow a consistent format that makes them easy to identify and rotate.
        </DocsParagraph>
        <DocsCode>{`cr_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxx   # Production key
cr_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxx   # Test/staging key`}</DocsCode>
        <DocsParagraph>
          The prefix indicates the environment. Test keys work with the staging API and do not
          consume real credits.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="ide-keys" title="IDE Auto-Created Keys">
        <DocsParagraph>
          When you sign into Creor from the IDE for the first time, a key is automatically
          created for that device. This key is used to authenticate the engine&apos;s API
          requests to the Creor Gateway.
        </DocsParagraph>
        <DocsList
          items={[
            "Auto-created keys are named after your device (e.g., \"MacBook Pro - Creor IDE\").",
            "They have \"IDE\" scope, which includes gateway inference and basic API access.",
            "One key is created per device. Signing in again on the same device reuses the existing key.",
            "Auto-created keys appear in the API Keys list and can be revoked like any other key.",
          ]}
        />
        <DocsCallout type="info">
          IDE keys are stored securely in your operating system&apos;s keychain (macOS Keychain,
          Windows Credential Manager, or Linux Secret Service). They are never written to disk
          in plain text.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="key-scopes" title="Key Scopes">
        <DocsParagraph>
          Scopes control what an API key can access. Follow the principle of least privilege --
          give each key only the permissions it needs.
        </DocsParagraph>
        <DocsTable
          headers={["Scope", "Permissions", "Use Case"]}
          rows={[
            ["IDE", "Gateway inference, provider list, session management", "Automatically assigned to IDE-created keys."],
            ["Cloud Agents", "Launch, manage, and monitor cloud agent runs", "CI/CD pipelines, automated workflows."],
            ["Gateway", "Gateway inference only (no agent or dashboard access)", "Custom applications using the Creor LLM gateway."],
            ["Admin", "Full API access including team management and billing", "Workspace administration scripts."],
            ["Full Access", "All permissions combined", "Development and testing only. Avoid in production."],
          ]}
        />
        <DocsParagraph>
          You can combine scopes by selecting multiple when creating a key. For example, a key
          with &quot;Cloud Agents&quot; + &quot;Gateway&quot; scopes can launch agents and make
          inference calls but cannot manage team members or billing.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="usage-tracking" title="Usage Tracking">
        <DocsParagraph>
          Every API key has usage statistics accessible from the dashboard.
        </DocsParagraph>
        <DocsTable
          headers={["Metric", "Description"]}
          rows={[
            ["Total requests", "Number of API calls made with this key."],
            ["Last used", "Timestamp of the most recent request."],
            ["Tokens consumed", "Total input + output tokens through gateway inference."],
            ["Credits consumed", "Total credits spent via this key."],
            ["Agent runs", "Number of cloud agent runs launched with this key."],
          ]}
        />
        <DocsParagraph>
          Usage data is updated in near real-time and visible on the key detail page. Use this
          to identify unused keys (candidates for revocation) and high-usage keys (candidates
          for monitoring or rate limiting).
        </DocsParagraph>
        <DocsCode lines>{`# Check key usage via API
curl https://api.creor.ai/v1/keys/key_abc123/usage \\
  -H "Authorization: Bearer $CREOR_ADMIN_KEY"

# Response
{
  "keyId": "key_abc123",
  "name": "ci-pipeline-prod",
  "totalRequests": 4521,
  "lastUsed": "2026-04-12T08:30:00Z",
  "tokensConsumed": { "input": 12500000, "output": 890000 },
  "creditsConsumed": 342.50,
  "agentRuns": 87
}`}</DocsCode>
      </DocsSection>

      <DocsSection id="revoking-keys" title="Revoking Keys">
        <DocsParagraph>
          Revoke a key immediately if it has been exposed, is no longer needed, or if you
          suspect unauthorized use.
        </DocsParagraph>
        <DocsList
          items={[
            "Go to Dashboard > Settings > API Keys.",
            "Find the key you want to revoke.",
            "Click the three-dot menu and select \"Revoke\".",
            "Confirm the revocation. This takes effect immediately.",
          ]}
        />
        <DocsParagraph>
          Revoked keys cannot be restored. Any application or service using a revoked key will
          receive a 401 Unauthorized response on its next request. Create a new key to replace it.
        </DocsParagraph>
        <DocsCallout type="warning">
          Revoking an IDE auto-created key will sign you out of the IDE&apos;s gateway access.
          You will need to sign in again from the IDE to create a new key.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="security" title="Security Best Practices">
        <DocsList
          items={[
            "Use the narrowest scope possible. A CI pipeline that only launches cloud agents does not need Admin scope.",
            "Set expiration dates on keys used for temporary access or time-limited integrations.",
            "Rotate keys periodically. Create a new key, update your integrations, then revoke the old key.",
            "Never commit API keys to version control. Use environment variables or a secrets manager.",
            "Monitor the \"Last used\" timestamp. Keys that have not been used in 90+ days are candidates for revocation.",
            "Use separate keys for separate environments (production, staging, development).",
            "Enable the low-balance alert to detect unexpected credit consumption, which may indicate a compromised key.",
          ]}
        />
      </DocsSection>
    </DocsPage>
  );
}
