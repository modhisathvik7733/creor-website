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
  title: "Plugins | Creor",
  description:
    "Extend the Creor engine with plugins — add custom tools, providers, lifecycle hooks, and integrations.",
  path: "/docs/customizing/plugins",
});

export default function PluginsPage() {
  return (
    <DocsPage
      breadcrumb="Customizing"
      title="Plugins"
      description="Plugins extend the Creor engine with custom tools, authentication providers, lifecycle hooks, and more. They can be npm packages, local TypeScript files, or file:// URL references."
      toc={[
        { label: "Overview", href: "#overview" },
        { label: "Plugin Sources", href: "#sources" },
        { label: "Configuration", href: "#configuration" },
        { label: "Plugin API", href: "#api" },
        { label: "Creating a Plugin", href: "#creating" },
        { label: "Local Plugins", href: "#local-plugins" },
        { label: "Built-in Plugins", href: "#built-in" },
        { label: "Plugin Deduplication", href: "#deduplication" },
      ]}
    >
      <DocsSection id="overview" title="Overview">
        <DocsParagraph>
          The Creor engine has a plugin system that lets you extend its
          capabilities without modifying the core codebase. Plugins can:
        </DocsParagraph>
        <DocsList
          items={[
            "Add custom tools that the agent can use",
            "Register authentication providers for custom LLM endpoints",
            "Hook into lifecycle events (tool execution, chat messages, system prompt generation)",
            "Transform system prompts before they're sent to the model",
            "React to internal bus events",
          ]}
        />
        <DocsParagraph>
          Plugins are loaded during engine initialization. Each plugin exports
          a function that receives a context object and returns a hooks
          object.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="sources" title="Plugin Sources">
        <DocsParagraph>
          Plugins can come from three sources:
        </DocsParagraph>
        <DocsTable
          headers={["Source", "Format", "Example"]}
          rows={[
            [
              "npm package",
              "package-name@version",
              "\"devflow-rag@latest\"",
            ],
            [
              "Scoped npm package",
              "@scope/package@version",
              "\"@myorg/creor-plugin@1.0.0\"",
            ],
            [
              "Local file",
              "file:// URL (auto-detected from .creor/plugins/)",
              "\"file:///path/to/plugin.ts\"",
            ],
          ]}
        />
        <DocsParagraph>
          Creor automatically installs npm packages using Bun. Local plugins
          are loaded directly from the filesystem.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="configuration" title="Configuration">
        <DocsParagraph>
          Add plugins to the <code>plugin</code> array in your{" "}
          <code>creor.json</code>:
        </DocsParagraph>
        <DocsCode lines>{`{
  "plugin": [
    "devflow-rag@latest",
    "@myorg/custom-tools@2.0.0",
    "file:///absolute/path/to/plugin.ts"
  ]
}`}</DocsCode>
        <DocsParagraph>
          Plugins can also be auto-discovered from the{" "}
          <code>.creor/plugins/</code> directory. Any <code>.ts</code> or{" "}
          <code>.js</code> file in this directory is automatically loaded as a
          plugin.
        </DocsParagraph>
        <DocsCode lines>{`.creor/
  plugins/
    my-custom-tool.ts     # auto-discovered as a plugin
    lint-reporter.ts      # auto-discovered as a plugin`}</DocsCode>
        <DocsCallout type="info">
          The <code>plugin</code> array from all config levels is
          concatenated, not replaced. Plugins defined globally in{" "}
          <code>~/.creor/creor.json</code> are always included alongside
          project-level plugins.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="api" title="Plugin API">
        <DocsParagraph>
          A plugin is a function that receives an input context and returns a
          hooks object. The input provides access to the engine&apos;s SDK
          client and project information.
        </DocsParagraph>
        <DocsH3>Plugin Input</DocsH3>
        <DocsCode lines>{`interface PluginInput {
  // Creor SDK client for interacting with the engine
  client: OpencodeClient

  // Project paths
  project: string    // project root directory
  worktree: string   // git worktree root
  directory: string  // engine instance directory

  // Server URL for API calls
  serverUrl: string

  // Bun shell for running commands
  $: typeof Bun.$
}`}</DocsCode>

        <DocsH3>Hooks Object</DocsH3>
        <DocsParagraph>
          The returned hooks object can implement any combination of lifecycle
          hooks:
        </DocsParagraph>
        <DocsTable
          headers={["Hook", "Description"]}
          rows={[
            ["tool.execute.before", "Called before any tool executes. Can modify args or block execution."],
            ["tool.execute.after", "Called after a tool completes. Can add context to the response."],
            ["tool.execute.failure", "Called when a tool fails."],
            ["shell.env", "Set environment variables for shell commands."],
            ["command.execute.before", "Called before a slash command executes."],
            ["chat.message", "Called when a new chat message is sent."],
            ["session.start", "Called when a new session begins."],
            ["session.end", "Called when a session ends."],
            ["notification", "Called when the agent sends a notification."],
            ["pre.compact", "Called before context compaction."],
            ["experimental.chat.system.transform", "Transform the system prompt before it's sent to the model."],
            ["auth", "Provide custom authentication for LLM providers."],
            ["tool", "Register custom tools for the agent."],
            ["event", "React to internal bus events."],
            ["config", "Called with the resolved config after initialization."],
          ]}
        />
      </DocsSection>

      <DocsDivider />

      <DocsSection id="creating" title="Creating a Plugin">
        <DocsParagraph>
          Here is a complete plugin that adds a custom tool and hooks into
          tool execution:
        </DocsParagraph>
        <DocsCode lines>{`import type { PluginInput, Hooks } from "@creor-ai/plugin"

export default function myPlugin(input: PluginInput): Hooks {
  return {
    // Register a custom tool
    tool: () => [
      {
        name: "check_coverage",
        description: "Run test coverage and report results",
        parameters: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "Path to check coverage for",
            },
          },
          required: ["path"],
        },
        execute: async (args) => {
          const result = await input.$\`npx vitest --coverage --reporter=json \${args.path}\`
          return {
            content: [
              {
                type: "text",
                text: result.stdout.toString(),
              },
            ],
          }
        },
      },
    ],

    // Hook into post-tool execution
    "tool.execute.after": async (hookInput, output) => {
      if (hookInput.tool === "Edit") {
        console.log(\`File edited in session \${hookInput.sessionID}\`)
      }
    },

    // Transform system prompt
    "experimental.chat.system.transform": async (hookInput, output) => {
      output.system.push(
        "Always check test coverage after making changes to src/ files."
      )
    },
  }
}`}</DocsCode>

        <DocsH3>Installing the Plugin SDK</DocsH3>
        <DocsParagraph>
          If you&apos;re developing a plugin as an npm package, install the
          plugin SDK:
        </DocsParagraph>
        <DocsCode>{`bun add @creor-ai/plugin`}</DocsCode>
        <DocsParagraph>
          For local plugins in <code>.creor/plugins/</code>, Creor
          automatically installs <code>@creor-ai/plugin</code> as a
          dependency in the <code>.creor/</code> directory. A{" "}
          <code>package.json</code>, <code>.gitignore</code>, and{" "}
          <code>node_modules/</code> are created automatically.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="local-plugins" title="Local Plugins">
        <DocsParagraph>
          The simplest way to extend Creor is with local plugins in your
          project&apos;s <code>.creor/plugins/</code> directory:
        </DocsParagraph>
        <DocsCode lines>{`// .creor/plugins/notify-slack.ts
import type { PluginInput, Hooks } from "@creor-ai/plugin"

export default function slackNotifier(input: PluginInput): Hooks {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL

  return {
    notification: async (hookInput) => {
      if (!webhookUrl) return
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: \`Creor: \${(hookInput as any).message}\`,
        }),
      })
    },
  }
}`}</DocsCode>
        <DocsParagraph>
          Local plugins are loaded as <code>file://</code> URLs internally.
          They have full access to the Node.js runtime and can import any
          packages installed in the <code>.creor/node_modules/</code>{" "}
          directory.
        </DocsParagraph>
        <DocsCallout type="tip">
          Add external dependencies by creating a{" "}
          <code>.creor/package.json</code> with a <code>dependencies</code>{" "}
          field. Creor runs <code>bun install</code> automatically when it
          detects a <code>package.json</code> in the <code>.creor/</code>{" "}
          directory.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="built-in" title="Built-in Plugins">
        <DocsParagraph>
          Creor ships with several built-in plugins that are loaded
          automatically:
        </DocsParagraph>
        <DocsTable
          headers={["Plugin", "Description"]}
          rows={[
            [
              "opencode-anthropic-auth",
              "Handles Anthropic OAuth authentication flows",
            ],
            [
              "Codex Auth (internal)",
              "OpenAI Codex / Responses API authentication",
            ],
            [
              "Copilot Auth (internal)",
              "GitHub Copilot authentication integration",
            ],
          ]}
        />
        <DocsParagraph>
          To disable built-in plugins, set the{" "}
          <code>CREOR_DISABLE_DEFAULT_PLUGINS</code> environment variable to{" "}
          <code>true</code>.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="deduplication" title="Plugin Deduplication">
        <DocsParagraph>
          When the same plugin is referenced at multiple config levels (e.g.,
          global and project), Creor deduplicates by canonical name. The
          higher-priority source wins.
        </DocsParagraph>
        <DocsParagraph>
          Priority order (highest to lowest):
        </DocsParagraph>
        <DocsList
          items={[
            "Project .creor/plugins/ directory",
            "Project creor.json plugin array",
            "Global .creor/plugins/ directory",
            "Global creor.json plugin array",
          ]}
        />
        <DocsParagraph>
          For example, if <code>~/.creor/creor.json</code> lists{" "}
          <code>my-plugin@1.0.0</code> and{" "}
          <code>.creor/creor.json</code> lists{" "}
          <code>my-plugin@2.0.0</code>, only version 2.0.0 is loaded.
        </DocsParagraph>
      </DocsSection>
    </DocsPage>
  );
}
