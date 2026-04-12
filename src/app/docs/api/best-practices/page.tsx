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
} from "@/components/docs-page";

export const metadata: Metadata = generatePageMetadata({
  title: "Best Practices | Creor API",
  description:
    "Idempotency keys, error handling, pagination, streaming, and webhook reliability for the Creor API.",
  path: "/docs/api/best-practices",
});

export default function BestPracticesPage() {
  return (
    <DocsPage
      breadcrumb="API"
      title="Best Practices"
      description="Build reliable, efficient integrations with the Creor API. This guide covers idempotency, error handling, pagination, streaming, and webhook patterns."
      toc={[
        { label: "Idempotency Keys", href: "#idempotency" },
        { label: "Error Handling", href: "#error-handling" },
        { label: "Pagination", href: "#pagination" },
        { label: "Streaming Responses", href: "#streaming" },
        { label: "Webhook Reliability", href: "#webhooks" },
      ]}
    >
      <DocsSection id="idempotency" title="Idempotency Keys">
        <DocsParagraph>
          Network failures, timeouts, and retries can cause a request to be sent
          more than once. Idempotency keys let you safely retry requests without
          duplicating the operation. The server stores the result of the first
          request and returns it for any subsequent request with the same key.
        </DocsParagraph>

        <DocsH3>How to Use Idempotency Keys</DocsH3>
        <DocsParagraph>
          Pass a unique string in the Idempotency-Key header. Use a UUID v4 or
          another value that uniquely identifies the logical operation on the
          client side.
        </DocsParagraph>

        <DocsCode>{`curl https://api.creor.ai/v1/agents \\
  -u YOUR_API_KEY: \\
  -H "Content-Type: application/json" \\
  -H "Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000" \\
  -d '{
    "name": "bugfix-agent",
    "repository": "org/repo",
    "prompt": "Fix the failing CI test in src/auth.ts"
  }'`}</DocsCode>

        <DocsTable
          headers={["Behavior", "Description"]}
          rows={[
            ["First request", "Processed normally. The result is cached against the idempotency key for 24 hours."],
            ["Duplicate request (same key)", "Returns the cached result from the first request without re-executing the operation."],
            ["Same key, different body", "Returns a 409 Conflict error. A key must always be paired with the same request body."],
            ["Key expiration", "Cached results are purged after 24 hours. After that, the key can be reused."],
          ]}
        />

        <DocsCallout type="tip">
          Generate the idempotency key on the client before the first attempt
          and reuse it across retries. Do not generate a new key for each retry --
          that defeats the purpose.
        </DocsCallout>

        <DocsH3>Which Endpoints Support Idempotency</DocsH3>
        <DocsList
          items={[
            "POST /v1/agents -- launch a new agent",
            "POST /v1/agents/:id/followup -- add a follow-up message",
            "POST /v1/chat/completions -- chat completion (non-streaming only)",
          ]}
        />
        <DocsParagraph>
          GET, PUT, and DELETE requests are naturally idempotent and do not require
          an idempotency key.
        </DocsParagraph>
      </DocsSection>

      <DocsDivider />

      <DocsSection id="error-handling" title="Error Handling">
        <DocsParagraph>
          The Creor API uses standard HTTP status codes and returns structured
          JSON error bodies. Every error response follows the same shape, making
          it straightforward to handle errors consistently in your client code.
        </DocsParagraph>

        <DocsH3>Error Response Format</DocsH3>
        <DocsCode>{`{
  "error": {
    "type": "invalid_request",
    "message": "The 'model' field is required.",
    "param": "model",
    "code": "missing_field"
  }
}`}</DocsCode>

        <DocsTable
          headers={["Status Code", "Type", "Description"]}
          rows={[
            ["400", "invalid_request", "The request body is malformed or missing required fields."],
            ["401", "authentication_error", "The API key is missing, invalid, or expired."],
            ["403", "permission_denied", "The API key does not have permission for this operation."],
            ["404", "not_found", "The requested resource does not exist."],
            ["409", "conflict", "Idempotency key conflict or resource state conflict."],
            ["422", "unprocessable_entity", "The request is well-formed but semantically invalid (e.g., unsupported model)."],
            ["429", "rate_limit_exceeded", "You have exceeded your rate limit. See the Rate Limits page."],
            ["500", "internal_error", "An unexpected server error. Safe to retry with exponential backoff."],
            ["503", "service_unavailable", "The service is temporarily unavailable. Retry after the Retry-After header value."],
          ]}
        />

        <DocsH3>Handling Errors in Code</DocsH3>
        <DocsCode lines>{`async function creorRequest(path: string, body: Record<string, unknown>) {
  const response = await fetch(\`https://api.creor.ai\${path}\`, {
    method: "POST",
    headers: {
      "Authorization": \`Basic \${btoa(API_KEY + ":")}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const { error } = await response.json();

    switch (response.status) {
      case 401:
        throw new Error("Invalid API key. Check your credentials.");
      case 429:
        const retryAfter = response.headers.get("Retry-After");
        throw new Error(\`Rate limited. Retry after \${retryAfter}s.\`);
      case 500:
      case 503:
        // Safe to retry with backoff
        throw new Error(\`Server error: \${error.message}\`);
      default:
        throw new Error(\`API error [\${error.type}]: \${error.message}\`);
    }
  }

  return response.json();
}`}</DocsCode>

        <DocsCallout type="info">
          Always check the error.type field rather than parsing the message
          string. Error messages may change over time, but types are stable.
        </DocsCallout>
      </DocsSection>

      <DocsDivider />

      <DocsSection id="pagination" title="Pagination">
        <DocsParagraph>
          List endpoints return paginated results using cursor-based pagination.
          This approach is more reliable than offset-based pagination because it
          handles insertions and deletions between pages correctly.
        </DocsParagraph>

        <DocsH3>Request Parameters</DocsH3>
        <DocsTable
          headers={["Parameter", "Type", "Default", "Description"]}
          rows={[
            ["limit", "integer", "20", "Number of items per page. Maximum 100."],
            ["cursor", "string", "null", "Cursor from the previous response to fetch the next page."],
            ["order", "string", "desc", "Sort order: \"asc\" or \"desc\" by creation time."],
          ]}
        />

        <DocsH3>Response Format</DocsH3>
        <DocsCode>{`{
  "data": [
    { "id": "agent_abc123", "name": "bugfix-agent", "status": "completed" },
    { "id": "agent_def456", "name": "review-agent", "status": "running" }
  ],
  "has_more": true,
  "next_cursor": "eyJpZCI6ImFnZW50X2RlZjQ1NiJ9"
}`}</DocsCode>

        <DocsH3>Iterating Through All Pages</DocsH3>
        <DocsCode lines>{`async function fetchAllAgents(apiKey: string) {
  const agents = [];
  let cursor: string | undefined;

  do {
    const params = new URLSearchParams({ limit: "50" });
    if (cursor) params.set("cursor", cursor);

    const response = await fetch(
      \`https://api.creor.ai/v1/agents?\${params}\`,
      { headers: { Authorization: \`Basic \${btoa(apiKey + ":")}\` } }
    );

    const page = await response.json();
    agents.push(...page.data);
    cursor = page.has_more ? page.next_cursor : undefined;
  } while (cursor);

  return agents;
}`}</DocsCode>

        <DocsCallout type="tip">
          Use the largest reasonable limit value to minimize the number of
          requests. Fetching 100 items at a time is more efficient than fetching
          20 at a time.
        </DocsCallout>
      </DocsSection>

      <DocsDivider />

      <DocsSection id="streaming" title="Streaming Responses">
        <DocsParagraph>
          The /v1/chat/completions endpoint supports Server-Sent Events (SSE)
          for streaming responses. Streaming lets you display tokens to the user
          as they are generated instead of waiting for the full response.
        </DocsParagraph>

        <DocsH3>Enabling Streaming</DocsH3>
        <DocsParagraph>
          Set &quot;stream&quot;: true in your request body. The response will be a
          text/event-stream instead of a JSON object.
        </DocsParagraph>
        <DocsCode>{`curl https://api.creor.ai/v1/chat/completions \\
  -u YOUR_API_KEY: \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "claude-sonnet-4-20250514",
    "stream": true,
    "messages": [
      {"role": "user", "content": "Write a haiku about code reviews"}
    ]
  }'`}</DocsCode>

        <DocsH3>Event Format</DocsH3>
        <DocsParagraph>
          Each event is a JSON object prefixed with &quot;data: &quot;. The stream
          ends with a &quot;data: [DONE]&quot; sentinel. See the Gateway Streaming
          page for the full event schema and code examples.
        </DocsParagraph>

        <DocsCallout type="info">
          Streaming requests count as a single request against your rate limit,
          regardless of how many events are sent.
        </DocsCallout>
      </DocsSection>

      <DocsDivider />

      <DocsSection id="webhooks" title="Webhook Reliability">
        <DocsParagraph>
          Creor sends webhooks for agent lifecycle events (started, completed,
          failed) and usage alerts. Building a reliable webhook consumer requires
          handling retries, verifying signatures, and processing events
          idempotently.
        </DocsParagraph>

        <DocsH3>Webhook Delivery</DocsH3>
        <DocsTable
          headers={["Behavior", "Details"]}
          rows={[
            ["Timeout", "Your endpoint must respond with a 2xx status within 10 seconds."],
            ["Retries", "Failed deliveries are retried up to 5 times with exponential backoff (1m, 5m, 30m, 2h, 12h)."],
            ["Ordering", "Events are delivered in approximate order but not guaranteed. Use the event timestamp to detect out-of-order delivery."],
            ["Idempotency", "Each event includes a unique event_id. Store processed event IDs to avoid duplicate handling."],
          ]}
        />

        <DocsH3>Verifying Signatures</DocsH3>
        <DocsParagraph>
          Every webhook includes a Creor-Signature header containing an HMAC-SHA256
          signature of the request body. Verify this signature to ensure the
          webhook was sent by Creor and not tampered with in transit.
        </DocsParagraph>
        <DocsCode lines>{`import crypto from "node:crypto";

function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}

// In your webhook handler:
app.post("/webhooks/creor", (req, res) => {
  const signature = req.headers["creor-signature"] as string;
  const isValid = verifyWebhookSignature(
    JSON.stringify(req.body),
    signature,
    process.env.CREOR_WEBHOOK_SECRET!
  );

  if (!isValid) {
    return res.status(401).send("Invalid signature");
  }

  // Process the event
  const { event_id, type, data } = req.body;
  // ... handle event idempotently using event_id
  res.status(200).send("OK");
});`}</DocsCode>

        <DocsH3>Best Practices for Webhook Consumers</DocsH3>
        <DocsList
          items={[
            "Respond with 200 immediately, then process the event asynchronously. This prevents timeouts.",
            "Store the event_id and skip duplicates. Creor may deliver the same event more than once.",
            "Use the event timestamp (not arrival time) for ordering logic.",
            "Log the raw request body before processing for debugging.",
            "Set up a dead-letter queue for events that fail processing after all retries.",
            "Monitor your webhook endpoint's error rate and latency in your observability stack.",
          ]}
        />

        <DocsCallout type="warning">
          Never trust webhook data without verifying the signature. An
          unauthenticated webhook endpoint is a security vulnerability that
          could allow attackers to trigger actions in your system.
        </DocsCallout>
      </DocsSection>
    </DocsPage>
  );
}
