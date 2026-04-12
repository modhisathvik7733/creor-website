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
  title: "Skills | Creor",
  description:
    "Create reusable prompt workflows with the Creor skill system. Discover, author, and invoke skills from the .creor/skills/ directory.",
  path: "/docs/customizing/skills",
});

export default function SkillsPage() {
  return (
    <DocsPage
      breadcrumb="Customizing"
      title="Skills"
      description="Skills are reusable prompt workflows that you can invoke by name. They let you codify recurring tasks — deployments, code reviews, migration patterns — into versioned, shareable instructions."
      toc={[
        { label: "Overview", href: "#overview" },
        { label: "Skill Discovery", href: "#discovery" },
        { label: "Creating a Skill", href: "#creating" },
        { label: "Graph Skills", href: "#graph-skills" },
        { label: "Remote Skills", href: "#remote-skills" },
        { label: "Invoking Skills", href: "#invoking" },
        { label: "Auto-Activation", href: "#auto-activation" },
        { label: "Configuration", href: "#configuration" },
      ]}
    >
      <DocsSection id="overview" title="Overview">
        <DocsParagraph>
          A skill is a markdown file (<code>SKILL.md</code>) with
          frontmatter metadata and a prompt body. When invoked, the
          skill&apos;s content is injected into the conversation as context,
          guiding the agent through a specific workflow.
        </DocsParagraph>
        <DocsParagraph>
          Skills are more structured than rules. While rules provide passive
          guidance that&apos;s always present, skills are actively invoked for
          specific tasks and can contain multi-step instructions, code
          templates, and interconnected knowledge graphs.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="discovery" title="Skill Discovery">
        <DocsParagraph>
          Creor scans for skills in the following locations:
        </DocsParagraph>
        <DocsList
          items={[
            ".creor/skills/*/SKILL.md — project-level skills",
            ".creor/skill/*/SKILL.md — alternative singular directory name",
            "~/.creor/skills/*/SKILL.md — global user skills",
            "Additional paths from the skills.paths config array",
            "Remote URLs from the skills.urls config array",
          ]}
        />
        <DocsParagraph>
          Each skill lives in its own directory. The directory name is the
          skill&apos;s identifier, and the <code>SKILL.md</code> file is the
          entry point.
        </DocsParagraph>
        <DocsCode lines>{`.creor/
  skills/
    deploy/
      SKILL.md          # skill entry point
    code-review/
      SKILL.md
    migration/
      SKILL.md
      postgres.md       # graph node (see Graph Skills)
      redis.md          # graph node`}</DocsCode>
      </DocsSection>

      <DocsSection id="creating" title="Creating a Skill">
        <DocsParagraph>
          A skill file has two parts: YAML frontmatter with metadata, and a
          markdown body with the prompt content.
        </DocsParagraph>
        <DocsH3>Basic Skill</DocsH3>
        <DocsCode lines>{`---
name: deploy
description: Deploy the application to production
---

# Deploy to Production

Follow these steps to deploy:

1. Run the test suite: \`npm test\`
2. Build the application: \`npm run build\`
3. Check for TypeScript errors: \`npx tsc --noEmit\`
4. If all checks pass, run: \`npm run deploy\`

## Pre-deploy Checklist
- Verify all environment variables are set in .env.production
- Confirm the database migrations are up to date
- Check that no console.log statements remain in src/

## Rollback
If the deploy fails, run \`npm run rollback\` to revert to the previous version.`}</DocsCode>

        <DocsH3>Frontmatter Fields</DocsH3>
        <DocsTable
          headers={["Field", "Required", "Description"]}
          rows={[
            ["name", "Yes", "Unique identifier for the skill. Must match the directory name."],
            ["description", "Yes", "One-line description shown in the skill picker and autocomplete."],
          ]}
        />
        <DocsCallout type="warning">
          The <code>name</code> field in the frontmatter must match the
          directory name. If the directory is <code>skills/deploy/</code>,
          the name must be <code>deploy</code>. A mismatch will cause a
          warning during discovery.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="graph-skills" title="Graph Skills">
        <DocsParagraph>
          For complex workflows, you can break a skill into multiple
          interconnected nodes. Each node is a separate <code>.md</code> file
          in the skill directory, and nodes reference each other using{" "}
          <code>[[wikilink]]</code> syntax.
        </DocsParagraph>
        <DocsH3>Directory Layout</DocsH3>
        <DocsCode lines>{`.creor/skills/migration/
  SKILL.md              # entry point — references [[postgres]] and [[redis]]
  postgres.md           # node: PostgreSQL migration steps
  redis.md              # node: Redis cache migration steps
  rollback.md           # node: referenced by postgres and redis`}</DocsCode>

        <DocsH3>Entry Point (SKILL.md)</DocsH3>
        <DocsCode lines>{`---
name: migration
description: Database migration workflow
---

# Database Migration

This skill guides you through migrating databases.

Choose the relevant path:
- For PostgreSQL migrations, see [[postgres]]
- For Redis cache migrations, see [[redis]]`}</DocsCode>

        <DocsH3>Node File (postgres.md)</DocsH3>
        <DocsCode lines>{`---
name: PostgreSQL Migration
description: Steps for PostgreSQL schema migrations
---

# PostgreSQL Migration

1. Create a new migration: \`prisma migrate dev --name descriptive_name\`
2. Review the generated SQL in \`prisma/migrations/\`
3. Test the migration on a local database
4. Apply to staging: \`prisma migrate deploy\`

If anything goes wrong, follow the [[rollback]] procedure.`}</DocsCode>

        <DocsParagraph>
          Creor automatically builds an adjacency graph from the wikilinks. When
          the agent activates a skill, it can traverse the graph to load only
          the relevant nodes, keeping context focused.
        </DocsParagraph>

        <DocsH3>Reserved Directories</DocsH3>
        <DocsParagraph>
          The following subdirectories inside a skill folder are skipped during
          node discovery:
        </DocsParagraph>
        <DocsList
          items={[
            "scripts/ — helper scripts, not skill content",
            "references/ — reference material, not injected as nodes",
            "assets/ — images or other assets",
          ]}
        />

        <DocsCallout type="tip">
          Keep individual nodes under ~3,000 tokens (~12,000 characters). Creor
          will log a warning for large nodes. If a node is too big, split it
          into smaller interconnected pieces.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="remote-skills" title="Remote Skills">
        <DocsParagraph>
          You can load skills from remote URLs. Creor downloads them and
          caches them locally. This is useful for sharing skills across teams
          or organizations.
        </DocsParagraph>
        <DocsCode lines>{`{
  "skills": {
    "urls": [
      "https://example.com/.well-known/skills/",
      "https://github.com/your-org/shared-skills/archive/main.tar.gz"
    ]
  }
}`}</DocsCode>
        <DocsParagraph>
          Remote skill URLs are fetched during config initialization. The
          downloaded skills follow the same directory structure — each skill
          must have a <code>SKILL.md</code> entry point.
        </DocsParagraph>
        <DocsCallout type="info">
          Set <code>CREOR_DISABLE_EXTERNAL_SKILLS=true</code> to prevent
          loading any remote skills. This is useful in air-gapped or
          security-sensitive environments.
        </DocsCallout>
      </DocsSection>

      <DocsDivider />

      <DocsSection id="invoking" title="Invoking Skills">
        <DocsParagraph>
          There are two ways to invoke a skill:
        </DocsParagraph>
        <DocsH3>Slash Command</DocsH3>
        <DocsParagraph>
          Type <code>/skill-name</code> in the chat input to trigger a skill
          directly. For example, <code>/deploy</code> invokes the deploy
          skill. Creor shows autocomplete suggestions as you type.
        </DocsParagraph>
        <DocsH3>Natural Language</DocsH3>
        <DocsParagraph>
          You can also ask the agent to use a skill naturally: &quot;Use the
          deploy skill to push this to production.&quot; The agent will look up
          the skill by name and inject its content.
        </DocsParagraph>
        <DocsParagraph>
          When a skill is invoked, its full content (including graph nodes if
          applicable) is loaded into the conversation context. The agent then
          follows the instructions in the skill as it works through the task.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="auto-activation" title="Auto-Activation">
        <DocsParagraph>
          Creor can automatically detect when a skill is relevant to the
          current conversation and inject targeted excerpts into the system
          prompt. This is controlled by the{" "}
          <code>skill_auto_activation</code> config:
        </DocsParagraph>
        <DocsCode lines>{`{
  "skill_auto_activation": {
    "enabled": true,
    "threshold": 0.3,
    "max_skills": 2,
    "token_budget": 2000,
    "recency_window": 8,
    "llm_fallback": false
  }
}`}</DocsCode>
        <DocsTable
          headers={["Field", "Default", "Description"]}
          rows={[
            ["enabled", "false", "Turn on auto-activation"],
            ["threshold", "0.3", "Minimum relevance score (0-1) to activate a skill"],
            ["max_skills", "2", "Maximum skills to inject per message"],
            ["token_budget", "2000", "Maximum tokens across all activated skills"],
            ["recency_window", "8", "Number of recent messages to consider for relevance"],
            ["llm_fallback", "false", "Use LLM classification when heuristic matching is ambiguous"],
          ]}
        />
      </DocsSection>

      <DocsSection id="configuration" title="Configuration">
        <DocsParagraph>
          Additional skill directories and remote sources are configured in the{" "}
          <code>skills</code> section of your <code>creor.json</code>:
        </DocsParagraph>
        <DocsCode lines>{`{
  "skills": {
    "paths": [
      "./custom-skills",
      "~/shared-team-skills",
      "/opt/org-skills"
    ],
    "urls": [
      "https://skills.example.com/.well-known/skills/"
    ]
  }
}`}</DocsCode>
        <DocsParagraph>
          Paths can be relative (resolved from the project root), home-relative
          (starting with <code>~/</code>), or absolute. Creor scans each path
          for <code>**/SKILL.md</code> files.
        </DocsParagraph>
        <DocsParagraph>
          When duplicate skill names are found across directories, the last
          one discovered wins. Creor logs a warning so you can resolve the
          conflict.
        </DocsParagraph>
      </DocsSection>
    </DocsPage>
  );
}
