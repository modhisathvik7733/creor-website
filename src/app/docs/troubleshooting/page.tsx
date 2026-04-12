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
  title: "Troubleshooting | Creor",
  description:
    "Common issues and solutions for Creor: auth failures, model errors, credit exhaustion, connection problems, and more.",
  path: "/docs/troubleshooting",
});

export default function TroubleshootingPage() {
  return (
    <DocsPage
      breadcrumb="Troubleshooting"
      title="Common Issues"
      description="Solutions for the most frequently encountered issues in Creor. If your issue is not listed here, check the specific troubleshooting pages for terminal and network problems, or reach out on the Creor Discord."
      toc={[
        { label: "Auth Failures", href: "#auth-failures" },
        { label: "Model Errors", href: "#model-errors" },
        { label: "Credit Exhaustion", href: "#credit-exhaustion" },
        { label: "Connection Issues", href: "#connection-issues" },
        { label: "Engine Startup", href: "#engine-startup" },
        { label: "Performance Issues", href: "#performance-issues" },
        { label: "Getting Help", href: "#getting-help" },
      ]}
    >
      <DocsSection id="auth-failures" title="Auth Failures">
        <DocsH3>Expired session token</DocsH3>
        <DocsParagraph>
          Symptoms: the chat panel shows &quot;Session expired&quot; or &quot;Unauthorized&quot;.
          API requests return HTTP 401.
        </DocsParagraph>
        <DocsList
          items={[
            "Sign out and sign back in from the chat panel (click your avatar > Sign Out).",
            "If the problem persists, clear the stored credentials: open the Command Palette (Cmd/Ctrl + Shift + P) and run \"Creor: Clear Credentials\".",
            "Check that your system clock is accurate. Token validation fails if your clock is more than 5 minutes off.",
          ]}
        />

        <DocsH3>Invalid API key</DocsH3>
        <DocsParagraph>
          Symptoms: API requests return HTTP 401 with &quot;Invalid API key&quot; in the
          response body.
        </DocsParagraph>
        <DocsList
          items={[
            "Verify the key has not been revoked in Dashboard > Settings > API Keys.",
            "Check that you are using the correct key for the correct workspace.",
            "Ensure the key prefix matches the environment: cr_live_ for production, cr_test_ for staging.",
            "If using environment variables, verify the variable is set correctly (echo $CREOR_API_KEY).",
          ]}
        />

        <DocsH3>BYOK provider key rejected</DocsH3>
        <DocsParagraph>
          Symptoms: &quot;Authentication failed&quot; when using your own API key for a provider
          like Anthropic or OpenAI.
        </DocsParagraph>
        <DocsList
          items={[
            "Verify the key is correct and has not expired or been rotated.",
            "Check that the key has the required permissions (e.g., OpenAI keys need API access, not just ChatGPT Plus).",
            "For organization-scoped keys, verify the organization ID is set correctly.",
            "Try the key directly with the provider's API to confirm it works outside Creor.",
          ]}
        />
        <DocsCode lines>{`# Test an Anthropic key directly
curl https://api.anthropic.com/v1/messages \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "content-type: application/json" \\
  -d '{"model":"claude-sonnet-4-20250514","max_tokens":10,"messages":[{"role":"user","content":"hi"}]}'

# Test an OpenAI key directly
curl https://api.openai.com/v1/models \\
  -H "Authorization: Bearer $OPENAI_API_KEY"`}</DocsCode>
      </DocsSection>

      <DocsSection id="model-errors" title="Model Errors">
        <DocsH3>Rate limit exceeded</DocsH3>
        <DocsParagraph>
          Symptoms: &quot;Rate limit exceeded&quot; or HTTP 429. Requests fail temporarily.
        </DocsParagraph>
        <DocsList
          items={[
            "Wait 30-60 seconds and try again. Rate limits reset automatically.",
            "If using BYOK, check your provider's rate limit tier. Higher tiers have higher limits.",
            "Switch to a different model temporarily. Rate limits are per-model.",
            "If using the Creor Gateway, upgrade your plan for higher rate limits.",
          ]}
        />

        <DocsH3>Model not available</DocsH3>
        <DocsParagraph>
          Symptoms: &quot;Model not found&quot; or the model does not appear in the picker.
        </DocsParagraph>
        <DocsList
          items={[
            "Check that the model is available on your plan. Free plan users have access to a subset of models.",
            "For BYOK providers, verify the model name matches exactly (e.g., \"claude-sonnet-4-20250514\" not \"claude-sonnet\").",
            "Some models require specific provider access (e.g., Claude requires an Anthropic API key or Creor Gateway).",
            "The model may have been deprecated. Check the provider's documentation for the current model list.",
          ]}
        />

        <DocsH3>Context window exceeded</DocsH3>
        <DocsParagraph>
          Symptoms: &quot;Context length exceeded&quot; or the agent stops mid-response.
        </DocsParagraph>
        <DocsList
          items={[
            "Start a new session. Long conversations accumulate context that can exceed limits.",
            "Use a model with a larger context window (e.g., Claude Sonnet supports up to 200K tokens).",
            "Scope your requests more narrowly to reduce the amount of code the agent reads.",
            "Enable session compaction in settings to automatically summarize older turns.",
          ]}
        />
      </DocsSection>

      <DocsSection id="credit-exhaustion" title="Credit Exhaustion">
        <DocsParagraph>
          When your credit balance reaches zero, gateway requests and cloud agent runs are
          paused.
        </DocsParagraph>

        <DocsH3>How to resume</DocsH3>
        <DocsList
          items={[
            "Add credits: Dashboard > Billing > Add Credits. Credits are available within seconds.",
            "Wait for your billing cycle: subscription credits are added at the start of each cycle.",
            "Switch to BYOK: configure your own API keys in Settings > Providers to bypass gateway billing.",
          ]}
        />

        <DocsH3>Preventing credit exhaustion</DocsH3>
        <DocsList
          items={[
            "Set up low-balance alerts: Dashboard > Billing > Alerts.",
            "Set spending limits per member, per API key, or per month.",
            "Monitor the Usage page to understand your consumption patterns.",
            "Use cheaper models (Haiku, GPT-4o mini) for simple tasks.",
            "Enable auto-purchase: Dashboard > Billing > Auto-Purchase to automatically buy credits when your balance is low.",
          ]}
        />
      </DocsSection>

      <DocsSection id="connection-issues" title="Connection Issues">
        <DocsH3>Engine not connecting</DocsH3>
        <DocsParagraph>
          Symptoms: the chat panel shows &quot;Connecting to engine...&quot; indefinitely or
          &quot;Engine not available&quot;.
        </DocsParagraph>
        <DocsList
          items={[
            "Check the Output panel (View > Output > Creor Engine) for error messages.",
            "The engine may have crashed. Restart it: Command Palette > \"Creor: Restart Engine\".",
            "Check that port 4096 (default engine port) is not in use by another process.",
            "On macOS, verify the engine binary has execution permissions.",
          ]}
        />
        <DocsCode lines>{`# Check if something is already using port 4096
lsof -i :4096

# Check engine process
ps aux | grep opencode`}</DocsCode>

        <DocsH3>Server unreachable (gateway)</DocsH3>
        <DocsParagraph>
          Symptoms: &quot;Server unreachable&quot; or &quot;Network error&quot; when sending
          messages via the Creor Gateway.
        </DocsParagraph>
        <DocsList
          items={[
            "Check your internet connection.",
            "Verify that api.creor.ai is reachable: try opening creor.ai in a browser.",
            "If you are behind a corporate proxy or firewall, see the Network & Proxy troubleshooting page.",
            "Check the Creor status page (status.creor.ai) for ongoing incidents.",
          ]}
        />
      </DocsSection>

      <DocsSection id="engine-startup" title="Engine Startup">
        <DocsH3>Engine binary not found</DocsH3>
        <DocsParagraph>
          Symptoms: &quot;Failed to start engine: ENOENT&quot; in the Output panel.
        </DocsParagraph>
        <DocsList
          items={[
            "The engine binary may not have been extracted correctly during installation. Reinstall Creor.",
            "On macOS, the binary may be quarantined. Run: xattr -dr com.apple.quarantine /Applications/Creor.app",
            "On Linux, verify the binary has execute permission: chmod +x /path/to/opencode",
          ]}
        />

        <DocsH3>Engine crashes on startup</DocsH3>
        <DocsParagraph>
          Symptoms: the engine starts and immediately exits. The Output panel shows an error
          or stack trace.
        </DocsParagraph>
        <DocsList
          items={[
            "Check if Bun is installed and accessible (the engine requires Bun 1.3.8+).",
            "Look for port conflicts on port 4096.",
            "Check disk space -- the engine needs at least 100 MB free for temporary files.",
            "On Apple Silicon Macs, verify you downloaded the arm64 build, not the x64 build.",
          ]}
        />
      </DocsSection>

      <DocsSection id="performance-issues" title="Performance Issues">
        <DocsH3>Slow responses</DocsH3>
        <DocsParagraph>
          If the agent takes a long time to respond, the bottleneck is usually the LLM
          provider, not Creor itself.
        </DocsParagraph>
        <DocsList
          items={[
            "Switch to a faster model. Haiku and GPT-4o mini respond in 1-3 seconds for most queries.",
            "Check the provider's status page for degraded performance.",
            "If using BYOK, your rate limit tier may throttle long-running requests.",
            "Reduce context size by starting a new session or scoping requests more narrowly.",
          ]}
        />

        <DocsH3>High memory usage</DocsH3>
        <DocsParagraph>
          Creor runs multiple processes (editor, engine, extensions). High memory usage is
          normal for large workspaces.
        </DocsParagraph>
        <DocsList
          items={[
            "Close unused editor tabs. Each open file consumes memory for syntax highlighting and IntelliSense.",
            "Disable extensions you are not actively using.",
            "If codebase indexing (RAG) is running, memory will be higher temporarily. It drops after indexing completes.",
            "Restart Creor to reclaim memory from leaked processes or extensions.",
          ]}
        />
      </DocsSection>

      <DocsDivider />

      <DocsSection id="getting-help" title="Getting Help">
        <DocsParagraph>
          If the solutions above do not resolve your issue, here is how to get additional help.
        </DocsParagraph>
        <DocsList
          items={[
            "Discord: Join the Creor Discord server for community support and real-time help.",
            "GitHub Issues: Report bugs at github.com/modhisathvik7733/creor-app/issues.",
            "Email support: support@creor.ai (Starter and Pro plans get priority response).",
            "Status page: status.creor.ai for real-time service health.",
          ]}
        />

        <DocsH3>When Reporting a Bug</DocsH3>
        <DocsParagraph>
          Include this information to help us diagnose the issue faster:
        </DocsParagraph>
        <DocsList
          items={[
            "Creor version (Help > About).",
            "Operating system and version.",
            "Steps to reproduce the issue.",
            "Output panel logs (View > Output > Creor Engine).",
            "Screenshot or screen recording if applicable.",
          ]}
        />

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DocsCard
            title="Terminal & Shell"
            description="PTY issues, command timeouts, sandbox restrictions, and interactive command problems."
            href="/docs/troubleshooting/terminal"
          />
          <DocsCard
            title="Network & Proxy"
            description="Proxy configuration, firewall rules, SSL certificates, and sandbox network policies."
            href="/docs/troubleshooting/network"
          />
        </div>
      </DocsSection>
    </DocsPage>
  );
}
