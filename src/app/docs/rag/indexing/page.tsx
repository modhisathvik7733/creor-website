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
  title: "Indexing | Creor",
  description:
    "How Creor indexes your codebase: file chunking, incremental updates, security filtering, and index management.",
  path: "/docs/rag/indexing",
});

export default function RagIndexingPage() {
  return (
    <DocsPage
      breadcrumb="Codebase Search"
      title="Indexing"
      description="Creor's indexer processes your source files into searchable chunks stored in a local vector database. Indexing is automatic, incremental, and security-aware."
      toc={[
        { label: "File Chunking", href: "#file-chunking" },
        { label: "AST-Aware Splitting", href: "#ast-aware-splitting" },
        { label: "Incremental Indexing", href: "#incremental-indexing" },
        { label: "Security Filtering", href: "#security-filtering" },
        { label: "Index State", href: "#index-state" },
        { label: "Troubleshooting", href: "#troubleshooting" },
        { label: "Next Steps", href: "#next-steps" },
      ]}
    >
      <DocsSection id="file-chunking" title="File Chunking">
        <DocsParagraph>
          Raw source files are too large and noisy to embed as single vectors. The indexer splits
          each file into smaller, semantically meaningful chunks that each capture a coherent unit
          of code -- a function, a class, a configuration block, or a group of related statements.
        </DocsParagraph>

        <DocsH3>Chunking Strategy</DocsH3>
        <DocsParagraph>
          Creor uses a multi-pass chunking strategy that prioritizes semantic boundaries over
          arbitrary line counts.
        </DocsParagraph>
        <DocsList
          items={[
            "First pass: AST parsing identifies top-level declarations (functions, classes, interfaces, types, exports).",
            "Second pass: Large declarations are split further at logical boundaries (methods within a class, branches within a switch).",
            "Third pass: Non-code files (Markdown, JSON, YAML) are split by headings, keys, or fixed-size windows with overlap.",
            "Each chunk retains its file path, start/end line numbers, and parent context (e.g., which class a method belongs to).",
          ]}
        />

        <DocsH3>Chunk Sizing</DocsH3>
        <DocsTable
          headers={["Parameter", "Default", "Description"]}
          rows={[
            ["Max chunk size", "1500 tokens", "Upper limit for a single chunk. Larger declarations are split."],
            ["Min chunk size", "50 tokens", "Chunks below this threshold are merged with adjacent chunks."],
            ["Overlap", "100 tokens", "Overlap between adjacent chunks to preserve context at boundaries."],
            ["Context window", "Parent declaration", "Each chunk includes a header comment identifying its parent scope."],
          ]}
        />
        <DocsParagraph>
          These defaults work well for most codebases. You can adjust them in the RAG plugin
          configuration if your project has unusually large or small files.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="ast-aware-splitting" title="AST-Aware Splitting">
        <DocsParagraph>
          For supported languages, the indexer parses the Abstract Syntax Tree (AST) before
          chunking. This ensures that chunks never split a function in the middle of a logic
          block or break a class definition between its constructor and methods.
        </DocsParagraph>
        <DocsTable
          headers={["Language", "AST Support", "Splitting Granularity"]}
          rows={[
            ["TypeScript / JavaScript", "Full", "Functions, classes, methods, interfaces, type aliases, exports"],
            ["Python", "Full", "Functions, classes, methods, decorators, module-level assignments"],
            ["Go", "Full", "Functions, methods, structs, interfaces, package declarations"],
            ["Rust", "Full", "Functions, impl blocks, structs, enums, traits, modules"],
            ["Java / Kotlin", "Full", "Classes, methods, interfaces, enums, annotations"],
            ["C / C++", "Partial", "Functions, classes, structs. Macros treated as text."],
            ["Other languages", "Fallback", "Line-based splitting with overlap at logical boundaries (blank lines, comments)"],
          ]}
        />
        <DocsCallout type="tip">
          Even without AST support, the fallback chunker produces good results. It uses heuristics
          like blank line clusters, comment blocks, and indentation changes to find natural split
          points.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="incremental-indexing" title="Incremental Indexing">
        <DocsParagraph>
          Creor does not re-index your entire codebase every time you save a file. A file watcher
          monitors your workspace and triggers re-indexing only for files that have changed.
        </DocsParagraph>

        <DocsH3>How It Works</DocsH3>
        <DocsList
          items={[
            "On project open: the indexer compares file modification timestamps against the stored index state. Only changed or new files are processed.",
            "On file save: the watcher detects the change and queues the file for re-indexing. Old chunks from that file are removed and replaced.",
            "On file delete: all chunks associated with the deleted file are removed from the vector store.",
            "On branch switch: the indexer detects changed files via git and re-indexes them. This typically takes a few seconds.",
          ]}
        />

        <DocsH3>Indexing Performance</DocsH3>
        <DocsTable
          headers={["Codebase Size", "Initial Index Time", "Incremental Update"]}
          rows={[
            ["Small (< 1K files)", "10-30 seconds", "< 1 second"],
            ["Medium (1K-10K files)", "1-5 minutes", "1-3 seconds"],
            ["Large (10K-50K files)", "5-15 minutes", "2-5 seconds"],
            ["Very large (50K+ files)", "15-45 minutes", "3-10 seconds"],
          ]}
        />
        <DocsParagraph>
          Initial indexing runs in the background and does not block the editor. You can start
          working immediately -- the agent will fall back to grep-based search for files that
          are not yet indexed.
        </DocsParagraph>
        <DocsCallout type="info">
          Indexing performance depends on your embedding provider&apos;s API speed and rate limits.
          Voyage AI and Nomic both support batch embedding requests, which Creor uses to minimize
          round trips.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="security-filtering" title="Security Filtering">
        <DocsParagraph>
          The indexer includes a security filter that prevents sensitive data from being embedded
          and stored in the vector database. This runs before the embedding step, so secrets
          never leave your machine in an embedding API call.
        </DocsParagraph>

        <DocsH3>What Gets Filtered</DocsH3>
        <DocsList
          items={[
            "Files matching .gitignore patterns are skipped entirely.",
            "Files matching common secret patterns (.env, .pem, credentials.json, *_secret*, *.key) are excluded.",
            "Chunks containing high-entropy strings that look like API keys or tokens are redacted before embedding.",
            "Binary files, images, videos, and other non-text files are skipped.",
            "Lock files (package-lock.json, yarn.lock, bun.lock, Cargo.lock) are skipped -- they add noise without useful semantics.",
          ]}
        />

        <DocsH3>Custom Exclusions</DocsH3>
        <DocsParagraph>
          You can add custom exclusion patterns in your project&apos;s creor.json file to skip
          additional files or directories.
        </DocsParagraph>
        <DocsCode lines>{`{
  "plugins": {
    "devflow-rag": {
      "exclude": [
        "vendor/**",
        "generated/**",
        "**/*.generated.ts",
        "test/fixtures/**"
      ]
    }
  }
}`}</DocsCode>
        <DocsCallout type="warning">
          The security filter is a best-effort safeguard. Do not rely on it as your only line of
          defense for sensitive data. If your codebase contains secrets, use a dedicated secrets
          manager and keep secrets out of source files.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="index-state" title="Index State">
        <DocsParagraph>
          The vector index is stored locally in your project&apos;s .creor/ directory. It persists
          across editor restarts, so you only pay the initial indexing cost once.
        </DocsParagraph>

        <DocsH3>Index Location</DocsH3>
        <DocsCode>{`.creor/
  rag/
    index/          # LanceDB vector store files
    state.json      # File hashes and timestamps for incremental updates
    config.json     # Snapshot of indexing configuration`}</DocsCode>

        <DocsH3>Managing the Index</DocsH3>
        <DocsList
          items={[
            "Rebuild index: Delete the .creor/rag/ directory and reopen the project. A full re-index will start automatically.",
            "Check index status: The status bar shows indexing progress. Hover over it to see the number of indexed files and chunks.",
            "Pause indexing: Close the project or disable the RAG plugin in settings. Indexing resumes when re-enabled.",
          ]}
        />
        <DocsCallout type="tip">
          Add .creor/rag/ to your .gitignore. The index is machine-specific and should not be
          committed to version control.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="troubleshooting" title="Troubleshooting">
        <DocsH3>Index not building</DocsH3>
        <DocsList
          items={[
            "Verify the RAG plugin is enabled in settings.",
            "Check that an embedding provider API key is configured (Voyage AI or Nomic).",
            "Look at the Creor output panel (View > Output > Creor Engine) for error messages.",
          ]}
        />

        <DocsH3>Search returning irrelevant results</DocsH3>
        <DocsList
          items={[
            "The index may be stale. Delete .creor/rag/ and let it rebuild.",
            "Check if the relevant files are excluded by .gitignore or custom exclusion patterns.",
            "Try a more specific query -- include function names or file paths when possible.",
          ]}
        />

        <DocsH3>Indexing is slow</DocsH3>
        <DocsList
          items={[
            "Large codebases take longer on first index. Subsequent updates are incremental.",
            "Check your embedding provider's rate limits. Voyage AI's free tier has lower throughput.",
            "Exclude large generated or vendored directories to reduce index size.",
          ]}
        />
      </DocsSection>

      <DocsDivider />

      <DocsSection id="next-steps" title="Next Steps">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DocsCard
            title="Configuration"
            description="Configure embedding providers, rerankers, and vector store settings."
            href="/docs/rag/configuration"
          />
          <DocsCard
            title="Search Overview"
            description="Learn how hybrid search combines vector similarity and keyword matching."
            href="/docs/rag/overview"
          />
        </div>
      </DocsSection>
    </DocsPage>
  );
}
