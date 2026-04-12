import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import {
  DocsPage,
  DocsSection,
  DocsH3,
  DocsParagraph,
  DocsCode,
  DocsTable,
  DocsCallout,
  DocsDivider,
} from "@/components/docs-page";

export const metadata: Metadata = generatePageMetadata({
  title: "Streaming | Creor Gateway API",
  description:
    "Stream chat completions from the Creor Gateway using Server-Sent Events (SSE). Full event format, error handling, and SDK examples.",
  path: "/docs/api/gateway/streaming",
});

export default function GatewayStreamingPage() {
  return (
    <DocsPage
      breadcrumb="API > Gateway"
      title="Streaming"
      description="Stream chat completions using Server-Sent Events (SSE) to display tokens as they are generated. This guide covers the event format, error handling during streams, and complete code examples for curl, JavaScript, and Python."
      toc={[
        { label: "Enabling Streaming", href: "#enabling-streaming" },
        { label: "Event Format", href: "#event-format" },
        { label: "Stream Lifecycle", href: "#lifecycle" },
        { label: "Error Handling", href: "#error-handling" },
        { label: "curl Example", href: "#curl" },
        { label: "JavaScript / TypeScript", href: "#javascript" },
        { label: "Python", href: "#python" },
        { label: "OpenAI SDK", href: "#openai-sdk" },
      ]}
    >
      <DocsSection id="enabling-streaming" title="Enabling Streaming">
        <DocsParagraph>
          Set &quot;stream&quot;: true in your request body to receive a stream of
          Server-Sent Events instead of a single JSON response. The response
          Content-Type changes to text/event-stream and the connection stays
          open until the model finishes generating or an error occurs.
        </DocsParagraph>

        <DocsCode>{`POST https://api.creor.ai/v1/chat/completions
Content-Type: application/json
Authorization: Basic base64(YOUR_API_KEY:)

{
  "model": "claude-sonnet-4-20250514",
  "stream": true,
  "messages": [
    {"role": "user", "content": "Write a function to reverse a linked list"}
  ]
}`}</DocsCode>

        <DocsCallout type="info">
          Streaming requests count as a single request against your rate limit,
          the same as non-streaming requests. There is no additional cost for
          streaming.
        </DocsCallout>
      </DocsSection>

      <DocsDivider />

      <DocsSection id="event-format" title="Event Format">
        <DocsParagraph>
          Each event in the stream is a line prefixed with &quot;data: &quot; followed by
          a JSON object. Events are separated by two newlines. The stream ends
          with a special &quot;data: [DONE]&quot; sentinel.
        </DocsParagraph>

        <DocsH3>Chunk Object</DocsH3>
        <DocsCode>{`data: {
  "id": "chatcmpl-9f8g7h6j5k4l3m2n1",
  "object": "chat.completion.chunk",
  "created": 1712937600,
  "model": "claude-sonnet-4-20250514",
  "choices": [
    {
      "index": 0,
      "delta": {
        "content": "Here"
      },
      "finish_reason": null
    }
  ]
}

data: {
  "id": "chatcmpl-9f8g7h6j5k4l3m2n1",
  "object": "chat.completion.chunk",
  "created": 1712937600,
  "model": "claude-sonnet-4-20250514",
  "choices": [
    {
      "index": 0,
      "delta": {
        "content": " is"
      },
      "finish_reason": null
    }
  ]
}

data: [DONE]`}</DocsCode>

        <DocsH3>Chunk Fields</DocsH3>
        <DocsTable
          headers={["Field", "Type", "Description"]}
          rows={[
            ["id", "string", "Same ID across all chunks in one completion."],
            ["object", "string", "Always \"chat.completion.chunk\" for streaming."],
            ["created", "integer", "Unix timestamp when the stream started."],
            ["model", "string", "The model generating the response."],
            ["choices[].index", "integer", "Choice index (always 0 when n=1)."],
            ["choices[].delta.role", "string", "Present only in the first chunk. Always \"assistant\"."],
            ["choices[].delta.content", "string", "The token(s) generated in this chunk. May be empty or null."],
            ["choices[].finish_reason", "string | null", "null during generation. Set to \"stop\", \"length\", or \"content_filter\" in the final chunk."],
          ]}
        />

        <DocsH3>First and Last Chunks</DocsH3>
        <DocsParagraph>
          The first chunk includes the role field in the delta to establish the
          assistant turn. The last chunk before [DONE] has a non-null
          finish_reason and may include a usage field with token counts.
        </DocsParagraph>
        <DocsCode>{`// First chunk
data: {"id":"chatcmpl-...","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"role":"assistant","content":""},"finish_reason":null}]}

// Final chunk
data: {"id":"chatcmpl-...","object":"chat.completion.chunk","choices":[{"index":0,"delta":{},"finish_reason":"stop"}],"usage":{"prompt_tokens":28,"completion_tokens":142,"total_tokens":170}}

data: [DONE]`}</DocsCode>
      </DocsSection>

      <DocsDivider />

      <DocsSection id="lifecycle" title="Stream Lifecycle">
        <DocsParagraph>
          Understanding the stream lifecycle helps you build robust streaming
          clients that handle every state correctly.
        </DocsParagraph>

        <DocsTable
          headers={["Phase", "What Happens", "Client Action"]}
          rows={[
            ["Connection", "HTTP response starts with status 200 and Content-Type: text/event-stream.", "Begin reading the event stream."],
            ["First chunk", "Contains delta.role = \"assistant\" and optionally the first token.", "Initialize the response buffer."],
            ["Content chunks", "Each chunk contains one or more tokens in delta.content.", "Append to the response buffer and update the UI."],
            ["Final chunk", "finish_reason is set. usage field may be present.", "Record usage data for billing tracking."],
            ["[DONE] sentinel", "The string \"data: [DONE]\" signals the end of the stream.", "Close the connection and finalize the response."],
          ]}
        />
      </DocsSection>

      <DocsDivider />

      <DocsSection id="error-handling" title="Error Handling">
        <DocsParagraph>
          Errors can occur before or during the stream. The handling strategy
          differs depending on when the error happens.
        </DocsParagraph>

        <DocsH3>Errors Before Streaming Starts</DocsH3>
        <DocsParagraph>
          If the request is invalid (bad model ID, missing auth, rate limited),
          the server returns a standard JSON error response with the appropriate
          HTTP status code. No SSE events are sent.
        </DocsParagraph>
        <DocsCode>{`HTTP/2 429 Too Many Requests
Content-Type: application/json

{
  "error": {
    "type": "rate_limit_exceeded",
    "message": "You have exceeded your per-minute request limit.",
    "retry_after": 12
  }
}`}</DocsCode>

        <DocsH3>Errors During Streaming</DocsH3>
        <DocsParagraph>
          If an error occurs after streaming has started (e.g., the upstream
          provider times out), the server sends an error event before closing the
          stream. The error event uses the same &quot;data: &quot; prefix.
        </DocsParagraph>
        <DocsCode>{`data: {"id":"chatcmpl-...","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":"Here is the function"},"finish_reason":null}]}

data: {"error":{"type":"upstream_error","message":"Provider connection timed out. Partial response may be incomplete."}}

data: [DONE]`}</DocsCode>

        <DocsCallout type="warning">
          Always check each event for an &quot;error&quot; field. If present, the stream
          terminated abnormally and the response may be incomplete. Display
          what you have and offer the user the option to retry.
        </DocsCallout>

        <DocsH3>Connection Drops</DocsH3>
        <DocsParagraph>
          If the connection drops without a [DONE] sentinel, the stream was
          interrupted. Common causes include network issues, client timeouts, or
          server restarts. Implement reconnection logic or prompt the user to
          resend the message.
        </DocsParagraph>
      </DocsSection>

      <DocsDivider />

      <DocsSection id="curl" title="curl Example">
        <DocsCode>{`curl https://api.creor.ai/v1/chat/completions \\
  -u YOUR_API_KEY: \\
  -H "Content-Type: application/json" \\
  -N \\
  -d '{
    "model": "claude-sonnet-4-20250514",
    "stream": true,
    "messages": [
      {"role": "user", "content": "Write a TypeScript function to debounce"}
    ]
  }'`}</DocsCode>
        <DocsParagraph>
          The -N flag disables output buffering so you see tokens as they arrive.
        </DocsParagraph>
      </DocsSection>

      <DocsDivider />

      <DocsSection id="javascript" title="JavaScript / TypeScript">
        <DocsParagraph>
          Use the Fetch API with a ReadableStream to process SSE events. This
          works in both Node.js (18+) and modern browsers.
        </DocsParagraph>

        <DocsCode lines>{`async function streamCompletion(apiKey: string, prompt: string) {
  const response = await fetch("https://api.creor.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": \`Basic \${btoa(apiKey + ":")}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      stream: true,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(\`API error: \${error.error.message}\`);
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let fullResponse = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data: ")) continue;

      const data = trimmed.slice(6);
      if (data === "[DONE]") {
        return fullResponse;
      }

      const chunk = JSON.parse(data);

      if (chunk.error) {
        throw new Error(\`Stream error: \${chunk.error.message}\`);
      }

      const content = chunk.choices?.[0]?.delta?.content;
      if (content) {
        fullResponse += content;
        process.stdout.write(content); // or update UI
      }
    }
  }

  return fullResponse;
}

// Usage
const result = await streamCompletion(
  process.env.CREOR_API_KEY!,
  "Write a TypeScript function to debounce"
);`}</DocsCode>
      </DocsSection>

      <DocsDivider />

      <DocsSection id="python" title="Python">
        <DocsParagraph>
          Use the httpx library with streaming support for a clean Python
          implementation.
        </DocsParagraph>

        <DocsCode lines>{`import httpx
import json
import os

def stream_completion(prompt: str) -> str:
    api_key = os.environ["CREOR_API_KEY"]
    full_response = ""

    with httpx.stream(
        "POST",
        "https://api.creor.ai/v1/chat/completions",
        auth=(api_key, ""),
        json={
            "model": "claude-sonnet-4-20250514",
            "stream": True,
            "messages": [{"role": "user", "content": prompt}],
        },
    ) as response:
        response.raise_for_status()

        for line in response.iter_lines():
            if not line or not line.startswith("data: "):
                continue

            data = line[len("data: "):]
            if data == "[DONE]":
                break

            chunk = json.loads(data)

            if "error" in chunk:
                raise Exception(f"Stream error: {chunk['error']['message']}")

            content = chunk.get("choices", [{}])[0].get("delta", {}).get("content", "")
            if content:
                full_response += content
                print(content, end="", flush=True)

    print()  # newline after stream
    return full_response

# Usage
result = stream_completion("Write a Python function to debounce")`}</DocsCode>
      </DocsSection>

      <DocsDivider />

      <DocsSection id="openai-sdk" title="OpenAI SDK">
        <DocsParagraph>
          The easiest way to stream is with the OpenAI SDK, which handles SSE
          parsing, connection management, and error handling for you. Just point
          it at the Creor Gateway.
        </DocsParagraph>

        <DocsH3>JavaScript / TypeScript</DocsH3>
        <DocsCode lines>{`import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.CREOR_API_KEY,
  baseURL: "https://api.creor.ai/v1",
});

const stream = await client.chat.completions.create({
  model: "claude-sonnet-4-20250514",
  stream: true,
  messages: [
    { role: "user", content: "Write a function to reverse a linked list" },
  ],
});

let fullResponse = "";
for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content;
  if (content) {
    fullResponse += content;
    process.stdout.write(content);
  }
}

console.log("\\n\\nFull response length:", fullResponse.length);`}</DocsCode>

        <DocsH3>Python</DocsH3>
        <DocsCode lines>{`import openai
import os

client = openai.OpenAI(
    api_key=os.environ["CREOR_API_KEY"],
    base_url="https://api.creor.ai/v1",
)

stream = client.chat.completions.create(
    model="claude-sonnet-4-20250514",
    stream=True,
    messages=[
        {"role": "user", "content": "Write a function to reverse a linked list"}
    ],
)

full_response = ""
for chunk in stream:
    content = chunk.choices[0].delta.content
    if content:
        full_response += content
        print(content, end="", flush=True)

print(f"\\n\\nFull response length: {len(full_response)}")`}</DocsCode>

        <DocsCallout type="tip">
          The OpenAI SDK automatically handles SSE parsing, reconnection on
          transient errors, and the [DONE] sentinel. It is the recommended
          approach for production integrations.
        </DocsCallout>

        <DocsH3>React Example</DocsH3>
        <DocsParagraph>
          For React applications, stream tokens into component state to render
          them incrementally:
        </DocsParagraph>
        <DocsCode lines>{`"use client";
import { useState, useCallback } from "react";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_CREOR_API_KEY!,
  baseURL: "https://api.creor.ai/v1",
  dangerouslyAllowBrowser: true, // only for demos
});

export function Chat() {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async (prompt: string) => {
    setLoading(true);
    setResponse("");

    const stream = await client.chat.completions.create({
      model: "claude-sonnet-4-20250514",
      stream: true,
      messages: [{ role: "user", content: prompt }],
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        setResponse((prev) => prev + content);
      }
    }

    setLoading(false);
  }, []);

  return (
    <div>
      <button onClick={() => handleSubmit("Explain React hooks")}>
        {loading ? "Streaming..." : "Ask"}
      </button>
      <pre>{response}</pre>
    </div>
  );
}`}</DocsCode>

        <DocsCallout type="warning">
          Never expose your API key in client-side code in production. The React
          example above is for demonstration only. In production, proxy requests
          through your own backend server.
        </DocsCallout>
      </DocsSection>
    </DocsPage>
  );
}
