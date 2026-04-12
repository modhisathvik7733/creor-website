import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import {
  DocsPage,
  DocsSection,
  DocsH3,
  DocsParagraph,
  DocsTable,
  DocsList,
  DocsCallout,
} from "@/components/docs-page";

export const metadata: Metadata = generatePageMetadata({
  title: "Team Management | Creor",
  description:
    "Manage your Creor workspace: invite team members, assign roles, and organize your team for collaborative AI-powered development.",
  path: "/docs/dashboard/team",
});

export default function DashboardTeamPage() {
  return (
    <DocsPage
      breadcrumb="Dashboard & Account"
      title="Team Management"
      description="Creor workspaces support multi-user collaboration. Invite team members, assign roles with appropriate permissions, and manage your organization's access to Creor services."
      toc={[
        { label: "Workspaces", href: "#workspaces" },
        { label: "Roles", href: "#roles" },
        { label: "Inviting Members", href: "#inviting-members" },
        { label: "Managing Members", href: "#managing-members" },
        { label: "Shared Resources", href: "#shared-resources" },
        { label: "FAQ", href: "#faq" },
      ]}
    >
      <DocsSection id="workspaces" title="Workspaces">
        <DocsParagraph>
          A workspace is the top-level organizational unit in Creor. It groups team members,
          API keys, credit balance, cloud agent configurations, and settings under a single
          billing account.
        </DocsParagraph>
        <DocsList
          items={[
            "Every Creor account starts with a personal workspace.",
            "You can create additional workspaces for different teams, projects, or clients.",
            "Each workspace has its own credit balance, API keys, and billing settings.",
            "A user can belong to multiple workspaces with different roles in each.",
          ]}
        />

        <DocsH3>Creating a Workspace</DocsH3>
        <DocsList
          items={[
            "Go to Dashboard > Workspaces (in the top-left dropdown).",
            "Click \"Create Workspace\".",
            "Enter a name and optional description.",
            "Select a plan for the workspace (each workspace has its own subscription).",
            "You become the owner of the new workspace.",
          ]}
        />
      </DocsSection>

      <DocsSection id="roles" title="Roles">
        <DocsParagraph>
          Roles control what members can do within a workspace. Assign the minimum role
          necessary for each member&apos;s responsibilities.
        </DocsParagraph>
        <DocsTable
          headers={["Permission", "Owner", "Admin", "Member"]}
          rows={[
            ["Use gateway inference", "Yes", "Yes", "Yes"],
            ["Launch cloud agents", "Yes", "Yes", "Yes"],
            ["View usage analytics", "Yes", "Yes", "Yes"],
            ["Create API keys", "Yes", "Yes", "No"],
            ["Manage cloud agent settings", "Yes", "Yes", "No"],
            ["Invite members", "Yes", "Yes", "No"],
            ["Remove members", "Yes", "Yes", "No"],
            ["Change member roles", "Yes", "Yes (except owner)", "No"],
            ["Manage billing & subscription", "Yes", "No", "No"],
            ["Delete workspace", "Yes", "No", "No"],
            ["Transfer ownership", "Yes", "No", "No"],
          ]}
        />

        <DocsH3>Role Details</DocsH3>
        <DocsList
          items={[
            "Owner: Full control over the workspace, including billing, plan changes, and deletion. Only one owner per workspace.",
            "Admin: Can manage team members, API keys, and agent settings. Cannot access billing or delete the workspace.",
            "Member: Can use Creor services (gateway, cloud agents) but cannot manage team settings or create API keys.",
          ]}
        />
        <DocsCallout type="info">
          Ownership can be transferred to another member from Dashboard &gt; Settings &gt;
          General &gt; Transfer Ownership. The previous owner is demoted to Admin.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="inviting-members" title="Inviting Members">
        <DocsParagraph>
          Invite team members by email. They will receive an invitation link to join the
          workspace.
        </DocsParagraph>

        <DocsH3>How to Invite</DocsH3>
        <DocsList
          items={[
            "Go to Dashboard > Team.",
            "Click \"Invite Member\".",
            "Enter the email address and select a role (Admin or Member).",
            "Click \"Send Invitation\".",
            "The invitee receives an email with a link to accept the invitation.",
          ]}
        />

        <DocsH3>Invitation States</DocsH3>
        <DocsTable
          headers={["State", "Meaning", "Action"]}
          rows={[
            ["Pending", "Invitation sent, not yet accepted", "Resend or cancel the invitation."],
            ["Accepted", "Member has joined the workspace", "No action needed."],
            ["Expired", "Invitation expired after 7 days", "Send a new invitation."],
            ["Declined", "Invitee declined the invitation", "Send a new invitation if needed."],
          ]}
        />
        <DocsParagraph>
          Invitations expire after 7 days. You can resend an expired invitation from the
          Team page -- it generates a new link and resets the expiration.
        </DocsParagraph>

        <DocsH3>Plan Limits</DocsH3>
        <DocsTable
          headers={["Plan", "Max Members"]}
          rows={[
            ["Free", "1 (owner only)"],
            ["Starter", "5"],
            ["Pro", "Unlimited"],
            ["BYOK", "5"],
          ]}
        />
        <DocsCallout type="tip">
          If you need more members than your plan allows, upgrade your plan or contact sales
          for custom team pricing.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="managing-members" title="Managing Members">
        <DocsParagraph>
          Manage existing team members from the Dashboard &gt; Team page.
        </DocsParagraph>

        <DocsH3>Changing Roles</DocsH3>
        <DocsParagraph>
          Owners and Admins can change a member&apos;s role. Click the role dropdown next to
          the member&apos;s name and select the new role. The change takes effect immediately.
        </DocsParagraph>

        <DocsH3>Removing Members</DocsH3>
        <DocsList
          items={[
            "Click the three-dot menu next to the member's name.",
            "Select \"Remove from workspace\".",
            "Confirm the removal.",
            "The member loses access immediately. Their IDE-created API keys are revoked.",
            "Any cloud agent runs they launched continue to completion but new runs cannot be started.",
          ]}
        />

        <DocsH3>Viewing Member Activity</DocsH3>
        <DocsParagraph>
          The Team page shows each member&apos;s last active date, total credits consumed, and
          number of requests. Use this to identify inactive members or understand how usage
          is distributed across the team.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="shared-resources" title="Shared Resources">
        <DocsParagraph>
          All workspace members share the following resources.
        </DocsParagraph>
        <DocsList
          items={[
            "Credit balance: all members draw from the same pool. Set per-member spending limits in Settings > Spending Limits.",
            "Cloud agent configurations: Bugbot, webhook settings, and repository connections are workspace-wide.",
            "Usage analytics: all members can view the workspace's usage data.",
            "MCP servers: installed marketplace servers are available to all members.",
          ]}
        />
        <DocsParagraph>
          API keys are not shared. Each member creates their own keys (Admins+) or uses their
          IDE auto-created key.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="faq" title="FAQ">
        <DocsH3>Can a member belong to multiple workspaces?</DocsH3>
        <DocsParagraph>
          Yes. A user can be a member of unlimited workspaces. Switch between workspaces
          using the dropdown in the top-left corner of the dashboard, or in the IDE via
          Settings &gt; Account &gt; Active Workspace.
        </DocsParagraph>

        <DocsH3>What happens when a member leaves the workspace?</DocsH3>
        <DocsParagraph>
          Their API keys are revoked and their IDE will stop using the workspace&apos;s credits.
          Their past usage data is retained in the workspace analytics.
        </DocsParagraph>

        <DocsH3>Can I set per-member spending limits?</DocsH3>
        <DocsParagraph>
          Yes. Go to Dashboard &gt; Settings &gt; Spending Limits &gt; Per-Member Limits.
          Set a monthly credit cap per member. When a member hits their limit, their requests
          are paused until the next billing cycle.
        </DocsParagraph>
      </DocsSection>
    </DocsPage>
  );
}
