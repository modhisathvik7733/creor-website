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
} from "@/components/docs-page";

export const metadata: Metadata = generatePageMetadata({
  title: "Authentication | Creor API",
  description:
    "Learn how to authenticate with the Creor API using API keys, device code flow, and JWT tokens.",
  path: "/docs/api/authentication",
});

export default function AuthenticationPage() {
  return (
    <DocsPage
      breadcrumb="API"
      title="Authentication"
      description="Every request to the Creor API must be authenticated. Creor supports three authentication methods depending on your integration context: API keys for server-to-server calls, device code flow for IDE integrations, and JWT tokens for the web dashboard."
      toc={[
        { label: "API Key Authentication", href: "#api-key" },
        { label: "Device Code Flow", href: "#device-code-flow" },
        { label: "JWT Tokens", href: "#jwt-tokens" },
        { label: "Code Examples", href: "#code-examples" },
        { label: "Security Best Practices", href: "#security" },
      ]}
    >
      <DocsSection id="api-key" title="API Key Authentication">
        <DocsParagraph>
          API keys are the simplest way to authenticate with the Creor API. They are
          intended for server-side integrations, scripts, and CI/CD pipelines where
          you can securely store a secret.
        </DocsParagraph>

        <DocsH3>Obtaining an API Key</DocsH3>
        <DocsList
          items={[
            "Sign in to the Creor dashboard at dashboard.creor.ai.",
            "Navigate to Settings > API Keys.",
            "Click \"Create New Key\" and give it a descriptive name.",
            "Copy the key immediately -- it is only shown once.",
          ]}
        />

        <DocsCallout type="warning">
          API keys grant full access to your account. Never commit them to version
          control, embed them in client-side code, or share them in public channels.
        </DocsCallout>

        <DocsH3>Basic Auth</DocsH3>
        <DocsParagraph>
          Pass your API key as the username in HTTP Basic Authentication. Leave the
          password field empty. The API server expects the key followed by a colon,
          base64-encoded in the Authorization header.
        </DocsParagraph>
        <DocsCode>{`curl https://api.creor.ai/v1/chat/completions \\
  -u YOUR_API_KEY:`}</DocsCode>

        <DocsParagraph>
          This is equivalent to setting the header directly:
        </DocsParagraph>
        <DocsCode>{`curl https://api.creor.ai/v1/chat/completions \\
  -H "Authorization: Basic $(echo -n 'YOUR_API_KEY:' | base64)"`}</DocsCode>

        <DocsH3>Bearer Token (Alternative)</DocsH3>
        <DocsParagraph>
          You can also pass the API key as a Bearer token. This is useful when
          working with SDKs that expect a Bearer token format.
        </DocsParagraph>
        <DocsCode>{`curl https://api.creor.ai/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</DocsCode>

        <DocsTable
          headers={["Method", "Header Format", "When to Use"]}
          rows={[
            ["Basic Auth", "Authorization: Basic base64(KEY:)", "Default. Works with curl -u flag."],
            ["Bearer Token", "Authorization: Bearer KEY", "SDKs that expect Bearer format (e.g., OpenAI SDK)."],
          ]}
        />
      </DocsSection>

      <DocsDivider />

      <DocsSection id="device-code-flow" title="Device Code Flow">
        <DocsParagraph>
          The device code flow is designed for IDE integrations where users
          authenticate through a browser. Creor&apos;s desktop editor uses this
          flow to sign users in without requiring them to paste an API key.
        </DocsParagraph>

        <DocsH3>How It Works</DocsH3>
        <DocsList
          items={[
            "The IDE requests a device code from the Creor auth server.",
            "The user is shown a URL and a short code to enter in their browser.",
            "The IDE polls the auth server until the user completes the browser flow.",
            "Once approved, the IDE receives an access token and a refresh token.",
            "The access token is used for API requests; the refresh token renews it when it expires.",
          ]}
        />

        <DocsH3>Step 1: Request a Device Code</DocsH3>
        <DocsCode>{`POST https://auth.creor.ai/device/code
Content-Type: application/json

{
  "client_id": "creor-ide",
  "scope": "api offline_access"
}`}</DocsCode>

        <DocsParagraph>
          The response includes a verification URL, a user code, and a device code
          for polling:
        </DocsParagraph>
        <DocsCode>{`{
  "device_code": "GmRhmhcxhwAzkoEqiMEg_DnyEysNkuNhszIySk9eS",
  "user_code": "WDJB-MJHT",
  "verification_uri": "https://creor.ai/activate",
  "expires_in": 900,
  "interval": 5
}`}</DocsCode>

        <DocsH3>Step 2: Direct the User to Verify</DocsH3>
        <DocsParagraph>
          Display the verification_uri and user_code to the user. They will open
          the URL in their browser, sign in (or use an existing session), and
          enter the code to authorize the device.
        </DocsParagraph>

        <DocsH3>Step 3: Poll for the Token</DocsH3>
        <DocsCode>{`POST https://auth.creor.ai/oauth/token
Content-Type: application/json

{
  "client_id": "creor-ide",
  "grant_type": "urn:ietf:params:oauth:grant-type:device_code",
  "device_code": "GmRhmhcxhwAzkoEqiMEg_DnyEysNkuNhszIySk9eS"
}`}</DocsCode>

        <DocsParagraph>
          Poll at the interval specified in the initial response (typically 5 seconds).
          The server returns authorization_pending until the user completes the flow,
          then returns the tokens:
        </DocsParagraph>
        <DocsCode>{`{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "v1.MR5wOHNlcnZlcl...",
  "token_type": "Bearer",
  "expires_in": 3600
}`}</DocsCode>

        <DocsCallout type="info">
          Store the refresh token securely in the OS keychain (macOS Keychain,
          Windows Credential Manager, or libsecret on Linux). Never write tokens
          to plain text files.
        </DocsCallout>
      </DocsSection>

      <DocsDivider />

      <DocsSection id="jwt-tokens" title="JWT Tokens">
        <DocsParagraph>
          The Creor web dashboard authenticates using JWT tokens issued after
          OAuth sign-in with GitHub or Google. These tokens are short-lived and
          automatically refreshed by the dashboard client.
        </DocsParagraph>

        <DocsH3>Token Structure</DocsH3>
        <DocsParagraph>
          Creor JWTs are signed with HS256 and contain the following claims:
        </DocsParagraph>
        <DocsTable
          headers={["Claim", "Description", "Example"]}
          rows={[
            ["sub", "User ID", "usr_a1b2c3d4e5"],
            ["email", "User email address", "dev@example.com"],
            ["role", "Account role", "authenticated"],
            ["iat", "Issued at (Unix timestamp)", "1712937600"],
            ["exp", "Expiration (Unix timestamp)", "1712941200"],
          ]}
        />

        <DocsH3>Using JWT Tokens</DocsH3>
        <DocsParagraph>
          Pass the JWT as a Bearer token in the Authorization header. This is
          the same format used for API keys, so the server distinguishes them
          by token format.
        </DocsParagraph>
        <DocsCode>{`curl https://api.creor.ai/v1/chat/completions \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."`}</DocsCode>

        <DocsH3>Refreshing Tokens</DocsH3>
        <DocsParagraph>
          When the access token expires, use the refresh token to obtain a new one
          without requiring the user to sign in again:
        </DocsParagraph>
        <DocsCode>{`POST https://auth.creor.ai/oauth/token
Content-Type: application/json

{
  "grant_type": "refresh_token",
  "refresh_token": "v1.MR5wOHNlcnZlcl..."
}`}</DocsCode>

        <DocsCallout type="tip">
          For server-side integrations, prefer API keys over JWT tokens. JWTs
          are designed for interactive sessions where a user is present.
        </DocsCallout>
      </DocsSection>

      <DocsDivider />

      <DocsSection id="code-examples" title="Code Examples">
        <DocsH3>curl</DocsH3>
        <DocsCode>{`# Basic Auth with API key
curl https://api.creor.ai/v1/chat/completions \\
  -u YOUR_API_KEY: \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "claude-sonnet-4-20250514",
    "messages": [
      {"role": "user", "content": "Explain async/await in JavaScript"}
    ]
  }'`}</DocsCode>

        <DocsH3>JavaScript / TypeScript</DocsH3>
        <DocsCode lines>{`import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.CREOR_API_KEY,
  baseURL: "https://api.creor.ai/v1",
});

const response = await client.chat.completions.create({
  model: "claude-sonnet-4-20250514",
  messages: [
    { role: "user", content: "Explain async/await in JavaScript" },
  ],
});

console.log(response.choices[0].message.content);`}</DocsCode>

        <DocsH3>Python</DocsH3>
        <DocsCode lines>{`import openai
import os

client = openai.OpenAI(
    api_key=os.environ["CREOR_API_KEY"],
    base_url="https://api.creor.ai/v1",
)

response = client.chat.completions.create(
    model="claude-sonnet-4-20250514",
    messages=[
        {"role": "user", "content": "Explain async/await in JavaScript"}
    ],
)

print(response.choices[0].message.content)`}</DocsCode>

        <DocsCallout type="tip">
          The Creor Gateway is OpenAI SDK-compatible. Point any OpenAI SDK at
          https://api.creor.ai/v1 and use your Creor API key -- no code changes
          needed beyond the base URL and key.
        </DocsCallout>
      </DocsSection>

      <DocsDivider />

      <DocsSection id="security" title="Security Best Practices">
        <DocsList
          items={[
            "Store API keys in environment variables or a secrets manager, never in source code.",
            "Use the least-privileged key scope for each integration.",
            "Rotate API keys periodically and immediately if you suspect a leak.",
            "Set IP allowlists on API keys when your integration runs from a fixed set of IPs.",
            "Use the device code flow for desktop applications instead of asking users to paste API keys.",
            "Monitor the API Keys page in the dashboard for unexpected usage patterns.",
            "Revoke unused keys promptly. Each key shows its last-used timestamp in the dashboard.",
          ]}
        />
      </DocsSection>
    </DocsPage>
  );
}
