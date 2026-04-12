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
  title: "Dashboard Settings | Creor",
  description:
    "Configure workspace settings, user profile, display preferences, and security options in the Creor dashboard.",
  path: "/docs/dashboard/settings",
});

export default function DashboardSettingsPage() {
  return (
    <DocsPage
      breadcrumb="Dashboard & Account"
      title="Settings"
      description="The dashboard settings page controls your workspace configuration, user profile, and security options. Changes here affect the web dashboard and propagate to connected IDE instances."
      toc={[
        { label: "Workspace Settings", href: "#workspace-settings" },
        { label: "User Profile", href: "#user-profile" },
        { label: "Display Preferences", href: "#display-preferences" },
        { label: "Security Settings", href: "#security-settings" },
        { label: "Integrations", href: "#integrations" },
        { label: "Data & Privacy", href: "#data-privacy" },
      ]}
    >
      <DocsSection id="workspace-settings" title="Workspace Settings">
        <DocsParagraph>
          Workspace settings apply to all members of the workspace. Only Owners can change
          these settings.
        </DocsParagraph>
        <DocsTable
          headers={["Setting", "Description", "Default"]}
          rows={[
            ["Workspace name", "Display name shown in the dashboard and workspace picker.", "Set during creation."],
            ["Workspace slug", "URL-safe identifier used in API endpoints and links.", "Auto-generated from name."],
            ["Default model", "The model used when no override is specified.", "Claude Sonnet 4."],
            ["Default agent", "The agent type used for new sessions.", "Build."],
            ["Timezone", "Used for usage analytics, scheduled agents, and billing cycle display.", "UTC."],
          ]}
        />

        <DocsH3>Changing Settings</DocsH3>
        <DocsParagraph>
          Go to Dashboard &gt; Settings &gt; General. Edit the fields you want to change and
          click &quot;Save&quot;. Changes take effect immediately for all workspace members.
        </DocsParagraph>
        <DocsCallout type="info">
          Changing the workspace slug will update all API endpoints and dashboard URLs. Update
          any bookmarks, CI/CD configurations, or scripts that reference the old slug.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="user-profile" title="User Profile">
        <DocsParagraph>
          User profile settings are personal and apply to your account across all workspaces.
        </DocsParagraph>
        <DocsTable
          headers={["Setting", "Description"]}
          rows={[
            ["Display name", "Your name as shown to other workspace members."],
            ["Avatar", "Profile picture. Upload an image or use your GitHub/Google avatar."],
            ["Email", "Your primary email. Used for notifications and invitations."],
            ["Linked accounts", "GitHub and Google accounts linked for sign-in."],
          ]}
        />

        <DocsH3>Changing Your Profile</DocsH3>
        <DocsList
          items={[
            "Go to Dashboard > Settings > Profile.",
            "Update your display name, avatar, or email.",
            "Click \"Save\" to apply changes.",
            "To link or unlink a GitHub/Google account, use the \"Linked Accounts\" section.",
          ]}
        />

        <DocsH3>Avatar</DocsH3>
        <DocsParagraph>
          Upload a custom avatar or choose to use the avatar from your linked GitHub or Google
          account. Avatars are resized to 256x256 pixels and stored as WebP. Supported upload
          formats: PNG, JPG, GIF, WebP (max 2 MB).
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="display-preferences" title="Display Preferences">
        <DocsParagraph>
          Customize how the dashboard looks and behaves.
        </DocsParagraph>
        <DocsTable
          headers={["Setting", "Options", "Default"]}
          rows={[
            ["Theme", "Dark, Light, System", "Dark"],
            ["Date format", "Relative (\"2 hours ago\"), Absolute (\"Apr 12, 2026\")", "Relative"],
            ["Number format", "Compact (\"12.5K\"), Full (\"12,500\")", "Compact"],
            ["Default usage view", "7 days, 30 days, 90 days", "30 days"],
            ["Notifications", "Email, In-app, Both, None", "Both"],
          ]}
        />
        <DocsParagraph>
          Display preferences are stored per-user and do not affect other workspace members.
          Changes take effect immediately without a page reload.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="security-settings" title="Security Settings">
        <DocsParagraph>
          Security settings protect your account and workspace from unauthorized access.
        </DocsParagraph>

        <DocsH3>Sessions</DocsH3>
        <DocsParagraph>
          View all active sessions (browser and IDE) and sign out of any session remotely.
          Go to Dashboard &gt; Settings &gt; Security &gt; Active Sessions.
        </DocsParagraph>
        <DocsList
          items={[
            "Each session shows the device, browser/IDE, IP address, and last active time.",
            "Click \"Sign Out\" next to a session to revoke it immediately.",
            "Click \"Sign Out All Other Sessions\" to revoke all sessions except the current one.",
          ]}
        />

        <DocsH3>Two-Factor Authentication (2FA)</DocsH3>
        <DocsParagraph>
          Enable 2FA for an extra layer of security on your account.
        </DocsParagraph>
        <DocsList
          items={[
            "Go to Dashboard > Settings > Security > Two-Factor Authentication.",
            "Click \"Enable 2FA\".",
            "Scan the QR code with your authenticator app (Google Authenticator, Authy, 1Password, etc.).",
            "Enter the 6-digit code to confirm.",
            "Save the recovery codes in a secure location.",
          ]}
        />
        <DocsCallout type="warning">
          Recovery codes are shown only once. If you lose your authenticator and recovery codes,
          you will need to contact support@creor.ai to regain access to your account.
        </DocsCallout>

        <DocsH3>Audit Log</DocsH3>
        <DocsParagraph>
          The audit log tracks security-relevant events in your workspace. Available on
          Starter, Pro, and Enterprise plans.
        </DocsParagraph>
        <DocsTable
          headers={["Event", "Logged Data"]}
          rows={[
            ["Sign in", "User, IP address, device, timestamp, auth method."],
            ["API key created", "Key name, scope, creator, timestamp."],
            ["API key revoked", "Key name, revoker, timestamp."],
            ["Member invited", "Email, role, inviter, timestamp."],
            ["Member removed", "User, remover, timestamp."],
            ["Role changed", "User, old role, new role, changer, timestamp."],
            ["Settings changed", "Setting name, old value, new value, changer, timestamp."],
          ]}
        />
      </DocsSection>

      <DocsSection id="integrations" title="Integrations">
        <DocsParagraph>
          Manage third-party integrations from Dashboard &gt; Settings &gt; Integrations.
        </DocsParagraph>
        <DocsTable
          headers={["Integration", "Purpose", "Configuration"]}
          rows={[
            ["GitHub", "Repository access for cloud agents, Bugbot", "OAuth via Creor GitHub App."],
            ["GitLab", "Repository access for cloud agents", "Personal access token."],
            ["Bitbucket", "Repository access for cloud agents", "App password."],
            ["Slack", "Notifications for agent runs and alerts", "Slack webhook URL."],
            ["Webhooks", "Custom HTTP notifications", "Endpoint URL + signing secret."],
          ]}
        />
        <DocsParagraph>
          Each integration can be enabled, disabled, or reconfigured independently. Disabling
          an integration does not delete its configuration -- it can be re-enabled later.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="data-privacy" title="Data & Privacy">
        <DocsParagraph>
          Manage your data and privacy preferences.
        </DocsParagraph>

        <DocsH3>Data Export</DocsH3>
        <DocsParagraph>
          Request a full export of your data from Dashboard &gt; Settings &gt; Data &amp;
          Privacy &gt; Export Data. The export includes your profile, usage history, API key
          metadata (not the keys themselves), and cloud agent run logs.
        </DocsParagraph>

        <DocsH3>Account Deletion</DocsH3>
        <DocsList
          items={[
            "To delete your account, go to Dashboard > Settings > Data & Privacy > Delete Account.",
            "This action is irreversible. All your data, API keys, and workspace memberships will be permanently deleted.",
            "If you are the owner of a workspace with other members, transfer ownership before deleting your account.",
            "Purchased credits are forfeited upon account deletion.",
          ]}
        />
        <DocsCallout type="warning">
          Account deletion is permanent. Export your data first if you want to keep a copy.
          Allow up to 30 days for all data to be purged from backups.
        </DocsCallout>
      </DocsSection>
    </DocsPage>
  );
}
