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
  title: "Rules | Creor",
  description:
    "Define project-level rules with CREOR.md files to guide the AI agent's behavior across your codebase.",
  path: "/docs/customizing/rules",
});

export default function RulesPage() {
  return (
    <DocsPage
      breadcrumb="Customizing"
      title="Rules"
      description="Rules are natural-language instructions that shape how the Creor agent works in your project. Check them into your repo as CREOR.md files, and every team member gets the same guardrails."
      toc={[
        { label: "CREOR.md Files", href: "#creor-md" },
        { label: "The .creor Directory", href: "#creor-directory" },
        { label: "Instruction Discovery", href: "#instruction-discovery" },
        { label: "Global vs Project Rules", href: "#global-vs-project" },
        { label: "Instruction Metadata", href: "#instruction-metadata" },
        { label: "Writing Effective Rules", href: "#effective-rules" },
        { label: "Examples", href: "#examples" },
      ]}
    >
      <DocsSection id="creor-md" title="CREOR.md Files">
        <DocsParagraph>
          The simplest way to add rules is to create a <code>CREOR.md</code>{" "}
          file in your project root. Creor reads this file and injects its
          contents into the system prompt for every conversation in that
          project.
        </DocsParagraph>
        <DocsCode lines>{`# CREOR.md

## Code Style
- Use TypeScript strict mode. No \`any\` types.
- Prefer named exports over default exports.
- Use single quotes for imports, double quotes for user-facing strings.

## Architecture
- All API routes go in \`src/routes/\`.
- Business logic belongs in \`src/services/\`, not in route handlers.
- Database queries live in \`src/db/\` — never write raw SQL in services.

## Testing
- Every new function needs a unit test in the adjacent \`__tests__/\` directory.
- Use \`vitest\` for tests. Do not use Jest.

## Restrictions
- Never modify files in \`src/generated/\`.
- Do not install new dependencies without asking first.`}</DocsCode>
        <DocsParagraph>
          Because <code>CREOR.md</code> is a regular file, it gets version
          controlled alongside your code. Pull requests that change project
          conventions can update the rules in the same commit.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="creor-directory" title="The .creor Directory">
        <DocsParagraph>
          For more granular control, create a <code>.creor/</code> directory in
          your project root. Creor scans this directory for config, rules,
          agents, skills, and plugins.
        </DocsParagraph>
        <DocsH3>Directory Structure</DocsH3>
        <DocsCode lines>{`.creor/
  creor.json          # project config (same format as root creor.json)
  rules/
    typescript.md     # rules about TypeScript conventions
    testing.md        # rules about testing patterns
    security.md       # rules about security practices
  agents/
    review.md         # a custom agent definition
  skills/
    deploy/
      SKILL.md        # a custom skill
  plugins/
    my-tool.ts        # a local plugin`}</DocsCode>
        <DocsParagraph>
          You can also place a <code>CREOR.md</code> file inside the{" "}
          <code>.creor/</code> directory itself. This is equivalent to placing
          it at the project root.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="instruction-discovery" title="Instruction Discovery">
        <DocsParagraph>
          Creor discovers instructions from multiple sources and injects them
          into the system prompt. The discovery process works as follows:
        </DocsParagraph>
        <DocsList
          items={[
            "CREOR.md at the project root and any parent directories up to the workspace root",
            ".creor/CREOR.md in every .creor directory found walking up from the project root",
            "Markdown files in .creor/rules/ directories",
            "Files referenced in the \"instructions\" array in creor.json",
            "Global instructions from ~/.creor/ (your home directory)",
          ]}
        />
        <DocsParagraph>
          Instructions from all sources are concatenated. Project-level rules
          appear after global rules, so they take practical precedence when
          the agent resolves conflicting guidance.
        </DocsParagraph>
        <DocsH3>Custom Instruction Paths</DocsH3>
        <DocsParagraph>
          You can explicitly list additional instruction files or glob patterns
          in your config:
        </DocsParagraph>
        <DocsCode lines>{`{
  "instructions": [
    "docs/ai-guidelines.md",
    "team-standards/*.md"
  ]
}`}</DocsCode>
      </DocsSection>

      <DocsSection id="global-vs-project" title="Global vs Project Rules">
        <DocsParagraph>
          Rules can exist at two levels:
        </DocsParagraph>
        <DocsTable
          headers={["Level", "Location", "Applies To"]}
          rows={[
            [
              "Global",
              "~/.creor/CREOR.md or ~/.creor/rules/*.md",
              "Every project on your machine",
            ],
            [
              "Project",
              "CREOR.md or .creor/rules/*.md in the repo",
              "Only this project",
            ],
          ]}
        />
        <DocsParagraph>
          Global rules are useful for personal preferences — your preferred
          commit message format, coding style, or communication tone. Project
          rules are for team-shared conventions that everyone should follow.
        </DocsParagraph>
        <DocsCallout type="tip">
          Keep global rules short and focused on style. Put architecture
          and domain-specific guidance in project rules so they stay with the
          code.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="instruction-metadata" title="Instruction Metadata">
        <DocsParagraph>
          You can attach metadata to instruction files using the{" "}
          <code>instructionMeta</code> field in your config. This controls how
          each instruction is presented and whether it should always be
          included.
        </DocsParagraph>
        <DocsCode lines>{`{
  "instructionMeta": {
    "docs/ai-guidelines.md": {
      "description": "Team AI coding guidelines",
      "alwaysApply": true
    },
    "docs/security-rules.md": {
      "description": "Security review checklist",
      "alwaysApply": false
    }
  }
}`}</DocsCode>
        <DocsParagraph>
          When <code>alwaysApply</code> is <code>true</code>, the instruction
          is always injected into the system prompt. When <code>false</code>,
          the agent may choose to load it on demand using the{" "}
          <code>fetch_rules</code> tool when it seems relevant.
        </DocsParagraph>
      </DocsSection>

      <DocsDivider />

      <DocsSection id="effective-rules" title="Writing Effective Rules">
        <DocsParagraph>
          Good rules are specific, actionable, and scoped. Here are patterns
          that work well:
        </DocsParagraph>
        <DocsH3>Be Specific, Not Vague</DocsH3>
        <DocsTable
          headers={["Instead of...", "Write..."]}
          rows={[
            [
              "\"Write good code\"",
              "\"Use TypeScript strict mode. All functions must have explicit return types.\"",
            ],
            [
              "\"Follow best practices\"",
              "\"Use React Server Components for data fetching. Client components only for interactivity.\"",
            ],
            [
              "\"Be careful with security\"",
              "\"Never log or store API keys. Use environment variables via process.env.\"",
            ],
          ]}
        />
        <DocsH3>Include File Paths</DocsH3>
        <DocsParagraph>
          Referencing specific paths makes rules unambiguous:
        </DocsParagraph>
        <DocsCode lines>{`## File Organization
- API route handlers: src/app/api/
- Shared types: src/types/
- Database models: prisma/schema.prisma — do NOT edit manually
- Generated code: src/__generated__/ — never modify these files`}</DocsCode>

        <DocsH3>State Consequences</DocsH3>
        <DocsParagraph>
          Explaining why a rule exists helps the agent make better judgment
          calls in edge cases:
        </DocsParagraph>
        <DocsCode lines>{`## Dependency Policy
- Do not add new npm dependencies without confirming with the user first.
  Our bundle size is already at the limit for our Lighthouse target.
- Always prefer built-in Node.js APIs over third-party packages.
  We had incidents caused by abandoned packages in the past.`}</DocsCode>
      </DocsSection>

      <DocsSection id="examples" title="Examples">
        <DocsH3>Full-Stack Next.js Project</DocsH3>
        <DocsCode lines>{`# CREOR.md

## Stack
- Next.js 15 App Router with TypeScript strict mode
- Tailwind CSS for styling — no CSS modules
- Prisma ORM with PostgreSQL
- Vitest for testing

## Conventions
- All server actions go in src/app/actions/.
- Use \`"use server"\` directive, never \`"use client"\` in action files.
- Form validation: use Zod schemas in src/lib/validators/.
- Error handling: throw typed errors from src/lib/errors.ts, catch in error.tsx boundaries.

## Restrictions
- Never modify prisma/migrations/ files directly. Use \`prisma migrate dev\`.
- The src/components/ui/ directory is auto-generated from shadcn. Don't edit.
- Always check \`pnpm lint\` passes before considering a task complete.`}</DocsCode>

        <DocsH3>Monorepo with Multiple Packages</DocsH3>
        <DocsCode lines>{`# CREOR.md

## Monorepo Structure
- packages/core — shared business logic, zero dependencies on other packages
- packages/web — Next.js frontend, depends on core
- packages/api — Hono backend, depends on core
- packages/shared — TypeScript types shared across all packages

## Rules
- Changes to packages/shared/ require updating all consumers.
- Each package has its own tsconfig.json — do not modify the root tsconfig.
- Use workspace protocol for internal deps: "workspace:*"
- Run \`turbo build\` to verify no circular dependencies after structural changes.`}</DocsCode>
      </DocsSection>
    </DocsPage>
  );
}
