import { BlogPostClient } from "./client";

// Pre-render these slugs at build time for static export
export function generateStaticParams() {
  return [
    { slug: "how-software-development-changed-2026" },
    { slug: "practical-guide-using-llms-for-code" },
    { slug: "why-open-source-matters-ai-coding-tools" },
    { slug: "agentic-coding-from-chat-to-autonomous-workflows" },
    { slug: "developer-career-playbook-ai-era" },
  ];
}

export default function BlogPostPage() {
  return <BlogPostClient />;
}
