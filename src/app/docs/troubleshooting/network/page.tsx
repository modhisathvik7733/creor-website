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
  title: "Network & Proxy Troubleshooting | Creor",
  description:
    "Configure Creor for corporate proxies, firewalls, SSL certificates, and sandbox network policies.",
  path: "/docs/troubleshooting/network",
});

export default function TroubleshootingNetworkPage() {
  return (
    <DocsPage
      breadcrumb="Troubleshooting"
      title="Network & Proxy"
      description="Creor needs internet access to reach LLM providers and the Creor API. If you are behind a corporate proxy or firewall, you may need to configure network settings for Creor to work correctly."
      toc={[
        { label: "Required Endpoints", href: "#required-endpoints" },
        { label: "Proxy Configuration", href: "#proxy-configuration" },
        { label: "Firewall Rules", href: "#firewall-rules" },
        { label: "SSL Certificates", href: "#ssl-certificates" },
        { label: "Sandbox Network Policies", href: "#sandbox-network" },
        { label: "Diagnosing Issues", href: "#diagnosing" },
      ]}
    >
      <DocsSection id="required-endpoints" title="Required Endpoints">
        <DocsParagraph>
          Creor needs to reach the following endpoints for core functionality. If your network
          restricts outbound traffic, ensure these are allowed.
        </DocsParagraph>
        <DocsTable
          headers={["Endpoint", "Port", "Purpose"]}
          rows={[
            ["api.creor.ai", "443", "Creor API (auth, credits, settings, cloud agents)"],
            ["gateway.creor.ai", "443", "Creor Gateway (LLM inference proxy)"],
            ["api.anthropic.com", "443", "Anthropic API (BYOK direct access)"],
            ["api.openai.com", "443", "OpenAI API (BYOK direct access)"],
            ["generativelanguage.googleapis.com", "443", "Google AI API (BYOK direct access)"],
            ["*.supabase.co", "443", "Creor backend services"],
            ["api.voyageai.com", "443", "Voyage AI embeddings (codebase search)"],
            ["api-atlas.nomic.ai", "443", "Nomic embeddings (codebase search)"],
            ["api.jina.ai", "443", "Jina reranker (codebase search)"],
          ]}
        />
        <DocsCallout type="info">
          You only need to allow the LLM provider endpoints you actually use. If you use the
          Creor Gateway exclusively, only api.creor.ai and gateway.creor.ai are required for
          LLM inference.
        </DocsCallout>

        <DocsH3>Optional Endpoints</DocsH3>
        <DocsTable
          headers={["Endpoint", "Port", "Purpose"]}
          rows={[
            ["*.github.com", "443", "GitHub OAuth sign-in, cloud agent repo cloning"],
            ["*.googleapis.com", "443", "Google OAuth sign-in"],
            ["marketplace.visualstudio.com", "443", "VS Code extension marketplace"],
            ["update.code.visualstudio.com", "443", "Editor update checks"],
            ["status.creor.ai", "443", "Service status page"],
          ]}
        />
      </DocsSection>

      <DocsSection id="proxy-configuration" title="Proxy Configuration">
        <DocsParagraph>
          Creor respects standard proxy environment variables. If your corporate network
          requires a proxy for HTTPS traffic, configure it using one of these methods.
        </DocsParagraph>

        <DocsH3>Method 1: Environment Variables</DocsH3>
        <DocsParagraph>
          Set proxy environment variables before launching Creor. These are the most widely
          supported method.
        </DocsParagraph>
        <DocsCode lines>{`# Set in your shell profile (.bashrc, .zshrc, or .profile)
export HTTP_PROXY="http://proxy.company.com:8080"
export HTTPS_PROXY="http://proxy.company.com:8080"
export NO_PROXY="localhost,127.0.0.1,.company.com"

# If the proxy requires authentication
export HTTPS_PROXY="http://username:password@proxy.company.com:8080"`}</DocsCode>

        <DocsH3>Method 2: Creor Settings</DocsH3>
        <DocsParagraph>
          Configure the proxy in Creor&apos;s settings, which takes precedence over environment
          variables.
        </DocsParagraph>
        <DocsCode lines>{`// In Creor settings (Cmd/Ctrl + ,)
// Search for "proxy"

"http.proxy": "http://proxy.company.com:8080",
"http.proxyAuthorization": null,
"http.proxyStrictSSL": true`}</DocsCode>

        <DocsH3>Method 3: System Proxy (macOS)</DocsH3>
        <DocsParagraph>
          On macOS, Creor can use the system proxy settings configured in System Settings &gt;
          Network &gt; Wi-Fi &gt; Proxies. This is automatic -- no additional configuration
          needed.
        </DocsParagraph>

        <DocsH3>Proxy with Authentication</DocsH3>
        <DocsParagraph>
          If your proxy requires authentication, include credentials in the proxy URL or use
          the proxyAuthorization setting for header-based auth.
        </DocsParagraph>
        <DocsCode lines>{`// URL-based authentication
"http.proxy": "http://user:pass@proxy.company.com:8080"

// Header-based authentication (Basic auth)
"http.proxy": "http://proxy.company.com:8080",
"http.proxyAuthorization": "Basic dXNlcjpwYXNz"`}</DocsCode>
        <DocsCallout type="warning">
          Proxy credentials in environment variables or settings may be visible to extensions.
          If this is a concern, use a PAC file or system-level proxy that handles auth
          transparently.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="firewall-rules" title="Firewall Rules">
        <DocsParagraph>
          If you manage a corporate firewall, here are the rules needed for Creor to function.
        </DocsParagraph>

        <DocsH3>Minimum Required Rules</DocsH3>
        <DocsTable
          headers={["Rule", "Direction", "Protocol", "Destination", "Port"]}
          rows={[
            ["Creor API", "Outbound", "HTTPS", "api.creor.ai", "443"],
            ["Creor Gateway", "Outbound", "HTTPS", "gateway.creor.ai", "443"],
            ["OAuth (GitHub)", "Outbound", "HTTPS", "github.com", "443"],
            ["OAuth (Google)", "Outbound", "HTTPS", "accounts.google.com", "443"],
          ]}
        />

        <DocsH3>Full Feature Set</DocsH3>
        <DocsParagraph>
          For all features including BYOK providers, codebase search, and extensions, add the
          endpoints from the Required Endpoints section above.
        </DocsParagraph>

        <DocsH3>WebSocket Support</DocsH3>
        <DocsParagraph>
          Creor uses WebSocket connections (wss://) for real-time communication between the
          editor and the engine, and for SSE streams from the Creor API. Ensure your firewall
          and proxy allow WebSocket upgrades on port 443.
        </DocsParagraph>
        <DocsCallout type="info">
          Some corporate proxies block WebSocket connections by default. If real-time features
          (streaming responses, live terminal output) do not work but basic requests succeed,
          check your proxy&apos;s WebSocket policy.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="ssl-certificates" title="SSL Certificates">
        <DocsParagraph>
          Corporate networks often use SSL inspection (MITM proxies) that replace server
          certificates with their own. This can cause certificate verification errors in Creor.
        </DocsParagraph>

        <DocsH3>Symptoms</DocsH3>
        <DocsList
          items={[
            "\"UNABLE_TO_VERIFY_LEAF_SIGNATURE\" or \"SELF_SIGNED_CERT_IN_CHAIN\" errors.",
            "\"certificate has expired\" when the certificate is actually valid.",
            "HTTPS requests fail but HTTP requests (if any) succeed.",
          ]}
        />

        <DocsH3>Solution: Add Your Corporate CA Certificate</DocsH3>
        <DocsList
          items={[
            "Get your corporate CA certificate from your IT department (usually a .pem or .crt file).",
            "Set the NODE_EXTRA_CA_CERTS environment variable to point to the certificate file.",
          ]}
        />
        <DocsCode lines>{`# Add to your shell profile
export NODE_EXTRA_CA_CERTS="/path/to/corporate-ca.pem"

# On macOS, you can also add it to the system keychain
sudo security add-trusted-cert -d -r trustRoot \\
  -k /Library/Keychains/System.keychain /path/to/corporate-ca.pem`}</DocsCode>

        <DocsH3>Disabling SSL Verification (Not Recommended)</DocsH3>
        <DocsParagraph>
          As a last resort, you can disable SSL verification. This makes your connection
          vulnerable to MITM attacks and should only be used for debugging.
        </DocsParagraph>
        <DocsCode lines>{`# Disable SSL verification for Node.js (affects Creor engine)
export NODE_TLS_REJECT_UNAUTHORIZED=0

# Or in Creor settings
"http.proxyStrictSSL": false`}</DocsCode>
        <DocsCallout type="warning">
          Disabling SSL verification means Creor will accept any certificate, including
          malicious ones. Only use this for temporary debugging on trusted networks. Add the
          proper CA certificate instead.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="sandbox-network" title="Sandbox Network Policies">
        <DocsParagraph>
          The agent&apos;s bash tool can access the network by default (it inherits your
          system&apos;s network configuration). You can restrict or allow specific network
          access in the sandbox configuration.
        </DocsParagraph>

        <DocsH3>Restricting Network Access</DocsH3>
        <DocsParagraph>
          To prevent the agent from making network requests via bash commands (e.g., curl, wget),
          configure the sandbox network policy.
        </DocsParagraph>
        <DocsCode lines>{`{
  "tools": {
    "bash": {
      "network": {
        "policy": "deny",
        "allow": [
          "localhost:*",
          "127.0.0.1:*",
          "registry.npmjs.org:443"
        ]
      }
    }
  }
}`}</DocsCode>
        <DocsParagraph>
          The policy field sets the default (allow or deny). The allow and deny lists override
          the default for specific hosts. Host patterns support wildcards and port specifications.
        </DocsParagraph>

        <DocsH3>Common Configurations</DocsH3>
        <DocsTable
          headers={["Use Case", "Policy", "Allow List"]}
          rows={[
            ["Maximum security", "deny", "localhost:* only"],
            ["Allow package registries", "deny", "registry.npmjs.org:443, registry.yarnpkg.com:443"],
            ["Allow internal services", "deny", "*.company.internal:*, localhost:*"],
            ["No restrictions (default)", "allow", "None needed"],
          ]}
        />
      </DocsSection>

      <DocsSection id="diagnosing" title="Diagnosing Network Issues">
        <DocsParagraph>
          Use these steps to diagnose network connectivity problems.
        </DocsParagraph>

        <DocsH3>Step 1: Test Basic Connectivity</DocsH3>
        <DocsCode lines>{`# Test Creor API
curl -I https://api.creor.ai/global/health

# Test Creor Gateway
curl -I https://gateway.creor.ai/health

# Test DNS resolution
nslookup api.creor.ai
nslookup gateway.creor.ai`}</DocsCode>

        <DocsH3>Step 2: Test Through Proxy</DocsH3>
        <DocsCode lines>{`# Test with explicit proxy
curl -I --proxy http://proxy.company.com:8080 https://api.creor.ai/global/health

# Check proxy environment variables
echo $HTTP_PROXY
echo $HTTPS_PROXY
echo $NO_PROXY`}</DocsCode>

        <DocsH3>Step 3: Check Creor Logs</DocsH3>
        <DocsList
          items={[
            "Open the Output panel: View > Output.",
            "Select \"Creor Engine\" from the dropdown.",
            "Look for network error messages, timeout errors, or certificate errors.",
            "If you see \"ECONNREFUSED\", the endpoint is not reachable from your network.",
            "If you see \"ETIMEDOUT\", the request is blocked by a firewall or the server is unreachable.",
            "If you see certificate errors, see the SSL Certificates section above.",
          ]}
        />

        <DocsH3>Step 4: Verify Proxy Configuration</DocsH3>
        <DocsCode lines>{`# Check what proxy Creor is using
# Open Creor Developer Tools (Help > Toggle Developer Tools)
# In the Console tab, run:
process.env.HTTP_PROXY
process.env.HTTPS_PROXY`}</DocsCode>
        <DocsCallout type="tip">
          If you can reach the Creor API from a browser but not from Creor itself, the issue
          is almost always proxy-related. The browser uses system proxy settings automatically,
          but Creor needs them configured explicitly via environment variables or settings.
        </DocsCallout>
      </DocsSection>
    </DocsPage>
  );
}
