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
  title: "Open Source & Other Providers | Creor",
  description:
    "Configure Groq, Together AI, DeepInfra, Cerebras, Mistral, Cohere, Perplexity, xAI (Grok), and Vercel in Creor.",
  path: "/docs/providers/open-source",
});

export default function OpenSourcePage() {
  return (
    <DocsPage
      breadcrumb="Models & Providers"
      title="Open Source & Other Providers"
      description="Creor supports a wide range of inference providers that host open-source models, specialized models, and fast-inference hardware. Each provider has different strengths -- from raw speed to specialized capabilities."
      toc={[
        { label: "Provider Comparison", href: "#provider-comparison" },
        { label: "Groq", href: "#groq" },
        { label: "Together AI", href: "#together-ai" },
        { label: "DeepInfra", href: "#deepinfra" },
        { label: "Cerebras", href: "#cerebras" },
        { label: "Mistral", href: "#mistral" },
        { label: "Cohere", href: "#cohere" },
        { label: "Perplexity", href: "#perplexity" },
        { label: "xAI (Grok)", href: "#xai" },
        { label: "Vercel", href: "#vercel" },
      ]}
    >
      <DocsSection id="provider-comparison" title="Provider Comparison">
        <DocsTable
          headers={["Provider", "Key Models", "Auth Env Var", "Best For"]}
          rows={[
            ["Groq", "Llama 3.x, Mixtral, Gemma", "GROQ_API_KEY", "Ultra-fast inference (LPU hardware)"],
            ["Together AI", "Llama 3.x, Qwen 2.5, DeepSeek, Mixtral", "TOGETHER_AI_API_KEY", "Wide open-source model selection"],
            ["DeepInfra", "Llama 3.x, Mistral, Qwen", "DEEPINFRA_API_KEY", "Cost-effective open models"],
            ["Cerebras", "Llama 3.x", "CEREBRAS_API_KEY", "Wafer-scale inference speed"],
            ["Mistral", "Mistral Large, Codestral, Ministral", "MISTRAL_API_KEY", "European AI, code generation"],
            ["Cohere", "Command R, Command R+", "COHERE_API_KEY", "RAG and enterprise search"],
            ["Perplexity", "Sonar Pro, Sonar", "PERPLEXITY_API_KEY", "Web-grounded, up-to-date answers"],
            ["xAI", "Grok 3, Grok 3 Mini", "XAI_API_KEY", "Reasoning, real-time knowledge"],
            ["Vercel", "v0 models", "VERCEL_API_KEY", "Vercel platform integration"],
          ]}
        />
        <DocsCallout type="tip">
          All of these providers follow the same setup pattern: get an API key, set it as an
          environment variable or in the Settings UI, and reference models with the{" "}
          <code className="text-[#FF6A13]">provider/model-id</code> format.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="groq" title="Groq">
        <DocsParagraph>
          Groq runs inference on custom LPU (Language Processing Unit) hardware, delivering
          some of the fastest token generation speeds available. Ideal for rapid iteration
          and tasks where latency matters more than model size.
        </DocsParagraph>

        <DocsH3>Setup</DocsH3>
        <DocsList
          items={[
            "Sign up at console.groq.com.",
            "Create an API key from the dashboard.",
            "Set the environment variable or add the key in Creor Settings.",
          ]}
        />
        <DocsCode>{`export GROQ_API_KEY="gsk_your-key-here"`}</DocsCode>

        <DocsH3>Configuration</DocsH3>
        <DocsCode lines>{`{
  "model": "groq/llama-3.3-70b-versatile"
}`}</DocsCode>

        <DocsH3>Popular Models</DocsH3>
        <DocsTable
          headers={["Model", "Model ID", "Parameters"]}
          rows={[
            ["Llama 3.3 70B", "llama-3.3-70b-versatile", "70B"],
            ["Llama 3.1 8B", "llama-3.1-8b-instant", "8B"],
            ["Mixtral 8x7B", "mixtral-8x7b-32768", "46.7B (MoE)"],
            ["Gemma 2 9B", "gemma2-9b-it", "9B"],
          ]}
        />
      </DocsSection>

      <DocsSection id="together-ai" title="Together AI">
        <DocsParagraph>
          Together AI hosts the widest selection of open-source models, from Llama and Qwen to
          DeepSeek and Mixtral. It offers both serverless and dedicated inference options.
        </DocsParagraph>

        <DocsH3>Setup</DocsH3>
        <DocsList
          items={[
            "Sign up at api.together.xyz.",
            "Create an API key from your account dashboard.",
            "Set the environment variable or add the key in Creor Settings.",
          ]}
        />
        <DocsCode>{`export TOGETHER_AI_API_KEY="your-key-here"`}</DocsCode>

        <DocsH3>Configuration</DocsH3>
        <DocsCode lines>{`{
  "model": "togetherai/meta-llama/Llama-3.3-70B-Instruct-Turbo"
}`}</DocsCode>

        <DocsH3>Popular Models</DocsH3>
        <DocsTable
          headers={["Model", "Model ID", "Parameters"]}
          rows={[
            ["Llama 3.3 70B Turbo", "meta-llama/Llama-3.3-70B-Instruct-Turbo", "70B"],
            ["Qwen 2.5 72B", "Qwen/Qwen2.5-72B-Instruct-Turbo", "72B"],
            ["DeepSeek V3", "deepseek-ai/DeepSeek-V3", "671B (MoE)"],
            ["Mixtral 8x22B", "mistralai/Mixtral-8x22B-Instruct-v0.1", "141B (MoE)"],
          ]}
        />
      </DocsSection>

      <DocsSection id="deepinfra" title="DeepInfra">
        <DocsParagraph>
          DeepInfra provides cost-effective inference for popular open-source models with
          competitive pricing and low latency.
        </DocsParagraph>

        <DocsH3>Setup</DocsH3>
        <DocsList
          items={[
            "Sign up at deepinfra.com.",
            "Get your API key from the dashboard.",
            "Set the environment variable or add the key in Creor Settings.",
          ]}
        />
        <DocsCode>{`export DEEPINFRA_API_KEY="your-key-here"`}</DocsCode>

        <DocsH3>Configuration</DocsH3>
        <DocsCode lines>{`{
  "model": "deepinfra/meta-llama/Llama-3.3-70B-Instruct"
}`}</DocsCode>
      </DocsSection>

      <DocsSection id="cerebras" title="Cerebras">
        <DocsParagraph>
          Cerebras uses wafer-scale engine (WSE) chips to deliver extremely fast inference.
          Currently supports Llama models with industry-leading tokens-per-second throughput.
        </DocsParagraph>

        <DocsH3>Setup</DocsH3>
        <DocsList
          items={[
            "Sign up at cloud.cerebras.ai.",
            "Create an API key from the console.",
            "Set the environment variable or add the key in Creor Settings.",
          ]}
        />
        <DocsCode>{`export CEREBRAS_API_KEY="your-key-here"`}</DocsCode>

        <DocsH3>Configuration</DocsH3>
        <DocsCode lines>{`{
  "model": "cerebras/llama-3.3-70b"
}`}</DocsCode>
      </DocsSection>

      <DocsSection id="mistral" title="Mistral">
        <DocsParagraph>
          Mistral is a European AI company offering models optimized for code generation,
          multilingual tasks, and efficient inference. Their Codestral model is purpose-built
          for coding.
        </DocsParagraph>

        <DocsH3>Setup</DocsH3>
        <DocsList
          items={[
            "Sign up at console.mistral.ai.",
            "Create an API key from the dashboard.",
            "Set the environment variable or add the key in Creor Settings.",
          ]}
        />
        <DocsCode>{`export MISTRAL_API_KEY="your-key-here"`}</DocsCode>

        <DocsH3>Configuration</DocsH3>
        <DocsCode lines>{`{
  "model": "mistral/mistral-large-latest"
}`}</DocsCode>

        <DocsH3>Popular Models</DocsH3>
        <DocsTable
          headers={["Model", "Model ID", "Best For"]}
          rows={[
            ["Mistral Large", "mistral-large-latest", "Complex reasoning, multilingual"],
            ["Codestral", "codestral-latest", "Code generation and completion"],
            ["Ministral 8B", "ministral-8b-latest", "Fast, lightweight tasks"],
          ]}
        />
      </DocsSection>

      <DocsSection id="cohere" title="Cohere">
        <DocsParagraph>
          Cohere specializes in enterprise AI with models optimized for retrieval-augmented
          generation (RAG) and search. Their Command R models excel at grounded, factual responses.
        </DocsParagraph>

        <DocsH3>Setup</DocsH3>
        <DocsList
          items={[
            "Sign up at dashboard.cohere.com.",
            "Create an API key from the API keys page.",
            "Set the environment variable or add the key in Creor Settings.",
          ]}
        />
        <DocsCode>{`export COHERE_API_KEY="your-key-here"`}</DocsCode>

        <DocsH3>Configuration</DocsH3>
        <DocsCode lines>{`{
  "model": "cohere/command-r-plus"
}`}</DocsCode>
      </DocsSection>

      <DocsSection id="perplexity" title="Perplexity">
        <DocsParagraph>
          Perplexity&apos;s Sonar models are grounded in real-time web search results, making
          them excellent for questions that require up-to-date information about libraries,
          APIs, or recent changes.
        </DocsParagraph>

        <DocsH3>Setup</DocsH3>
        <DocsList
          items={[
            "Sign up at perplexity.ai and access the API section.",
            "Create an API key.",
            "Set the environment variable or add the key in Creor Settings.",
          ]}
        />
        <DocsCode>{`export PERPLEXITY_API_KEY="pplx-your-key-here"`}</DocsCode>

        <DocsH3>Configuration</DocsH3>
        <DocsCode lines>{`{
  "model": "perplexity/sonar-pro"
}`}</DocsCode>
      </DocsSection>

      <DocsSection id="xai" title="xAI (Grok)">
        <DocsParagraph>
          xAI&apos;s Grok models combine strong reasoning with access to real-time knowledge.
          Grok 3 is competitive with frontier models on coding and reasoning benchmarks.
        </DocsParagraph>

        <DocsH3>Setup</DocsH3>
        <DocsList
          items={[
            "Sign up at console.x.ai.",
            "Create an API key from the dashboard.",
            "Set the environment variable or add the key in Creor Settings.",
          ]}
        />
        <DocsCode>{`export XAI_API_KEY="xai-your-key-here"`}</DocsCode>

        <DocsH3>Configuration</DocsH3>
        <DocsCode lines>{`{
  "model": "xai/grok-3"
}`}</DocsCode>

        <DocsH3>Available Models</DocsH3>
        <DocsTable
          headers={["Model", "Model ID", "Best For"]}
          rows={[
            ["Grok 3", "grok-3", "Complex reasoning, full capability"],
            ["Grok 3 Mini", "grok-3-mini", "Fast reasoning, lower cost"],
          ]}
        />
      </DocsSection>

      <DocsSection id="vercel" title="Vercel">
        <DocsParagraph>
          Vercel provides model access through the Vercel AI platform. This is useful for teams
          already using the Vercel ecosystem.
        </DocsParagraph>

        <DocsH3>Setup</DocsH3>
        <DocsList
          items={[
            "Go to vercel.com and sign in.",
            "Navigate to your account settings and find the API tokens section.",
            "Create a token with the appropriate permissions.",
          ]}
        />
        <DocsCode>{`export VERCEL_API_KEY="your-vercel-token"`}</DocsCode>

        <DocsH3>Configuration</DocsH3>
        <DocsCode lines>{`{
  "model": "vercel/v0-1.0-md"
}`}</DocsCode>
      </DocsSection>

      <DocsDivider />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DocsCard
          title="OpenRouter"
          description="Access 100+ models through a single API key."
          href="/docs/providers/openrouter"
        />
        <DocsCard
          title="BYOK"
          description="Use any OpenAI-compatible endpoint."
          href="/docs/providers/byok"
        />
      </div>
    </DocsPage>
  );
}
