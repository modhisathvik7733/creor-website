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
  title: "Rate Limits | Creor API",
  description:
    "Understand Creor API rate limits per plan tier, rate limit headers, and how to handle 429 responses.",
  path: "/docs/api/rate-limits",
});

export default function RateLimitsPage() {
  return (
    <DocsPage
      breadcrumb="API"
      title="Rate Limits"
      description="Creor enforces rate limits to ensure fair usage and platform stability. Limits vary by plan tier and are applied per API key."
      toc={[
        { label: "Limits by Plan", href: "#limits-by-plan" },
        { label: "Rate Limit Headers", href: "#headers" },
        { label: "Handling 429 Responses", href: "#handling-429" },
        { label: "Best Practices", href: "#best-practices" },
      ]}
    >
      <DocsSection id="limits-by-plan" title="Limits by Plan">
        <DocsParagraph>
          Rate limits are applied per API key on a rolling monthly window. The
          counter resets on the first day of each calendar month (UTC). Each
          successful request counts as one unit regardless of the model used or
          tokens consumed.
        </DocsParagraph>

        <DocsTable
          headers={["Plan", "Monthly Requests", "Requests / Minute", "Concurrent Requests"]}
          rows={[
            ["Free", "200", "10", "1"],
            ["Starter", "1,000", "30", "3"],
            ["Pro", "Unlimited", "120", "10"],
            ["Enterprise", "Unlimited", "Custom", "Custom"],
          ]}
        />

        <DocsCallout type="info">
          The per-minute and concurrency limits apply even on the Pro and
          Enterprise plans. These protect the platform from sudden traffic spikes
          and ensure consistent latency for all users.
        </DocsCallout>

        <DocsH3>What Counts as a Request</DocsH3>
        <DocsList
          items={[
            "Each call to /v1/chat/completions counts as one request, whether streaming or non-streaming.",
            "Polling endpoints (e.g., agent status) count as one request per poll.",
            "Requests that fail with a 4xx client error still count toward your limit.",
            "Requests that fail with a 5xx server error do not count toward your limit.",
          ]}
        />
      </DocsSection>

      <DocsDivider />

      <DocsSection id="headers" title="Rate Limit Headers">
        <DocsParagraph>
          Every API response includes headers that tell you your current rate
          limit status. Use these to monitor your consumption and implement
          client-side throttling.
        </DocsParagraph>

        <DocsTable
          headers={["Header", "Type", "Description"]}
          rows={[
            ["X-RateLimit-Limit", "integer", "Maximum number of requests allowed in the current period."],
            ["X-RateLimit-Remaining", "integer", "Number of requests remaining in the current period."],
            ["X-RateLimit-Reset", "integer", "Unix timestamp (seconds) when the current period resets."],
            ["X-RateLimit-Limit-Minute", "integer", "Maximum requests allowed per minute."],
            ["X-RateLimit-Remaining-Minute", "integer", "Requests remaining in the current minute window."],
            ["Retry-After", "integer", "Seconds to wait before retrying (only present on 429 responses)."],
          ]}
        />

        <DocsH3>Example Response Headers</DocsH3>
        <DocsCode>{`HTTP/2 200 OK
Content-Type: application/json
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 1714521600
X-RateLimit-Limit-Minute: 30
X-RateLimit-Remaining-Minute: 28`}</DocsCode>

        <DocsParagraph>
          The X-RateLimit-Limit and X-RateLimit-Remaining headers reflect your
          monthly quota. The minute-level headers reflect the short-term burst
          limit.
        </DocsParagraph>
      </DocsSection>

      <DocsDivider />

      <DocsSection id="handling-429" title="Handling 429 Responses">
        <DocsParagraph>
          When you exceed either the monthly or per-minute limit, the API returns
          a 429 Too Many Requests response with a JSON error body and a
          Retry-After header.
        </DocsParagraph>

        <DocsH3>429 Response Body</DocsH3>
        <DocsCode>{`{
  "error": {
    "type": "rate_limit_exceeded",
    "message": "You have exceeded your per-minute request limit. Please retry after 12 seconds.",
    "retry_after": 12
  }
}`}</DocsCode>

        <DocsH3>Retry Strategy</DocsH3>
        <DocsParagraph>
          Implement exponential backoff with jitter when you receive a 429. The
          Retry-After header gives you the minimum wait time, but adding jitter
          prevents thundering herd problems when multiple clients are rate-limited
          simultaneously.
        </DocsParagraph>

        <DocsCode lines>{`async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, options);

    if (response.status !== 429) {
      return response;
    }

    if (attempt === maxRetries) {
      throw new Error("Rate limit exceeded after max retries");
    }

    const retryAfter = parseInt(response.headers.get("Retry-After") || "5", 10);
    const jitter = Math.random() * 1000;
    const delay = retryAfter * 1000 + jitter;

    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}`}</DocsCode>

        <DocsH3>Python Example</DocsH3>
        <DocsCode lines>{`import time
import random
import requests

def fetch_with_retry(url, headers, json_body, max_retries=3):
    for attempt in range(max_retries + 1):
        response = requests.post(url, headers=headers, json=json_body)

        if response.status_code != 429:
            return response

        if attempt == max_retries:
            raise Exception("Rate limit exceeded after max retries")

        retry_after = int(response.headers.get("Retry-After", 5))
        jitter = random.uniform(0, 1)
        time.sleep(retry_after + jitter)`}</DocsCode>

        <DocsCallout type="warning">
          Do not retry immediately without respecting the Retry-After header.
          Aggressive retries can result in longer backoff periods or temporary
          key suspension.
        </DocsCallout>
      </DocsSection>

      <DocsDivider />

      <DocsSection id="best-practices" title="Best Practices">
        <DocsParagraph>
          Follow these practices to stay within your rate limits and build
          resilient integrations.
        </DocsParagraph>

        <DocsList
          items={[
            "Monitor the X-RateLimit-Remaining header and slow down requests when it drops below 10% of your limit.",
            "Use streaming responses for chat completions -- a single streaming request is more efficient than polling for results.",
            "Cache responses when appropriate. If multiple users ask the same question, serve the cached result instead of making duplicate API calls.",
            "Batch operations where possible. Use the models list endpoint once and cache it rather than calling it before every completion request.",
            "Distribute requests evenly across the minute window instead of sending bursts.",
            "Set up alerts in your monitoring system when X-RateLimit-Remaining drops below a threshold.",
            "On the Free plan, consider upgrading to Starter if you regularly hit the 200 request/month ceiling.",
          ]}
        />

        <DocsCallout type="tip">
          Enterprise customers can request custom rate limits tailored to their
          workload. Contact sales@creor.ai to discuss your requirements.
        </DocsCallout>
      </DocsSection>
    </DocsPage>
  );
}
