import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import {
  DocsPage,
  DocsSection,
  DocsParagraph,
  DocsCode,
  DocsList,
  DocsCallout,
  DocsTable,
  DocsH3,
} from "@/components/docs-page";

export const metadata: Metadata = generatePageMetadata({
  title: "Web Tools | Creor",
  description:
    "Search the web and fetch page content with Creor's websearch and webfetch tools for documentation, API references, and external resources.",
  path: "/docs/agent/tools/web",
});

export default function WebToolsPage() {
  return (
    <DocsPage
      breadcrumb="Agent / Tools"
      title="Web Tools"
      description="Web tools let the agent search the internet and fetch web page content. This is useful when the agent needs to look up documentation, check API references, or find solutions to specific errors."
      toc={[
        { label: "WebSearch", href: "#websearch" },
        { label: "WebFetch", href: "#webfetch" },
        { label: "Use Cases", href: "#use-cases" },
        { label: "Permissions & Limits", href: "#permissions-limits" },
      ]}
    >
      <DocsSection id="websearch" title="WebSearch">
        <DocsParagraph>
          The websearch tool performs internet searches using Exa, a search engine optimized for
          developer content. It returns a list of relevant results with titles, URLs, and snippets
          that the agent can review to find the information it needs.
        </DocsParagraph>

        <DocsTable
          headers={["Parameter", "Type", "Description"]}
          rows={[
            ["query", "string", "The search query. Works best with specific, technical queries."],
            ["num_results", "number (optional)", "Number of results to return. Default: 5."],
          ]}
        />

        <DocsH3>How the Agent Uses Search</DocsH3>
        <DocsParagraph>
          The agent does not search the web randomly. It searches when it encounters a problem it
          cannot solve from its training data or your codebase alone. Common triggers include
          unfamiliar library APIs, obscure error messages, and recently released features that may
          be newer than its training cutoff.
        </DocsParagraph>
        <DocsCode>{`# The agent might search for:
websearch query="zod v3.24 discriminatedUnion type inference"
websearch query="Next.js 16 app router middleware redirect loop"
websearch query="prisma client 6.0 breaking changes migration guide"`}</DocsCode>

        <DocsParagraph>
          After receiving search results, the agent typically selects the most relevant result and
          uses webfetch to read the full page content.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="webfetch" title="WebFetch">
        <DocsParagraph>
          The webfetch tool retrieves the content of a web page and returns it as readable text.
          HTML is converted to a clean text format, stripping navigation, ads, and other non-content
          elements so the agent can focus on the information it needs.
        </DocsParagraph>

        <DocsTable
          headers={["Parameter", "Type", "Description"]}
          rows={[
            ["url", "string", "The URL of the page to fetch."],
          ]}
        />

        <DocsH3>What It Can Fetch</DocsH3>
        <DocsList
          items={[
            "Documentation pages (MDN, React docs, library READMEs).",
            "GitHub issues and pull requests.",
            "Stack Overflow answers.",
            "Blog posts and tutorials.",
            "API documentation and specifications.",
            "Package registry pages (npm, PyPI, crates.io).",
          ]}
        />

        <DocsCode>{`# Fetch documentation for a specific API
webfetch url="https://zod.dev/docs/discriminatedUnion"

# Read a GitHub issue for context
webfetch url="https://github.com/prisma/prisma/issues/12345"

# Check an npm package README
webfetch url="https://www.npmjs.com/package/@tanstack/react-query"`}</DocsCode>

        <DocsCallout type="info">
          The webfetch tool extracts the main content from pages and strips boilerplate HTML. The
          result is plain text optimized for the agent to read, not a full HTML document.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="use-cases" title="Use Cases">
        <DocsH3>Looking Up Documentation</DocsH3>
        <DocsParagraph>
          When the agent needs to use a library API it is not fully confident about, it searches for
          the official documentation and reads the relevant page. This ensures the code it writes
          uses current, correct APIs.
        </DocsParagraph>
        <DocsCode>{`# Your prompt:
Add server-side pagination to the products table using
@tanstack/react-table v8.

# The agent might:
# 1. Search for "@tanstack/react-table v8 server-side pagination"
# 2. Fetch the relevant docs page
# 3. Read the current table component
# 4. Implement pagination following the official docs`}</DocsCode>

        <DocsH3>Debugging Unfamiliar Errors</DocsH3>
        <DocsParagraph>
          When the agent encounters an error it does not immediately recognize, it can search for
          the error message to find known solutions and workarounds.
        </DocsParagraph>

        <DocsH3>Checking API References</DocsH3>
        <DocsParagraph>
          When integrating with external APIs (Stripe, Twilio, AWS, etc.), the agent can fetch
          the API documentation to ensure it is using the correct endpoints, parameters, and
          authentication methods.
        </DocsParagraph>

        <DocsH3>Staying Current</DocsH3>
        <DocsParagraph>
          The agent&apos;s training data has a cutoff date. For libraries and frameworks with recent
          releases, web tools bridge the gap by fetching the latest documentation and migration guides.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="permissions-limits" title="Permissions & Limits">
        <DocsParagraph>
          Web tools have specific permission and usage considerations.
        </DocsParagraph>

        <DocsTable
          headers={["Aspect", "Default", "Notes"]}
          rows={[
            ["websearch permission", "ask", "You approve each search query before it executes."],
            ["webfetch permission", "ask", "You approve each URL fetch before it executes."],
            ["Network access", "Required", "Web tools do not work in fully offline mode or when network access is blocked by sandbox."],
            ["Content size", "Truncated", "Very large pages are truncated to fit within context limits. The agent sees the first portion."],
            ["JavaScript rendering", "No", "Webfetch retrieves the initial HTML. Single-page applications that require JavaScript to render content may return incomplete results."],
          ]}
        />

        <DocsCallout type="tip">
          If you want the agent to search freely without prompting for each query, set websearch
          and webfetch to &quot;allow&quot; in your creor.json permissions.
        </DocsCallout>

        <DocsH3>Disabling Web Tools</DocsH3>
        <DocsParagraph>
          If your project should not access the internet (e.g., air-gapped environments, compliance
          requirements), you can deny web tools entirely.
        </DocsParagraph>
        <DocsCode lines>{`{
  "permissions": {
    "websearch": "deny",
    "webfetch": "deny"
  }
}`}</DocsCode>
      </DocsSection>
    </DocsPage>
  );
}
