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
  title: "Codebase Search Overview | Creor",
  description:
    "Learn how Creor uses hybrid semantic search to find relevant code context across your entire codebase.",
  path: "/docs/rag/overview",
});

export default function RagOverviewPage() {
  return (
    <DocsPage
      breadcrumb="Codebase Search"
      title="Codebase Search Overview"
      description="Creor includes a built-in RAG (Retrieval-Augmented Generation) pipeline that indexes your codebase and provides the agent with relevant code context. This means the agent can find and reference code it has never seen in the current conversation."
      toc={[
        { label: "How It Works", href: "#how-it-works" },
        { label: "Hybrid Search", href: "#hybrid-search" },
        { label: "Query Classification", href: "#query-classification" },
        { label: "When Search Is Used", href: "#when-search-is-used" },
        { label: "Search Quality", href: "#search-quality" },
        { label: "Next Steps", href: "#next-steps" },
      ]}
    >
      <DocsSection id="how-it-works" title="How It Works">
        <DocsParagraph>
          When you open a project in Creor, the RAG pipeline indexes your source files in the
          background. Each file is split into semantically meaningful chunks, converted into vector
          embeddings, and stored in a local vector database. When the agent needs to find code
          relevant to your request, it queries this index instead of reading every file.
        </DocsParagraph>
        <DocsCode>{`Your codebase
  -> File chunking (semantic splitting + AST parsing)
    -> Embedding (Voyage AI or Nomic)
      -> Vector store (LanceDB)
        -> Query time: hybrid search (vector + keyword)
          -> Reranking (Jina or Voyage AI)
            -> Top results returned to the agent`}</DocsCode>
        <DocsParagraph>
          This pipeline runs entirely locally. Your code is never sent to external servers for
          indexing -- embeddings are generated using lightweight API calls that send only small
          text chunks, not entire files.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="hybrid-search" title="Hybrid Search">
        <DocsParagraph>
          Creor does not rely on a single search strategy. It combines two complementary approaches
          to maximize recall and precision.
        </DocsParagraph>

        <DocsH3>Vector Similarity (Semantic Search)</DocsH3>
        <DocsParagraph>
          Each code chunk is converted into a high-dimensional vector that captures its semantic
          meaning. When the agent searches, the query is also embedded, and the most similar
          vectors are retrieved. This finds code that is conceptually related even if it uses
          different variable names or phrasing.
        </DocsParagraph>
        <DocsList
          items={[
            "Finds code by meaning, not exact wording.",
            "Works across languages -- a Python function and its TypeScript equivalent can match.",
            "Handles natural language queries like \"the function that validates user email addresses\".",
          ]}
        />

        <DocsH3>Keyword Matching (Grep Search)</DocsH3>
        <DocsParagraph>
          Alongside vector search, Creor runs a keyword-based grep search. This catches exact
          matches that semantic search might rank lower -- function names, error messages, specific
          strings, and import paths.
        </DocsParagraph>
        <DocsList
          items={[
            "Exact match for identifiers, class names, and error strings.",
            "Fast fallback when the semantic index is still building.",
            "Catches recently added code that may not yet be indexed.",
          ]}
        />

        <DocsH3>Result Fusion</DocsH3>
        <DocsParagraph>
          Results from both search strategies are merged and deduplicated. A reranker then scores
          each result against the original query, producing a single ranked list. The top results
          are injected into the agent&apos;s context as code snippets with file paths and line numbers.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="query-classification" title="Query Classification">
        <DocsParagraph>
          Not every query benefits from the same search strategy. Creor&apos;s query classifier
          analyzes each search request and routes it to the optimal pipeline.
        </DocsParagraph>
        <DocsTable
          headers={["Query Type", "Strategy", "Example"]}
          rows={[
            [
              "Conceptual",
              "Vector-heavy with broad retrieval",
              "\"How does authentication work in this project?\"",
            ],
            [
              "Identifier lookup",
              "Grep-heavy with exact matching",
              "\"Find the UserService class\"",
            ],
            [
              "Mixed",
              "Balanced hybrid with reranking",
              "\"Where is the rate limiter configured and how does it work?\"",
            ],
            [
              "File path",
              "Direct file lookup, skip search",
              "\"Show me src/auth/middleware.ts\"",
            ],
          ]}
        />
        <DocsParagraph>
          The classifier runs before the search and adds no perceptible latency. It examines the
          query structure, presence of identifiers (camelCase, PascalCase, snake_case), and
          natural language indicators to make its routing decision.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="when-search-is-used" title="When Search Is Used">
        <DocsParagraph>
          The agent does not search your codebase on every message. Search is triggered when the
          agent determines it needs additional context that is not already in the conversation.
        </DocsParagraph>
        <DocsList
          items={[
            "You ask about code the agent has not read yet in this session.",
            "The agent needs to find all usages of a function before refactoring it.",
            "You ask a question about project architecture or how a feature is implemented.",
            "The agent is planning a multi-file change and needs to understand dependencies.",
            "You reference a concept (\"the auth middleware\") without specifying a file path.",
          ]}
        />
        <DocsCallout type="tip">
          You can explicitly trigger a codebase search by asking the agent to &quot;search the
          codebase for...&quot; or &quot;find all files related to...&quot;. The agent will use the
          codesearch tool, which invokes the full RAG pipeline.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="search-quality" title="Search Quality">
        <DocsParagraph>
          Several factors affect how well codebase search performs in your project.
        </DocsParagraph>
        <DocsTable
          headers={["Factor", "Impact", "What You Can Do"]}
          rows={[
            [
              "Project size",
              "Larger projects benefit more from semantic search",
              "Let indexing complete before relying on search-heavy queries",
            ],
            [
              "Code documentation",
              "Well-commented code produces better embeddings",
              "JSDoc, docstrings, and inline comments improve search recall",
            ],
            [
              "File types",
              "Source code is indexed; binary files and media are skipped",
              "Check .gitignore -- files ignored by git are also ignored by the indexer",
            ],
            [
              "Embedding model",
              "Different models have different strengths",
              "Voyage AI code-3 is optimized for code; Nomic is a solid general-purpose alternative",
            ],
          ]}
        />
        <DocsCallout type="info">
          Search results include file paths and line numbers so you can verify context before the
          agent acts on it. If a search result looks wrong, you can correct the agent and it will
          refine its query.
        </DocsCallout>
      </DocsSection>

      <DocsDivider />

      <DocsSection id="next-steps" title="Next Steps">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DocsCard
            title="Indexing"
            description="Understand how files are chunked, watched, and incrementally indexed."
            href="/docs/rag/indexing"
          />
          <DocsCard
            title="Configuration"
            description="Configure embedding providers, vector store settings, and rerankers."
            href="/docs/rag/configuration"
          />
        </div>
      </DocsSection>
    </DocsPage>
  );
}
