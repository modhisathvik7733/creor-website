import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import {
  DocsPage,
  DocsSection,
  DocsParagraph,
  DocsCode,
  DocsList,
  DocsCallout,
  DocsH3,
} from "@/components/docs-page";

export const metadata: Metadata = generatePageMetadata({
  title: "Debugging | Creor",
  description:
    "Use Creor's AI agent to debug code, trace errors, run tests iteratively, and revert changes when needed.",
  path: "/docs/agent/debugging",
});

export default function DebuggingPage() {
  return (
    <DocsPage
      breadcrumb="Agent"
      title="Debugging"
      description="Creor's agent can diagnose bugs, trace errors through your codebase, run tests iteratively, and fix issues -- often in a single conversation. This guide covers effective debugging workflows."
      toc={[
        { label: "Paste the Error", href: "#paste-the-error" },
        { label: "Debugging Workflows", href: "#debugging-workflows" },
        { label: "Stack Trace Analysis", href: "#stack-trace-analysis" },
        { label: "Iterative Test Fixing", href: "#iterative-test-fixing" },
        { label: "Reverting Changes", href: "#reverting-changes" },
        { label: "Plan-First Debugging", href: "#plan-first-debugging" },
        { label: "Advanced Techniques", href: "#advanced-techniques" },
      ]}
    >
      <DocsSection id="paste-the-error" title="Paste the Error">
        <DocsParagraph>
          The simplest and most effective debugging workflow: paste the error message directly into
          the chat. The agent will analyze it, locate the relevant code, and propose a fix.
        </DocsParagraph>
        <DocsCode>{`I'm getting this error when I run npm test:

TypeError: Cannot read properties of undefined (reading 'map')
    at UserList (src/components/UserList.tsx:23:18)
    at renderWithHooks (node_modules/react-dom/...)
    at mountIndeterminateComponent (node_modules/react-dom/...)

The test file is tests/UserList.test.tsx`}</DocsCode>
        <DocsParagraph>
          The agent will read the referenced files, understand the data flow, and identify that
          the component is not handling the case where the user list is undefined. It will then
          edit the component to add a null check or default value.
        </DocsParagraph>

        <DocsCallout type="tip">
          Include the full error output, not just the message. Stack traces, line numbers, and
          surrounding log output give the agent critical context for pinpointing the root cause.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="debugging-workflows" title="Debugging Workflows">
        <DocsParagraph>
          Different types of bugs call for different approaches. Here are the most common
          debugging workflows.
        </DocsParagraph>

        <DocsH3>Runtime Errors</DocsH3>
        <DocsParagraph>
          Paste the error message and stack trace. The agent will follow the trace, read the
          relevant source files, and fix the issue.
        </DocsParagraph>

        <DocsH3>Logic Bugs</DocsH3>
        <DocsParagraph>
          Describe the expected behavior and actual behavior. The agent will read the relevant code,
          trace the logic, and identify where the behavior diverges.
        </DocsParagraph>
        <DocsCode>{`The discount calculation is wrong. When a user has a 20%
discount code and a $10 loyalty credit, the loyalty credit
should be applied after the percentage discount. But right
now the credit is applied first, making the percentage
discount smaller than it should be.

The relevant code is in src/pricing/checkout.ts`}</DocsCode>

        <DocsH3>Build and Compile Errors</DocsH3>
        <DocsParagraph>
          Paste the compiler output. The agent will parse the error messages, navigate to the
          offending files, and fix type errors, missing imports, or syntax issues.
        </DocsParagraph>

        <DocsH3>Performance Issues</DocsH3>
        <DocsParagraph>
          Describe the symptom (slow response, high memory, excessive renders) and the agent will
          analyze the code for common performance issues like N+1 queries, missing memoization,
          unnecessary re-renders, or inefficient algorithms.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="stack-trace-analysis" title="Stack Trace Analysis">
        <DocsParagraph>
          The agent is particularly effective at reading stack traces because it can follow each
          frame through your codebase.
        </DocsParagraph>

        <DocsH3>What the Agent Does</DocsH3>
        <DocsList
          items={[
            "Reads the stack trace and identifies which frames are in your code vs. library code.",
            "Opens each relevant source file at the referenced line number.",
            "Traces the data flow from the entry point to the error location.",
            "Identifies the root cause, which is often several frames above the actual error.",
            "Proposes a fix at the root cause, not just a workaround at the symptom.",
          ]}
        />

        <DocsH3>Multi-Language Stack Traces</DocsH3>
        <DocsParagraph>
          The agent handles stack traces from any language: JavaScript/TypeScript, Python, Java, Go,
          Rust, C#, and more. It understands the stack trace format for each language and can
          navigate your project files accordingly.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="iterative-test-fixing" title="Iterative Test Fixing">
        <DocsParagraph>
          One of the most powerful debugging workflows is the test-fix loop. The agent runs your tests,
          reads the failures, fixes the code, and re-runs the tests -- repeating until all tests pass.
        </DocsParagraph>
        <DocsCode>{`Run the tests in tests/pricing/ and fix any failures.`}</DocsCode>
        <DocsParagraph>
          The agent will execute the following loop automatically.
        </DocsParagraph>
        <DocsList
          items={[
            "Run the test suite using your project's test command.",
            "Parse the test output to identify failing tests.",
            "Read the test file to understand the expected behavior.",
            "Read the source file to understand the current implementation.",
            "Edit the source code to fix the bug.",
            "Re-run the tests to verify the fix.",
            "Repeat if there are remaining failures.",
          ]}
        />

        <DocsCallout type="info">
          The agent respects your CREOR.md test commands. Make sure your test runner command is
          documented so the agent uses the right tool.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="reverting-changes" title="Reverting Changes">
        <DocsParagraph>
          If the agent makes changes that do not work out, you can revert them. Creor tracks all
          file modifications made during a session.
        </DocsParagraph>

        <DocsH3>Undo Last Change</DocsH3>
        <DocsParagraph>
          Click the revert button on any tool call card in the chat timeline to undo that specific
          change. This restores the file to its state before that edit.
        </DocsParagraph>

        <DocsH3>Revert All Session Changes</DocsH3>
        <DocsParagraph>
          Use the session menu to revert all changes made in the current session. This is useful
          when the agent has gone down the wrong path and you want to start fresh.
        </DocsParagraph>

        <DocsH3>Git-Based Revert</DocsH3>
        <DocsParagraph>
          You can also ask the agent to use git to revert changes.
        </DocsParagraph>
        <DocsCode>{`Revert all the changes you just made and try a different approach.
Use git checkout to restore the original files.`}</DocsCode>

        <DocsCallout type="warning">
          Reverting restores file contents but does not undo side effects like database migrations,
          installed packages, or external API calls. Be mindful of irreversible operations.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="plan-first-debugging" title="Plan-First Debugging">
        <DocsParagraph>
          For complex bugs, use plan mode to analyze the issue before attempting a fix. This is
          especially useful when you are not sure where the bug originates or when the fix might
          have wide-reaching implications.
        </DocsParagraph>
        <DocsCode>{`/plan The checkout process fails silently when a user has
both a discount code and store credit. Analyze the payment
flow and identify where the failure occurs.`}</DocsCode>
        <DocsParagraph>
          The Plan agent will trace the code path, identify potential failure points, and produce a
          structured analysis. You can then review the findings and ask the Build agent to implement
          the fix with full understanding of the root cause.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="advanced-techniques" title="Advanced Techniques">
        <DocsH3>Add Logging</DocsH3>
        <DocsParagraph>
          Ask the agent to add temporary logging to trace a runtime issue.
        </DocsParagraph>
        <DocsCode>{`Add console.log statements to trace the data flow through
the payment processing pipeline in src/services/payment.ts.
Log the input and output of each step.`}</DocsCode>

        <DocsH3>Reproduce First</DocsH3>
        <DocsParagraph>
          Ask the agent to write a test that reproduces the bug before fixing it. This ensures the
          fix is verified and prevents regressions.
        </DocsParagraph>
        <DocsCode>{`Write a test that reproduces this bug: when the cart is empty
and the user applies a discount code, the API returns a 500
instead of a 400. Then fix the bug and verify the test passes.`}</DocsCode>

        <DocsH3>Binary Search Debugging</DocsH3>
        <DocsParagraph>
          For regressions, ask the agent to use git bisect to find the commit that introduced the bug.
        </DocsParagraph>
        <DocsCode>{`Use git bisect to find which commit broke the user search.
The test tests/search.test.ts should pass on the good commit
and fail on the bad one. HEAD is bad, v2.1.0 is good.`}</DocsCode>
      </DocsSection>
    </DocsPage>
  );
}
