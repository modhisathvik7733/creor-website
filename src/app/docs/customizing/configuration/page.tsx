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
  title: "Configuration | Creor",
  description:
    "Configure Creor with creor.json files, environment variables, and a layered config hierarchy.",
  path: "/docs/customizing/configuration",
});

export default function ConfigurationPage() {
  return (
    <DocsPage
      breadcrumb="Customizing"
      title="Configuration"
      description="Creor reads settings from creor.json files at multiple levels. Higher-priority sources override lower ones, so you can set organization defaults while letting individual projects fine-tune behavior."
      toc={[
        { label: "Config Files", href: "#config-files" },
        { label: "Config Hierarchy", href: "#hierarchy" },
        { label: "Key Sections", href: "#key-sections" },
        { label: "Full Example", href: "#full-example" },
        { label: "Environment Variables", href: "#environment-variables" },
        { label: "Runtime Config", href: "#runtime-config" },
      ]}
    >
      <DocsSection id="config-files" title="Config Files">
        <DocsParagraph>
          Creor uses <code>creor.json</code> or <code>creor.jsonc</code> (JSON
          with comments) for configuration. You can place these files at the
          project level, inside a <code>.creor/</code> directory, or in your home
          directory for global defaults.
        </DocsParagraph>
        <DocsParagraph>
          A minimal config file only needs the <code>$schema</code> field for
          editor autocompletion:
        </DocsParagraph>
        <DocsCode lines>{`{
  "$schema": "https://creor.dev/config.json"
}`}</DocsCode>
        <DocsCallout type="tip">
          Use <code>creor.jsonc</code> if you want to add inline comments.
          Both formats are supported everywhere Creor looks for config.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="hierarchy" title="Config Hierarchy">
        <DocsParagraph>
          Creor merges configuration from multiple sources. Each level overrides
          the one below it. From lowest to highest priority:
        </DocsParagraph>
        <DocsTable
          headers={["Priority", "Source", "Description"]}
          rows={[
            [
              "1 (lowest)",
              "Remote .well-known/creor",
              "Organization defaults fetched from a well-known URL during auth",
            ],
            [
              "2",
              "Managed config",
              "/etc/creor (Linux), /Library/Application Support/creor (macOS), or %ProgramData%\\creor (Windows) — admin-controlled, enterprise deployments",
            ],
            [
              "3",
              "Global user config",
              "~/.creor/creor.json — your personal defaults across all projects",
            ],
            [
              "4",
              "CREOR_CONFIG file",
              "A custom path set via the CREOR_CONFIG environment variable",
            ],
            [
              "5",
              "Project creor.json",
              "creor.json or creor.jsonc in the project root (checked into the repo)",
            ],
            [
              "6",
              ".creor/ directory",
              ".creor/creor.json inside the project — also loads agents, skills, and plugins from subdirectories",
            ],
            [
              "7",
              "CREOR_CONFIG_CONTENT",
              "Inline JSON passed as an environment variable",
            ],
            [
              "8",
              "Runtime config",
              "Changes applied via the PATCH /config API at runtime",
            ],
            [
              "9 (highest)",
              "Managed directory",
              "Enterprise managed directory always wins — it overrides everything above",
            ],
          ]}
        />
        <DocsParagraph>
          Array fields like <code>plugin</code> and <code>instructions</code>{" "}
          are concatenated across levels rather than replaced, so global
          plugins are always included alongside project-specific ones.
        </DocsParagraph>
        <DocsCallout type="info">
          Creor also loads agents from <code>.creor/agents/*.md</code>, skills
          from <code>.creor/skills/*/SKILL.md</code>, and plugins from{" "}
          <code>.creor/plugins/*.ts</code> in every config directory it scans.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="key-sections" title="Key Sections">
        <DocsH3>model</DocsH3>
        <DocsParagraph>
          Set the default model in <code>provider/model</code> format. You can
          also set a smaller model for background tasks like title generation.
        </DocsParagraph>
        <DocsCode lines>{`{
  "model": "anthropic/claude-sonnet-4-20250514",
  "small_model": "anthropic/claude-haiku-3-5"
}`}</DocsCode>

        <DocsH3>provider</DocsH3>
        <DocsParagraph>
          Override provider settings — custom base URLs, API keys, or model
          routing.
        </DocsParagraph>
        <DocsCode lines>{`{
  "provider": {
    "openai": {
      "api_key_env": "MY_OPENAI_KEY"
    },
    "custom-ollama": {
      "api_url": "http://localhost:11434/v1",
      "models": ["llama3:70b"]
    }
  }
}`}</DocsCode>

        <DocsH3>agent</DocsH3>
        <DocsParagraph>
          Customize built-in agents or define new subagents. See the{" "}
          <a href="/docs/customizing/subagents" className="text-[#FF6A13] hover:underline">
            Subagents
          </a>{" "}
          page for full details.
        </DocsParagraph>
        <DocsCode lines>{`{
  "agent": {
    "build": {
      "model": "anthropic/claude-sonnet-4-20250514",
      "temperature": 0.3
    },
    "review": {
      "description": "Read-only code reviewer",
      "mode": "subagent",
      "prompt": "You are a code reviewer. Read code and provide feedback."
    }
  }
}`}</DocsCode>

        <DocsH3>permission</DocsH3>
        <DocsParagraph>
          Control which tools require confirmation, are auto-allowed, or
          are denied entirely. Each tool can be set to <code>ask</code>,{" "}
          <code>allow</code>, or <code>deny</code>. You can also use glob
          patterns for file-specific rules.
        </DocsParagraph>
        <DocsCode lines>{`{
  "permission": {
    "bash": "ask",
    "edit": "allow",
    "read": {
      "*": "allow",
      "*.env": "deny",
      "*.env.*": "deny"
    },
    "websearch": "allow"
  }
}`}</DocsCode>

        <DocsH3>skills</DocsH3>
        <DocsParagraph>
          Point Creor at additional skill directories or remote skill URLs.
        </DocsParagraph>
        <DocsCode lines>{`{
  "skills": {
    "paths": ["./custom-skills", "~/shared-skills"],
    "urls": ["https://example.com/.well-known/skills/"]
  }
}`}</DocsCode>

        <DocsH3>hooks</DocsH3>
        <DocsParagraph>
          Run shell commands at specific lifecycle events. See the{" "}
          <a href="/docs/customizing/hooks" className="text-[#FF6A13] hover:underline">
            Hooks
          </a>{" "}
          page for details.
        </DocsParagraph>
        <DocsCode lines>{`{
  "hooks": {
    "tool.execute.after": [
      {
        "command": "prettier --write $HOOK_TOOL_OUTPUT",
        "matcher": "Edit",
        "description": "Auto-format after edit"
      }
    ]
  }
}`}</DocsCode>

        <DocsH3>mcp</DocsH3>
        <DocsParagraph>
          Configure Model Context Protocol servers — local stdio-based
          or remote URL-based. See the{" "}
          <a href="/docs/customizing/mcp" className="text-[#FF6A13] hover:underline">
            MCP
          </a>{" "}
          page.
        </DocsParagraph>

        <DocsH3>sandbox</DocsH3>
        <DocsParagraph>
          OS-level sandboxing for bash commands. Enabled by default on
          macOS and Linux with kernel-level enforcement.
        </DocsParagraph>
        <DocsCode lines>{`{
  "sandbox": {
    "enabled": true,
    "filesystem": {
      "writable_roots": ["/tmp/builds"],
      "denied_paths": ["~/.ssh", "~/.gnupg"]
    },
    "network": "allow"
  }
}`}</DocsCode>

        <DocsH3>Other Settings</DocsH3>
        <DocsTable
          headers={["Field", "Type", "Description"]}
          rows={[
            ["share", '"manual" | "auto" | "disabled"', "Control session sharing behavior"],
            ["autoupdate", "boolean | \"notify\"", "Auto-update behavior"],
            ["snapshot", "boolean", "Enable file snapshots for undo"],
            ["repo_map_enabled", "boolean", "Inject workspace file tree into system prompt (default: true)"],
            ["project_context_enabled", "boolean", "Inject framework/dependency context (default: true)"],
            ["git_context_enabled", "boolean", "Inject git branch/commit context at session start"],
            ["format_enabled", "boolean", "Auto-format files after AI edits (default: true)"],
            ["default_agent", "string", "Default agent name (falls back to \"build\")"],
            ["auto_route", "boolean", "Auto-route messages to the best agent via LLM classification"],
            ["disabled_providers", "string[]", "Providers to exclude"],
            ["enabled_providers", "string[]", "When set, ONLY these providers are loaded"],
            ["username", "string", "Custom display name in conversations"],
          ]}
        />
      </DocsSection>

      <DocsDivider />

      <DocsSection id="full-example" title="Full Example">
        <DocsParagraph>
          A typical project-level <code>.creor/creor.json</code> covering the
          most common settings:
        </DocsParagraph>
        <DocsCode lines>{`{
  "$schema": "https://creor.dev/config.json",
  "model": "anthropic/claude-sonnet-4-20250514",
  "small_model": "anthropic/claude-haiku-3-5",
  "default_agent": "build",
  "auto_route": true,
  "format_enabled": true,
  "repo_map_enabled": true,
  "share": "manual",
  "permission": {
    "bash": "ask",
    "edit": "allow",
    "read": {
      "*": "allow",
      "*.env": "deny"
    },
    "websearch": "allow"
  },
  "agent": {
    "build": {
      "temperature": 0.2
    },
    "review": {
      "description": "Read-only code reviewer",
      "mode": "subagent",
      "permission": {
        "edit": "deny",
        "bash": "deny"
      }
    }
  },
  "hooks": {
    "tool.execute.after": [
      {
        "command": "npx prettier --write \\"$HOOK_TOOL_OUTPUT\\"",
        "matcher": "Edit",
        "description": "Format after edit"
      }
    ]
  },
  "mcp": {
    "github": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-github"],
      "environment": {
        "GITHUB_TOKEN": "your-token"
      }
    }
  },
  "plugin": ["devflow-rag@latest"],
  "sandbox": {
    "enabled": true,
    "network": "allow"
  }
}`}</DocsCode>
      </DocsSection>

      <DocsSection id="environment-variables" title="Environment Variables">
        <DocsParagraph>
          Many settings can be controlled via environment variables. These are
          evaluated at startup and can override file-based config.
        </DocsParagraph>
        <DocsTable
          headers={["Variable", "Description"]}
          rows={[
            ["CREOR_CONFIG", "Path to a custom config file"],
            ["CREOR_CONFIG_CONTENT", "Inline JSON config (overrides file-based config)"],
            ["CREOR_CONFIG_DIR", "Additional config directory to scan"],
            ["CREOR_CLIENT", "Client identifier: \"cli\", \"desktop\", etc. (default: \"cli\")"],
            ["CREOR_PERMISSION", "JSON permission overrides"],
            ["CREOR_DISABLE_PROJECT_CONFIG", "Set to \"true\" to ignore project-level config"],
            ["CREOR_DISABLE_DEFAULT_PLUGINS", "Set to \"true\" to skip built-in plugins"],
            ["CREOR_DISABLE_AUTOCOMPACT", "Set to \"true\" to disable automatic context compaction"],
            ["CREOR_DISABLE_PRUNE", "Set to \"true\" to disable output pruning"],
            ["CREOR_DISABLE_LSP_DOWNLOAD", "Set to \"true\" to skip auto-downloading LSP servers"],
            ["CREOR_DISABLE_EXTERNAL_SKILLS", "Set to \"true\" to skip remote skill loading"],
            ["CREOR_SANDBOX", "Set to \"true\" to force sandbox mode"],
            ["CREOR_SANDBOX_NETWORK", "\"allow\" or \"deny\" for sandbox network policy"],
            ["CREOR_ENABLE_EXA", "Set to \"true\" to enable Exa web search"],
            ["CREOR_MODELS_URL", "Custom URL for the models registry"],
            ["CREOR_MODELS_PATH", "Local path to a models registry file"],
            ["CREOR_SERVER_USERNAME", "HTTP basic auth username for the engine server"],
            ["CREOR_SERVER_PASSWORD", "HTTP basic auth password for the engine server"],
            ["CREOR_EXPERIMENTAL", "Set to \"true\" to enable all experimental features"],
            ["CREOR_EXPERIMENTAL_PLAN_MODE", "Set to \"true\" to enable plan mode agent"],
            ["CREOR_TELEMETRY", "Set to \"true\" to enable anonymous telemetry"],
          ]}
        />
        <DocsCallout type="warning">
          Environment variables like <code>CREOR_PERMISSION</code> and{" "}
          <code>CREOR_CONFIG_CONTENT</code> expect valid JSON strings.
          Malformed JSON will be silently ignored.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="runtime-config" title="Runtime Config">
        <DocsParagraph>
          You can change configuration at runtime using the{" "}
          <code>PATCH /config</code> API endpoint. These changes are persisted
          to a <code>config.json</code> file in the engine&apos;s instance
          directory and take the second-highest priority in the merge order,
          just below managed config.
        </DocsParagraph>
        <DocsParagraph>
          Creor also watches <code>.creor/creor.json</code> for external edits.
          When the file changes on disk, the engine automatically reloads all
          configuration, agent definitions, and permissions without requiring
          a restart.
        </DocsParagraph>
      </DocsSection>
    </DocsPage>
  );
}
