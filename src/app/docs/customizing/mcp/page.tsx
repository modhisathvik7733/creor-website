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
  title: "MCP | Creor",
  description:
    "Connect external tools and services to Creor using the Model Context Protocol (MCP). Configure local and remote MCP servers.",
  path: "/docs/customizing/mcp",
});

export default function McpPage() {
  return (
    <DocsPage
      breadcrumb="Customizing"
      title="MCP"
      description="The Model Context Protocol (MCP) is an open standard for connecting AI models to external tools and data sources. Creor supports both local stdio-based servers and remote HTTP-based servers with OAuth."
      toc={[
        { label: "Overview", href: "#overview" },
        { label: "Local MCP Servers", href: "#local" },
        { label: "Remote MCP Servers", href: "#remote" },
        { label: "Configuration", href: "#configuration" },
        { label: "mcp.json File", href: "#mcp-json" },
        { label: "Server Status", href: "#status" },
        { label: "Marketplace", href: "#marketplace" },
        { label: "Examples", href: "#examples" },
      ]}
    >
      <DocsSection id="overview" title="Overview">
        <DocsParagraph>
          MCP servers expose tools, resources, and prompts that the Creor
          agent can use during conversations. When you configure an MCP
          server, its tools appear alongside Creor&apos;s built-in tools
          and the agent can call them as needed.
        </DocsParagraph>
        <DocsParagraph>
          Creor supports two types of MCP servers:
        </DocsParagraph>
        <DocsList
          items={[
            "Local servers — spawned as child processes, communicating via stdio",
            "Remote servers — accessed over HTTP, with optional OAuth authentication",
          ]}
        />
        <DocsParagraph>
          MCP servers are configured in the <code>mcp</code> section of your{" "}
          <code>creor.json</code> or in a standalone <code>mcp.json</code>{" "}
          file.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="local" title="Local MCP Servers">
        <DocsParagraph>
          Local servers run as child processes on your machine. Creor spawns
          them with the specified command and communicates via stdin/stdout
          using the MCP stdio transport.
        </DocsParagraph>
        <DocsCode lines>{`{
  "mcp": {
    "github": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-github"],
      "environment": {
        "GITHUB_TOKEN": "ghp_your_token_here"
      }
    }
  }
}`}</DocsCode>

        <DocsH3>Local Server Config</DocsH3>
        <DocsTable
          headers={["Field", "Type", "Description"]}
          rows={[
            ["type", "\"local\"", "Must be \"local\" for stdio-based servers"],
            ["command", "string[]", "Command and arguments to spawn the server process"],
            ["environment", "Record<string, string>", "Environment variables passed to the server process"],
            ["enabled", "boolean", "Set to false to disable without removing (default: true)"],
            ["timeout", "number", "Request timeout in milliseconds (default: 5000)"],
          ]}
        />

        <DocsParagraph>
          The <code>command</code> array is executed directly — the first
          element is the binary and the rest are arguments. Common patterns:
        </DocsParagraph>
        <DocsCode lines>{`// npx to run an npm package
"command": ["npx", "-y", "@modelcontextprotocol/server-github"]

// Python server
"command": ["python", "-m", "mcp_server_sqlite", "--db-path", "./data.db"]

// Docker container
"command": ["docker", "run", "-i", "--rm", "mcp/fetch"]

// Local binary
"command": ["/usr/local/bin/my-mcp-server", "--port", "0"]`}</DocsCode>
      </DocsSection>

      <DocsSection id="remote" title="Remote MCP Servers">
        <DocsParagraph>
          Remote servers are accessed over HTTP using the Streamable HTTP
          transport. They can optionally require OAuth authentication.
        </DocsParagraph>
        <DocsCode lines>{`{
  "mcp": {
    "linear": {
      "type": "remote",
      "url": "https://mcp.linear.app/sse",
      "oauth": {
        "clientId": "your-client-id",
        "scope": "read write"
      }
    }
  }
}`}</DocsCode>

        <DocsH3>Remote Server Config</DocsH3>
        <DocsTable
          headers={["Field", "Type", "Description"]}
          rows={[
            ["type", "\"remote\"", "Must be \"remote\" for HTTP-based servers"],
            ["url", "string", "URL of the remote MCP server endpoint"],
            ["enabled", "boolean", "Set to false to disable without removing (default: true)"],
            ["headers", "Record<string, string>", "Custom HTTP headers to include with requests"],
            ["oauth", "object | false", "OAuth config, or false to disable OAuth auto-detection"],
            ["timeout", "number", "Request timeout in milliseconds (default: 5000)"],
          ]}
        />

        <DocsH3>OAuth Configuration</DocsH3>
        <DocsParagraph>
          When a remote server requires OAuth, Creor handles the
          authorization flow automatically. It opens a browser for the user
          to authenticate, receives the callback, and stores tokens securely.
        </DocsParagraph>
        <DocsTable
          headers={["Field", "Type", "Description"]}
          rows={[
            ["clientId", "string", "OAuth client ID. If omitted, dynamic client registration (RFC 7591) is attempted."],
            ["clientSecret", "string", "OAuth client secret (if required by the authorization server)"],
            ["scope", "string", "OAuth scopes to request during authorization"],
          ]}
        />
        <DocsParagraph>
          Set <code>oauth: false</code> to explicitly disable OAuth
          auto-detection for servers that don&apos;t require authentication:
        </DocsParagraph>
        <DocsCode lines>{`{
  "mcp": {
    "public-api": {
      "type": "remote",
      "url": "https://api.example.com/mcp",
      "oauth": false,
      "headers": {
        "X-Api-Key": "your-api-key"
      }
    }
  }
}`}</DocsCode>
      </DocsSection>

      <DocsSection id="configuration" title="Configuration">
        <DocsParagraph>
          MCP servers can be configured in two places:
        </DocsParagraph>
        <DocsList
          items={[
            "The \"mcp\" section of creor.json or creor.jsonc",
            "A standalone mcp.json file in the .creor/ directory",
          ]}
        />
        <DocsParagraph>
          Both global (<code>~/.creor/</code>) and project-level (
          <code>.creor/</code>) config directories are scanned. Project-level
          MCP config overrides global config for servers with the same name.
        </DocsParagraph>
        <DocsParagraph>
          To disable a server that was configured at a higher level, use:
        </DocsParagraph>
        <DocsCode lines>{`{
  "mcp": {
    "server-name": {
      "enabled": false
    }
  }
}`}</DocsCode>
      </DocsSection>

      <DocsSection id="mcp-json" title="mcp.json File">
        <DocsParagraph>
          Creor also supports a standalone <code>mcp.json</code> file in{" "}
          <code>.creor/</code> directories. This follows the same format as
          the <code>mcp</code> section in <code>creor.json</code> and provides
          compatibility with other tools that use the same convention.
        </DocsParagraph>
        <DocsCode lines>{`// .creor/mcp.json
{
  "github": {
    "type": "local",
    "command": ["npx", "-y", "@modelcontextprotocol/server-github"],
    "environment": {
      "GITHUB_TOKEN": "ghp_your_token_here"
    }
  },
  "slack": {
    "type": "local",
    "command": ["npx", "-y", "@anthropic/mcp-server-slack"],
    "environment": {
      "SLACK_BOT_TOKEN": "xoxb-your-token",
      "SLACK_TEAM_ID": "T0123456789"
    }
  }
}`}</DocsCode>
        <DocsParagraph>
          Servers defined in <code>mcp.json</code> override any servers with
          the same name from <code>creor.json</code>. The load order is:
        </DocsParagraph>
        <DocsList
          items={[
            "Global ~/.creor/mcp.json",
            "Project .creor/mcp.json (overrides global)",
          ]}
        />
      </DocsSection>

      <DocsDivider />

      <DocsSection id="status" title="Server Status">
        <DocsParagraph>
          Each MCP server has a status that Creor tracks and displays in
          the UI:
        </DocsParagraph>
        <DocsTable
          headers={["Status", "Description"]}
          rows={[
            ["connected", "Server is running and tools are available"],
            ["connecting", "Server is being started or connection is in progress"],
            ["disabled", "Server is configured but disabled (enabled: false)"],
            ["failed", "Server failed to start or connection was lost"],
            ["needs_auth", "Remote server requires OAuth authentication"],
            ["needs_client_registration", "Dynamic client registration failed — manual client ID required"],
          ]}
        />
        <DocsParagraph>
          MCP servers emit a <code>ToolListChanged</code> notification when
          their available tools change at runtime. Creor automatically picks
          up these changes without requiring a reconnection.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="marketplace" title="Marketplace">
        <DocsParagraph>
          The Creor dashboard includes an MCP marketplace where you can browse
          and install community MCP servers. Installed servers from the
          marketplace are synced to your configuration and can be managed
          alongside manually configured servers.
        </DocsParagraph>
        <DocsParagraph>
          Marketplace servers appear in the MCP panel in the IDE with an
          indicator badge. You can enable, disable, or remove them from the
          settings UI or by editing your config directly.
        </DocsParagraph>
        <DocsCallout type="tip">
          Marketplace servers use real-time sync — changes you make in the
          dashboard are reflected in the IDE immediately without restarting.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="examples" title="Examples">
        <DocsH3>GitHub MCP Server</DocsH3>
        <DocsParagraph>
          Access GitHub repositories, issues, pull requests, and more through
          the official GitHub MCP server:
        </DocsParagraph>
        <DocsCode lines>{`{
  "mcp": {
    "github": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-github"],
      "environment": {
        "GITHUB_TOKEN": "ghp_your_personal_access_token"
      }
    }
  }
}`}</DocsCode>

        <DocsH3>Slack MCP Server</DocsH3>
        <DocsParagraph>
          Read and send messages in Slack channels:
        </DocsParagraph>
        <DocsCode lines>{`{
  "mcp": {
    "slack": {
      "type": "local",
      "command": ["npx", "-y", "@anthropic/mcp-server-slack"],
      "environment": {
        "SLACK_BOT_TOKEN": "xoxb-your-bot-token",
        "SLACK_TEAM_ID": "T0123456789"
      }
    }
  }
}`}</DocsCode>

        <DocsH3>SQLite Database Server</DocsH3>
        <DocsParagraph>
          Query and modify a local SQLite database:
        </DocsParagraph>
        <DocsCode lines>{`{
  "mcp": {
    "sqlite": {
      "type": "local",
      "command": ["python", "-m", "mcp_server_sqlite", "--db-path", "./data/app.db"]
    }
  }
}`}</DocsCode>

        <DocsH3>Filesystem Server</DocsH3>
        <DocsParagraph>
          Give the agent access to specific directories through a sandboxed
          filesystem server:
        </DocsParagraph>
        <DocsCode lines>{`{
  "mcp": {
    "filesystem": {
      "type": "local",
      "command": [
        "npx", "-y", "@modelcontextprotocol/server-filesystem",
        "/path/to/allowed/directory"
      ]
    }
  }
}`}</DocsCode>

        <DocsH3>Remote Server with Custom Headers</DocsH3>
        <DocsParagraph>
          Connect to a private MCP server using API key authentication:
        </DocsParagraph>
        <DocsCode lines>{`{
  "mcp": {
    "internal-api": {
      "type": "remote",
      "url": "https://mcp.internal.company.com/v1",
      "oauth": false,
      "headers": {
        "Authorization": "Bearer your-api-key",
        "X-Team-Id": "engineering"
      },
      "timeout": 10000
    }
  }
}`}</DocsCode>

        <DocsH3>Remote Server with OAuth</DocsH3>
        <DocsParagraph>
          Connect to a remote MCP server that uses OAuth for authentication:
        </DocsParagraph>
        <DocsCode lines>{`{
  "mcp": {
    "linear": {
      "type": "remote",
      "url": "https://mcp.linear.app/sse",
      "oauth": {
        "clientId": "your-linear-client-id",
        "scope": "read write issues:create"
      }
    }
  }
}`}</DocsCode>

        <DocsH3>Full Configuration Example</DocsH3>
        <DocsParagraph>
          A production setup with multiple MCP servers:
        </DocsParagraph>
        <DocsCode lines>{`{
  "mcp": {
    "github": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-github"],
      "environment": {
        "GITHUB_TOKEN": "ghp_your_token"
      }
    },
    "slack": {
      "type": "local",
      "command": ["npx", "-y", "@anthropic/mcp-server-slack"],
      "environment": {
        "SLACK_BOT_TOKEN": "xoxb-your-token",
        "SLACK_TEAM_ID": "T0123456789"
      }
    },
    "linear": {
      "type": "remote",
      "url": "https://mcp.linear.app/sse",
      "oauth": {
        "clientId": "your-client-id"
      }
    },
    "sentry": {
      "type": "local",
      "command": ["npx", "-y", "@sentry/mcp-server"],
      "environment": {
        "SENTRY_AUTH_TOKEN": "your-sentry-token"
      }
    }
  }
}`}</DocsCode>
      </DocsSection>
    </DocsPage>
  );
}
