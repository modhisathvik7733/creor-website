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
  title: "BYOK (Bring Your Own Key) | Creor",
  description:
    "Use your own API keys and any OpenAI-compatible endpoint with Creor. Connect custom models, self-hosted LLMs, and enterprise deployments.",
  path: "/docs/providers/byok",
});

export default function BYOKPage() {
  return (
    <DocsPage
      breadcrumb="Models & Providers"
      title="BYOK (Bring Your Own Key)"
      description="Bring Your Own Key lets you connect any LLM provider to Creor -- whether it's a supported provider with your own API key, a self-hosted model, or any service that exposes an OpenAI-compatible API."
      toc={[
        { label: "Overview", href: "#overview" },
        { label: "Adding Provider API Keys", href: "#adding-api-keys" },
        { label: "Custom OpenAI-Compatible Endpoints", href: "#custom-endpoints" },
        { label: "Self-Hosted Models", href: "#self-hosted-models" },
        { label: "Credential Storage", href: "#credential-storage" },
        { label: "Provider Configuration Reference", href: "#configuration-reference" },
        { label: "Troubleshooting", href: "#troubleshooting" },
      ]}
    >
      <DocsSection id="overview" title="Overview">
        <DocsParagraph>
          Creor supports two approaches for using your own keys:
        </DocsParagraph>
        <DocsList
          items={[
            "Direct API keys -- use your own credentials for any of the 19+ built-in providers (Anthropic, OpenAI, Google, etc.).",
            "Custom endpoints -- connect any service that implements the OpenAI-compatible chat/completions API format.",
          ]}
        />
        <DocsParagraph>
          Both methods give you full control over billing, rate limits, and data routing.
          Your API keys are stored securely in the OS keychain and never transmitted to Creor
          servers.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="adding-api-keys" title="Adding Provider API Keys">
        <DocsParagraph>
          For any supported provider, you can use your own API key instead of the Creor Gateway.
        </DocsParagraph>

        <DocsH3>Via Settings UI</DocsH3>
        <DocsList
          items={[
            "Open Creor and go to Settings.",
            "Navigate to the Providers section.",
            "Find the provider you want to configure.",
            "Enter your API key in the key field.",
            "The key is encrypted and stored in the OS keychain immediately.",
          ]}
        />

        <DocsH3>Via Environment Variables</DocsH3>
        <DocsParagraph>
          Each provider has a standard environment variable for its API key:
        </DocsParagraph>
        <DocsTable
          headers={["Provider", "Environment Variable"]}
          rows={[
            ["Anthropic", "ANTHROPIC_API_KEY"],
            ["OpenAI", "OPENAI_API_KEY"],
            ["Google AI Studio", "GOOGLE_GENERATIVE_AI_API_KEY"],
            ["Google Vertex", "GOOGLE_CLOUD_PROJECT (+ gcloud ADC)"],
            ["AWS Bedrock", "AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY"],
            ["Azure OpenAI", "AZURE_OPENAI_API_KEY + AZURE_OPENAI_ENDPOINT"],
            ["OpenRouter", "OPENROUTER_API_KEY"],
            ["Groq", "GROQ_API_KEY"],
            ["Together AI", "TOGETHER_AI_API_KEY"],
            ["DeepInfra", "DEEPINFRA_API_KEY"],
            ["Cerebras", "CEREBRAS_API_KEY"],
            ["Mistral", "MISTRAL_API_KEY"],
            ["Cohere", "COHERE_API_KEY"],
            ["Perplexity", "PERPLEXITY_API_KEY"],
            ["xAI", "XAI_API_KEY"],
            ["Vercel", "VERCEL_API_KEY"],
          ]}
        />

        <DocsH3>Via creor.json</DocsH3>
        <DocsCallout type="warning">
          Do not store API keys in <code className="text-[#FF6A13]">creor.json</code>. This file
          is typically checked into version control. Use the Settings UI (OS keychain) or
          environment variables for credentials.
        </DocsCallout>
        <DocsParagraph>
          Use <code className="text-[#FF6A13]">creor.json</code> only for non-secret provider
          configuration like base URLs, timeouts, and model filtering:
        </DocsParagraph>
        <DocsCode lines>{`{
  "provider": {
    "anthropic": {
      "whitelist": ["claude-sonnet-4-20250514"],
      "timeout": 600000
    }
  }
}`}</DocsCode>
      </DocsSection>

      <DocsSection id="custom-endpoints" title="Custom OpenAI-Compatible Endpoints">
        <DocsParagraph>
          Any service that implements the OpenAI chat/completions API format can be used as a
          provider in Creor. This includes LLM proxies, corporate API gateways, and
          OpenAI-compatible inference servers.
        </DocsParagraph>

        <DocsH3>Defining a Custom Provider</DocsH3>
        <DocsParagraph>
          Add a custom provider in <code className="text-[#FF6A13]">creor.json</code> using the{" "}
          <code className="text-[#FF6A13]">@ai-sdk/openai-compatible</code> npm adapter:
        </DocsParagraph>
        <DocsCode lines>{`{
  "provider": {
    "my-custom-llm": {
      "name": "My Custom LLM",
      "npm": "@ai-sdk/openai-compatible",
      "options": {
        "baseURL": "https://my-llm-proxy.company.com/v1"
      },
      "models": {
        "my-model-v1": {
          "name": "My Model v1",
          "capabilities": {
            "toolcall": true,
            "reasoning": false,
            "temperature": true
          },
          "limit": {
            "context": 128000,
            "output": 8192
          }
        }
      }
    }
  }
}`}</DocsCode>

        <DocsParagraph>
          Then reference it like any other model:
        </DocsParagraph>
        <DocsCode lines>{`{
  "model": "my-custom-llm/my-model-v1"
}`}</DocsCode>

        <DocsH3>Authentication for Custom Endpoints</DocsH3>
        <DocsParagraph>
          Set the API key for your custom provider via the Settings UI (it will be stored under
          the provider ID you chose) or via a provider-specific environment variable. You can
          also add headers directly in the provider options for token-based auth:
        </DocsParagraph>
        <DocsCode lines>{`{
  "provider": {
    "my-custom-llm": {
      "npm": "@ai-sdk/openai-compatible",
      "options": {
        "baseURL": "https://my-llm-proxy.company.com/v1",
        "headers": {
          "X-Custom-Auth": "Bearer token-here"
        }
      }
    }
  }
}`}</DocsCode>
      </DocsSection>

      <DocsSection id="self-hosted-models" title="Self-Hosted Models">
        <DocsParagraph>
          If you run your own LLM inference server (vLLM, Ollama, llama.cpp, TGI, etc.),
          you can connect it to Creor as long as it exposes an OpenAI-compatible API.
        </DocsParagraph>

        <DocsH3>Example: Ollama</DocsH3>
        <DocsCode lines>{`{
  "provider": {
    "ollama": {
      "name": "Ollama (Local)",
      "npm": "@ai-sdk/openai-compatible",
      "options": {
        "baseURL": "http://localhost:11434/v1"
      },
      "models": {
        "llama3.2:latest": {
          "name": "Llama 3.2 (Local)",
          "limit": {
            "context": 128000,
            "output": 4096
          }
        }
      }
    }
  }
}`}</DocsCode>

        <DocsH3>Example: vLLM</DocsH3>
        <DocsCode lines>{`{
  "provider": {
    "vllm": {
      "name": "vLLM Server",
      "npm": "@ai-sdk/openai-compatible",
      "options": {
        "baseURL": "http://gpu-server.local:8000/v1"
      },
      "models": {
        "meta-llama/Llama-3.3-70B-Instruct": {
          "name": "Llama 3.3 70B (Self-Hosted)",
          "limit": {
            "context": 128000,
            "output": 8192
          }
        }
      }
    }
  }
}`}</DocsCode>

        <DocsCallout type="tip">
          When using self-hosted models, you typically do not need an API key. If your server
          requires one, set it through the Settings UI under the custom provider name.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="credential-storage" title="Credential Storage">
        <DocsParagraph>
          Creor stores API keys securely using the operating system&apos;s native credential
          manager:
        </DocsParagraph>
        <DocsTable
          headers={["OS", "Storage Backend"]}
          rows={[
            ["macOS", "Keychain (via SecretStorage API)"],
            ["Linux", "libsecret / GNOME Keyring / KWallet"],
            ["Windows", "Windows Credential Manager"],
          ]}
        />
        <DocsParagraph>
          Keys entered through the Settings UI are encrypted at rest and never written to disk
          in plaintext. They are not included in <code className="text-[#FF6A13]">creor.json</code> or
          any other configuration file.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="configuration-reference" title="Provider Configuration Reference">
        <DocsParagraph>
          The full provider configuration schema in <code className="text-[#FF6A13]">creor.json</code>:
        </DocsParagraph>
        <DocsCode lines>{`{
  "provider": {
    "<provider-id>": {
      // Display name in the UI
      "name": "My Provider",

      // AI SDK adapter package
      "npm": "@ai-sdk/openai-compatible",

      // API base URL
      "api": "https://api.example.com/v1",

      // Options passed to the SDK adapter
      "options": {
        "baseURL": "https://api.example.com/v1",
        "headers": { "X-Custom": "value" }
      },

      // Only show these models (model IDs)
      "whitelist": ["model-a", "model-b"],

      // Hide these models from the selector
      "blacklist": ["model-c"],

      // Define or override model metadata
      "models": {
        "model-a": {
          "name": "Model A",
          "capabilities": { "toolcall": true },
          "limit": { "context": 128000, "output": 8192 }
        }
      },

      // Request timeout in ms (default: 300000)
      // Set to false to disable timeout
      "timeout": 600000
    }
  }
}`}</DocsCode>
      </DocsSection>

      <DocsSection id="troubleshooting" title="Troubleshooting">
        <DocsH3>Provider not showing up</DocsH3>
        <DocsList
          items={[
            "Make sure the API key is set (via Settings UI or environment variable).",
            "Check that the provider is not in your disabled_providers list.",
            "If using enabled_providers, make sure your provider is included.",
            "Restart Creor after changing environment variables.",
          ]}
        />

        <DocsH3>Authentication errors</DocsH3>
        <DocsList
          items={[
            "Verify your API key is valid and has not expired.",
            "Check that your account has billing/credits set up with the provider.",
            "For custom endpoints, verify the base URL is correct and the server is running.",
            "Check Creor logs for detailed error messages.",
          ]}
        />

        <DocsH3>Custom endpoint returning errors</DocsH3>
        <DocsList
          items={[
            "Ensure the endpoint implements the OpenAI chat/completions format.",
            "Verify the model ID matches what your server expects.",
            "Check that the context and output limits in your config match the server's capabilities.",
            "Try increasing the timeout if the server is slow to respond.",
          ]}
        />
      </DocsSection>

      <DocsDivider />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DocsCard
          title="Overview"
          description="See all supported providers and how model selection works."
          href="/docs/providers/overview"
        />
        <DocsCard
          title="Creor Gateway"
          description="Use the built-in gateway if you prefer zero-config setup."
          href="/docs/providers/gateway"
        />
      </div>
    </DocsPage>
  );
}
