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
  title: "Azure OpenAI | Creor",
  description:
    "Configure Azure OpenAI in Creor to use GPT-4o, o-series, and other OpenAI models through your Azure infrastructure.",
  path: "/docs/providers/azure",
});

export default function AzurePage() {
  return (
    <DocsPage
      breadcrumb="Models & Providers"
      title="Azure OpenAI"
      description="Azure OpenAI lets you run GPT and o-series models on Azure infrastructure with enterprise-grade security, compliance, and regional data residency."
      toc={[
        { label: "Available Models", href: "#available-models" },
        { label: "Setup", href: "#setup" },
        { label: "Configuration", href: "#configuration" },
        { label: "Azure Cognitive Services", href: "#azure-cognitive-services" },
        { label: "Advanced Options", href: "#advanced-options" },
        { label: "Best For", href: "#best-for" },
      ]}
    >
      <DocsSection id="available-models" title="Available Models">
        <DocsParagraph>
          Azure OpenAI hosts the same models as OpenAI but through Azure&apos;s infrastructure.
          Available models depend on your Azure region and deployment.
        </DocsParagraph>
        <DocsTable
          headers={["Model", "Deployment Name (typical)", "Best For"]}
          rows={[
            ["GPT-4o", "gpt-4o", "General-purpose coding, fast responses"],
            ["GPT-4o Mini", "gpt-4o-mini", "Cost-effective lightweight tasks"],
            ["GPT-4 Turbo", "gpt-4-turbo", "Complex coding with vision support"],
            ["o3", "o3", "Advanced reasoning, complex architectures"],
            ["o3-mini", "o3-mini", "Fast reasoning at lower cost"],
            ["o4-mini", "o4-mini", "Newest reasoning model"],
          ]}
        />
        <DocsCallout type="info">
          In Azure OpenAI, you create &quot;deployments&quot; with custom names. The model ID you
          use in Creor is your deployment name, not the base model name. For example, if you
          deployed GPT-4o as &quot;my-gpt4o&quot;, you would use that as the model ID.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="setup" title="Setup">
        <DocsH3>Prerequisites</DocsH3>
        <DocsList
          items={[
            "An Azure subscription with Azure OpenAI access approved.",
            "An Azure OpenAI resource created in the Azure portal.",
            "At least one model deployed in your Azure OpenAI resource.",
          ]}
        />

        <DocsH3>Step 1: Get Your Credentials</DocsH3>
        <DocsParagraph>
          From the Azure portal, navigate to your Azure OpenAI resource and collect:
        </DocsParagraph>
        <DocsList
          items={[
            "Endpoint URL -- found in the \"Keys and Endpoint\" section (e.g., https://your-resource.openai.azure.com).",
            "API Key -- either Key 1 or Key 2 from the same section.",
            "Deployment name -- the name you gave your model deployment.",
          ]}
        />

        <DocsH3>Step 2: Configure Environment Variables</DocsH3>
        <DocsCode lines>{`export AZURE_OPENAI_API_KEY="your-azure-api-key"
export AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com"
export AZURE_OPENAI_DEPLOYMENT="your-deployment-name"`}</DocsCode>

        <DocsH3>Step 3: Set the Model in Creor</DocsH3>
        <DocsParagraph>
          Reference Azure models using the <code className="text-[#FF6A13]">azure/</code> provider
          prefix followed by your deployment name:
        </DocsParagraph>
        <DocsCode lines>{`{
  "model": "azure/your-deployment-name"
}`}</DocsCode>
      </DocsSection>

      <DocsSection id="configuration" title="Configuration">
        <DocsH3>Basic Configuration</DocsH3>
        <DocsCode lines>{`{
  "model": "azure/gpt-4o",
  "provider": {
    "azure": {
      "options": {
        "baseURL": "https://your-resource.openai.azure.com/openai"
      }
    }
  }
}`}</DocsCode>

        <DocsH3>Multiple Deployments</DocsH3>
        <DocsParagraph>
          Use different Azure deployments for different agents:
        </DocsParagraph>
        <DocsCode lines>{`{
  "agent": {
    "build": {
      "model": "azure/gpt-4o-deploy"
    },
    "plan": {
      "model": "azure/o3-deploy"
    }
  }
}`}</DocsCode>

        <DocsH3>Completion URLs Mode</DocsH3>
        <DocsParagraph>
          If your Azure deployment uses the older completions API instead of the responses API,
          enable the <code className="text-[#FF6A13]">useCompletionUrls</code> option:
        </DocsParagraph>
        <DocsCode lines>{`{
  "provider": {
    "azure": {
      "options": {
        "useCompletionUrls": true
      }
    }
  }
}`}</DocsCode>
      </DocsSection>

      <DocsSection id="azure-cognitive-services" title="Azure Cognitive Services">
        <DocsParagraph>
          Creor also supports the Azure Cognitive Services endpoint variant, which uses a
          different base URL pattern. This is common in enterprise Azure setups.
        </DocsParagraph>
        <DocsCode lines>{`# Set the resource name
export AZURE_COGNITIVE_SERVICES_RESOURCE_NAME="your-resource-name"

# The endpoint becomes:
# https://your-resource-name.cognitiveservices.azure.com/openai`}</DocsCode>
        <DocsParagraph>
          Use the <code className="text-[#FF6A13]">azure-cognitive-services</code> provider prefix:
        </DocsParagraph>
        <DocsCode lines>{`{
  "model": "azure-cognitive-services/your-deployment-name"
}`}</DocsCode>
      </DocsSection>

      <DocsSection id="advanced-options" title="Advanced Options">
        <DocsH3>API Version</DocsH3>
        <DocsParagraph>
          Azure OpenAI APIs are versioned. If you need a specific API version:
        </DocsParagraph>
        <DocsCode>{`export AZURE_OPENAI_API_VERSION="2024-12-01-preview"`}</DocsCode>

        <DocsH3>Request Timeout</DocsH3>
        <DocsCode lines>{`{
  "provider": {
    "azure": {
      "timeout": 600000
    }
  }
}`}</DocsCode>

        <DocsH3>Model Filtering</DocsH3>
        <DocsCode lines>{`{
  "provider": {
    "azure": {
      "whitelist": ["gpt-4o-deploy", "o3-deploy"]
    }
  }
}`}</DocsCode>
      </DocsSection>

      <DocsSection id="best-for" title="Best For">
        <DocsList
          items={[
            "Organizations that must keep traffic within Azure infrastructure.",
            "Teams using Azure Active Directory for access control.",
            "Deployments requiring regional data residency (EU, Asia, etc.).",
            "Enterprise compliance requirements (SOC 2, ISO 27001, HIPAA).",
            "Companies with existing Azure OpenAI commitments or reserved capacity.",
          ]}
        />
      </DocsSection>

      <DocsDivider />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DocsCard
          title="OpenAI (Direct)"
          description="Use OpenAI models directly through the OpenAI API."
          href="/docs/providers/openai"
        />
        <DocsCard
          title="AWS Bedrock"
          description="Run Claude and other models on AWS infrastructure."
          href="/docs/providers/bedrock"
        />
      </div>
    </DocsPage>
  );
}
