import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { BlogListClient } from "./client";

export const metadata: Metadata = generatePageMetadata({
  title: "Blog",
  description:
    "Engineering deep-dives, practical guides, and insights on AI-native development from the Creor team.",
  path: "/blog",
});

export default function BlogPage() {
  return <BlogListClient />;
}
