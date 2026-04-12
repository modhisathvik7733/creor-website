import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/metadata";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/pricing", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/download", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/login", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/blog", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/blog/how-software-development-changed-2026", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/blog/practical-guide-using-llms-for-code", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/blog/why-open-source-matters-ai-coding-tools", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/blog/agentic-coding-from-chat-to-autonomous-workflows", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/blog/developer-career-playbook-ai-era", priority: 0.7, changeFrequency: "monthly" as const },
  ];

  return routes.map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
