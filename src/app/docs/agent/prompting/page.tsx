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
  title: "Prompting | Creor",
  description:
    "Write effective prompts, configure project-level instructions with CREOR.md, and learn how context injection works.",
  path: "/docs/agent/prompting",
});

export default function PromptingPage() {
  return (
    <DocsPage
      breadcrumb="Agent"
      title="Prompting"
      description="The quality of the agent's work depends heavily on how you communicate with it. This guide covers writing effective prompts, configuring project-level instructions, and understanding how context is assembled."
      toc={[
        { label: "Writing Effective Prompts", href: "#writing-effective-prompts" },
        { label: "CREOR.md", href: "#creor-md" },
        { label: "The .creor/ Directory", href: "#creor-directory" },
        { label: "System Prompt Structure", href: "#system-prompt-structure" },
        { label: "Attachments", href: "#attachments" },
        { label: "Prompting Tips", href: "#prompting-tips" },
      ]}
    >
      <DocsSection id="writing-effective-prompts" title="Writing Effective Prompts">
        <DocsParagraph>
          The agent is most effective when you give it clear, specific instructions with enough
          context to understand both what you want and why. Vague prompts produce vague results.
        </DocsParagraph>

        <DocsH3>Bad vs. Good Prompts</DocsH3>
        <DocsTable
          headers={["Weak Prompt", "Stronger Prompt"]}
          rows={[
            [
              "Fix the bug",
              "The login form submits twice when the user double-clicks the submit button. Add debouncing to the onClick handler in src/components/LoginForm.tsx.",
            ],
            [
              "Add tests",
              "Add unit tests for the calculateDiscount function in src/pricing/discount.ts. Cover the cases: no discount, percentage discount, fixed amount discount, and discount exceeding the total.",
            ],
            [
              "Refactor this",
              "Extract the validation logic from the UserController into a separate UserValidator class. Keep the same validation rules but make them testable independently.",
            ],
            [
              "Make it faster",
              "The /api/products endpoint takes 3 seconds to respond. The N+1 query in ProductRepository.findAll() is likely the cause. Add eager loading for the category relationship.",
            ],
          ]}
        />

        <DocsH3>Structure Your Requests</DocsH3>
        <DocsParagraph>
          For complex tasks, structure your prompt with clear sections.
        </DocsParagraph>
        <DocsCode>{`Add a caching layer to the API:

Context: We're seeing 500ms response times on the /api/users
endpoint due to repeated database queries for the same data.

Requirements:
- Use Redis for caching (already in our docker-compose)
- Cache user profiles for 5 minutes
- Invalidate cache on user update/delete
- Add cache-hit/miss headers to responses

Constraints:
- Don't change the existing API response format
- Must work with the existing auth middleware`}</DocsCode>
      </DocsSection>

      <DocsSection id="creor-md" title="CREOR.md">
        <DocsParagraph>
          CREOR.md is a special file at the root of your project that provides persistent instructions
          to the agent. Think of it as a project constitution -- it is included in every agent
          interaction, so the agent always knows your project&apos;s conventions, architecture, and rules.
        </DocsParagraph>

        <DocsH3>What to Include</DocsH3>
        <DocsList
          items={[
            "Project overview: What the project does, its architecture, and key components.",
            "Code style: Naming conventions, formatting preferences, import ordering.",
            "Build commands: How to compile, test, lint, and run the project.",
            "Testing conventions: Test framework, file naming, mocking patterns.",
            "Architecture rules: Where different types of code should live, dependency boundaries.",
            "Common pitfalls: Known issues, workarounds, or things the agent should avoid.",
          ]}
        />

        <DocsH3>Example CREOR.md</DocsH3>
        <DocsCode lines>{`# CREOR.md

## Project
E-commerce API built with Express + TypeScript + Prisma.

## Build Commands
- npm run dev         # start dev server
- npm run test        # run all tests
- npm run test:watch  # watch mode
- npm run lint        # ESLint + Prettier check
- npm run typecheck   # tsc --noEmit

## Code Style
- Use named exports, not default exports
- Prefer interfaces over type aliases
- Error handling: always use AppError class
- Logging: use the logger from src/lib/logger.ts

## Architecture
- src/routes/     - Express route handlers (thin)
- src/services/   - Business logic (testable)
- src/repos/      - Database access (Prisma)
- src/middleware/  - Express middleware
- src/lib/        - Shared utilities

## Testing
- Use vitest with the config in vitest.config.ts
- Mock database with prisma-mock (not real DB)
- Test files live next to source: foo.test.ts

## Rules
- Never import from routes/ in services/
- All new endpoints need integration tests
- Keep controllers thin, logic in services`}</DocsCode>

        <DocsCallout type="tip">
          Commit your CREOR.md to version control. This way, every team member and CI agent shares
          the same project instructions.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="creor-directory" title="The .creor/ Directory">
        <DocsParagraph>
          The .creor/ directory at your project root holds additional configuration, rules, and
          agent-generated artifacts. While CREOR.md provides top-level instructions, the .creor/
          directory offers more granular control.
        </DocsParagraph>

        <DocsH3>Directory Structure</DocsH3>
        <DocsCode>{`.creor/
  rules/          # Additional instruction files (.md)
  plans/          # Plans generated by the Plan agent
  skills/         # Custom skill definitions
  settings.json   # Local Creor settings`}</DocsCode>

        <DocsH3>Rules</DocsH3>
        <DocsParagraph>
          The .creor/rules/ directory can contain any number of markdown files with additional
          instructions. These are loaded alongside CREOR.md and can be used for domain-specific
          guidelines, team-specific conventions, or temporary rules.
        </DocsParagraph>
        <DocsCode lines>{`# .creor/rules/api-conventions.md

## API Response Format
All API endpoints must return responses in this format:
{
  "data": <response payload>,
  "error": null | { "code": "ERROR_CODE", "message": "..." }
}

## Status Codes
- 200: Success with data
- 201: Created
- 400: Validation error (include field-level errors)
- 401: Unauthorized (missing/invalid token)
- 404: Resource not found
- 500: Internal error (never expose stack traces)`}</DocsCode>

        <DocsParagraph>
          Rules files are automatically discovered and included in the agent&apos;s context. You do not
          need to reference them explicitly -- just create them in the .creor/rules/ directory.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="system-prompt-structure" title="System Prompt Structure">
        <DocsParagraph>
          Understanding how the agent&apos;s system prompt is assembled helps you write better instructions.
          The system prompt is built from multiple sources in this order.
        </DocsParagraph>

        <DocsTable
          headers={["Layer", "Source", "Purpose"]}
          rows={[
            ["1. Base prompt", "Built-in", "Core agent behavior, tool usage instructions, safety rules."],
            ["2. Agent definition", "Agent config", "Agent-specific instructions (Build, Plan, etc.)."],
            ["3. Project instructions", "CREOR.md", "Your project-level instructions and conventions."],
            ["4. Rules", ".creor/rules/*.md", "Additional rules and guidelines."],
            ["5. Tool definitions", "Tool registry", "Available tools with descriptions and parameter schemas."],
            ["6. Session context", "Conversation history", "Previous messages, tool results, and compacted history."],
            ["7. User message", "Chat input", "Your current message with any attachments."],
          ]}
        />

        <DocsParagraph>
          Your CREOR.md and rules files appear early in the prompt, which gives them high influence
          over the agent&apos;s behavior. Instructions at the project level reliably override default
          behaviors.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="attachments" title="Attachments">
        <DocsParagraph>
          You can attach files, images, and URLs to your messages to give the agent additional context.
        </DocsParagraph>

        <DocsH3>File Attachments</DocsH3>
        <DocsParagraph>
          Drag and drop files into the chat input or use the attachment button. The agent can read
          the contents of text files, images (for visual analysis), PDFs, and Jupyter notebooks.
        </DocsParagraph>

        <DocsH3>Image Attachments</DocsH3>
        <DocsParagraph>
          Attach screenshots to show the agent what you see. This is especially useful for UI bugs,
          design implementation, and visual comparisons. The agent can analyze the image and reference
          specific elements in its response.
        </DocsParagraph>

        <DocsH3>URL Attachments</DocsH3>
        <DocsParagraph>
          Paste a URL and the agent will fetch and read the page content. This is useful for
          referencing documentation, API specs, GitHub issues, or Stack Overflow answers.
        </DocsParagraph>

        <DocsCallout type="info">
          Attachments are included in the message context and count toward the context window. For
          very large files, the agent may need to read specific sections rather than processing the
          entire file.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="prompting-tips" title="Prompting Tips">
        <DocsH3>Be Specific About Location</DocsH3>
        <DocsParagraph>
          Reference specific files and functions when you know them. The agent can find things on its
          own, but pointing it to the right place saves time and avoids ambiguity.
        </DocsParagraph>
        <DocsCode>{`Fix the race condition in useUserProfile hook at
src/hooks/useUserProfile.ts -- the cleanup function doesn't
cancel the pending fetch.`}</DocsCode>

        <DocsH3>Provide Error Context</DocsH3>
        <DocsParagraph>
          When reporting bugs, include the error message, stack trace, or steps to reproduce. The
          more the agent knows about the failure, the faster it can diagnose and fix it.
        </DocsParagraph>

        <DocsH3>Break Complex Tasks into Steps</DocsH3>
        <DocsParagraph>
          For large features, break them into sequential messages rather than one massive prompt. This
          lets you verify each step before moving on.
        </DocsParagraph>
        <DocsCode>{`Step 1: Create the database schema for the notifications table.

[verify, then continue]

Step 2: Add the NotificationService with methods for create,
markAsRead, and listForUser.

[verify, then continue]

Step 3: Add the API routes and wire them to the service.`}</DocsCode>

        <DocsH3>Tell the Agent What Not to Do</DocsH3>
        <DocsParagraph>
          Constraints are just as important as requirements. If there are approaches you want to avoid,
          say so explicitly.
        </DocsParagraph>
        <DocsCode>{`Add form validation to the checkout page.
- Don't use any validation libraries -- use native HTML5
  validation attributes.
- Don't modify the existing submit handler.
- Don't change the CSS.`}</DocsCode>

        <DocsH3>Use Follow-up Messages</DocsH3>
        <DocsParagraph>
          The agent maintains full session context. You can refine its work with follow-up messages
          without repeating yourself.
        </DocsParagraph>
        <DocsCode>{`> (initial) Add a search endpoint to the API.
> (follow-up) Add pagination with cursor-based navigation.
> (follow-up) Add a rate limit of 100 requests per minute.
> (follow-up) Write tests for the edge cases.`}</DocsCode>
      </DocsSection>
    </DocsPage>
  );
}
