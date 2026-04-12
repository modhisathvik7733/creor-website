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
  title: "Codebase Search Configuration | Creor",
  description:
    "Configure embedding providers, vector store, rerankers, and search behavior for Creor's codebase search.",
  path: "/docs/rag/configuration",
});

export default function RagConfigurationPage() {
  return (
    <DocsPage
      breadcrumb="Codebase Search"
      title="Configuration"
      description="Customize the codebase search pipeline by choosing embedding providers, configuring the vector store, and tuning search behavior. All settings live in your project's creor.json file or the RAG plugin configuration."
      toc={[
        { label: "Embedding Providers", href: "#embedding-providers" },
        { label: "Vector Store", href: "#vector-store" },
        { label: "Reranking", href: "#reranking" },
        { label: "Search Tuning", href: "#search-tuning" },
        { label: "Full Configuration Reference", href: "#full-configuration" },
        { label: "Next Steps", href: "#next-steps" },
      ]}
    >
      <DocsSection id="embedding-providers" title="Embedding Providers">
        <DocsParagraph>
          Creor supports two embedding providers out of the box. The embedding model converts
          code chunks into vectors for semantic search. Choose based on your use case and
          API access.
        </DocsParagraph>

        <DocsH3>Voyage AI</DocsH3>
        <DocsParagraph>
          Voyage AI offers embedding models specifically optimized for code. The voyage-code-3
          model is the default and recommended choice for most codebases.
        </DocsParagraph>
        <DocsTable
          headers={["Model", "Dimensions", "Max Tokens", "Best For"]}
          rows={[
            ["voyage-code-3", "1024", "16000", "Code-heavy repositories. Best code retrieval quality."],
            ["voyage-3-large", "1024", "32000", "Mixed code and documentation. Larger context window."],
            ["voyage-3-lite", "512", "16000", "Budget-conscious usage. Faster, lower cost per embedding."],
          ]}
        />
        <DocsCode lines>{`{
  "plugins": {
    "devflow-rag": {
      "embedding": {
        "provider": "voyage",
        "model": "voyage-code-3",
        "apiKey": "$VOYAGE_API_KEY"
      }
    }
  }
}`}</DocsCode>
        <DocsCallout type="tip">
          Use an environment variable reference ($VOYAGE_API_KEY) instead of hardcoding your key
          in creor.json. Creor resolves environment variables at runtime.
        </DocsCallout>

        <DocsH3>Nomic</DocsH3>
        <DocsParagraph>
          Nomic provides open-weight embedding models with a generous free tier. A good alternative
          if you do not have Voyage AI access.
        </DocsParagraph>
        <DocsTable
          headers={["Model", "Dimensions", "Max Tokens", "Best For"]}
          rows={[
            ["nomic-embed-text-v1.5", "768", "8192", "General-purpose text and code embedding."],
            ["nomic-embed-code-v1", "768", "8192", "Code-specific embedding with improved identifier handling."],
          ]}
        />
        <DocsCode lines>{`{
  "plugins": {
    "devflow-rag": {
      "embedding": {
        "provider": "nomic",
        "model": "nomic-embed-text-v1.5",
        "apiKey": "$NOMIC_API_KEY"
      }
    }
  }
}`}</DocsCode>

        <DocsH3>Creor Gateway</DocsH3>
        <DocsParagraph>
          If you are signed into Creor with an active subscription, embeddings are routed through
          the Creor Gateway by default. This means you do not need to configure a separate
          embedding API key -- it is included in your plan.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="vector-store" title="Vector Store">
        <DocsParagraph>
          Creor uses LanceDB as its local vector store. LanceDB is an embedded vector database
          that runs in-process with no external dependencies -- no Docker containers, no separate
          server processes.
        </DocsParagraph>

        <DocsH3>Why LanceDB</DocsH3>
        <DocsList
          items={[
            "Zero configuration: works out of the box with no setup.",
            "Fast: optimized columnar storage with SIMD-accelerated similarity search.",
            "Compact: stores vectors efficiently on disk. A 10K-file codebase typically uses 50-100 MB.",
            "Portable: the entire index is a directory of files that can be copied or deleted.",
          ]}
        />

        <DocsH3>Storage Settings</DocsH3>
        <DocsTable
          headers={["Setting", "Default", "Description"]}
          rows={[
            ["storagePath", ".creor/rag/index", "Directory for the vector store files."],
            ["tableName", "code_chunks", "Name of the LanceDB table. Change if running multiple index configs."],
            ["overwrite", "false", "If true, drops and recreates the table on each full index. Use for debugging."],
          ]}
        />
        <DocsCode lines>{`{
  "plugins": {
    "devflow-rag": {
      "vectorStore": {
        "storagePath": ".creor/rag/index",
        "tableName": "code_chunks"
      }
    }
  }
}`}</DocsCode>
      </DocsSection>

      <DocsSection id="reranking" title="Reranking">
        <DocsParagraph>
          After the initial hybrid search retrieves candidate results, a reranker scores each
          result against the original query to improve ranking quality. Reranking is especially
          valuable when combining results from vector and keyword search.
        </DocsParagraph>

        <DocsH3>Supported Rerankers</DocsH3>
        <DocsTable
          headers={["Provider", "Model", "Strength"]}
          rows={[
            ["Jina", "jina-reranker-v2-base-multilingual", "Fast, multilingual, good for mixed-language codebases."],
            ["Voyage AI", "rerank-2", "High accuracy for code, pairs well with Voyage embeddings."],
          ]}
        />
        <DocsCode lines>{`{
  "plugins": {
    "devflow-rag": {
      "reranker": {
        "provider": "jina",
        "model": "jina-reranker-v2-base-multilingual",
        "apiKey": "$JINA_API_KEY",
        "topK": 10
      }
    }
  }
}`}</DocsCode>
        <DocsParagraph>
          The topK parameter controls how many results the reranker returns to the agent. Higher
          values provide more context but consume more tokens in the agent&apos;s context window.
        </DocsParagraph>
        <DocsCallout type="info">
          Reranking is optional. If no reranker is configured, Creor uses reciprocal rank fusion
          to merge results from the vector and keyword searches. This still produces good results
          for most codebases.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="search-tuning" title="Search Tuning">
        <DocsParagraph>
          Fine-tune how the search pipeline behaves with these additional settings.
        </DocsParagraph>
        <DocsTable
          headers={["Setting", "Default", "Description"]}
          rows={[
            ["vectorWeight", "0.6", "Weight for vector search results in hybrid fusion (0.0-1.0)."],
            ["keywordWeight", "0.4", "Weight for keyword/grep search results in hybrid fusion (0.0-1.0)."],
            ["maxResults", "20", "Maximum number of candidate results before reranking."],
            ["minScore", "0.3", "Minimum similarity score to include a result (0.0-1.0)."],
            ["contextLines", "3", "Number of surrounding lines to include with each result for context."],
          ]}
        />
        <DocsCode lines>{`{
  "plugins": {
    "devflow-rag": {
      "search": {
        "vectorWeight": 0.6,
        "keywordWeight": 0.4,
        "maxResults": 20,
        "minScore": 0.3,
        "contextLines": 3
      }
    }
  }
}`}</DocsCode>
        <DocsCallout type="tip">
          If your codebase uses highly specific identifiers (e.g., generated code with unique
          prefixes), increase keywordWeight to 0.5 or higher. If your code is well-documented
          with natural language, lean toward vectorWeight.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="full-configuration" title="Full Configuration Reference">
        <DocsParagraph>
          Here is a complete creor.json with all RAG-related settings shown with their defaults.
        </DocsParagraph>
        <DocsCode lines>{`{
  "plugins": {
    "devflow-rag": {
      "embedding": {
        "provider": "voyage",
        "model": "voyage-code-3",
        "apiKey": "$VOYAGE_API_KEY"
      },
      "vectorStore": {
        "storagePath": ".creor/rag/index",
        "tableName": "code_chunks"
      },
      "reranker": {
        "provider": "jina",
        "model": "jina-reranker-v2-base-multilingual",
        "apiKey": "$JINA_API_KEY",
        "topK": 10
      },
      "search": {
        "vectorWeight": 0.6,
        "keywordWeight": 0.4,
        "maxResults": 20,
        "minScore": 0.3,
        "contextLines": 3
      },
      "indexer": {
        "maxChunkSize": 1500,
        "minChunkSize": 50,
        "chunkOverlap": 100,
        "batchSize": 100
      },
      "exclude": [
        "node_modules/**",
        "vendor/**",
        "dist/**",
        "build/**",
        ".git/**"
      ]
    }
  }
}`}</DocsCode>
        <DocsCallout type="info">
          You only need to include settings you want to override. Omitted settings use the
          defaults shown above.
        </DocsCallout>
      </DocsSection>

      <DocsDivider />

      <DocsSection id="next-steps" title="Next Steps">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DocsCard
            title="Search Overview"
            description="Learn how hybrid search combines vector similarity and keyword matching."
            href="/docs/rag/overview"
          />
          <DocsCard
            title="Indexing"
            description="Understand how files are chunked, watched, and incrementally indexed."
            href="/docs/rag/indexing"
          />
        </div>
      </DocsSection>
    </DocsPage>
  );
}
