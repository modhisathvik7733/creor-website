import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import {
  DocsPage,
  DocsSection,
  DocsH3,
  DocsParagraph,
  DocsCode,
  DocsList,
  DocsCallout,
  DocsTable,
  DocsDivider,
  DocsCard,
} from "@/components/docs-page";

export const metadata: Metadata = generatePageMetadata({
  title: "AWS Bedrock | Creor",
  description:
    "Configure AWS Bedrock in Creor to use Claude, Llama, Mistral, and Amazon Nova models through your AWS infrastructure.",
  path: "/docs/providers/bedrock",
});

export default function BedrockPage() {
  return (
    <DocsPage
      breadcrumb="Models & Providers"
      title="AWS Bedrock"
      description="AWS Bedrock lets you access Claude, Llama, Mistral, Amazon Nova, and DeepSeek models through your existing AWS infrastructure. All traffic stays within AWS, making it ideal for organizations with strict compliance requirements."
      toc={[
        { label: "Available Models", href: "#available-models" },
        { label: "Setup", href: "#setup" },
        { label: "Configuration", href: "#configuration" },
        { label: "Region and Cross-Region Inference", href: "#region-inference" },
        { label: "Authentication Methods", href: "#authentication-methods" },
        { label: "Advanced Options", href: "#advanced-options" },
        { label: "Best For", href: "#best-for" },
      ]}
    >
      <DocsSection id="available-models" title="Available Models">
        <DocsParagraph>
          AWS Bedrock hosts models from multiple providers. Available models depend on your
          AWS region and account access.
        </DocsParagraph>
        <DocsTable
          headers={["Model Family", "Example Model IDs", "Provider"]}
          rows={[
            ["Claude 4 Sonnet", "anthropic.claude-sonnet-4-20250514-v1:0", "Anthropic"],
            ["Claude 4 Opus", "anthropic.claude-opus-4-20250514-v1:0", "Anthropic"],
            ["Claude 3.5 Haiku", "anthropic.claude-3-5-haiku-20241022-v1:0", "Anthropic"],
            ["Llama 3.x", "meta.llama3-70b-instruct-v1:0", "Meta"],
            ["Mistral Large", "mistral.mistral-large-2407-v1:0", "Mistral"],
            ["Amazon Nova Pro", "amazon.nova-pro-v1:0", "Amazon"],
            ["Amazon Nova Lite", "amazon.nova-lite-v1:0", "Amazon"],
            ["Amazon Nova Micro", "amazon.nova-micro-v1:0", "Amazon"],
            ["DeepSeek", "deepseek.deepseek-r1-v1:0", "DeepSeek"],
          ]}
        />
        <DocsCallout type="info">
          You must request access to models in the AWS Bedrock console before they can be used.
          Go to the Bedrock console, select "Model access" in the sidebar, and enable the models
          you need.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="setup" title="Setup">
        <DocsH3>Prerequisites</DocsH3>
        <DocsList
          items={[
            "An AWS account with Bedrock access enabled.",
            "IAM credentials with bedrock:InvokeModel and bedrock:InvokeModelWithResponseStream permissions.",
            "The desired models enabled in your Bedrock console for your region.",
          ]}
        />

        <DocsH3>Step 1: Configure AWS Credentials</DocsH3>
        <DocsParagraph>
          The simplest approach is to use the AWS CLI to configure your credentials:
        </DocsParagraph>
        <DocsCode>{`aws configure`}</DocsCode>
        <DocsParagraph>
          Or set environment variables directly:
        </DocsParagraph>
        <DocsCode lines>{`export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_REGION="us-east-1"`}</DocsCode>

        <DocsH3>Step 2: Verify Access</DocsH3>
        <DocsParagraph>
          Once credentials are configured, Creor auto-detects the Bedrock provider. No
          additional setup is needed in Creor.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="configuration" title="Configuration">
        <DocsParagraph>
          Set a Bedrock model as your default in <code className="text-[#FF6A13]">creor.json</code>:
        </DocsParagraph>
        <DocsCode lines>{`{
  "model": "amazon-bedrock/anthropic.claude-sonnet-4-20250514-v1:0"
}`}</DocsCode>

        <DocsParagraph>
          Use different Bedrock models for different agents:
        </DocsParagraph>
        <DocsCode lines>{`{
  "agent": {
    "build": {
      "model": "amazon-bedrock/anthropic.claude-sonnet-4-20250514-v1:0"
    },
    "plan": {
      "model": "amazon-bedrock/anthropic.claude-opus-4-20250514-v1:0"
    },
    "explore": {
      "model": "amazon-bedrock/amazon.nova-lite-v1:0"
    }
  }
}`}</DocsCode>
      </DocsSection>

      <DocsSection id="region-inference" title="Region and Cross-Region Inference">
        <DocsParagraph>
          Bedrock automatically applies cross-region inference prefixes based on your configured
          AWS region. For example, if you are in <code className="text-[#FF6A13]">us-east-1</code>,
          Claude models are automatically prefixed with <code className="text-[#FF6A13]">us.</code> for
          cross-region inference.
        </DocsParagraph>
        <DocsTable
          headers={["Region Prefix", "AWS Regions", "Example"]}
          rows={[
            ["us.", "us-east-1, us-west-2, etc.", "us.anthropic.claude-sonnet-4-20250514-v1:0"],
            ["eu.", "eu-west-1, eu-central-1, etc.", "eu.anthropic.claude-sonnet-4-20250514-v1:0"],
            ["jp.", "ap-northeast-1", "jp.anthropic.claude-sonnet-4-20250514-v1:0"],
            ["apac.", "ap-southeast-1, ap-south-1, etc.", "apac.anthropic.claude-sonnet-4-20250514-v1:0"],
            ["au.", "ap-southeast-2, ap-southeast-4", "au.anthropic.claude-sonnet-4-20250514-v1:0"],
          ]}
        />
        <DocsParagraph>
          You can also manually specify a cross-region prefix in the model ID (e.g.,{" "}
          <code className="text-[#FF6A13]">global.anthropic.claude-sonnet-4-20250514-v1:0</code>)
          and Creor will use it as-is without adding another prefix.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="authentication-methods" title="Authentication Methods">
        <DocsParagraph>
          Creor supports multiple AWS authentication methods, resolved in this order:
        </DocsParagraph>

        <DocsH3>1. AWS Bearer Token</DocsH3>
        <DocsParagraph>
          Set via environment variable or the Creor Settings UI:
        </DocsParagraph>
        <DocsCode>{`export AWS_BEARER_TOKEN_BEDROCK="your-bearer-token"`}</DocsCode>

        <DocsH3>2. AWS Credential Chain</DocsH3>
        <DocsParagraph>
          If no bearer token is set, Creor uses the standard AWS credential provider chain:
        </DocsParagraph>
        <DocsList
          items={[
            "Environment variables (AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY)",
            "Named AWS profile (via AWS_PROFILE or creor.json config)",
            "Web identity token (AWS_WEB_IDENTITY_TOKEN_FILE for EKS/IRSA)",
            "Instance metadata (EC2 instance roles)",
          ]}
        />

        <DocsH3>3. Named Profile</DocsH3>
        <DocsParagraph>
          Use a specific AWS profile from <code className="text-[#FF6A13]">~/.aws/credentials</code>:
        </DocsParagraph>
        <DocsCode lines>{`{
  "provider": {
    "amazon-bedrock": {
      "options": {
        "profile": "my-bedrock-profile",
        "region": "us-west-2"
      }
    }
  }
}`}</DocsCode>
      </DocsSection>

      <DocsSection id="advanced-options" title="Advanced Options">
        <DocsH3>Custom Endpoint</DocsH3>
        <DocsParagraph>
          For VPC endpoints or custom Bedrock endpoints:
        </DocsParagraph>
        <DocsCode lines>{`{
  "provider": {
    "amazon-bedrock": {
      "options": {
        "endpoint": "https://vpce-xxx.bedrock-runtime.us-east-1.vpce.amazonaws.com",
        "region": "us-east-1"
      }
    }
  }
}`}</DocsCode>

        <DocsH3>Region Override</DocsH3>
        <DocsParagraph>
          Override the region at the provider level (takes precedence over the{" "}
          <code className="text-[#FF6A13]">AWS_REGION</code> environment variable):
        </DocsParagraph>
        <DocsCode lines>{`{
  "provider": {
    "amazon-bedrock": {
      "options": {
        "region": "eu-west-1"
      }
    }
  }
}`}</DocsCode>
      </DocsSection>

      <DocsSection id="best-for" title="Best For">
        <DocsList
          items={[
            "Organizations that must keep all traffic within AWS infrastructure.",
            "Teams using AWS IAM for access control and audit logging.",
            "Deployments requiring VPC endpoints for network isolation.",
            "Multi-model strategies using Claude, Llama, and Nova through a single provider.",
            "Compliance-driven environments (SOC 2, HIPAA, FedRAMP).",
          ]}
        />
      </DocsSection>

      <DocsDivider />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DocsCard
          title="Anthropic (Direct)"
          description="Use Claude models directly through Anthropic's API."
          href="/docs/providers/anthropic"
        />
        <DocsCard
          title="Azure OpenAI"
          description="Run GPT models on Azure infrastructure."
          href="/docs/providers/azure"
        />
      </div>
    </DocsPage>
  );
}
