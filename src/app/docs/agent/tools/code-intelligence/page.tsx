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
  title: "Code Intelligence | Creor",
  description:
    "LSP integration, symbol lookup, test discovery, and change impact analysis powered by language servers.",
  path: "/docs/agent/tools/code-intelligence",
});

export default function CodeIntelligencePage() {
  return (
    <DocsPage
      breadcrumb="Agent / Tools"
      title="Code Intelligence"
      description="Code intelligence tools give the agent deep understanding of your code's structure through language server integration. The agent can find definitions, references, symbols, and analyze the impact of changes."
      toc={[
        { label: "LSP Integration", href: "#lsp-integration" },
        { label: "Symbol Lookup", href: "#symbol-lookup" },
        { label: "Go to Definition", href: "#go-to-definition" },
        { label: "Find References", href: "#find-references" },
        { label: "Test Discovery", href: "#test-discovery" },
        { label: "Change Impact Analysis", href: "#change-impact-analysis" },
        { label: "Supported Languages", href: "#supported-languages" },
      ]}
    >
      <DocsSection id="lsp-integration" title="LSP Integration">
        <DocsParagraph>
          Creor integrates with language servers through the Language Server Protocol (LSP). When
          a language server is active for your project, the agent can use it to navigate code
          with the same precision as your editor&apos;s go-to-definition, find-references, and symbol
          search features.
        </DocsParagraph>
        <DocsParagraph>
          Language servers run automatically when you open a project -- they are the same language
          servers that power the editor&apos;s IntelliSense, diagnostics, and code navigation. The agent
          accesses them through the LSP tool, which wraps common language server operations into a
          single tool interface.
        </DocsParagraph>

        <DocsCallout type="info">
          LSP features depend on having the appropriate language server installed and active. For
          TypeScript, this is automatic. For other languages, you may need to install the relevant
          VS Code extension.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="symbol-lookup" title="Symbol Lookup">
        <DocsParagraph>
          Symbol lookup lets the agent search for functions, classes, interfaces, variables, and
          other symbols across your entire project. This is faster and more accurate than grep for
          finding code definitions because it understands language semantics.
        </DocsParagraph>

        <DocsH3>Workspace Symbol Search</DocsH3>
        <DocsParagraph>
          The agent can search for symbols by name across the entire workspace. This returns all
          matching definitions with their file locations, making it easy to navigate large codebases.
        </DocsParagraph>
        <DocsCode>{`# Find all symbols matching "UserService"
lsp operation="workspaceSymbol" query="UserService"

# Results might include:
# - class UserService (src/services/user.ts:15)
# - interface IUserService (src/types/services.ts:42)
# - const userService (src/di/container.ts:88)`}</DocsCode>

        <DocsH3>Document Symbols</DocsH3>
        <DocsParagraph>
          For a specific file, the agent can request all symbols defined in that file. This provides
          a structured outline of classes, functions, interfaces, and variables.
        </DocsParagraph>
        <DocsCode>{`# Get all symbols in a file
lsp operation="documentSymbol" uri="src/services/user.ts"

# Returns the file's structure:
# - class UserService
#   - constructor()
#   - findById(id: string)
#   - create(data: CreateUserDto)
#   - update(id: string, data: UpdateUserDto)
#   - delete(id: string)`}</DocsCode>
      </DocsSection>

      <DocsSection id="go-to-definition" title="Go to Definition">
        <DocsParagraph>
          The agent can jump to the definition of any symbol -- a function, class, variable, type,
          or imported module. This is critical for understanding code that references abstractions
          defined elsewhere.
        </DocsParagraph>
        <DocsCode>{`# Find where a function is defined
lsp operation="definition" uri="src/routes/users.ts" line=23 character=15

# Returns: src/services/user.ts:42:2`}</DocsCode>
        <DocsParagraph>
          The agent uses go-to-definition when it needs to understand what a function does before
          modifying code that calls it, or when it needs to trace the implementation behind an
          interface.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="find-references" title="Find References">
        <DocsParagraph>
          Find references returns every location where a symbol is used across the project. The
          agent uses this when renaming symbols, understanding the blast radius of a change, or
          finding all callers of a function.
        </DocsParagraph>
        <DocsCode>{`# Find all usages of a function
lsp operation="references" uri="src/services/user.ts" line=42 character=8

# Returns all files and locations where findById is called:
# - src/routes/users.ts:23:15
# - src/routes/admin.ts:67:22
# - src/middleware/auth.ts:31:10
# - tests/services/user.test.ts:45:8`}</DocsCode>

        <DocsH3>Why This Matters</DocsH3>
        <DocsParagraph>
          Without find-references, the agent would need to grep for the symbol name, which catches
          string matches but misses renamed imports, aliases, and method overrides. LSP references
          are semantically accurate because they understand the language&apos;s type system and scope rules.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="test-discovery" title="Test Discovery">
        <DocsParagraph>
          The agent can discover tests in your project using a combination of glob patterns, file
          naming conventions, and LSP symbols. This lets it find the right test file for a given
          source file and identify which tests cover a specific function.
        </DocsParagraph>

        <DocsH3>Discovery Strategies</DocsH3>
        <DocsList
          items={[
            "Convention-based: Looks for files matching *.test.ts, *.spec.ts, __tests__/*.ts alongside source files.",
            "Co-located tests: Finds test files in the same directory as the source file (e.g., utils.ts and utils.test.ts).",
            "Test directories: Checks for centralized test directories (tests/, __tests__/) that mirror the source structure.",
            "Symbol analysis: Uses LSP to find describe/it/test blocks that reference the function being modified.",
          ]}
        />

        <DocsParagraph>
          When the agent modifies a function, it automatically looks for related tests to verify
          the change. If no tests exist, the agent may offer to create them.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="change-impact-analysis" title="Change Impact Analysis">
        <DocsParagraph>
          Before making a change, the agent can analyze its potential impact by combining find-references
          with type information. This helps it understand which files will be affected and whether the
          change might break existing code.
        </DocsParagraph>

        <DocsH3>What the Agent Checks</DocsH3>
        <DocsList
          items={[
            "All direct callers of the function or method being modified.",
            "All implementations of an interface being changed.",
            "All subclasses of a class being modified.",
            "All files that import the module being changed.",
            "Type compatibility -- whether a change to a function signature breaks existing callers.",
          ]}
        />

        <DocsParagraph>
          This analysis is especially valuable for refactoring tasks. The agent can tell you how
          many files will be affected and what kind of changes will be needed in each one before
          starting the refactor.
        </DocsParagraph>

        <DocsCallout type="tip">
          Ask the agent to analyze the impact of a change before it starts editing. For example:
          &quot;Before renaming UserService to AccountService, show me all the files that would need to
          change.&quot;
        </DocsCallout>
      </DocsSection>

      <DocsSection id="supported-languages" title="Supported Languages">
        <DocsParagraph>
          Code intelligence features depend on having a language server available. The following
          languages have built-in language server support in Creor.
        </DocsParagraph>

        <DocsTable
          headers={["Language", "Language Server", "Features"]}
          rows={[
            ["TypeScript / JavaScript", "tsserver (built-in)", "Full LSP: definitions, references, symbols, diagnostics, rename, completions."],
            ["Python", "Pylance / Pyright", "Definitions, references, symbols, diagnostics, type checking."],
            ["Go", "gopls", "Definitions, references, symbols, diagnostics, formatting."],
            ["Rust", "rust-analyzer", "Definitions, references, symbols, diagnostics, inlay hints."],
            ["Java", "Eclipse JDT.LS", "Definitions, references, symbols, diagnostics, refactoring."],
            ["C / C++", "clangd", "Definitions, references, symbols, diagnostics, formatting."],
            ["HTML / CSS", "vscode-html-languageservice", "Completions, diagnostics, formatting."],
            ["JSON", "vscode-json-languageservice", "Schema validation, completions."],
          ]}
        />

        <DocsParagraph>
          Additional language servers can be added through VS Code extensions. Any extension that
          provides LSP features will be accessible to the agent through the LSP tool.
        </DocsParagraph>
      </DocsSection>
    </DocsPage>
  );
}
