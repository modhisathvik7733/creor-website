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
  title: "Marketplace | Creor",
  description:
    "Browse, install, and manage MCP servers from the Creor marketplace. Extend agent capabilities with community-built tools.",
  path: "/docs/dashboard/marketplace",
});

export default function DashboardMarketplacePage() {
  return (
    <DocsPage
      breadcrumb="Dashboard & Account"
      title="Marketplace"
      description="The Creor Marketplace is a directory of MCP (Model Context Protocol) servers that extend the agent's capabilities. Install servers to give the agent access to new tools like database queries, cloud APIs, design systems, and more."
      toc={[
        { label: "What Is the Marketplace", href: "#what-is-marketplace" },
        { label: "Browsing Servers", href: "#browsing" },
        { label: "Installing Servers", href: "#installing" },
        { label: "Managing Servers", href: "#managing" },
        { label: "Featured Servers", href: "#featured" },
        { label: "Publishing", href: "#publishing" },
      ]}
    >
      <DocsSection id="what-is-marketplace" title="What Is the Marketplace">
        <DocsParagraph>
          MCP servers are lightweight services that expose tools to the Creor agent via the
          Model Context Protocol. Each server provides one or more tools that the agent can
          call during a conversation -- for example, a Supabase server provides tools to
          query databases, manage tables, and deploy edge functions.
        </DocsParagraph>
        <DocsParagraph>
          The Marketplace is a curated directory of community-built and officially maintained
          MCP servers. You can browse available servers, install them to your workspace with
          one click, and manage their configuration from the dashboard.
        </DocsParagraph>
        <DocsCallout type="info">
          MCP servers run locally alongside the Creor engine. They are not cloud services.
          When you install a server, the engine downloads and starts it as a subprocess.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="browsing" title="Browsing Servers">
        <DocsParagraph>
          Access the Marketplace from Dashboard &gt; Marketplace or from the IDE via
          Settings &gt; Tools &amp; MCP &gt; Browse Marketplace.
        </DocsParagraph>

        <DocsH3>Search and Filter</DocsH3>
        <DocsList
          items={[
            "Search by name, description, or tool name (e.g., \"database\", \"slack\", \"github\").",
            "Filter by category: Databases, Cloud, DevOps, Productivity, Communication, Design, Analytics.",
            "Sort by: popularity (installs), rating, recently updated, or alphabetical.",
            "View tags for quick filtering (e.g., \"official\", \"community\", \"beta\").",
          ]}
        />

        <DocsH3>Server Detail Page</DocsH3>
        <DocsParagraph>
          Each server has a detail page showing:
        </DocsParagraph>
        <DocsList
          items={[
            "Description and screenshots.",
            "List of tools provided with parameter schemas.",
            "Configuration requirements (API keys, environment variables).",
            "Install count, rating, and reviews.",
            "Author information and source code link.",
            "Version history and changelog.",
          ]}
        />
      </DocsSection>

      <DocsSection id="installing" title="Installing Servers">
        <DocsParagraph>
          Install a server from its detail page or from the search results.
        </DocsParagraph>

        <DocsH3>One-Click Install</DocsH3>
        <DocsList
          items={[
            "Click \"Install\" on the server's card or detail page.",
            "If the server requires configuration (API keys, etc.), a setup form appears.",
            "Enter the required configuration values.",
            "Click \"Activate\" to start the server.",
            "The server's tools are now available to the agent in your next conversation.",
          ]}
        />

        <DocsH3>Manual Install via creor.json</DocsH3>
        <DocsParagraph>
          You can also install servers by adding them to your project&apos;s creor.json file.
          This is useful for team-wide configurations that should be version-controlled.
        </DocsParagraph>
        <DocsCode lines>{`{
  "mcp": {
    "servers": {
      "supabase": {
        "command": "npx",
        "args": ["-y", "@creor/mcp-supabase"],
        "env": {
          "SUPABASE_URL": "$SUPABASE_URL",
          "SUPABASE_KEY": "$SUPABASE_KEY"
        }
      },
      "github": {
        "command": "npx",
        "args": ["-y", "@creor/mcp-github"],
        "env": {
          "GITHUB_TOKEN": "$GITHUB_TOKEN"
        }
      }
    }
  }
}`}</DocsCode>
        <DocsCallout type="tip">
          Use environment variable references ($VAR_NAME) in creor.json instead of hardcoded
          values. This lets you check the configuration into version control safely while each
          team member uses their own credentials.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="managing" title="Managing Servers">
        <DocsParagraph>
          Manage installed servers from Dashboard &gt; Marketplace &gt; Installed or from the
          IDE settings.
        </DocsParagraph>

        <DocsH3>Server Status</DocsH3>
        <DocsTable
          headers={["Status", "Meaning", "Action"]}
          rows={[
            ["Running", "Server is active and tools are available", "No action needed."],
            ["Stopped", "Server is installed but not running", "Click \"Start\" to activate."],
            ["Error", "Server failed to start or crashed", "Check logs. Common causes: missing config, port conflict."],
            ["Update available", "A newer version is published", "Click \"Update\" to install the latest version."],
          ]}
        />

        <DocsH3>Configuration</DocsH3>
        <DocsParagraph>
          Update a server&apos;s configuration from its settings page. Changes take effect after
          restarting the server.
        </DocsParagraph>

        <DocsH3>Uninstalling</DocsH3>
        <DocsList
          items={[
            "Click the three-dot menu on the installed server.",
            "Select \"Uninstall\".",
            "Confirm the removal. The server process is stopped and its tools are no longer available.",
            "Configuration data is retained for 30 days in case you reinstall.",
          ]}
        />
      </DocsSection>

      <DocsSection id="featured" title="Featured Servers">
        <DocsParagraph>
          These are some of the most popular MCP servers available in the Marketplace.
        </DocsParagraph>
        <DocsTable
          headers={["Server", "Tools", "Description"]}
          rows={[
            ["Supabase", "execute_sql, apply_migration, list_tables, deploy_edge_function", "Full Supabase management from the agent."],
            ["GitHub", "create_issue, create_pr, list_repos, search_code", "GitHub operations without leaving the editor."],
            ["Slack", "send_message, list_channels, search_messages", "Send Slack messages and search channel history."],
            ["Notion", "search, create_page, update_page, get_comments", "Read and write Notion pages and databases."],
            ["PostgreSQL", "query, list_tables, describe_table, explain", "Direct PostgreSQL database access."],
            ["Sentry", "list_issues, get_issue, resolve_issue", "View and manage Sentry error reports."],
            ["Figma", "get_file, get_components, export_images", "Read Figma designs for implementation reference."],
            ["Linear", "list_issues, create_issue, update_issue", "Manage Linear project issues."],
          ]}
        />
      </DocsSection>

      <DocsSection id="publishing" title="Publishing">
        <DocsParagraph>
          Publish your own MCP servers to the Marketplace to share tools with the Creor
          community.
        </DocsParagraph>

        <DocsH3>Requirements</DocsH3>
        <DocsList
          items={[
            "Server must implement the MCP protocol (see docs.creor.ai/mcp for the spec).",
            "Must include a manifest file (mcp-server.json) with name, description, tools, and configuration schema.",
            "Must be published as an npm package, Docker image, or standalone binary.",
            "Must include a README with setup instructions and tool documentation.",
            "Source code link is required. Closed-source servers are labeled accordingly.",
          ]}
        />

        <DocsH3>Submission Process</DocsH3>
        <DocsList
          items={[
            "Go to Dashboard > Marketplace > Publish.",
            "Enter the package name or repository URL.",
            "The system validates the manifest and tests tool definitions.",
            "Submit for review. The Creor team reviews for quality and security (typically 1-3 business days).",
            "Once approved, the server appears in the Marketplace.",
          ]}
        />
      </DocsSection>
    </DocsPage>
  );
}
