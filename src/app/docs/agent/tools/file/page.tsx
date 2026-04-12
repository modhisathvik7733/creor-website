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
  DocsDivider,
} from "@/components/docs-page";

export const metadata: Metadata = generatePageMetadata({
  title: "File Tools | Creor",
  description:
    "Read, write, edit, search, and navigate files with Creor's file tools: read, write, edit, multiedit, glob, grep, and ls.",
  path: "/docs/agent/tools/file",
});

export default function FileToolsPage() {
  return (
    <DocsPage
      breadcrumb="Agent / Tools"
      title="File Tools"
      description="File tools are the foundation of the agent's ability to understand and modify your codebase. They handle reading, writing, editing, and searching across your project files."
      toc={[
        { label: "Read", href: "#read" },
        { label: "Write", href: "#write" },
        { label: "Edit", href: "#edit" },
        { label: "MultiEdit", href: "#multiedit" },
        { label: "Glob", href: "#glob" },
        { label: "Grep", href: "#grep" },
        { label: "Ls", href: "#ls" },
      ]}
    >
      <DocsSection id="read" title="Read">
        <DocsParagraph>
          The read tool retrieves the contents of a file. It is the most frequently used tool --
          the agent reads files to understand code before making changes, to check configurations,
          and to verify the results of edits.
        </DocsParagraph>

        <DocsTable
          headers={["Parameter", "Type", "Description"]}
          rows={[
            ["file_path", "string", "Absolute path to the file to read."],
            ["offset", "number (optional)", "Line number to start reading from (0-indexed)."],
            ["limit", "number (optional)", "Number of lines to read. Used with offset for large files."],
          ]}
        />

        <DocsH3>Reading Text Files</DocsH3>
        <DocsParagraph>
          By default, the read tool returns the entire file with line numbers. For large files, the
          agent uses offset and limit to read specific sections.
        </DocsParagraph>
        <DocsCode>{`# Read the entire file
read file_path="/src/components/Header.tsx"

# Read lines 50-100
read file_path="/src/components/Header.tsx" offset=50 limit=50`}</DocsCode>

        <DocsH3>Reading Images</DocsH3>
        <DocsParagraph>
          The read tool can open image files (PNG, JPG, SVG, etc.) and present them visually to the
          agent. This enables the agent to analyze screenshots, design mockups, and diagram files
          directly.
        </DocsParagraph>

        <DocsH3>Reading PDFs</DocsH3>
        <DocsParagraph>
          PDF files are supported with a pages parameter to select specific page ranges. For large
          PDFs (more than 10 pages), the agent must specify a page range to avoid exceeding context
          limits.
        </DocsParagraph>
        <DocsCode>{`# Read pages 1-5 of a PDF
read file_path="/docs/api-spec.pdf" pages="1-5"`}</DocsCode>

        <DocsH3>Reading Jupyter Notebooks</DocsH3>
        <DocsParagraph>
          The read tool understands .ipynb files and returns all cells with their outputs, combining
          code, markdown, and visualizations into a readable format.
        </DocsParagraph>

        <DocsCallout type="info">
          The read tool defaults to &quot;allow&quot; permission since it is read-only and cannot modify your
          project. The agent can freely read any file without prompting for approval.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="write" title="Write">
        <DocsParagraph>
          The write tool creates a new file or completely replaces the contents of an existing file.
          It is used when the agent needs to create new files from scratch -- components, test files,
          configuration files, and so on.
        </DocsParagraph>

        <DocsTable
          headers={["Parameter", "Type", "Description"]}
          rows={[
            ["file_path", "string", "Absolute path for the file to create or overwrite."],
            ["content", "string", "The complete file content to write."],
          ]}
        />

        <DocsCode>{`# Create a new component file
write file_path="/src/components/UserAvatar.tsx" content="..."

# Overwrite an existing config file
write file_path="/tsconfig.json" content="..."`}</DocsCode>

        <DocsCallout type="warning">
          The write tool overwrites existing files entirely. For modifying specific parts of a file,
          the agent uses the edit tool instead. The agent is instructed to always read a file before
          overwriting it to avoid accidental data loss.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="edit" title="Edit">
        <DocsParagraph>
          The edit tool performs exact string replacement within a file. It finds an exact match of
          the old_string and replaces it with new_string. This is the primary tool for modifying
          existing code -- it is more precise and safer than rewriting entire files.
        </DocsParagraph>

        <DocsTable
          headers={["Parameter", "Type", "Description"]}
          rows={[
            ["file_path", "string", "Absolute path to the file to modify."],
            ["old_string", "string", "The exact text to find and replace. Must be unique in the file."],
            ["new_string", "string", "The replacement text."],
            ["replace_all", "boolean (optional)", "Replace all occurrences, not just the first. Default: false."],
          ]}
        />

        <DocsH3>How It Works</DocsH3>
        <DocsList
          items={[
            "The agent reads the file to understand its current content.",
            "It identifies the exact string to replace, including surrounding context for uniqueness.",
            "The old_string must match exactly -- including whitespace, indentation, and line breaks.",
            "If old_string is not found or is not unique, the edit fails and the agent retries with a corrected match.",
          ]}
        />

        <DocsCode>{`# Replace a specific function implementation
edit file_path="/src/utils/format.ts"
  old_string="function formatDate(date: Date): string {
  return date.toISOString();
}"
  new_string="function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}"`}</DocsCode>

        <DocsH3>Rename with replace_all</DocsH3>
        <DocsParagraph>
          Use the replace_all parameter to rename a variable, function, or string across an entire file.
        </DocsParagraph>
        <DocsCode>{`# Rename a variable throughout a file
edit file_path="/src/config.ts"
  old_string="apiEndpoint"
  new_string="apiBaseUrl"
  replace_all=true`}</DocsCode>

        <DocsCallout type="tip">
          The edit tool requires the old_string to be unique in the file. If the agent needs to edit a
          common string, it includes more surrounding context to make the match unique.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="multiedit" title="MultiEdit">
        <DocsParagraph>
          The multiedit tool applies multiple edit operations in a single call, either to one file
          or across several files. This is more efficient for related changes and ensures all edits
          are applied atomically.
        </DocsParagraph>

        <DocsH3>When MultiEdit Is Used</DocsH3>
        <DocsList
          items={[
            "Renaming a function and updating all its call sites across multiple files.",
            "Applying a consistent pattern change (e.g., updating import paths after a directory restructure).",
            "Making several related edits to a single file where each edit depends on the others being applied.",
          ]}
        />

        <DocsParagraph>
          Each edit in the batch follows the same old_string/new_string logic as the single edit tool.
          If any individual edit fails (match not found), the entire batch is reported so the agent
          can adjust.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="glob" title="Glob">
        <DocsParagraph>
          The glob tool finds files by pattern matching. It supports standard glob patterns and returns
          matching file paths sorted by modification time. This is the agent's primary tool for
          discovering files in your project.
        </DocsParagraph>

        <DocsTable
          headers={["Parameter", "Type", "Description"]}
          rows={[
            ["pattern", "string", "The glob pattern to match (e.g., **/*.ts, src/components/*.tsx)."],
            ["path", "string (optional)", "Directory to search in. Defaults to project root."],
          ]}
        />

        <DocsH3>Common Patterns</DocsH3>
        <DocsCode>{`# Find all TypeScript files
**/*.ts

# Find test files
**/*.test.ts
**/*.spec.ts

# Find components in a specific directory
src/components/**/*.tsx

# Find configuration files
**/config.{ts,js,json}

# Find all files in a directory (one level)
src/utils/*`}</DocsCode>

        <DocsCallout type="info">
          Glob defaults to &quot;allow&quot; permission. The agent can search for files freely without
          interrupting your workflow.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="grep" title="Grep">
        <DocsParagraph>
          The grep tool searches file contents using regex patterns, powered by ripgrep under the hood.
          It is the agent's primary tool for finding where specific code patterns, function calls,
          or strings appear across your project.
        </DocsParagraph>

        <DocsTable
          headers={["Parameter", "Type", "Description"]}
          rows={[
            ["pattern", "string", "Regex pattern to search for (ripgrep syntax)."],
            ["path", "string (optional)", "File or directory to search in. Defaults to project root."],
            ["glob", "string (optional)", "Filter files by pattern (e.g., *.ts, *.{ts,tsx})."],
            ["output_mode", "string (optional)", "content (matching lines), files_with_matches (paths only), or count."],
            ["-C / context", "number (optional)", "Lines of context to show around each match."],
            ["-i", "boolean (optional)", "Case-insensitive search."],
          ]}
        />

        <DocsH3>Search Examples</DocsH3>
        <DocsCode>{`# Find all usages of a function
grep pattern="calculateDiscount" glob="*.ts"

# Find TODO comments
grep pattern="TODO|FIXME|HACK" output_mode="content"

# Find imports of a specific module
grep pattern="from ['\"]@/services/auth" glob="*.{ts,tsx}"

# Case-insensitive search with context
grep pattern="error" -i=true -C=3 path="src/middleware/"

# Count occurrences per file
grep pattern="console\\.log" output_mode="count" glob="*.ts"`}</DocsCode>

        <DocsCallout type="tip">
          Grep uses ripgrep syntax, which is similar to standard regex but requires escaping literal
          braces. For example, to find Go interface definitions, use &quot;interface\\&#123;\\&#125;&quot; instead of
          &quot;interface&#123;&#125;&quot;.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="ls" title="Ls">
        <DocsParagraph>
          The ls tool lists directory contents with file metadata. It gives the agent a quick overview
          of a directory's structure without reading every file.
        </DocsParagraph>

        <DocsParagraph>
          The agent typically uses ls to understand project structure before diving into specific files,
          or to verify that expected files exist after a write or edit operation.
        </DocsParagraph>
      </DocsSection>
    </DocsPage>
  );
}
